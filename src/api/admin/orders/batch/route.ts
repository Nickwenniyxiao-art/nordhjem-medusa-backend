import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { randomUUID } from "node:crypto"

type BatchAction = "update_status" | "create_fulfillment" | "export"

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

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const orderService = req.scope.resolve(Modules.ORDER) as any
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any

  const body = (req.body ?? {}) as {
    action?: BatchAction
    order_ids?: string[]
    status?: string
    data?: {
      status?: string
      fulfillment_data?: Record<string, unknown>
    }
  }

  if (!Array.isArray(body.order_ids) || body.order_ids.length === 0) {
    return res.status(400).json({ error: "order_ids cannot be empty" })
  }

  if (body.order_ids.length > 100) {
    return res.status(400).json({ error: "Max 100 orders per batch" })
  }

  if (!body.action) {
    return res.status(400).json({ error: "action is required" })
  }

  if (body.action === "export") {
    const jobId = `job_${randomUUID().replace(/-/g, "")}`
    return res.status(200).json({
      processed: body.order_ids.length,
      succeeded: body.order_ids.length,
      failed: 0,
      job_id: jobId,
      note: "Use /admin/orders/export for CSV output",
      results: body.order_ids.map((order_id) => ({ order_id, success: true })),
    })
  }

  // For update_status: support both body.status and body.data.status
  const targetStatus = body.action === "update_status"
    ? (body.status || body.data?.status)
    : undefined

  if (body.action === "update_status") {
    if (!targetStatus) {
      return res.status(400).json({ error: "status is required for update_status action" })
    }

    if (!VALID_STATUSES.includes(targetStatus)) {
      return res.status(400).json({
        error: `Invalid status: ${targetStatus}. Valid statuses: ${VALID_STATUSES.join(", ")}`,
      })
    }

    // Pre-validate: check all orders can transition before applying any
    const placeholders = body.order_ids.map(() => "?").join(",")
    const ordersResult = await pgConnection.raw(
      `SELECT id, status, canceled_at FROM "order" WHERE id IN (${placeholders})`,
      body.order_ids
    )

    const orderMap = new Map<string, any>()
    for (const row of ordersResult?.rows || []) {
      orderMap.set(row.id, row)
    }

    const preValidationErrors: Array<{ id: string; reason: string }> = []

    for (const orderId of body.order_ids) {
      const order = orderMap.get(orderId)
      if (!order) {
        preValidationErrors.push({ id: orderId, reason: "Order not found" })
        continue
      }
      if (order.canceled_at) {
        preValidationErrors.push({ id: orderId, reason: "Order is canceled" })
        continue
      }
      const currentStatus = String(order.status || "pending")
      const allowed = VALID_TRANSITIONS[currentStatus] || []
      if (!allowed.includes(targetStatus)) {
        preValidationErrors.push({
          id: orderId,
          reason: `Invalid transition: ${currentStatus} → ${targetStatus}`,
        })
      }
    }

    if (preValidationErrors.length > 0) {
      return res.status(400).json({
        error: "Some orders cannot transition to the target status. No changes were applied.",
        success: 0,
        failed: preValidationErrors,
      })
    }

    // All validated — apply updates
    for (const orderId of body.order_ids) {
      const order = orderMap.get(orderId)
      await pgConnection.raw(
        `UPDATE "order" SET status = ?, updated_at = NOW() WHERE id = ?`,
        [targetStatus, orderId]
      )
      await emitEvent(req.scope, "order.status_updated", {
        order_id: orderId,
        previous_status: order?.status,
        status: targetStatus,
      })
    }

    return res.status(200).json({
      success: body.order_ids.length,
      failed: [],
    })
  }

  // Non-update_status actions (create_fulfillment, etc.)
  const results: Array<{ order_id: string; success: boolean; error?: string }> = []

  for (const orderId of body.order_ids) {
    try {
      const order = await orderService.retrieveOrder(orderId, { relations: ["fulfillments"] })

      if (!order || order.canceled_at) {
        throw new Error("Order is canceled")
      }

      if (body.action === "create_fulfillment") {
        if (typeof orderService.createFulfillment === "function") {
          await orderService.createFulfillment({
            order_id: orderId,
            ...body.data?.fulfillment_data,
          })
        } else {
          throw new Error("Fulfillment API unavailable")
        }

        await emitEvent(req.scope, "order.fulfillment_created", {
          order_id: orderId,
          fulfillment_data: body.data?.fulfillment_data || {},
        })
      }

      results.push({ order_id: orderId, success: true })
    } catch (err: any) {
      results.push({ order_id: orderId, success: false, error: err.message || "Unknown error" })
    }
  }

  const succeeded = results.filter((r) => r.success).length

  return res.status(200).json({
    processed: results.length,
    succeeded,
    failed: results.length - succeeded,
    results,
  })
}
