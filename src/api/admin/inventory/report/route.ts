import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

function toNum(value: unknown, fallback = 0): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as {
    raw: (query: string, params?: any[]) => Promise<{ rows?: any[] }>
  }
  const eventBus = req.scope.resolve(Modules.EVENT_BUS) as unknown as {
    emit: (eventName: string, data: Record<string, unknown>) => Promise<void>
  }

  const query = `
    WITH inventory_by_item AS (
      SELECT
        il.inventory_item_id,
        SUM(COALESCE(il.stocked_quantity, 0))::numeric AS total_stock,
        MAX(COALESCE((il.metadata->>'low_stock_threshold')::numeric, 10)) AS threshold
      FROM inventory_level il
      GROUP BY il.inventory_item_id
    ),
    sku_stats AS (
      SELECT
        COUNT(*)::numeric AS total_items,
        SUM(CASE WHEN COALESCE(ibi.total_stock, 0) = 0 THEN 1 ELSE 0 END)::numeric AS stockout_items,
        SUM(CASE WHEN COALESCE(ibi.total_stock, 0) < COALESCE(ibi.threshold, 10) THEN 1 ELSE 0 END)::numeric AS below_threshold_items
      FROM inventory_by_item ibi
    ),
    sales_by_product AS (
      SELECT
        li.product_id,
        SUM(COALESCE(li.quantity, 0))::numeric AS sold_quantity
      FROM order_line_item li
      JOIN "order" o ON o.id = li.order_id
      WHERE o.canceled_at IS NULL
      GROUP BY li.product_id
    ),
    inventory_by_product AS (
      SELECT
        pv.product_id,
        AVG(COALESCE(il.stocked_quantity, 0))::numeric AS avg_inventory
      FROM product_variant_inventory_item pvii
      JOIN product_variant pv ON pv.id = pvii.variant_id
      JOIN inventory_level il ON il.inventory_item_id = pvii.inventory_item_id
      GROUP BY pv.product_id
    ),
    turnover AS (
      SELECT
        COALESCE(SUM(
          CASE WHEN COALESCE(ibp.avg_inventory, 0) = 0 THEN 0
               ELSE COALESCE(sbp.sold_quantity, 0) / NULLIF(ibp.avg_inventory, 0)
          END
        ) / NULLIF(COUNT(*), 0), 0)::numeric AS avg_turnover_rate
      FROM inventory_by_product ibp
      LEFT JOIN sales_by_product sbp ON sbp.product_id = ibp.product_id
    )
    SELECT
      COALESCE(SUM(ibi.total_stock * COALESCE(ii.unit_cost, 0)), 0)::numeric AS total_inventory_value,
      COALESCE(ss.stockout_items / NULLIF(ss.total_items, 0), 0)::numeric AS stockout_rate,
      CASE
        WHEN COALESCE(t.avg_turnover_rate, 0) = 0 THEN 0
        ELSE ROUND(365 / t.avg_turnover_rate, 2)
      END AS avg_turnover_days,
      COALESCE(ss.below_threshold_items, 0)::int AS items_below_threshold,
      COALESCE(ss.total_items, 0)::int AS total_items
    FROM inventory_by_item ibi
    LEFT JOIN inventory_item ii ON ii.id = ibi.inventory_item_id
    CROSS JOIN sku_stats ss
    CROSS JOIN turnover t
  `

  let row: any
  try {
    const result = await pgConnection.raw(query)
    row = result?.rows?.[0] || {}
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to generate inventory report", message: err?.message })
  }

  const report = {
    total_inventory_value: toNum(row.total_inventory_value),
    stockout_rate: toNum(row.stockout_rate),
    avg_turnover_days: toNum(row.avg_turnover_days),
    items_below_threshold: toNum(row.items_below_threshold),
    total_items: toNum(row.total_items),
    metadata: {},
  }

  try {
    await eventBus.emit("inventory.report.generated", {
      ...report,
      generated_at: new Date().toISOString(),
    })
  } catch {
    // optional event
  }

  return res.status(200).json(report)
}
