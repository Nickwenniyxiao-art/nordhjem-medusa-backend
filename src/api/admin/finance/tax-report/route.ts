import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

type TaxReportRow = {
  region: string | number | null
  tax_type: string | null
  total_tax: string | number | null
  order_count: string | number | null
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as any
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any
  const eventBus = req.scope.resolve(Modules.EVENT_BUS) as any

  const query = (req.query || {}) as Record<string, string>
  const period = String(query.period || "monthly").toLowerCase()
  const startDate = query.start_date || null
  const endDate = query.end_date || null
  const metadata = (query as any).metadata ?? null

  if (period !== "monthly") {
    return res.status(400).json({ error: "period only supports monthly" })
  }

  const conditions: string[] = ["o.canceled_at IS NULL"]
  const params: any[] = []

  if (startDate) {
    params.push(startDate)
    conditions.push(`o.created_at >= $${params.length}::timestamptz`)
  }

  if (endDate) {
    params.push(endDate)
    conditions.push(`o.created_at < ($${params.length}::date + interval '1 day')`)
  }

  const whereClause = `WHERE ${conditions.join(" AND ")}`

  try {
    let result: any

    try {
      result = await pgConnection.raw(
        `SELECT
           COALESCE(o.region_id::text, 'unknown') AS region,
           'standard' AS tax_type,
           COALESCE(SUM(COALESCE((to_jsonb(os)->>'tax_total')::numeric, 0)), 0) AS total_tax,
           COUNT(*)::int AS order_count
         FROM "order" o
         LEFT JOIN order_summary os ON os.order_id = o.id
         ${whereClause}
         GROUP BY region, tax_type
         ORDER BY region ASC, tax_type ASC`,
        params
      )
    } catch (sqlErr: any) {
      logger.error(`[finance-tax-report] SQL query failed: ${sqlErr.message}`)
      return res.status(200).json({
        period,
        start_date: startDate,
        end_date: endDate,
        report: [],
        data: [],
        metadata,
        message: "Query failed, check schema",
      })
    }

    const rows = ((result?.rows || []) as TaxReportRow[]).map((row) => ({
      region: row.region || "unknown",
      tax_type: row.tax_type || "standard",
      total_tax: Number(row.total_tax || 0),
      order_count: Number(row.order_count || 0),
    }))

    await eventBus.emit("finance.tax_report.generated", {
      period,
      start_date: startDate,
      end_date: endDate,
      record_count: rows.length,
      metadata,
    })

    return res.status(200).json({
      period,
      start_date: startDate,
      end_date: endDate,
      report: rows,
      metadata,
    })
  } catch (err: any) {
    logger.error(`[finance-tax-report] GET error: ${err.message}`)
    return res.status(500).json({ error: "Failed to generate tax report" })
  }
}
