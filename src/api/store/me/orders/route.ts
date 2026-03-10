import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any

  const customerId = (req as any).auth_context?.actor_id
  if (!customerId) {
    return res.status(401).json({ error: "Authentication required" })
  }

  const query = (req.query || {}) as any
  const limit = Math.min(Number(query.limit) || 20, 100)
  const offset = Math.max(Number(query.offset) || 0, 0)

  const sortBy = query.sort_by === "total" ? "total" : "created_at"
  const sortOrder = String(query.sort_order || "desc").toLowerCase() === "asc" ? "ASC" : "DESC"

  const statusAllowList = ["pending", "completed", "canceled", "archived"]

  const conditions: string[] = [`customer_id = ?`]
  const params: any[] = [customerId]

  if (query.date_from) {
    conditions.push("created_at >= ?")
    params.push(new Date(query.date_from))
  }

  if (query.date_to) {
    conditions.push("created_at <= ?")
    params.push(new Date(query.date_to))
  }

  if (query.status && statusAllowList.includes(query.status)) {
    conditions.push("status = ?")
    params.push(query.status)
  }

  if (query.min_amount !== undefined) {
    conditions.push("total >= ?")
    params.push(Number(query.min_amount))
  }

  if (query.max_amount !== undefined) {
    conditions.push("total <= ?")
    params.push(Number(query.max_amount))
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""

  const countResult = await pgConnection.raw(
    `SELECT COUNT(*)::int AS count FROM "order" ${whereClause}`,
    params
  )

  const listResult = await pgConnection.raw(
    `SELECT * FROM "order"
     ${whereClause}
     ORDER BY ${sortBy === "total" ? "total" : "created_at"} ${sortOrder}
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
