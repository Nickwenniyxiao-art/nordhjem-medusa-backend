/**
 * Admin API: GET /admin/analytics/sales-summary
 *
 * 返回销售统计：总销售额、订单数、平均客单价、退款率。
 * 支持 date_from/date_to/granularity/currency_code 参数。
 * 数据来源：Medusa order 表，WHERE status != 'canceled' AND payment_status = 'captured'。
 */
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as any;
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any;

  const {
    date_from,
    date_to,
    granularity = "day",
    currency_code = "usd",
  } = req.query as Record<string, string>;

  try {
    const validGranularities = ["day", "week", "month"];
    const gran = validGranularities.includes(granularity) ? granularity : "day";

    const conditions: string[] = [
      "o.canceled_at IS NULL",
      "o.payment_status = 'captured'",
      "o.currency_code = ?",
    ];
    const params: any[] = [currency_code.toLowerCase()];

    if (date_from) {
      conditions.push("o.created_at >= ?::timestamptz");
      params.push(date_from);
    }

    if (date_to) {
      conditions.push("o.created_at < (?::date + interval '1 day')");
      params.push(date_to);
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;
    const truncExpr = `date_trunc('${gran}', o.created_at)`;

    const dataPointsQuery = `
      SELECT
        ${truncExpr} AS date,
        COALESCE(SUM(
          CASE
            WHEN o.raw_total IS NOT NULL AND o.raw_total->>'value' IS NOT NULL
              THEN (o.raw_total->>'value')::numeric
            ELSE COALESCE(o.total, 0)
          END
        ), 0) AS sales,
        COUNT(DISTINCT o.id)::int AS orders
      FROM "order" o
      ${whereClause}
      GROUP BY date
      ORDER BY date DESC
    `;

    const dataPointsResult = await pgConnection.raw(dataPointsQuery, params);
    const dataPoints = (dataPointsResult?.rows || []).map((row: any) => ({
      date: row.date,
      sales: parseFloat(row.sales || "0"),
      orders: parseInt(row.orders || "0", 10),
    }));

    const totalSales = dataPoints.reduce((sum: number, dp: any) => sum + dp.sales, 0);
    const orderCount = dataPoints.reduce((sum: number, dp: any) => sum + dp.orders, 0);
    const avgOrderValue = orderCount > 0 ? Math.round((totalSales / orderCount) * 100) / 100 : 0;

    let refundRate = 0;

    try {
      const refundQuery = `
        SELECT COUNT(DISTINCT o.id)::int AS refunded
        FROM "order" o
        LEFT JOIN return r ON r.order_id = o.id
        ${whereClause}
          AND (
            r.id IS NOT NULL
            OR COALESCE(
              CASE
                WHEN o.raw_refunded_total IS NOT NULL AND o.raw_refunded_total->>'value' IS NOT NULL
                  THEN (o.raw_refunded_total->>'value')::numeric
                ELSE o.refunded_total
              END, 0
            ) > 0
          )
      `;
      const refundResult = await pgConnection.raw(refundQuery, params);
      const refundedOrders = parseInt(refundResult?.rows?.[0]?.refunded || "0", 10);

      refundRate = orderCount > 0 ? Math.round((refundedOrders / orderCount) * 10000) / 100 : 0;
    } catch {
      refundRate = 0;
    }

    return res.status(200).json({
      total_sales: totalSales,
      order_count: orderCount,
      avg_order_value: avgOrderValue,
      refund_rate: refundRate,
      currency_code: currency_code.toLowerCase(),
      data_points: dataPoints,
    });
  } catch (err: any) {
    logger.error(`[sales-summary] Query error: ${err.message}`);

    if (err.message?.includes("does not exist")) {
      return res.status(200).json({
        total_sales: 0,
        order_count: 0,
        avg_order_value: 0,
        refund_rate: 0,
        currency_code: currency_code.toLowerCase(),
        data_points: [],
        note: "Order table not initialized. Ensure migrations are up to date.",
      });
    }

    return res.status(500).json({ error: "Failed to query sales summary" });
  }
}
