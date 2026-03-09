import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

const ensureTableSql = `
  CREATE TABLE IF NOT EXISTS analytics_event (
    id BIGSERIAL PRIMARY KEY,
    session_id TEXT NOT NULL,
    event_name TEXT NOT NULL,
    properties JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`

const escapeCsv = (value: unknown): string => {
  const raw = value == null ? "" : String(value)
  const escaped = raw.replace(/"/g, '""')
  return `"${escaped}"`
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const pgConnection = req.scope.resolve(
    ContainerRegistrationKeys.PG_CONNECTION
  ) as any
  const logger = req.scope.resolve("logger") as any
  const { date_from, date_to, event_name } = req.query as Record<string, string>

  try {
    await pgConnection.raw(ensureTableSql)

    const conditions: string[] = []
    const params: any[] = []

    if (date_from) {
      conditions.push("created_at >= ?::timestamptz")
      params.push(date_from)
    }

    if (date_to) {
      conditions.push("created_at < (?::date + interval '1 day')")
      params.push(date_to)
    }

    if (event_name) {
      conditions.push("event_name = ?")
      params.push(event_name)
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""

    const result = await pgConnection.raw(
      `
      SELECT
        id,
        session_id,
        event_name,
        properties,
        created_at
      FROM analytics_event
      ${whereClause}
      ORDER BY created_at DESC
      `,
      params
    )

    const headers = ["id", "session_id", "event_name", "properties", "created_at"]
    const rows = (result?.rows || []).map((row: any) => [
      row.id,
      row.session_id,
      row.event_name,
      JSON.stringify(row.properties || {}),
      row.created_at,
    ])

    const csv = [headers.map(escapeCsv).join(","), ...rows.map((r: any[]) => r.map(escapeCsv).join(","))].join("\n")

    res.setHeader("Content-Type", "text/csv; charset=utf-8")
    res.setHeader("Content-Disposition", 'attachment; filename="analytics-events.csv"')

    return res.status(200).send(csv)
  } catch (err: any) {
    logger.error(`[analytics-export] ${err.message}`)
    return res.status(500).json({ error: "Failed to export analytics CSV" })
  }
}
