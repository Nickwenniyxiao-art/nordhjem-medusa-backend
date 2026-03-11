import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

async function ensureTicketSlaColumn(pgConnection: any) {
  await pgConnection.raw(`ALTER TABLE IF EXISTS ticket ADD COLUMN IF NOT EXISTS sla_deadline TIMESTAMPTZ`)
}

async function relayWebhook(eventName: string, payload: Record<string, unknown>, logger: any) {
  const webhookUrl = process.env.WEBHOOK_RELAY_URL
  if (!webhookUrl) {
    return
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-NordHjem-Event": eventName,
        ...(process.env.WEBHOOK_RELAY_SECRET
          ? { "X-Webhook-Secret": process.env.WEBHOOK_RELAY_SECRET }
          : {}),
      },
      body: JSON.stringify({
        event: eventName,
        data: payload,
        timestamp: new Date().toISOString(),
        source: "nordhjem-medusa",
      }),
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      logger.error(`[ticket-sla-check-job] Webhook relay failed: HTTP ${response.status}`)
    }
  } catch (err: any) {
    logger.error(`[ticket-sla-check-job] Webhook relay error: ${err.message}`)
  }
}

export default async function ticketSlaCheckJob(container: MedusaContainer) {
  const logger = container.resolve("logger") as any
  const pgConnection = container.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any
  const eventBus = container.resolve(Modules.EVENT_BUS) as any

  try {
    await ensureTicketSlaColumn(pgConnection)

    const result = await pgConnection.raw(
      `SELECT id, order_id, status, sla_deadline
       FROM ticket
       WHERE deleted_at IS NULL
         AND sla_deadline IS NOT NULL
         AND sla_deadline < NOW()
         AND status NOT IN ('resolved', 'closed')`
    )

    const tickets = result?.rows || []

    for (const ticket of tickets) {
      const payload = {
        id: ticket.id,
        order_id: ticket.order_id,
        status: ticket.status,
        sla_deadline: ticket.sla_deadline,
      }

      await eventBus.emit("ticket.sla.breached", payload)
      await relayWebhook("ticket.sla.breached", payload, logger)
    }
  } catch (err: any) {
    logger.error(`[ticket-sla-check-job] Error: ${err.message}`)
  }
}

export const config = {
  name: "ticket-sla-check",
  schedule: "*/15 * * * *",
}
