import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any

  const query = (req.query || {}) as Record<string, any>
  const limit = Math.min(Number(query.limit) || 20, 100)
  const offset = Math.max(Number(query.offset) || 0, 0)

  const sortAllowList = ["created_at", "total", "status"]
  const sortBy = sortAllowList.includes(String(query.sort_by)) ? String(query.sort_by) : "created_at"
  const sortOrder = String(query.sort_order || "desc").toLowerCase() === "asc" ? "ASC" : "DESC"

  const statusAllowList = [
    "pending", "processing", "shipped", "delivered",
    "completed", "canceled", "archived", "requires_action",
  ]

  const conditions: string[] = []
  const params: any[] = []
  const joins: string[] = []

  // Date range filters
  if (query.date_from) {
    conditions.push("o.created_at >= ?::timestamptz")
    params.push(query.date_from)
  }

  if (query.date_to) {
    conditions.push("o.created_at < (?::date + interval '1 day')")
    params.push(query.date_to)
  }

  // Status filter
  if (query.status && statusAllowList.includes(String(query.status))) {
    conditions.push("o.status = ?")
    params.push(query.status)
  }

  // Amount filters
  const minAmount = query.amount_min ?? query.min_amount
  if (minAmount !== undefined && minAmount !== "") {
    conditions.push("COALESCE((o.raw_total->>'value')::numeric, o.total, 0) >= ?")
    params.push(Number(minAmount))
  }

  const maxAmount = query.amount_max ?? query.max_amount
  if (maxAmount !== undefined && maxAmount !== "") {
    conditions.push("COALESCE((o.raw_total->>'value')::numeric, o.total, 0) <= ?")
    params.push(Number(maxAmount))
  }

  // Customer ID filter
  if (query.customer_id) {
    conditions.push("o.customer_id = ?")
    params.push(String(query.customer_id))
  }

  // Customer email filter (JOIN to customer table)
  if (query.email) {
    joins.push(`LEFT JOIN customer c ON c.id = o.customer_id`)
    conditions.push("c.email ILIKE ?")
    params.push(`%${String(query.email)}%`)
  }

  // Order number / display_id filter
  if (query.order_number) {
    conditions.push("o.display_id::text = ?")
    params.push(String(query.order_number))
  }

  // Payment status filter
  if (query.payment_status) {
    joins.push(
      `LEFT JOIN order_payment_collection opc ON opc.order_id = o.id
       LEFT JOIN payment_collection pcol ON pcol.id = opc.payment_collection_id`
    )
    conditions.push("pcol.status = ?")
    params.push(String(query.payment_status))
  }

  // Product ID filter
  if (query.product_id) {
    conditions.push(
      `EXISTS (
        SELECT 1
        FROM order_line_item oli
        WHERE oli.order_id = o.id
          AND oli.product_id = ?
      )`
    )
    params.push(String(query.product_id))
  }

  // Free text search (searches across display_id, email, customer name)
  if (query.q) {
    const searchTerm = `%${String(query.q)}%`
    if (!joins.some((j) => j.includes("LEFT JOIN customer c"))) {
      joins.push(`LEFT JOIN customer c ON c.id = o.customer_id`)
    }
    conditions.push(
      `(o.display_id::text ILIKE ? OR c.email ILIKE ? OR c.first_name ILIKE ? OR c.last_name ILIKE ?)`
    )
    params.push(searchTerm, searchTerm, searchTerm, searchTerm)
  }

  const joinClause = joins.length ? joins.join(" ") : ""
  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""

  const countResult = await pgConnection.raw(
    `SELECT COUNT(DISTINCT o.id)::int AS count FROM "order" o ${joinClause} ${whereClause}`,
    params
  )

  const listResult = await pgConnection.raw(
    `SELECT DISTINCT o.* FROM "order" o
     ${joinClause}
     ${whereClause}
     ORDER BY o.${sortBy} ${sortOrder}
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  )

  return res.status(200).json({
    orders: listResult.rows || [],
    count: countResult.rows?.[0]?.count || 0,
    limit,
    offset,
  })
}
