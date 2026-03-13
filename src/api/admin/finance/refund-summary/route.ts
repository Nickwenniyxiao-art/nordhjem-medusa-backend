import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const pgConnection = req.scope.resolve("pgConnection") as any;
    const query = req.query as Record<string, string | undefined>;

    const startDate = query.start_date;
    const endDate = query.end_date;
    const currencyCode = (query.currency_code || "").toLowerCase().trim();

    const conditions: string[] = ["1=1"];
    const params: unknown[] = [];

    if (startDate) {
      params.push(startDate);
      conditions.push(`r.created_at >= $${params.length}::timestamptz`);
    }

    if (endDate) {
      params.push(endDate);
      conditions.push(`r.created_at < ($${params.length}::date + interval '1 day')`);
    }

    if (currencyCode) {
      params.push(currencyCode);
      conditions.push(`LOWER(COALESCE(r.currency_code, '')) = $${params.length}`);
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    const summaryQuery = `
      SELECT
        COALESCE(SUM(
          CASE
            WHEN r.raw_amount IS NOT NULL AND r.raw_amount->>'value' IS NOT NULL
              THEN (r.raw_amount->>'value')::numeric
            WHEN r.amount IS NOT NULL
              THEN r.amount::numeric
            ELSE 0
          END
        ), 0) AS total_refunds,
        COUNT(*)::int AS refund_count
      FROM refund r
      ${whereClause}
    `;

    const summaryResult = await pgConnection.raw(summaryQuery, params);
    const summary = summaryResult?.rows?.[0] || {};

    const totalRefunds = toNumber(summary.total_refunds);
    const refundCount = toNumber(summary.refund_count);

    const reasonQuery = `
      SELECT
        COALESCE(NULLIF(r.reason, ''), r.metadata->>'reason', 'unknown') AS reason,
        COUNT(*)::int AS count,
        COALESCE(SUM(
          CASE
            WHEN r.raw_amount IS NOT NULL AND r.raw_amount->>'value' IS NOT NULL
              THEN (r.raw_amount->>'value')::numeric
            WHEN r.amount IS NOT NULL
              THEN r.amount::numeric
            ELSE 0
          END
        ), 0) AS total_amount
      FROM refund r
      ${whereClause}
      GROUP BY COALESCE(NULLIF(r.reason, ''), r.metadata->>'reason', 'unknown')
      ORDER BY total_amount DESC
    `;

    const reasonResult = await pgConnection.raw(reasonQuery, params);

    return res.status(200).json({
      total_refunds: totalRefunds,
      refund_count: refundCount,
      average_refund: refundCount > 0 ? totalRefunds / refundCount : 0,
      refunds_by_reason: (reasonResult?.rows || []).map((row: any) => ({
        reason: row.reason,
        count: toNumber(row.count),
        total_amount: toNumber(row.total_amount),
      })),
      filters: {
        start_date: startDate || null,
        end_date: endDate || null,
        currency_code: currencyCode || null,
      },
    });
  } catch (err: any) {
    console.error("[finance][refund-summary][GET]", err);
    return res.status(500).json({ error: "Failed to query refund summary" });
  }
}
