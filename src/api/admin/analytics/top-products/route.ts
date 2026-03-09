/**
 * Admin API: GET /admin/analytics/top-products
 *
 * 返回按销量排名的热销商品列表。
 * 从 order line items 聚合，GROUP BY variant_id ORDER BY quantity_sold DESC。
 */
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

const parseLimit = (rawLimit?: string) => {
  const parsed = Number.parseInt(rawLimit || "20", 10)
  return Math.min(Math.max(Number.isNaN(parsed) ? 20 : parsed, 1), 100)
}

const mapRows = (rows: any[]) =>
  rows.map((row) => ({
    product_id: row.product_id,
    product_title: row.product_title,
    variant_title: row.variant_title,
    variant_id: row.variant_id,
    sku: row.sku || null,
    quantity_sold: Number.parseInt(String(row.quantity_sold || "0"), 10) || 0,
    total_revenue: Number.parseFloat(String(row.total_revenue || "0")) || 0,
  }))

const buildConditions = (
  currencyCode: string,
  dateFrom?: string,
  dateTo?: string
): { whereClause: string; params: any[]; limitParam: string } => {
  const conditions: string[] = [
    "o.canceled_at IS NULL",
    "o.currency_code = ?",
  ]

  const params: any[] = [currencyCode]

  if (dateFrom) {
    conditions.push("o.created_at >= ?::timestamptz")
    params.push(dateFrom)
  }

  if (dateTo) {
    conditions.push("o.created_at < (?::date + interval '1 day')")
    params.push(dateTo)
  }

  return {
    whereClause: `WHERE ${conditions.join(" AND ")}`,
    params,
    limitParam: "?",
  }
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as any
  const pgConnection = req.scope.resolve(
    ContainerRegistrationKeys.PG_CONNECTION
  ) as any

  const {
    limit,
    date_from,
    date_to,
    currency_code = "usd",
  } = req.query as Record<string, string>

  const normalizedCurrency = currency_code.toLowerCase()
  const safeLimit = parseLimit(limit)

  try {
    const { whereClause, params, limitParam } = buildConditions(
      normalizedCurrency,
      date_from,
      date_to
    )

    const query = `
      SELECT
        li.product_id,
        li.title AS product_title,
        li.variant_title,
        li.variant_id,
        li.variant_sku AS sku,
        SUM(li.quantity)::int AS quantity_sold,
        COALESCE(SUM(
          CASE
            WHEN li.raw_unit_price IS NOT NULL AND li.raw_unit_price->>'value' IS NOT NULL
              THEN (li.raw_unit_price->>'value')::numeric * li.quantity
            ELSE COALESCE(li.unit_price, 0) * li.quantity
          END
        ), 0) AS total_revenue
      FROM order_line_item li
      JOIN "order" o ON li.order_id = o.id
      ${whereClause}
      GROUP BY li.variant_id, li.product_id, li.title, li.variant_title, li.variant_sku
      ORDER BY quantity_sold DESC, total_revenue DESC
      LIMIT ${limitParam}
    `

    const result = await pgConnection.raw(query, [...params, safeLimit])
    const products = mapRows(result?.rows || [])

    return res.status(200).json({
      products,
      count: products.length,
      currency_code: normalizedCurrency,
      date_from: date_from || null,
      date_to: date_to || null,
    })
  } catch (err: any) {
    logger.error(`[top-products] Query error: ${err.message}`)

    if (err.message?.includes("does not exist")) {
      try {
        const { whereClause, params, limitParam } = buildConditions(
          normalizedCurrency,
          date_from,
          date_to
        )

        const fallbackQuery = `
          SELECT
            li.product_id,
            li.title AS product_title,
            li.variant_title,
            li.variant_id,
            li.variant_sku AS sku,
            SUM(li.quantity)::int AS quantity_sold,
            COALESCE(SUM(COALESCE(li.unit_price, 0) * li.quantity), 0) AS total_revenue
          FROM line_item li
          JOIN "order" o ON li.order_id = o.id
          ${whereClause}
          GROUP BY li.variant_id, li.product_id, li.title, li.variant_title, li.variant_sku
          ORDER BY quantity_sold DESC, total_revenue DESC
          LIMIT ${limitParam}
        `

        const fallbackResult = await pgConnection.raw(fallbackQuery, [
          ...params,
          safeLimit,
        ])

        const products = mapRows(fallbackResult?.rows || [])

        return res.status(200).json({
          products,
          count: products.length,
          currency_code: normalizedCurrency,
          date_from: date_from || null,
          date_to: date_to || null,
          note: "Used fallback table name 'line_item'.",
        })
      } catch {
        return res.status(200).json({
          products: [],
          count: 0,
          currency_code: normalizedCurrency,
          date_from: date_from || null,
          date_to: date_to || null,
          note: "Line item table not found. Ensure migrations are up to date.",
        })
      }
    }

    return res.status(500).json({ error: "Failed to query top products" })
  }
}
