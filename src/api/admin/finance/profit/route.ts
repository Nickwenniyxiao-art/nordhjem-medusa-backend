import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

type ProfitRow = {
  gross_profit: string | number | null;
  net_profit: string | number | null;
  total_revenue: string | number | null;
  total_cost: string | number | null;
  order_count: string | number | null;
  period_start: Date | string | null;
  period_end: Date | string | null;
};

const PERIOD_INTERVAL: Record<string, string> = {
  daily: "1 day",
  weekly: "7 day",
  monthly: "1 month",
};

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as any;
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any;
  const eventBus = req.scope.resolve(Modules.EVENT_BUS) as any;

  const query = (req.query || {}) as Record<string, string>;
  const period = String(query.period || "daily").toLowerCase();
  const metadata = (query as any).metadata ?? null;

  if (!PERIOD_INTERVAL[period]) {
    return res.status(400).json({ error: "period must be one of daily, weekly, monthly" });
  }

  try {
    let result: any;

    try {
      result = await pgConnection.raw(
        `SELECT
           COALESCE(SUM(COALESCE((to_jsonb(os)->>'total')::numeric, 0)), 0) AS total_revenue,
           COALESCE(SUM(COALESCE((to_jsonb(os)->>'subtotal')::numeric, 0) * 0.65), 0) AS total_cost,
           COALESCE(
             SUM(COALESCE((to_jsonb(os)->>'total')::numeric, 0)) -
             SUM(COALESCE((to_jsonb(os)->>'subtotal')::numeric, 0) * 0.65),
             0
           ) AS gross_profit,
           COALESCE(
             SUM(COALESCE((to_jsonb(os)->>'total')::numeric, 0)) -
             SUM(COALESCE((to_jsonb(os)->>'subtotal')::numeric, 0) * 0.65) -
             SUM(COALESCE((to_jsonb(os)->>'tax_total')::numeric, 0)),
             0
           ) AS net_profit,
           COUNT(*)::int AS order_count,
           MIN(o.created_at) AS period_start,
           MAX(o.created_at) AS period_end
         FROM "order" o
         LEFT JOIN order_summary os ON os.order_id = o.id
         WHERE o.canceled_at IS NULL
           AND o.created_at >= (NOW() - $1::interval)`,
        [PERIOD_INTERVAL[period]],
      );
    } catch (sqlErr: any) {
      logger.error(`[finance-profit] SQL query failed: ${sqlErr.message}`);

      let fallback: any;
      try {
        fallback = await pgConnection.raw(
          `SELECT
             COUNT(*)::int AS order_count,
             MIN(o.created_at) AS period_start,
             MAX(o.created_at) AS period_end
           FROM "order" o
           WHERE o.canceled_at IS NULL
             AND o.created_at >= (NOW() - $1::interval)`,
          [PERIOD_INTERVAL[period]],
        );
      } catch (fallbackErr: any) {
        logger.error(`[finance-profit] fallback SQL query failed: ${fallbackErr.message}`);
        return res.status(200).json({ data: [], message: "Query failed, check schema" });
      }

      const fallbackRow = (fallback?.rows?.[0] || {}) as ProfitRow;
      return res.status(200).json({
        gross_profit: 0,
        net_profit: 0,
        total_revenue: 0,
        total_cost: 0,
        order_count: Number(fallbackRow.order_count || 0),
        period_start: fallbackRow.period_start || null,
        period_end: fallbackRow.period_end || null,
        metadata,
        data: [],
        message: "Query failed, check schema",
      });
    }

    const row = (result?.rows?.[0] || {}) as ProfitRow;
    const payload = {
      gross_profit: Number(row.gross_profit || 0),
      net_profit: Number(row.net_profit || 0),
      total_revenue: Number(row.total_revenue || 0),
      total_cost: Number(row.total_cost || 0),
      order_count: Number(row.order_count || 0),
      period_start: row.period_start,
      period_end: row.period_end,
      metadata,
    };

    await eventBus.emit("finance.profit.calculated", {
      period,
      ...payload,
    });

    return res.status(200).json(payload);
  } catch (err: any) {
    logger.error(`[finance-profit] GET error: ${err.message}`);
    return res.status(500).json({ error: "Failed to calculate profit" });
  }
}
