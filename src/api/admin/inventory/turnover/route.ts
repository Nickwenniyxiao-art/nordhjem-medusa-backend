import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

type TurnoverRow = {
  product_id: string
  product_title: string
  sold_quantity: number
  avg_inventory: number
  turnover_rate: number
}

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

  const { start_date, end_date, product_id, category_id } = req.query as Record<
    string,
    string | undefined
  >

  const periodStart =
    start_date || new Date(new Date().setDate(new Date().getDate() - 30)).toISOString()
  const periodEnd = end_date || new Date().toISOString()

  const conditions = [
    "o.canceled_at IS NULL",
    "o.created_at >= ?::timestamptz",
    "o.created_at <= ?::timestamptz",
  ]
  const params: any[] = [periodStart, periodEnd]

  if (product_id) {
    conditions.push("li.product_id = ?")
    params.push(product_id)
  }

  if (category_id) {
    conditions.push(
      "EXISTS (SELECT 1 FROM product_category_product pcp WHERE pcp.product_id = li.product_id AND pcp.product_category_id = ?)"
    )
    params.push(category_id)
  }

  const query = `
    WITH sold AS (
      SELECT
        li.product_id,
        MAX(li.title) AS product_title,
        SUM(COALESCE(li.quantity, 0))::numeric AS sold_quantity
      FROM order_line_item li
      JOIN "order" o ON o.id = li.order_id
      WHERE ${conditions.join(" AND ")}
      GROUP BY li.product_id
    ),
    inventory AS (
      SELECT
        pv.product_id,
        AVG(COALESCE(il.stocked_quantity, 0))::numeric AS avg_inventory
      FROM product_variant_inventory_item pvii
      JOIN product_variant pv ON pv.id = pvii.variant_id
      JOIN inventory_level il ON il.inventory_item_id = pvii.inventory_item_id
      GROUP BY pv.product_id
    )
    SELECT
      COALESCE(s.product_id, i.product_id) AS product_id,
      COALESCE(s.product_title, p.title, '') AS product_title,
      COALESCE(s.sold_quantity, 0) AS sold_quantity,
      COALESCE(i.avg_inventory, 0) AS avg_inventory,
      CASE
        WHEN COALESCE(i.avg_inventory, 0) = 0 THEN 0
        ELSE ROUND(COALESCE(s.sold_quantity, 0) / NULLIF(i.avg_inventory, 0), 4)
      END AS turnover_rate
    FROM sold s
    FULL OUTER JOIN inventory i ON s.product_id = i.product_id
    LEFT JOIN product p ON p.id = COALESCE(s.product_id, i.product_id)
    ${product_id ? "WHERE COALESCE(s.product_id, i.product_id) = ?" : ""}
    ORDER BY turnover_rate DESC, sold_quantity DESC
  `

  const queryParams = product_id ? [...params, product_id] : params

  try {
    const result = await pgConnection.raw(query, queryParams)
    const items: TurnoverRow[] = (result?.rows || []).map((row) => ({
      product_id: String(row.product_id || ""),
      product_title: String(row.product_title || ""),
      sold_quantity: toNum(row.sold_quantity),
      avg_inventory: toNum(row.avg_inventory),
      turnover_rate: toNum(row.turnover_rate),
    }))

    try {
      await eventBus.emit("inventory.turnover.calculated", {
        period_start: periodStart,
        period_end: periodEnd,
        product_id: product_id || null,
        category_id: category_id || null,
        count: items.length,
      })
    } catch {
      // optional event
    }

    return res.status(200).json({
      items,
      period_start: periodStart,
      period_end: periodEnd,
    })
  } catch (err: any) {
    if (err?.message?.includes("order_line_item") && err?.message?.includes("does not exist")) {
      return res.status(200).json({
        items: [],
        period_start: periodStart,
        period_end: periodEnd,
        note: "order_line_item table not found",
      })
    }

    return res.status(500).json({ error: "Failed to calculate inventory turnover" })
  }
}
