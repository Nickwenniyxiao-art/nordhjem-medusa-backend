import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import Stripe from "stripe";

function toMinorAmount(value: unknown) {
  const amount = Number(value || 0);
  return Number.isFinite(amount) ? Math.round(amount) : 0;
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as any;
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any;

  const query = req.query as any;
  const dateFrom = query.date_from ? String(query.date_from) : null;
  const dateTo = query.date_to ? String(query.date_to) : null;

  const stripeApiKey = process.env.STRIPE_API_KEY;
  if (!stripeApiKey) {
    return res.status(500).json({ error: "STRIPE_API_KEY not configured" });
  }

  const stripe = new Stripe(stripeApiKey);

  try {
    const conditions = ["o.canceled_at IS NULL"];
    const params: any[] = [];

    if (dateFrom) {
      conditions.push("o.created_at >= ?::timestamptz");
      params.push(dateFrom);
    }

    if (dateTo) {
      conditions.push("o.created_at < (?::date + interval '1 day')");
      params.push(dateTo);
    }

    const result = await pgConnection.raw(
      `SELECT o.id AS order_id, o.payment_status, o.currency_code, o.total
       FROM "order" o
       WHERE ${conditions.join(" AND ")}
       ORDER BY o.created_at DESC
       LIMIT 100`,
      params,
    );

    const rows = result?.rows || [];
    const discrepancies: any[] = [];
    let matched = 0;

    for (const row of rows) {
      const paymentResult = await pgConnection.raw(
        `SELECT p.data
         FROM payment p
         WHERE p.payment_collection_id IN (
           SELECT payment_collection_id FROM order_payment_collection WHERE order_id = ?
         )
         ORDER BY p.created_at DESC
         LIMIT 1`,
        [row.order_id],
      );

      const data = paymentResult?.rows?.[0]?.data || {};
      const paymentIntentId = String(
        data.id || data.payment_intent || data.payment_intent_id || "",
      );
      if (!paymentIntentId) {
        continue;
      }

      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      const localStatus = String(row.payment_status || "unknown");
      const stripeStatus = String(paymentIntent.status || "unknown");

      if (localStatus === stripeStatus) {
        matched += 1;
      } else {
        discrepancies.push({
          order_id: row.order_id,
          local_status: localStatus,
          stripe_status: stripeStatus,
          amount: toMinorAmount(row.total),
        });
      }
    }

    return res.status(200).json({
      total_orders: rows.length,
      matched,
      discrepancies,
    });
  } catch (err: any) {
    logger.error(`[admin-payment-reconciliation] GET error: ${err.message}`);
    return res.status(500).json({ error: "Failed to reconcile payments" });
  }
}
