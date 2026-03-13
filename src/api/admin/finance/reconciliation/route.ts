import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

type RawResultRow = Record<string, string | number | Date | null>;

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as { error: (message: string) => void };
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as {
    raw: (query: string, params?: unknown[]) => Promise<{ rows?: RawResultRow[] }>;
  };

  const { date_from, date_to, currency_code = "usd" } = req.query as Record<string, string>;

  try {
    const conditions: string[] = ["o.canceled_at IS NULL", "o.currency_code = ?"];
    const params: unknown[] = [currency_code.toLowerCase()];

    if (date_from) {
      conditions.push("o.created_at >= ?::timestamptz");
      params.push(date_from);
    }

    if (date_to) {
      conditions.push("o.created_at < (?::date + interval '1 day')");
      params.push(date_to);
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    const query = `
      SELECT
        o.id AS order_id,
        o.display_id,
        o.created_at,
        CASE
          WHEN o.raw_total IS NOT NULL AND o.raw_total->>'value' IS NOT NULL
            THEN (o.raw_total->>'value')::numeric
          ELSE COALESCE(o.total, 0)
        END AS order_amount,
        COALESCE(p_agg.payment_amount, 0) AS payment_amount,
        COALESCE(p_agg.payment_status, ps_agg.session_status, 'unknown') AS payment_status
      FROM "order" o
      JOIN order_payment_collection opc ON opc.order_id = o.id
      JOIN payment_collection pc ON pc.id = opc.payment_collection_id
      LEFT JOIN LATERAL (
        SELECT
          COALESCE(SUM(
            CASE
              WHEN p.raw_amount IS NOT NULL AND p.raw_amount->>'value' IS NOT NULL
                THEN (p.raw_amount->>'value')::numeric
              ELSE COALESCE(p.amount, 0)
            END
          ), 0) AS payment_amount,
          MAX(p.status) AS payment_status
        FROM payment p
        WHERE p.payment_collection_id = pc.id
      ) p_agg ON TRUE
      LEFT JOIN LATERAL (
        SELECT MAX(ps.status) AS session_status
        FROM payment_session ps
        WHERE ps.payment_collection_id = pc.id
      ) ps_agg ON TRUE
      ${whereClause}
      ORDER BY o.created_at DESC
    `;

    const result = await pgConnection.raw(query, params);
    const rows = result?.rows ?? [];

    let matched = 0;
    let discrepancies = 0;
    let discrepancyAmount = 0;

    const items = rows.map((row) => {
      const orderAmount = Number(row.order_amount ?? 0);
      const paymentAmount = Number(row.payment_amount ?? 0);
      const difference = Math.round((orderAmount - paymentAmount) * 100) / 100;
      const discrepancy = Math.abs(difference) > 0.01;

      if (discrepancy) {
        discrepancies += 1;
        discrepancyAmount += Math.abs(difference);
      } else {
        matched += 1;
      }

      return {
        order_id: String(row.order_id),
        display_id: Number(row.display_id ?? 0),
        order_amount: orderAmount,
        payment_amount: paymentAmount,
        difference,
        discrepancy,
        payment_status: String(row.payment_status ?? "unknown"),
        created_at: row.created_at,
      };
    });

    return res.status(200).json({
      total_orders: rows.length,
      matched,
      discrepancies,
      discrepancy_amount: Math.round(discrepancyAmount * 100) / 100,
      currency_code: currency_code.toLowerCase(),
      items,
      date_from: date_from ?? null,
      date_to: date_to ?? null,
    });
  } catch (err: any) {
    logger.error(`[finance-reconciliation] Query error: ${err.message}`);

    if (err.message?.includes("does not exist")) {
      return res.status(200).json({
        total_orders: 0,
        matched: 0,
        discrepancies: 0,
        discrepancy_amount: 0,
        currency_code: currency_code.toLowerCase(),
        items: [],
        date_from: date_from ?? null,
        date_to: date_to ?? null,
        note: "Finance tables not initialized.",
      });
    }

    return res.status(500).json({ error: "Failed to query finance reconciliation" });
  }
}
