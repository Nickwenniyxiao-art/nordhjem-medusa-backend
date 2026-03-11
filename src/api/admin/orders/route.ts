import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any

  const query = (req.query || {}) as Record<string, any>
  const limit = Math.min(Number(query.limit) || 20, 100)
  const offset = Math.max(Number(query.offset) || 0, 0)

  const sortBy = query.sort_by === "total" ? "total" : "created_at"
  const sortOrder = String(query.sort_order || "desc").toLowerCase() === "asc" ? "ASC" : "DESC"

  const statusAllowList = ["pending", "completed", "canceled", "archived", "requires_action"]

  const conditions: string[] = []
  const params: any[] = []

  if (query.date_from) {
    conditions.push("o.created_at >= ?::timestamptz")
    params.push(query.date_from)
  }

  if (query.date_to) {
    conditions.push("o.created_at < (?::date + interval '1 day')")
    params.push(query.date_to)
  }

  if (query.status && statusAllowList.includes(String(query.status))) {
    conditions.push("o.status = ?")
    params.push(query.status)
  }

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

  if (query.customer_id) {
    conditions.push("o.customer_id = ?")
    params.push(String(query.customer_id))
  }

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

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""

  const countResult = await pgConnection.raw(
    `SELECT COUNT(*)::int AS count FROM "order" o ${whereClause}`,
    params
  )

  const listResult = await pgConnection.raw(
    `SELECT o.* FROM "order" o
     ${whereClause}
     ORDER BY o.${sortBy === "total" ? "total" : "created_at"} ${sortOrder}
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
