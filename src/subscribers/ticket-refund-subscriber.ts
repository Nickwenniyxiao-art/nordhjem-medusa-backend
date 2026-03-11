import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

async function ensureRefundRecordTable(pgConnection: any) {
  await pgConnection.raw(
    `CREATE TABLE IF NOT EXISTS refund_record (
      id UUID PRIMARY KEY,
      ticket_id VARCHAR(64) NOT NULL,
      order_id VARCHAR(64) NOT NULL,
      status VARCHAR(32) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`
  )
}

export default async function ticketRefundSubscriber({
  event,
  container,
}: SubscriberArgs<Record<string, any>>) {
  const logger = container.resolve("logger") as any
  const pgConnection = container.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any
  const eventBus = container.resolve(Modules.EVENT_BUS) as any

  const ticketId = String(event.data?.id || "")
  const nextStatus = String(event.data?.new_status || "")

  if (!ticketId || nextStatus !== "refunded") {
    return
  }

  try {
    await ensureRefundRecordTable(pgConnection)

    const orderResult = await pgConnection.raw(
      `SELECT order_id
       FROM ticket
       WHERE id = ?
       LIMIT 1`,
      [ticketId]
    )

    const orderId = orderResult?.rows?.[0]?.order_id
    if (!orderId) {
      return
    }

    const id = crypto.randomUUID()

    await pgConnection.raw(
      `INSERT INTO refund_record (id, ticket_id, order_id, status)
       VALUES (?, ?, ?, ?)`,
      [id, ticketId, orderId, "triggered"]
    )

    await eventBus.emit("ticket.refund.triggered", {
      id,
      ticket_id: ticketId,
      order_id: orderId,
      status: "triggered",
    })
  } catch (err: any) {
    logger.error(`[ticket-refund-subscriber] Error: ${err.message}`)
  }
}

export const config: SubscriberConfig = {
  event: ["ticket.status.changed", "ticket.status_changed"],
}
