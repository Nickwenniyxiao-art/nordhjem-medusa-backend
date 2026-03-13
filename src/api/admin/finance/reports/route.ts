import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

type RawResultRow = Record<string, string | number | Date | null>;

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as { error: (message: string) => void };
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as {
    raw: (query: string, params?: unknown[]) => Promise<{ rows?: RawResultRow[] }>;
  };

  const {
    date_from,
    date_to,
    granularity = "month",
    currency,
  } = req.query as Record<string, string>;

  try {
    const validGranularities = ["day", "week", "month"];
    const gran = validGranularities.includes(granularity) ? granularity : "month";

    const currencies = (currency || "")
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);

    const conditions: string[] = ["o.canceled_at IS NULL"];
    const params: unknown[] = [];

    if (currencies.length > 0) {
      const placeholders = currencies.map(() => "?").join(", ");
      conditions.push(`o.currency_code IN (${placeholders})`);
      params.push(...currencies);
    }

    if (date_from) {
      conditions.push("o.created_at >= ?::timestamptz");
      params.push(date_from);
    }

    if (date_to) {
      conditions.push("o.created_at < (?::date + interval '1 day')");
      params.push(date_to);
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;
    const totalExpr = `
      CASE
        WHEN o.raw_total IS NOT NULL AND o.raw_total->>'value' IS NOT NULL
          THEN (o.raw_total->>'value')::numeric
        ELSE COALESCE(o.total, 0)
      END
    `;
    const refundExpr = `
      CASE
        WHEN o.raw_refunded_total IS NOT NULL AND o.raw_refunded_total->>'value' IS NOT NULL
          THEN (o.raw_refunded_total->>'value')::numeric
        ELSE COALESCE(o.refunded_total, 0)
      END
    `;

    const query = `
      SELECT
        o.currency_code,
        date_trunc('${gran}', o.created_at) AS period,
        COALESCE(SUM(${totalExpr}), 0) AS revenue,
        COALESCE(SUM(${refundExpr}), 0) AS refunds,
        COALESCE(SUM(${totalExpr}) - SUM(${refundExpr}), 0) AS net,
        COUNT(*)::int AS order_count
      FROM "order" o
      ${whereClause}
      GROUP BY o.currency_code, period
      ORDER BY o.currency_code ASC, period ASC
    `;

    const result = await pgConnection.raw(query, params);
    const rows = result?.rows ?? [];

    const byCurrency = new Map<
      string,
      {
        currency_code: string;
        revenue: number;
        refunds: number;
        net_profit: number;
        order_count: number;
        data_points: { period: string; revenue: number; refunds: number; net: number }[];
      }
    >();

    for (const row of rows) {
      const currencyCode = String(row.currency_code || "").toLowerCase();
      if (!currencyCode) {
        continue;
      }

      if (!byCurrency.has(currencyCode)) {
        byCurrency.set(currencyCode, {
          currency_code: currencyCode,
          revenue: 0,
          refunds: 0,
          net_profit: 0,
          order_count: 0,
          data_points: [],
        });
      }

      const entry = byCurrency.get(currencyCode)!;
      const revenue = Number(row.revenue ?? 0);
      const refunds = Number(row.refunds ?? 0);
      const net = Number(row.net ?? 0);
      const orderCount = Number(row.order_count ?? 0);
      const period = new Date(String(row.period)).toISOString().slice(0, 10);

      entry.revenue += revenue;
      entry.refunds += refunds;
      entry.net_profit += net;
      entry.order_count += orderCount;
      entry.data_points.push({ period, revenue, refunds, net });
    }

    return res.status(200).json({
      currencies: Array.from(byCurrency.values()),
      date_from: date_from ?? null,
      date_to: date_to ?? null,
    });
  } catch (err: any) {
    logger.error(`[finance-reports] Query error: ${err.message}`);

    if (err.message?.includes("does not exist")) {
      return res.status(200).json({
        currencies: [],
        date_from: date_from ?? null,
        date_to: date_to ?? null,
        note: "Finance tables not initialized.",
      });
    }

    return res.status(500).json({ error: "Failed to query finance reports" });
  }
}
