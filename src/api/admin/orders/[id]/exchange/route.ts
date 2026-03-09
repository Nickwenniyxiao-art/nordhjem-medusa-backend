import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { randomUUID } from "node:crypto"

type ReturnItemInput = {
  item_id: string
  quantity: number
  reason_id?: string
}

type SendItemInput = {
  variant_id: string
  quantity: number
}

async function emitEvent(scope: MedusaRequest["scope"], name: string, data: Record<string, unknown>) {
  try {
    const eventBus = scope.resolve("event_bus") as { emit: (name: string, data: any) => Promise<void> }
    await eventBus.emit(name, data)
  } catch {
    // noop
  }
}

async function tryCreateTicket(scope: MedusaRequest["scope"], payload: Record<string, unknown>) {
  try {
    const ticketService = scope.resolve("ticket") as any
    if (typeof ticketService?.createTickets === "function") {
      await ticketService.createTickets([payload])
    } else if (typeof ticketService?.create === "function") {
      await ticketService.create(payload)
    }
  } catch {
    // optional integration
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const orderService = req.scope.resolve(Modules.ORDER) as any
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any

  const orderId = req.params.id
  const body = (req.body ?? {}) as {
    return_items?: ReturnItemInput[]
    send_items?: SendItemInput[]
    return_shipping_option_id?: string
    note?: string
    metadata?: Record<string, unknown>
  }

  if (!Array.isArray(body.return_items) || body.return_items.length === 0) {
    return res.status(400).json({ error: "return_items is required" })
  }

  if (!Array.isArray(body.send_items) || body.send_items.length === 0) {
    return res.status(400).json({ error: "send_items is required" })
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

  for (const item of body.return_items) {
    const orderItem = (order.items || []).find((oi: any) => oi.id === item.item_id)
    if (!orderItem) {
      return res.status(400).json({ error: `Order item not found: ${item.item_id}` })
    }

    if (!Number.isFinite(item.quantity) || item.quantity <= 0 || item.quantity > Number(orderItem.quantity || 0)) {
      return res.status(400).json({ error: `Invalid return quantity for item ${item.item_id}` })
    }
  }

  const variantIds = body.send_items.map((item) => item.variant_id)
  const variantQuery = await pgConnection.raw(
    `SELECT id FROM product_variant WHERE id IN (${variantIds.map(() => "?").join(",")})`,
    variantIds
  )
  const foundVariants = new Set((variantQuery?.rows || []).map((row: any) => row.id))
  for (const sendItem of body.send_items) {
    if (!foundVariants.has(sendItem.variant_id)) {
      return res.status(400).json({ error: `Variant not found: ${sendItem.variant_id}` })
    }

    if (!Number.isFinite(sendItem.quantity) || sendItem.quantity <= 0) {
      return res.status(400).json({ error: `Invalid send quantity for variant ${sendItem.variant_id}` })
    }
  }

  const exchangeId = `exch_${randomUUID().replace(/-/g, "")}`
  await pgConnection.raw(
    `INSERT INTO order_exchange (id, order_id, status, shipping_option_id, note, metadata, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?::jsonb, NOW(), NOW())`,
    [
      exchangeId,
      orderId,
      "requested",
      body.return_shipping_option_id || null,
      body.note || null,
      body.metadata ? JSON.stringify(body.metadata) : null,
    ]
  )

  await emitEvent(req.scope, "order.exchange_created", {
    order_id: orderId,
    exchange_id: exchangeId,
    return_items: body.return_items,
    send_items: body.send_items,
  })

  await tryCreateTicket(req.scope, {
    type: "exchange",
    order_id: orderId,
    reference_id: exchangeId,
    note: body.note || null,
    metadata: body.metadata || {},
  })

  return res.status(200).json({
    exchange: {
      id: exchangeId,
      order_id: orderId,
      status: "requested",
      return_items: body.return_items,
      send_items: body.send_items,
    },
  })
}
