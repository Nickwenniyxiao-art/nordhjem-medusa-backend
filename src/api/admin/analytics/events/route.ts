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

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const pgConnection = req.scope.resolve(
    ContainerRegistrationKeys.PG_CONNECTION
  ) as any
  const logger = req.scope.resolve("logger") as any
  const body = req.body as any

  const sessionId = body?.session_id
  const eventName = body?.event_name
  const properties = body?.properties ?? {}

  if (!sessionId || !eventName) {
    return res.status(400).json({
      error: "session_id and event_name are required",
    })
  }

  try {
    await pgConnection.raw(ensureTableSql)
    await pgConnection.raw(
      `
        INSERT INTO analytics_event (session_id, event_name, properties)
        VALUES (?, ?, ?::jsonb)
      `,
      [sessionId, eventName, JSON.stringify(properties)]
    )

    return res.status(200).json({ ok: true })
  } catch (err: any) {
    logger.error(`[analytics-events:POST] ${err.message}`)
    return res.status(500).json({ error: "Failed to record analytics event" })
  }
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const pgConnection = req.scope.resolve(
    ContainerRegistrationKeys.PG_CONNECTION
  ) as any
  const logger = req.scope.resolve("logger") as any
  const { date_from, date_to, session_id } = req.query as Record<string, string>

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

    if (session_id) {
      conditions.push("session_id = ?")
      params.push(session_id)
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""

    const summaryResult = await pgConnection.raw(
      `
      SELECT
        COUNT(*)::int AS total_events,
        COUNT(DISTINCT session_id)::int AS unique_sessions
      FROM analytics_event
      ${whereClause}
      `,
      params
    )

    const breakdownResult = await pgConnection.raw(
      `
      SELECT
        event_name,
        COUNT(*)::int AS count
      FROM analytics_event
      ${whereClause}
      GROUP BY event_name
      ORDER BY count DESC, event_name ASC
      `,
      params
    )

    return res.status(200).json({
      total_events: parseInt(summaryResult?.rows?.[0]?.total_events || "0", 10),
      unique_sessions: parseInt(
        summaryResult?.rows?.[0]?.unique_sessions || "0",
        10
      ),
      breakdown: breakdownResult?.rows || [],
      date_from: date_from || null,
      date_to: date_to || null,
      session_id: session_id || null,
    })
  } catch (err: any) {
    logger.error(`[analytics-events:GET] ${err.message}`)
    return res.status(500).json({ error: "Failed to query analytics events" })
  }
}
