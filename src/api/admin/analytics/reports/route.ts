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

const DIMENSION_WHITELIST: Record<string, string> = {
  event_name: "event_name",
  session_id: "session_id",
  event_date: "DATE(created_at)",
  event_hour: "DATE_TRUNC('hour', created_at)",
}

const METRIC_WHITELIST: Record<string, string> = {
  event_count: "COUNT(*)::int",
  unique_sessions: "COUNT(DISTINCT session_id)::int",
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const pgConnection = req.scope.resolve(
    ContainerRegistrationKeys.PG_CONNECTION
  ) as any
  const logger = req.scope.resolve("logger") as any
  const body = req.body as any

  const dimensionsInput = Array.isArray(body?.dimensions) ? body.dimensions : []
  const metricsInput = Array.isArray(body?.metrics) ? body.metrics : ["event_count"]

  const dimensions = dimensionsInput.filter((d: string) => DIMENSION_WHITELIST[d])
  const metrics = metricsInput.filter((m: string) => METRIC_WHITELIST[m])

  if (metrics.length === 0) {
    return res.status(400).json({ error: "At least one valid metric is required" })
  }

  try {
    await pgConnection.raw(ensureTableSql)

    const selectParts: string[] = []
    const groupByParts: string[] = []

    dimensions.forEach((dimension) => {
      selectParts.push(`${DIMENSION_WHITELIST[dimension]} AS ${dimension}`)
      groupByParts.push(DIMENSION_WHITELIST[dimension])
    })

    metrics.forEach((metric) => {
      selectParts.push(`${METRIC_WHITELIST[metric]} AS ${metric}`)
    })

    const conditions: string[] = []
    const params: any[] = []

    if (body?.date_from) {
      conditions.push("created_at >= ?::timestamptz")
      params.push(body.date_from)
    }

    if (body?.date_to) {
      conditions.push("created_at < (?::date + interval '1 day')")
      params.push(body.date_to)
    }

    if (body?.event_name) {
      conditions.push("event_name = ?")
      params.push(body.event_name)
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""
    const groupByClause = groupByParts.length
      ? `GROUP BY ${groupByParts.join(", ")}`
      : ""
    const orderByClause = dimensions.length ? `ORDER BY ${dimensions.join(", ")}` : ""

    const query = `
      SELECT ${selectParts.join(", ")}
      FROM analytics_event
      ${whereClause}
      ${groupByClause}
      ${orderByClause}
    `

    const result = await pgConnection.raw(query, params)

    return res.status(200).json({
      dimensions,
      metrics,
      rows: result?.rows || [],
    })
  } catch (err: any) {
    logger.error(`[analytics-reports] ${err.message}`)
    return res.status(500).json({ error: "Failed to generate analytics report" })
  }
}
