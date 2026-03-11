import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

async function ensureTicketAnalyticsColumns(pgConnection: any) {
  await pgConnection.raw(`ALTER TABLE IF EXISTS ticket ADD COLUMN IF NOT EXISTS sla_deadline TIMESTAMPTZ`)
  await pgConnection.raw(
    `ALTER TABLE IF EXISTS ticket ADD COLUMN IF NOT EXISTS resolution_time_hours DOUBLE PRECISION`
  )
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as any
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any
  const eventBus = req.scope.resolve(Modules.EVENT_BUS) as any

  try {
    await ensureTicketAnalyticsColumns(pgConnection)

    const result = await pgConnection.raw(`
      SELECT
        COUNT(*)::int AS total_tickets,
        COUNT(*) FILTER (WHERE status IN ('open', 'in_progress'))::int AS open_tickets,
        COALESCE(AVG(resolution_time_hours) FILTER (WHERE status = 'resolved'), 0)::float AS avg_resolution_time_hours,
        COALESCE(
          (
            COUNT(*) FILTER (WHERE status = 'resolved' AND resolved_at IS NOT NULL AND sla_deadline IS NOT NULL AND resolved_at <= sla_deadline)::float
            / NULLIF(COUNT(*) FILTER (WHERE status = 'resolved' AND resolved_at IS NOT NULL), 0)
          ),
          0
        )::float AS sla_compliance_rate
      FROM ticket
      WHERE deleted_at IS NULL
    `)

    const stats = result?.rows?.[0] || {}

    const payload = {
      total_tickets: Number(stats.total_tickets || 0),
      open_tickets: Number(stats.open_tickets || 0),
      avg_resolution_time_hours: Number(stats.avg_resolution_time_hours || 0),
      sla_compliance_rate: Number(stats.sla_compliance_rate || 0),
    }

    await eventBus.emit("ticket.stats.generated", payload)

    return res.status(200).json(payload)
  } catch (err: any) {
    logger.error(`[admin-ticket-stats] GET error: ${err.message}`)
    return res.status(500).json({ error: "Failed to generate ticket stats" })
  }
}
