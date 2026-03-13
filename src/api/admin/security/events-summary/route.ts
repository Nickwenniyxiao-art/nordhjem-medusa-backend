import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const pgConnection = req.scope.resolve("pgConnection") as any

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

    const failedLoginsResult = await pgConnection.raw(
      `SELECT COUNT(*)::int AS count
       FROM audit_log
       WHERE timestamp >= NOW() - INTERVAL '24 hours'
         AND (
           action_type ILIKE $1
           OR action_type ILIKE $2
           OR resource ILIKE $3
         )`,
      ["%login_failed%", "%failed_login%", "%login%"]
    )

    const suspiciousIpsResult = await pgConnection.raw(
      `SELECT COALESCE(json_agg(ip), '[]'::json) AS ips
       FROM (
         SELECT
           COALESCE(metadata->>'ip_address', metadata->>'ip', metadata->>'client_ip') AS ip,
           COUNT(*)::int AS hit_count
         FROM audit_log
         WHERE timestamp >= NOW() - INTERVAL '24 hours'
         GROUP BY COALESCE(metadata->>'ip_address', metadata->>'ip', metadata->>'client_ip')
         HAVING COUNT(*) >= 10
       ) suspicious
       WHERE ip IS NOT NULL`
    )

    const rateLimitHitsResult = await pgConnection.raw(
      `SELECT COUNT(*)::int AS count
       FROM audit_log
       WHERE timestamp >= NOW() - INTERVAL '24 hours'
         AND (
           action_type ILIKE $1
           OR action_type ILIKE $2
           OR resource ILIKE $3
         )`,
      ["%rate_limit%", "%too_many_requests%", "%rate-limit%"]
    )

    const lastIncidentResult = await pgConnection.raw(
      `SELECT id, action_type, resource, actor_id, timestamp, metadata
       FROM audit_log
       WHERE
         action_type ILIKE $1
         OR action_type ILIKE $2
         OR action_type ILIKE $3
         OR action_type ILIKE $4
       ORDER BY timestamp DESC
       LIMIT 1`,
      ["%failed%", "%suspicious%", "%rate_limit%", "%incident%"]
    )

    return res.status(200).json({
      failed_logins_24h: toNumber(failedLoginsResult?.rows?.[0]?.count),
      suspicious_ips: suspiciousIpsResult?.rows?.[0]?.ips || [],
      rate_limit_hits_24h: toNumber(rateLimitHitsResult?.rows?.[0]?.count),
      last_security_incident: lastIncidentResult?.rows?.[0] || null,
    })
  } catch (err: any) {
    console.error("[security][events-summary][GET]", err)
    return res.status(500).json({ error: "Failed to query security events summary" })
  }
}
