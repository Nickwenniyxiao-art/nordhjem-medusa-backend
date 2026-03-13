import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

/**
 * Valid order status transitions.
 * pending → processing → shipped → delivered → completed
 * pending/processing → canceled
 */
const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ["processing", "canceled"],
  processing: ["shipped", "canceled"],
  shipped: ["delivered"],
  delivered: ["completed"],
  completed: [],
  canceled: [],
}

const VALID_STATUSES = Object.keys(VALID_TRANSITIONS)

async function emitEvent(scope: MedusaRequest["scope"], name: string, data: Record<string, unknown>) {
  try {
    const eventBus = scope.resolve("event_bus") as any
    await eventBus.emit(name, data)
  } catch {
    // optional
  }
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any
  const orderId = req.params.id

  const result = await pgConnection.raw(
    `SELECT * FROM "order" WHERE id = ? LIMIT 1`,
    [orderId]
  )

  const order = result?.rows?.[0]
  if (!order) {
    return res.status(404).json({ error: "Order not found" })
  }

  return res.status(200).json({ order })
}

export async function PATCH(req: MedusaRequest, res: MedusaResponse) {
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any
  const orderId = req.params.id

  const body = (req.body ?? {}) as { status?: string; metadata?: Record<string, unknown> }

  const orderResult = await pgConnection.raw(
    `SELECT id, status FROM "order" WHERE id = ? LIMIT 1`,
    [orderId]
  )

  const order = orderResult?.rows?.[0]
  if (!order) {
    return res.status(404).json({ error: "Order not found" })
  }

  const updates: string[] = []
  const params: any[] = []

  if (body.status) {
    const newStatus = String(body.status)

    if (!VALID_STATUSES.includes(newStatus)) {
      return res.status(400).json({
        error: `Invalid status: ${newStatus}. Valid statuses: ${VALID_STATUSES.join(", ")}`,
      })
    }

    const currentStatus = String(order.status || "pending")
    const allowed = VALID_TRANSITIONS[currentStatus] || []

    if (!allowed.includes(newStatus)) {
      return res.status(400).json({
        error: `Invalid status transition: ${currentStatus} → ${newStatus}. Allowed transitions from ${currentStatus}: ${allowed.length ? allowed.join(", ") : "none"}`,
      })
    }

    updates.push("status = ?")
    params.push(newStatus)
  }

  if (body.metadata !== undefined) {
    updates.push("metadata = ?::jsonb")
    params.push(JSON.stringify(body.metadata))
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: "No valid fields to update" })
  }

  updates.push("updated_at = NOW()")
  params.push(orderId)

  await pgConnection.raw(
    `UPDATE "order" SET ${updates.join(", ")} WHERE id = ?`,
    params
  )

  if (body.status) {
    await emitEvent(req.scope, "order.status_updated", {
      order_id: orderId,
      previous_status: order.status,
      status: body.status,
    })
  }

  const updated = await pgConnection.raw(
    `SELECT * FROM "order" WHERE id = ? LIMIT 1`,
    [orderId]
  )

  return res.status(200).json({ order: updated?.rows?.[0] })
}
