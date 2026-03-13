import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

async function ensureLoginHistoryTable(pgConnection: any) {
  await pgConnection.raw(
    `CREATE TABLE IF NOT EXISTS customer_login_history (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      customer_id TEXT NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      login_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      status TEXT NOT NULL
    )`,
  );
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any;

  const customerId = (req as any).auth_context?.actor_id;
  if (!customerId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const query = (req.query || {}) as any;
  const limit = Math.min(Number(query.limit) || 20, 100);
  const offset = Math.max(Number(query.offset) || 0, 0);

  await ensureLoginHistoryTable(pgConnection);

  const listResult = await pgConnection.raw(
    `SELECT id, customer_id, ip_address, user_agent, login_at, status
     FROM customer_login_history
     WHERE customer_id = ?
     ORDER BY login_at DESC
     LIMIT ? OFFSET ?`,
    [customerId, limit, offset],
  );

  const countResult = await pgConnection.raw(
    `SELECT COUNT(*)::int AS count FROM customer_login_history WHERE customer_id = ?`,
    [customerId],
  );

  return res.status(200).json({
    login_history: listResult.rows || [],
    count: countResult.rows?.[0]?.count || 0,
  });
}
