/**
 * Admin API: GET /admin/data-processing-log
 *
 * 允许管理员查看数据处理日志（GDPR 审计）。
 * 支持分页和按类型/客户过滤。
 */
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as any
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any

  const {
    customer_id,
    action_type,
    limit = "50",
    offset = "0",
  } = req.query as Record<string, string>

  try {
    let query = `SELECT * FROM data_processing_log WHERE 1=1`
    const params: any[] = []
    let paramIndex = 1

    if (customer_id) {
      query += ` AND customer_id = $${paramIndex}`
      params.push(customer_id)
      paramIndex++
    }

    if (action_type) {
      query += ` AND action_type = $${paramIndex}`
      params.push(action_type)
      paramIndex++
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    params.push(parseInt(limit) || 50, parseInt(offset) || 0)

    const result = await pgConnection.raw(query, params)

    let countQuery = `SELECT COUNT(*) FROM data_processing_log WHERE 1=1`
    const countParams: any[] = []
    let countIndex = 1

    if (customer_id) {
      countQuery += ` AND customer_id = $${countIndex}`
      countParams.push(customer_id)
      countIndex++
    }

    if (action_type) {
      countQuery += ` AND action_type = $${countIndex}`
      countParams.push(action_type)
    }

    const countResult = await pgConnection.raw(countQuery, countParams)

    return res.status(200).json({
      logs: result?.rows || [],
      count: parseInt(countResult?.rows?.[0]?.count || "0"),
      limit: parseInt(limit) || 50,
      offset: parseInt(offset) || 0,
    })
  } catch (err: any) {
    if (err.message?.includes("does not exist")) {
      return res.status(200).json({
        logs: [],
        count: 0,
        note: "data_processing_log table not yet created. Run the migration script.",
      })
    }

    logger.error(`[data-processing-log] Query error: ${err.message}`)
    return res.status(500).json({ error: "Failed to query logs" })
  }
}
