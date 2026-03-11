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

async function getDataByType(pgConnection: any, type: string) {
  if (type === "tax") {
    const result = await pgConnection.raw(
      `SELECT
         COALESCE(NULLIF(TRIM(o.region_code), ''), 'unknown') AS region,
         COALESCE(NULLIF(TRIM(o.tax_type), ''), 'standard') AS tax_type,
         COALESCE(SUM(COALESCE(o.tax_total, 0)), 0) AS total_tax,
         COUNT(*)::int AS order_count
       FROM "order" o
       WHERE o.canceled_at IS NULL
       GROUP BY region, tax_type
       ORDER BY region ASC, tax_type ASC`
    )

    return (result?.rows || []) as ExportRow[]
  }

  if (type === "reconciliation") {
    const result = await pgConnection.raw(
      `SELECT
         o.id AS order_id,
         o.created_at,
         COALESCE(o.total, 0) AS total,
         COALESCE(o.refunded_total, 0) AS refunded_total,
         COALESCE(o.payment_status, 'unknown') AS payment_status
       FROM "order" o
       WHERE o.canceled_at IS NULL
       ORDER BY o.created_at DESC
       LIMIT $1`,
      [500]
    )

    return (result?.rows || []) as ExportRow[]
  }

  const result = await pgConnection.raw(
    `SELECT
       COUNT(*)::int AS order_count,
       COALESCE(SUM(COALESCE(o.total, 0)), 0) AS total_revenue,
       COALESCE(SUM(COALESCE(o.tax_total, 0)), 0) AS total_tax,
       COALESCE(SUM(COALESCE(o.refunded_total, 0)), 0) AS total_refunded
     FROM "order" o
     WHERE o.canceled_at IS NULL`
  )

  return (result?.rows || []) as ExportRow[]
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
    const rows = await getDataByType(pgConnection, type)

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
