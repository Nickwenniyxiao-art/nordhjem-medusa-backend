import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as { error: (message: string) => void }
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as {
    raw: (query: string, params?: unknown[]) => Promise<{ rows?: Record<string, unknown>[] }>
  }

  const query = req.query as Record<string, string | undefined>
  const action = query.action
  const actorId = query.actor_id
  const date = query.date
  const limit = Number.parseInt(query.limit || "50", 10) || 50
  const offset = Number.parseInt(query.offset || "0", 10) || 0

  try {
    await pgConnection.raw(
      `CREATE TABLE IF NOT EXISTS security_audit_log (
        id BIGSERIAL PRIMARY KEY,
        action VARCHAR(64) NOT NULL,
        actor_id VARCHAR(128),
        target_id VARCHAR(128),
        resource VARCHAR(128),
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`
    )

    let sql = `SELECT * FROM security_audit_log WHERE 1=1`
    const params: unknown[] = []

    if (action) {
      sql += ` AND action = ?`
      params.push(action)
    }

    if (actorId) {
      sql += ` AND actor_id = ?`
      params.push(actorId)
    }

    if (date) {
      sql += ` AND DATE(created_at) = ?`
      params.push(date)
    }

    sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`
    params.push(limit, offset)

    const result = await pgConnection.raw(sql, params)

    return res.status(200).json({
      logs: result?.rows || [],
      limit,
      offset,
    })
  } catch (err: any) {
    logger.error(`[security-audit-logs] GET error: ${err.message}`)
    return res.status(500).json({ error: "Failed to fetch security audit logs" })
  }
}
