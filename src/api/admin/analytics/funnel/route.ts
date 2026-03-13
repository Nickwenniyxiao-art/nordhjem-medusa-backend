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

const defaultSteps = ["page_view", "add_to_cart", "checkout_started", "purchase"]

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any
  const logger = req.scope.resolve("logger") as any
  const { date_from, date_to, steps } = req.query as Record<string, string>

  const funnelSteps = (steps || defaultSteps.join(","))
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)

  if (funnelSteps.length < 2) {
    return res.status(400).json({ error: "At least 2 funnel steps are required" })
  }

  try {
    await pgConnection.raw(ensureTableSql)

    const timeConditions: string[] = []
    const params: any[] = [funnelSteps]

    if (date_from) {
      timeConditions.push("created_at >= ?::timestamptz")
      params.push(date_from)
    }

    if (date_to) {
      timeConditions.push("created_at < (?::date + interval '1 day')")
      params.push(date_to)
    }

    const timeWhere = timeConditions.length ? `AND ${timeConditions.join(" AND ")}` : ""

    const result = await pgConnection.raw(
      `
      WITH step_events AS (
        SELECT
          session_id,
          event_name,
          MIN(created_at) AS first_seen
        FROM analytics_event
        WHERE event_name = ANY(?::text[])
          ${timeWhere}
        GROUP BY session_id, event_name
      ),
      ordered AS (
        SELECT
          session_id,
          ARRAY_AGG(event_name ORDER BY first_seen) AS reached_steps
        FROM step_events
        GROUP BY session_id
      )
      SELECT reached_steps FROM ordered
      `,
      params
    )

    const sessions: string[][] = (result?.rows || []).map((row: any) => row.reached_steps || [])

    const counts = funnelSteps.map((step, index) => {
      const reached = sessions.filter((seq) => {
        let lastPos = -1

        for (let i = 0; i <= index; i++) {
          const pos = seq.indexOf(funnelSteps[i])
          if (pos === -1 || pos < lastPos) {
            return false
          }
          lastPos = pos
        }

        return true
      }).length

      return { step, reached }
    })

    const firstStepCount = counts[0].reached
    const stepsWithRates = counts.map((item, index) => {
      const prev = index === 0 ? item.reached : counts[index - 1].reached
      const conversionRate = prev > 0 ? Math.round((item.reached / prev) * 10000) / 100 : 0
      const dropOffRate = prev > 0 ? Math.round(((prev - item.reached) / prev) * 10000) / 100 : 0

      return {
        step: item.step,
        sessions: item.reached,
        conversion_rate: conversionRate,
        drop_off_rate: dropOffRate,
      }
    })

    return res.status(200).json({
      total_sessions: firstStepCount,
      steps: stepsWithRates,
      date_from: date_from || null,
      date_to: date_to || null,
    })
  } catch (err: any) {
    logger.error(`[analytics-funnel] ${err.message}`)
    return res.status(500).json({ error: "Failed to query funnel analytics" })
  }
}
