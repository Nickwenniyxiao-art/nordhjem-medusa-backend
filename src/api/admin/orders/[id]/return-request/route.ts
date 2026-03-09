import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { randomUUID } from "node:crypto"

type ReturnItemInput = {
  item_id: string
  quantity: number
  reason_id?: string
  note?: string
}

async function emitEvent(scope: MedusaRequest["scope"], name: string, data: Record<string, unknown>) {
  try {
    const eventBus = scope.resolve("event_bus") as { emit: (name: string, data: any) => Promise<void> }
    await eventBus.emit(name, data)
  } catch {
    // ignore event bus failures for API response
  }
}

async function tryCreateTicket(
  scope: MedusaRequest["scope"],
  payload: Record<string, unknown>
) {
  try {
    const ticketService = scope.resolve("ticket") as {
      createTickets?: (data: Record<string, unknown>[]) => Promise<unknown>
      create?: (data: Record<string, unknown>) => Promise<unknown>
    }

    if (typeof ticketService.createTickets === "function") {
      await ticketService.createTickets([payload])
      return
    }

    if (typeof ticketService.create === "function") {
      await ticketService.create(payload)
    }
  } catch {
    // optional integration: skip when ticket module is unavailable
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const orderService = req.scope.resolve(Modules.ORDER) as any
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as {
    raw: (query: string, params?: any[]) => Promise<{ rows?: any[] }>
  }

  const orderId = req.params.id
  const body = (req.body ?? {}) as {
    items?: ReturnItemInput[]
    return_shipping_option_id?: string
    note?: string
    metadata?: Record<string, unknown>
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return res.status(400).json({ error: "items is required" })
  }

  let order: any
  try {
    order = await orderService.retrieveOrder(orderId, { relations: ["items"] })
  } catch {
    return res.status(404).json({ error: "Order not found" })
  }

  if (!order || order.canceled_at) {
    return res.status(400).json({ error: "Order is canceled or unavailable" })
  }

  const orderItems = order.items || []
  let returnRow: { rows?: any[] } = { rows: [] }
  try {
    returnRow = await pgConnection.raw(
      `SELECT item_id, COALESCE(SUM(quantity), 0) AS returned_qty FROM return_item WHERE item_id IN (${body.items
        .map(() => "?")
        .join(",")}) GROUP BY item_id`,
      body.items.map((i) => i.item_id)
    )
  } catch {
    // allow environments where return_item table is unavailable
  }

  const returnedMap = new Map<string, number>()
  for (const row of returnRow?.rows || []) {
    returnedMap.set(row.item_id, Number(row.returned_qty || 0))
  }

  for (const item of body.items) {
    if (!item.item_id || !Number.isFinite(item.quantity) || item.quantity <= 0) {
      return res.status(400).json({ error: "Invalid return items payload" })
    }

    const orderItem = orderItems.find((oi: any) => oi.id === item.item_id)
    if (!orderItem) {
      return res.status(400).json({ error: `Order item not found: ${item.item_id}` })
    }

    const alreadyReturned = returnedMap.get(item.item_id) || 0
    const availableToReturn = Number(orderItem.quantity || 0) - alreadyReturned
    if (item.quantity > availableToReturn) {
      return res.status(400).json({ error: `Return quantity exceeds available for item ${item.item_id}` })
    }
  }

  const returnId = `ret_${randomUUID().replace(/-/g, "")}`
  const metadata = body.metadata ? JSON.stringify(body.metadata) : null

  await pgConnection.raw(
    `INSERT INTO "return" (id, order_id, status, no_notification, shipping_option_id, metadata, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?::jsonb, NOW(), NOW())`,
    [returnId, orderId, "requested", false, body.return_shipping_option_id || null, metadata]
  )

  for (const item of body.items) {
    await pgConnection.raw(
      `INSERT INTO return_item (id, return_id, item_id, quantity, reason_id, note, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [`ri_${randomUUID().replace(/-/g, "")}`, returnId, item.item_id, item.quantity, item.reason_id || null, item.note || null]
    )
  }

  await emitEvent(req.scope, "order.return_requested", {
    order_id: orderId,
    return_id: returnId,
    note: body.note || null,
    metadata: body.metadata || {},
  })

  await tryCreateTicket(req.scope, {
    type: "return",
    order_id: orderId,
    reference_id: returnId,
    note: body.note || null,
    metadata: body.metadata || {},
  })

  const created = await pgConnection.raw(`SELECT * FROM "return" WHERE id = ? LIMIT 1`, [returnId])

  return res.status(200).json({ return: created?.rows?.[0] || { id: returnId, order_id: orderId } })
}
