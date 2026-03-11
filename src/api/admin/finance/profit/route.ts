import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

type ProfitRow = {
  gross_profit: string | number | null
  net_profit: string | number | null
  total_revenue: string | number | null
  total_cost: string | number | null
  order_count: string | number | null
  period_start: Date | string | null
  period_end: Date | string | null
}

const PERIOD_INTERVAL: Record<string, string> = {
  daily: "1 day",
  weekly: "7 day",
  monthly: "1 month",
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as any
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any
  const eventBus = req.scope.resolve(Modules.EVENT_BUS) as any

  const query = (req.query || {}) as Record<string, string>
  const period = String(query.period || "daily").toLowerCase()
  const metadata = (query as any).metadata ?? null

  if (!PERIOD_INTERVAL[period]) {
    return res.status(400).json({ error: "period must be one of daily, weekly, monthly" })
  }

  try {
    const result = await pgConnection.raw(
      `SELECT
         COALESCE(SUM(
           CASE
             WHEN o.raw_total IS NOT NULL AND o.raw_total->>'value' IS NOT NULL
               THEN (o.raw_total->>'value')::numeric
             ELSE COALESCE(o.total, 0)
           END
         ), 0) AS total_revenue,
         COALESCE(SUM(COALESCE(o.subtotal, 0) * 0.65), 0) AS total_cost,
         COALESCE(SUM(
           CASE
             WHEN o.raw_total IS NOT NULL AND o.raw_total->>'value' IS NOT NULL
               THEN (o.raw_total->>'value')::numeric
             ELSE COALESCE(o.total, 0)
           END
         ) - SUM(COALESCE(o.subtotal, 0) * 0.65), 0) AS gross_profit,
         COALESCE(SUM(
           CASE
             WHEN o.raw_total IS NOT NULL AND o.raw_total->>'value' IS NOT NULL
               THEN (o.raw_total->>'value')::numeric
             ELSE COALESCE(o.total, 0)
           END
         ) - SUM(COALESCE(o.subtotal, 0) * 0.65) - SUM(COALESCE(o.tax_total, 0)), 0) AS net_profit,
         COUNT(*)::int AS order_count,
         MIN(o.created_at) AS period_start,
         MAX(o.created_at) AS period_end
       FROM "order" o
       WHERE o.canceled_at IS NULL
         AND o.created_at >= (NOW() - $1::interval)`,
      [PERIOD_INTERVAL[period]]
    )

    const row = (result?.rows?.[0] || {}) as ProfitRow
    const payload = {
      gross_profit: Number(row.gross_profit || 0),
      net_profit: Number(row.net_profit || 0),
      total_revenue: Number(row.total_revenue || 0),
      total_cost: Number(row.total_cost || 0),
      order_count: Number(row.order_count || 0),
      period_start: row.period_start,
      period_end: row.period_end,
      metadata,
    }

    await eventBus.emit("finance.profit.calculated", {
      period,
      ...payload,
    })

    return res.status(200).json(payload)
  } catch (err: any) {
    logger.error(`[finance-profit] GET error: ${err.message}`)
    return res.status(500).json({ error: "Failed to calculate profit" })
  }
}
