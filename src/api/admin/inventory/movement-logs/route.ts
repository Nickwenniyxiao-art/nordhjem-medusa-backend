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

    const inventoryItemId = query.inventory_item_id;
    const startDate = query.start_date;
    const endDate = query.end_date;
    const page = toPositiveInt(query.page, 1);
    const limit = Math.min(toPositiveInt(query.limit, 20), 100);
    const offset = (page - 1) * limit;

    const conditions: string[] = ["1=1"];
    const params: unknown[] = [];

    if (inventoryItemId) {
      params.push(inventoryItemId);
      conditions.push(`ml.inventory_item_id = $${params.length}`);
    }

    if (startDate) {
      params.push(startDate);
      conditions.push(`ml.created_at >= $${params.length}::timestamptz`);
    }

    if (endDate) {
      params.push(endDate);
      conditions.push(`ml.created_at < ($${params.length}::date + interval '1 day')`);
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    const totalQuery = `SELECT COUNT(*)::int AS total FROM inventory_movement ml ${whereClause}`;
    const totalResult = await pgConnection.raw(totalQuery, params);
    const total = Number(totalResult?.rows?.[0]?.total ?? 0);

    const listParams = [...params, limit, offset];
    const listQuery = `
      SELECT
        ml.id,
        ml.inventory_item_id,
        ml.location_id,
        ml.type,
        ml.quantity,
        ml.reference,
        ml.metadata,
        ml.created_at
      FROM inventory_movement ml
      ${whereClause}
      ORDER BY ml.created_at DESC
      LIMIT $${listParams.length - 1}
      OFFSET $${listParams.length}
    `;

    const result = await pgConnection.raw(listQuery, listParams);

    return res.status(200).json({
      page,
      limit,
      total,
      movement_logs: result?.rows || [],
    });
  } catch (err: any) {
    console.error("[inventory][movement-logs][GET]", err);

    if (String(err?.message || "").includes('relation "inventory_movement" does not exist')) {
      return res.status(200).json({
        page: 1,
        limit: 20,
        total: 0,
        movement_logs: [],
      });
    }
    return res.status(500).json({ error: "Failed to fetch inventory movement logs" });
  }
}
