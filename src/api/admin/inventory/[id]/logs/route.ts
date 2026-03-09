import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

async function ensureInventoryLogTable(pgConnection: any) {
  await pgConnection.raw(
    `CREATE TABLE IF NOT EXISTS inventory_log (
      id TEXT PRIMARY KEY,
      inventory_item_id TEXT NOT NULL,
      location_id TEXT,
      quantity_before INTEGER,
      quantity_after INTEGER,
      adjustment INTEGER,
      reason TEXT,
      actor_id TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`
  )
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any
  const limit = Number((req.query.limit as string) || 50)
  const offset = Number((req.query.offset as string) || 0)

  await ensureInventoryLogTable(pgConnection)

  const result = await pgConnection.raw(
    `SELECT id, inventory_item_id, location_id, quantity_before, quantity_after, adjustment, reason, actor_id, created_at
     FROM inventory_log
     WHERE inventory_item_id = ?
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [req.params.id, limit, offset]
  )

  const countResult = await pgConnection.raw(
    `SELECT COUNT(*)::int AS count FROM inventory_log WHERE inventory_item_id = ?`,
    [req.params.id]
  )

  return res.status(200).json({
    logs: result?.rows || [],
    count: Number(countResult?.rows?.[0]?.count || 0),
    limit,
    offset,
  })
}
