import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const pgConnection = req.scope.resolve("pgConnection") as any;
    const query = req.query as Record<string, string | undefined>;

    const period = query.period || "daily";
    const startDate = query.start_date;
    const endDate = query.end_date;

    const periodMap: Record<string, string> = {
      daily: "day",
      weekly: "week",
      monthly: "month",
    };

    const granularity = periodMap[period] || "day";
    const conditions: string[] = ["o.canceled_at IS NULL"];
    const params: unknown[] = [];

    if (startDate) {
      params.push(startDate);
      conditions.push(`o.created_at >= $${params.length}::timestamptz`);
    }

    if (endDate) {
      params.push(endDate);
      conditions.push(`o.created_at < ($${params.length}::date + interval '1 day')`);
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    const trendQuery = `
      SELECT
        date_trunc('${granularity}', o.created_at) AS period,
        COALESCE(SUM(
          CASE
            WHEN o.raw_total IS NOT NULL AND o.raw_total->>'value' IS NOT NULL
              THEN (o.raw_total->>'value')::numeric
            ELSE COALESCE(o.total, 0)::numeric
          END
        ), 0) AS revenue,
        COUNT(*)::int AS order_count
      FROM "order" o
      ${whereClause}
      GROUP BY period
      ORDER BY period ASC
    `;

    const result = await pgConnection.raw(trendQuery, params);

    return res.status(200).json({
      period,
      start_date: startDate || null,
      end_date: endDate || null,
      revenue_trend: (result?.rows || []).map((row: any) => ({
        period: row.period,
        revenue: toNumber(row.revenue),
        order_count: toNumber(row.order_count),
      })),
    });
  } catch (err: any) {
    console.error("[finance][revenue-trend][GET]", err);
    return res.status(500).json({ error: "Failed to query revenue trend" });
  }
}
