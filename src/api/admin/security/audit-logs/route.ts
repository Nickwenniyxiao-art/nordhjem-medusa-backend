import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as { error: (message: string) => void }
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as {
    raw: (query: string, params?: unknown[]) => Promise<{ rows?: Record<string, unknown>[] }>
  }

  const query = req.query as Record<string, string | undefined>
  const actionType = query.action_type
  const actorId = query.actor_id
  const startDate = query.start_date
  const endDate = query.end_date
  const resource = query.resource
  const limit = Number.parseInt(query.limit || "50", 10) || 50
  const offset = Number.parseInt(query.offset || "0", 10) || 0

  try {
    await pgConnection.raw(
      `CREATE TABLE IF NOT EXISTS audit_log (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        action_type TEXT NOT NULL,
        resource TEXT NOT NULL,
        resource_id TEXT,
        actor_id TEXT,
        timestamp TIMESTAMPTZ DEFAULT now(),
        request_body_summary TEXT,
        metadata JSONB DEFAULT '{}'
      )`
    )

    let whereSql = ` WHERE 1=1`
    const whereParams: unknown[] = []

    if (actionType) {
      whereSql += ` AND action_type = ?`
      whereParams.push(actionType)
    }

    if (actorId) {
      whereSql += ` AND actor_id = ?`
      whereParams.push(actorId)
    }

    if (resource) {
      whereSql += ` AND resource LIKE ?`
      whereParams.push(`%${resource}%`)
    }

    if (startDate) {
      whereSql += ` AND timestamp >= ?::timestamptz`
      whereParams.push(startDate)
    }

    if (endDate) {
      whereSql += ` AND timestamp <= ?::timestamptz`
      whereParams.push(endDate)
    }

    const listResult = await pgConnection.raw(
      `SELECT * FROM audit_log ${whereSql} ORDER BY timestamp DESC LIMIT ? OFFSET ?`,
      [...whereParams, limit, offset]
    )

    const totalResult = await pgConnection.raw(
      `SELECT COUNT(*)::int AS total FROM audit_log ${whereSql}`,
      whereParams
    )

    const total = Number((totalResult.rows?.[0] as { total?: number } | undefined)?.total || 0)

    return res.status(200).json({
      audit_logs: listResult?.rows || [],
      total,
      offset,
      limit,
      metadata: {},
    })
  } catch (err: any) {
    logger.error(`[security-audit-logs] GET error: ${err.message}`)
    return res.status(500).json({ error: "Failed to fetch security audit logs" })
  }
}
