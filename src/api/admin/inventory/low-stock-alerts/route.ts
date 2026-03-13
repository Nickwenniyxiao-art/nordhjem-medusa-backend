import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

function toPositiveInt(value: unknown, fallback: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return Math.floor(parsed);
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const pgConnection = req.scope.resolve("pgConnection") as any;
    const query = req.query as Record<string, string | undefined>;

    const threshold = toPositiveInt(query.threshold, 5);
    const locationId = query.location_id;
    const page = toPositiveInt(query.page, 1);
    const limit = Math.min(toPositiveInt(query.limit, 20), 100);
    const offset = (page - 1) * limit;

    const conditions: string[] = [
      "(COALESCE(il.stocked_quantity, 0) - COALESCE(il.reserved_quantity, 0)) < $1",
    ];
    const params: unknown[] = [threshold];

    if (locationId) {
      params.push(locationId);
      conditions.push(`il.location_id = $${params.length}`);
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    const totalQuery = `
      SELECT COUNT(*)::int AS total
      FROM inventory_level il
      ${whereClause}
    `;

    const totalResult = await pgConnection.raw(totalQuery, params);
    const total = Number(totalResult?.rows?.[0]?.total ?? 0);

    const listParams = [...params, limit, offset];

    const listQuery = `
      SELECT
        il.id,
        il.inventory_item_id,
        il.location_id,
        COALESCE(il.stocked_quantity, 0) AS stocked_quantity,
        COALESCE(il.reserved_quantity, 0) AS reserved_quantity,
        (COALESCE(il.stocked_quantity, 0) - COALESCE(il.reserved_quantity, 0)) AS available_quantity,
        ii.sku,
        COALESCE(ii.title, pv.title, '') AS title
      FROM inventory_level il
      LEFT JOIN inventory_item ii ON ii.id = il.inventory_item_id
      LEFT JOIN product_variant_inventory_item pvii ON pvii.inventory_item_id = il.inventory_item_id
      LEFT JOIN product_variant pv ON pv.id = pvii.variant_id
      ${whereClause}
      ORDER BY available_quantity ASC, il.updated_at DESC
      LIMIT $${listParams.length - 1}
      OFFSET $${listParams.length}
    `;

    const result = await pgConnection.raw(listQuery, listParams);

    return res.status(200).json({
      page,
      limit,
      threshold,
      total,
      low_stock_alerts: (result?.rows || []).map((row: any) => ({
        id: row.id,
        inventory_item_id: row.inventory_item_id,
        location_id: row.location_id,
        sku: row.sku,
        title: row.title,
        stocked_quantity: Number(row.stocked_quantity || 0),
        reserved_quantity: Number(row.reserved_quantity || 0),
        available_quantity: Number(row.available_quantity || 0),
      })),
    });
  } catch (err: any) {
    console.error("[inventory][low-stock-alerts][GET]", err);
    return res.status(500).json({ error: "Failed to fetch low stock alerts" });
  }
}
