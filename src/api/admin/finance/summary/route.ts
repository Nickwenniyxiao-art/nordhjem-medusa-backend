/**
 * Admin API: GET /admin/finance/summary
 *
 * 返回财务汇总：总收入、总退款、净收入、Stripe 手续费估算、待处理退款。
 * Stripe 手续费按 2.9% + $0.30 每笔订单估算。
 */
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

type RawResultRow = Record<string, string | number | Date | null>

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as {
    error: (message: string) => void
  }
  const pgConnection = req.scope.resolve(
    ContainerRegistrationKeys.PG_CONNECTION
  ) as {
    raw: (query: string, params?: unknown[]) => Promise<{ rows?: RawResultRow[] }>
  }

  const {
    date_from,
    date_to,
    granularity = "month",
    currency_code = "usd",
  } = req.query as Record<string, string>

  try {
    const validGranularities = ["day", "week", "month"]
    const gran = validGranularities.includes(granularity) ? granularity : "month"

    const conditions: string[] = [
      "o.canceled_at IS NULL",
      "o.currency_code = ?",
    ]
    const params: unknown[] = [currency_code.toLowerCase()]
    if (date_from) {
      conditions.push("o.created_at >= ?::timestamptz")
      params.push(date_from)
    }

    if (date_to) {
      conditions.push("o.created_at < (?::date + interval '1 day')")
      params.push(date_to)
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`
    const truncExpr = `date_trunc('${gran}', o.created_at)`

    const totalExpr = `
      CASE
        WHEN o.raw_total IS NOT NULL AND o.raw_total->>'value' IS NOT NULL
          THEN (o.raw_total->>'value')::numeric
        ELSE COALESCE(o.total, 0)
      END
    `

    const refundExpr = `
      CASE
        WHEN o.raw_refunded_total IS NOT NULL AND o.raw_refunded_total->>'value' IS NOT NULL
          THEN (o.raw_refunded_total->>'value')::numeric
        ELSE COALESCE(o.refunded_total, 0)
      END
    `

    const dataPointsQuery = `
      SELECT
        ${truncExpr} AS period,
        COALESCE(SUM(${totalExpr}), 0) AS revenue,
        COALESCE(SUM(${refundExpr}), 0) AS refunds,
        COALESCE(SUM(${totalExpr}) - SUM(${refundExpr}), 0) AS net
      FROM "order" o
      ${whereClause}
      GROUP BY period
      ORDER BY period DESC
    `

    const dataPointsResult = await pgConnection.raw(dataPointsQuery, params)
    const dataPoints = (dataPointsResult?.rows ?? []).map((row) => ({
      period: row.period,
      revenue: Number(row.revenue ?? 0),
      refunds: Number(row.refunds ?? 0),
      net: Number(row.net ?? 0),
    }))

    const totalRevenue = dataPoints.reduce((sum, point) => sum + point.revenue, 0)
    const totalRefunds = dataPoints.reduce((sum, point) => sum + point.refunds, 0)
    const netRevenue = totalRevenue - totalRefunds

    const feeQuery = `
      SELECT
        COALESCE(SUM(${totalExpr} * 0.029 + 0.30), 0) AS estimated_fees
      FROM "order" o
      ${whereClause}
    `
    const feeResult = await pgConnection.raw(feeQuery, params)
    const estimatedFeesRaw = feeResult?.rows?.[0]?.estimated_fees
    const estimatedStripeFees = Math.round(Number(estimatedFeesRaw ?? 0) * 100) / 100

    let pendingRefunds = 0
    try {
      const pendingQuery = `
        SELECT
          COALESCE(SUM(
            CASE
              WHEN r.raw_refund_amount IS NOT NULL AND r.raw_refund_amount->>'value' IS NOT NULL
                THEN (r.raw_refund_amount->>'value')::numeric
              ELSE COALESCE(r.refund_amount, 0)
            END
          ), 0) AS pending
        FROM return r
        JOIN "order" o ON r.order_id = o.id
        ${whereClause}
        AND r.status IN ('requested', 'received')
      `
      const pendingResult = await pgConnection.raw(pendingQuery, params)
      pendingRefunds = Number(pendingResult?.rows?.[0]?.pending ?? 0)
    } catch {
      pendingRefunds = 0
    }

    return res.status(200).json({
      total_revenue: totalRevenue,
      total_refunds: totalRefunds,
      net_revenue: netRevenue,
      estimated_stripe_fees: estimatedStripeFees,
      pending_refunds: pendingRefunds,
      currency_code: currency_code.toLowerCase(),
      data_points: dataPoints,
      date_from: date_from ?? null,
      date_to: date_to ?? null,
    })
  } catch (err: any) {
    logger.error(`[finance-summary] Query error: ${err.message}`)

    if (err.message?.includes("does not exist")) {
      return res.status(200).json({
        total_revenue: 0,
        total_refunds: 0,
        net_revenue: 0,
        estimated_stripe_fees: 0,
        pending_refunds: 0,
        currency_code: currency_code.toLowerCase(),
        data_points: [],
        date_from: date_from ?? null,
        date_to: date_to ?? null,
        note: "Order table not initialized.",
      })
    }

    return res.status(500).json({ error: "Failed to query finance summary" })
  }
}
