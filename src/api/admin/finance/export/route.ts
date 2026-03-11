import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

type ExportRow = Record<string, string | number | null>

function toCsv(rows: ExportRow[]) {
  if (!rows.length) {
    return ""
  }

  const headers = Object.keys(rows[0])
  const esc = (v: unknown) => {
    if (v === null || v === undefined) {
      return ""
    }
    const s = String(v)
    if (/[",\n]/.test(s)) {
      return `"${s.replace(/"/g, '""')}"`
    }
    return s
  }

  const lines = [headers.join(",")]
  for (const row of rows) {
    lines.push(headers.map((h) => esc(row[h])).join(","))
  }

  return `${lines.join("\n")}\n`
}

async function getDataByType(pgConnection: any, type: string, logger: any) {
  if (type === "tax") {
    try {
      const result = await pgConnection.raw(
        `SELECT
           COALESCE(o.region_id::text, 'unknown') AS region,
           'standard' AS tax_type,
           COALESCE(SUM(COALESCE((to_jsonb(os)->>'tax_total')::numeric, 0)), 0) AS total_tax,
           COUNT(*)::int AS order_count
         FROM "order" o
         LEFT JOIN order_summary os ON os.order_id = o.id
         WHERE o.canceled_at IS NULL
         GROUP BY region, tax_type
         ORDER BY region ASC, tax_type ASC`
      )

      return { rows: (result?.rows || []) as ExportRow[] }
    } catch (sqlErr: any) {
      logger.error(`[finance-export] tax SQL query failed: ${sqlErr.message}`)
      return { rows: [] as ExportRow[], error: "Query failed, check schema" }
    }
  }

  if (type === "reconciliation") {
    try {
      const result = await pgConnection.raw(
        `SELECT
           o.id AS order_id,
           o.created_at,
           COALESCE((to_jsonb(os)->>'total')::numeric, 0) AS total,
           COALESCE((to_jsonb(os)->>'refunded_total')::numeric, 0) AS refunded_total,
           COALESCE((to_jsonb(ot)->>'status'), 'unknown') AS payment_status
         FROM "order" o
         LEFT JOIN order_summary os ON os.order_id = o.id
         LEFT JOIN order_transaction ot ON ot.order_id = o.id
         WHERE o.canceled_at IS NULL
         ORDER BY o.created_at DESC
         LIMIT $1`,
        [500]
      )

      return { rows: (result?.rows || []) as ExportRow[] }
    } catch (sqlErr: any) {
      logger.error(`[finance-export] reconciliation SQL query failed: ${sqlErr.message}`)
      return { rows: [] as ExportRow[], error: "Query failed, check schema" }
    }
  }

  try {
    const result = await pgConnection.raw(
      `SELECT
         COUNT(*)::int AS order_count,
         COALESCE(SUM(COALESCE((to_jsonb(os)->>'total')::numeric, 0)), 0) AS total_revenue,
         COALESCE(SUM(COALESCE((to_jsonb(os)->>'tax_total')::numeric, 0)), 0) AS total_tax,
         COALESCE(SUM(COALESCE((to_jsonb(os)->>'refunded_total')::numeric, 0)), 0) AS total_refunded
       FROM "order" o
       LEFT JOIN order_summary os ON os.order_id = o.id
       WHERE o.canceled_at IS NULL`
    )

    return { rows: (result?.rows || []) as ExportRow[] }
  } catch (sqlErr: any) {
    logger.error(`[finance-export] summary SQL query failed: ${sqlErr.message}`)
    return { rows: [] as ExportRow[], error: "Query failed, check schema" }
  }
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as any
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any
  const eventBus = req.scope.resolve(Modules.EVENT_BUS) as any

  const query = (req.query || {}) as Record<string, string>
  const format = String(query.format || "csv").toLowerCase()
  const type = String(query.type || "summary").toLowerCase()
  const metadata = (query as any).metadata ?? null

  if (!["csv", "xlsx"].includes(format)) {
    return res.status(400).json({ error: "format must be csv or xlsx" })
  }

  if (!["summary", "tax", "reconciliation"].includes(type)) {
    return res.status(400).json({ error: "type must be summary, tax, or reconciliation" })
  }

  try {
    const { rows, error } = await getDataByType(pgConnection, type, logger)

    if (error) {
      return res.status(200).json({ data: [], message: "Query failed, check schema" })
    }

    await eventBus.emit("finance.export.completed", {
      format,
      type,
      row_count: rows.length,
      metadata,
    })

    if (format === "csv") {
      const csv = toCsv(rows)
      res.setHeader("Content-Type", "text/csv; charset=utf-8")
      res.setHeader("Content-Disposition", `attachment; filename="finance-${type}.csv"`)
      return res.status(200).send(csv)
    }

    return res.status(200).json({
      format,
      type,
      phase: 1,
      data: rows,
      metadata,
      message: "XLSX export is not enabled yet. Returning JSON payload in phase 1.",
    })
  } catch (err: any) {
    logger.error(`[finance-export] GET error: ${err.message}`)
    return res.status(500).json({ error: "Failed to export finance data" })
  }
}
