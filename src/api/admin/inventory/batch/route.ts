import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

type BatchInventoryAction = "adjust_quantity" | "set_threshold" | "csv_import"

type BatchInventoryItem = {
  inventory_item_id: string
  location_id: string
  quantity?: number
  threshold?: number
  reason?: string
}

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

function getActorId(req: MedusaRequest) {
  const authContext = (req as any).auth_context || {}
  return authContext.actor_id || authContext.user_id || null
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any
  const eventBus = req.scope.resolve(Modules.EVENT_BUS) as any

  const body = (req.body || {}) as any
  const action = body.action as BatchInventoryAction | undefined
  const items = Array.isArray(body.items) ? (body.items as BatchInventoryItem[]) : []

  if (!action || !["adjust_quantity", "set_threshold", "csv_import"].includes(action)) {
    return res.status(400).json({ error: "Invalid action" })
  }

  if (items.length === 0) {
    return res.status(400).json({ error: "items is required" })
  }

  await ensureInventoryLogTable(pgConnection)

  const results: Array<Record<string, unknown>> = []
  const actorId = getActorId(req)

  for (const item of items) {
    try {
      if (!item.inventory_item_id) {
        throw new Error("inventory_item_id is required")
      }

      const levelResult = await pgConnection.raw(
        `SELECT stocked_quantity FROM inventory_level WHERE inventory_item_id = ? AND location_id = ? LIMIT 1`,
        [item.inventory_item_id, item.location_id]
      )

      const row = levelResult?.rows?.[0]
      if (!row) {
        throw new Error("Inventory level not found")
      }

      const quantityBefore = Number(row.stocked_quantity || 0)
      let quantityAfter = quantityBefore
      let adjustment = 0

      if (action === "adjust_quantity" || action === "csv_import") {
        const delta = Number(item.quantity || 0)
        quantityAfter = quantityBefore + delta
        adjustment = delta

        await pgConnection.raw(
          `UPDATE inventory_level SET stocked_quantity = ?, updated_at = NOW() WHERE inventory_item_id = ? AND location_id = ?`,
          [quantityAfter, item.inventory_item_id, item.location_id]
        )
      }

      if (action === "set_threshold") {
        const threshold = Number(item.threshold)
        if (!Number.isFinite(threshold)) {
          throw new Error("threshold is required")
        }

        await pgConnection.raw(
          `UPDATE inventory_level SET metadata = COALESCE(metadata, '{}'::jsonb) || ?::jsonb, updated_at = NOW() WHERE inventory_item_id = ? AND location_id = ?`,
          [
            JSON.stringify({ low_stock_threshold: threshold }),
            item.inventory_item_id,
            item.location_id,
          ]
        )
      }

      const reason = item.reason || `${action}`

      await pgConnection.raw(
        `INSERT INTO inventory_log (id, inventory_item_id, location_id, quantity_before, quantity_after, adjustment, reason, actor_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          `ilog_${Math.random().toString(36).slice(2)}`,
          item.inventory_item_id,
          item.location_id,
          quantityBefore,
          quantityAfter,
          adjustment,
          reason,
          actorId,
        ]
      )

      results.push({
        inventory_item_id: item.inventory_item_id,
        location_id: item.location_id,
        success: true,
        quantity_before: quantityBefore,
        quantity_after: quantityAfter,
        adjustment,
      })
    } catch (e: any) {
      results.push({
        inventory_item_id: item.inventory_item_id,
        location_id: item.location_id,
        success: false,
        error: e?.message || "Unknown error",
      })
    }
  }

  try {
    await eventBus.emit("inventory.batch_updated", {
      action,
      processed: results.length,
      succeeded: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
    })
  } catch {
    // optional
  }

  return res.status(200).json({
    action,
    processed: results.length,
    succeeded: results.filter((r) => r.success).length,
    failed: results.filter((r) => !r.success).length,
    results,
  })
}
