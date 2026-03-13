import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  pending: ["processing", "canceled"],
  processing: ["shipped", "canceled"],
  shipped: ["delivered"],
  delivered: ["completed"],
  completed: [],
  canceled: [],
}

const VALID_STATUSES = Object.keys(ALLOWED_TRANSITIONS)

async function emitEvent(scope: MedusaRequest["scope"], name: string, data: Record<string, unknown>) {
  try {
    const eventBus = scope.resolve("event_bus") as any
    await eventBus.emit(name, data)
  } catch {
    // optional – don't fail the API if event bus is unavailable
  }
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any
  const orderId = req.params.id

  const result = await pgConnection.raw(`SELECT o.* FROM "order" o WHERE o.id = ?`, [orderId])

  const order = result?.rows?.[0]
  if (!order) {
    return res.status(404).json({ error: "Order not found" })
  }

  return res.status(200).json({ order })
}

export async function PATCH(req: MedusaRequest, res: MedusaResponse) {
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any
  const orderId = req.params.id

  const body = (req.body ?? {}) as Record<string, any>

  const lookupResult = await pgConnection.raw(`SELECT id, status FROM "order" WHERE id = ?`, [orderId])
  const order = lookupResult?.rows?.[0]

  if (!order) {
    return res.status(404).json({ error: "Order not found" })
  }

  if (body.status !== undefined) {
    const currentStatus = order.status as string
    const nextStatus = String(body.status)

    if (!VALID_STATUSES.includes(nextStatus)) {
      return res.status(400).json({
        error: `Invalid status "${nextStatus}". Valid statuses: ${VALID_STATUSES.join(", ")}`,
      })
    }

    const allowed = ALLOWED_TRANSITIONS[currentStatus]
    if (!allowed || !allowed.includes(nextStatus)) {
      return res.status(400).json({
        error: `Cannot transition from "${currentStatus}" to "${nextStatus}". Allowed transitions: ${(allowed || []).join(", ") || "none"}`,
      })
    }

    await pgConnection.raw(`UPDATE "order" SET status = ?, updated_at = NOW() WHERE id = ?`, [
      nextStatus,
      orderId,
    ])

    await emitEvent(req.scope, "order.status_updated", {
      order_id: orderId,
      previous_status: currentStatus,
      status: nextStatus,
    })
  }

  const updatedResult = await pgConnection.raw(`SELECT o.* FROM "order" o WHERE o.id = ?`, [orderId])

  return res.status(200).json({ order: updatedResult?.rows?.[0] })
}
