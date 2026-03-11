import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

async function ensureTicketColumns(pgConnection: any) {
  await pgConnection.raw(`ALTER TABLE IF EXISTS ticket ADD COLUMN IF NOT EXISTS sla_deadline TIMESTAMPTZ`)
  await pgConnection.raw(
    `ALTER TABLE IF EXISTS ticket ADD COLUMN IF NOT EXISTS resolution_time_hours DOUBLE PRECISION`
  )
}

export default async function ticketSlaSubscriber({
  event,
  container,
}: SubscriberArgs<Record<string, any>>) {
  const logger = container.resolve("logger") as any
  const pgConnection = container.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any
  const eventBus = container.resolve(Modules.EVENT_BUS) as any

  const ticketId = String(event.data?.id || "")
  const nextStatus = String(event.data?.new_status || "")

  if (!ticketId || !nextStatus) {
    return
  }

  try {
    await ensureTicketColumns(pgConnection)

    if (nextStatus === "resolved") {
      await pgConnection.raw(
        `UPDATE ticket
         SET resolved_at = COALESCE(resolved_at, NOW()),
             resolution_time_hours = EXTRACT(EPOCH FROM (COALESCE(resolved_at, NOW()) - created_at)) / 3600,
             updated_at = NOW()
         WHERE id = ?`,
        [ticketId]
      )
    }

    const ticketResult = await pgConnection.raw(
      `SELECT id, status, sla_deadline
       FROM ticket
       WHERE id = ?
       LIMIT 1`,
      [ticketId]
    )

    const ticket = ticketResult?.rows?.[0]
    if (!ticket?.sla_deadline) {
      return
    }

    const deadline = new Date(ticket.sla_deadline).getTime()
    const diffMs = deadline - Date.now()
    if (diffMs > 0 && diffMs < 60 * 60 * 1000 && !["resolved", "closed"].includes(String(ticket.status))) {
      await eventBus.emit("ticket.sla.warning", {
        id: ticketId,
        status: ticket.status,
        sla_deadline: ticket.sla_deadline,
        minutes_remaining: Math.floor(diffMs / 60000),
      })
    }
  } catch (err: any) {
    logger.error(`[ticket-sla-subscriber] Error: ${err.message}`)
  }
}

export const config: SubscriberConfig = {
  event: ["ticket.status.changed", "ticket.status_changed"],
}
