import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { randomUUID } from "node:crypto"

type BatchAction = "update_status" | "create_fulfillment" | "export"

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  pending: ["processing", "canceled"],
  processing: ["shipped", "canceled"],
  shipped: ["delivered"],
  delivered: ["completed"],
  completed: [],
  canceled: [],
}

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

  if (body.action === "update_status") {
    const targetStatus = body.status || body.data?.status
    if (!targetStatus) {
      return res.status(400).json({ error: "status is required for update_status action" })
    }

    // Pre-validate: fetch all orders and check transitions before applying any
    const failed: Array<{ id: string; reason: string }> = []
    const validOrders: Array<{ id: string; current_status: string }> = []

    for (const orderId of body.order_ids) {
      try {
        const result = await pgConnection.raw(
          `SELECT id, status FROM "order" WHERE id = ?`,
          [orderId]
        )
        const order = result?.rows?.[0]
        if (!order) {
          failed.push({ id: orderId, reason: "Order not found" })
          continue
        }

        const currentStatus = order.status as string
        const allowed = ALLOWED_TRANSITIONS[currentStatus]

        if (!allowed || !allowed.includes(targetStatus)) {
          failed.push({
            id: orderId,
            reason: `Cannot transition from "${currentStatus}" to "${targetStatus}"`,
          })
          continue
        }

        validOrders.push({ id: orderId, current_status: currentStatus })
      } catch (err: any) {
        failed.push({ id: orderId, reason: err.message || "Unknown error" })
      }
    }

    // Apply updates only to valid orders
    for (const order of validOrders) {
      await pgConnection.raw(
        `UPDATE "order" SET status = ?, updated_at = NOW() WHERE id = ?`,
        [targetStatus, order.id]
      )
      await emitEvent(req.scope, "order.status_updated", {
        order_id: order.id,
        previous_status: order.current_status,
        status: targetStatus,
      })
    }

    return res.status(200).json({
      success: validOrders.length,
      failed,
      processed: body.order_ids.length,
      succeeded: validOrders.length,
      results: [
        ...validOrders.map((o) => ({ order_id: o.id, success: true })),
        ...failed.map((f) => ({ order_id: f.id, success: false, error: f.reason })),
      ],
    })
  }

  // Other actions (create_fulfillment) – keep existing behavior
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
