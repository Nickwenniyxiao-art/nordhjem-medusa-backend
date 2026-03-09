import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

function escCsv(val: unknown): string {
  if (val === null || val === undefined) return ""

  const str = String(val)

  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return '"' + str.replace(/"/g, '""') + '"'
  }

  return str
}

function extractAmount(rawField: unknown, plainField: unknown): number {
  if (rawField && typeof rawField === "object" && "value" in rawField) {
    return parseFloat(String((rawField as { value: unknown }).value)) || 0
  }

  if (typeof rawField === "string") {
    try {
      const parsed = JSON.parse(rawField)
      if (parsed?.value !== undefined) {
        return parseFloat(String(parsed.value)) || 0
      }
    } catch {
      // ignore non-JSON raw amount value
    }
  }

  return parseFloat(String(plainField ?? 0)) || 0
}

const CSV_HEADERS = [
  "order_id",
  "date",
  "customer_email",
  "items",
  "subtotal",
  "shipping",
  "tax",
  "total",
  "payment_method",
  "payment_status",
  "refund_amount",
  "refund_status",
]

function buildCsv(rows: any[], fallbackItemsText = ""): string {
  let csv = CSV_HEADERS.join(",") + "\n"

  for (const row of rows) {
    const subtotal = extractAmount(row.raw_subtotal, row.subtotal)
    const shipping = extractAmount(row.raw_shipping_total, row.shipping_total)
    const tax = extractAmount(row.raw_tax_total, row.tax_total)
    const total = extractAmount(row.raw_total, row.total)
    const refundAmount = extractAmount(row.raw_refunded_total, row.refunded_total)

    const line = [
      escCsv(row.order_id),
      escCsv(row.date ? new Date(row.date).toISOString() : ""),
      escCsv(row.customer_email),
      escCsv(row.items ?? fallbackItemsText),
      escCsv(subtotal),
      escCsv(shipping),
      escCsv(tax),
      escCsv(total),
      escCsv(row.payment_provider || "stripe"),
      escCsv(row.payment_status || "unknown"),
      escCsv(refundAmount),
      escCsv(refundAmount > 0 ? "refunded" : "none"),
    ].join(",")

    csv += `${line}\n`
  }

  return csv
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as {
    error: (message: string) => void
  }

  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as {
    raw: (query: string, params?: any[]) => Promise<{ rows?: any[] }>
  }

  const { date_from, date_to, currency_code = "usd", format = "csv" } = req.query as Record<
    string,
    string
  >

  if (format.toLowerCase() !== "csv") {
    return res.status(400).json({ error: "Only csv format is supported" })
  }

  const conditions: string[] = ["o.canceled_at IS NULL", "o.currency_code = $1"]
  const params: any[] = [currency_code.toLowerCase()]
  let paramIndex = 2

  if (date_from) {
    conditions.push(`o.created_at >= $${paramIndex}::timestamptz`)
    params.push(date_from)
    paramIndex += 1
  }

  if (date_to) {
    conditions.push(`o.created_at < ($${paramIndex}::date + interval '1 day')`)
    params.push(date_to)
    paramIndex += 1
  }

  const whereClause = `WHERE ${conditions.join(" AND ")}`

  try {
    const query = `
      SELECT
        o.id AS order_id,
        o.created_at AS date,
        o.email AS customer_email,
        o.raw_subtotal,
        o.subtotal,
        o.raw_shipping_total,
        o.shipping_total,
        o.raw_tax_total,
        o.tax_total,
        o.raw_total,
        o.total,
        o.raw_refunded_total,
        o.refunded_total,
        o.payment_status,
        (
          SELECT STRING_AGG(
            CONCAT(li.title, ' (x', li.quantity, ')'),
            '; '
          )
          FROM order_line_item li
          WHERE li.order_id = o.id
        ) AS items,
        (
          SELECT p.provider_id
          FROM payment p
          JOIN payment_collection pc ON p.payment_collection_id = pc.id
          WHERE pc.id = (
            SELECT pc2.id
            FROM payment_collection pc2
            WHERE pc2.id IN (
              SELECT opc.payment_collection_id
              FROM order_payment_collection opc
              WHERE opc.order_id = o.id
            )
            LIMIT 1
          )
          LIMIT 1
        ) AS payment_provider
      FROM "order" o
      ${whereClause}
      ORDER BY o.created_at DESC
    `

    const result = await pgConnection.raw(query, params)
    const csv = buildCsv(result?.rows || [])

    const today = new Date().toISOString().split("T")[0]
    res.setHeader("Content-Type", "text/csv; charset=utf-8")
    res.setHeader("Content-Disposition", `attachment; filename="nordhjem-finance-export-${today}.csv"`)

    return res.status(200).send(csv)
  } catch (err: any) {
    logger.error(`[finance-export] Query error: ${err.message}`)

    if (err.message?.includes("order_line_item") && err.message?.includes("does not exist")) {
      try {
        const fallbackQuery = `
          SELECT
            o.id AS order_id,
            o.created_at AS date,
            o.email AS customer_email,
            o.raw_subtotal,
            o.subtotal,
            o.raw_shipping_total,
            o.shipping_total,
            o.raw_tax_total,
            o.tax_total,
            o.raw_total,
            o.total,
            o.raw_refunded_total,
            o.refunded_total,
            o.payment_status
          FROM "order" o
          ${whereClause}
          ORDER BY o.created_at DESC
        `

        const fallbackResult = await pgConnection.raw(fallbackQuery, params)
        const csv = buildCsv(fallbackResult?.rows || [], "(line items unavailable)")

        const today = new Date().toISOString().split("T")[0]
        res.setHeader("Content-Type", "text/csv; charset=utf-8")
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="nordhjem-finance-export-${today}.csv"`
        )

        return res.status(200).send(csv)
      } catch (fallbackErr: any) {
        logger.error(`[finance-export] Fallback error: ${fallbackErr.message}`)
      }
    }

    if (err.message?.includes("does not exist")) {
      res.setHeader("Content-Type", "text/csv; charset=utf-8")
      return res.status(200).send(`${CSV_HEADERS.join(",")}\n`)
    }

    return res.status(500).json({ error: "Failed to export finance data" })
  }
}
