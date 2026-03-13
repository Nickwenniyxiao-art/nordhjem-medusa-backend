import { MedusaContainer } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import Stripe from "stripe";

async function ensureLogTable(pgConnection: any) {
  await pgConnection.raw(
    `CREATE TABLE IF NOT EXISTS payment_reconciliation_log (
      id UUID PRIMARY KEY,
      order_id VARCHAR(64) NOT NULL,
      expected_status VARCHAR(64) NOT NULL,
      actual_status VARCHAR(64) NOT NULL,
      amount INT NOT NULL,
      checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
  );
}

export default async function paymentReconciliationJob(container: MedusaContainer) {
  const logger = container.resolve("logger") as any;
  const pgConnection = container.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any;
  const eventBus = container.resolve(Modules.EVENT_BUS) as any;

  const stripeApiKey = process.env.STRIPE_API_KEY;
  if (!stripeApiKey) {
    logger.error("[payment-reconciliation-job] STRIPE_API_KEY not configured");
    return;
  }

  const stripe = new Stripe(stripeApiKey);

  try {
    await ensureLogTable(pgConnection);

    const ordersResult = await pgConnection.raw(
      `SELECT o.id AS order_id, o.payment_status, o.total
       FROM "order" o
       WHERE o.canceled_at IS NULL
         AND o.created_at >= NOW() - interval '24 hours'
         AND o.status = 'completed'
       ORDER BY o.created_at DESC
       LIMIT 50`,
    );

    const orders = ordersResult?.rows || [];

    for (const row of orders) {
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

      const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
      const expectedStatus = String(row.payment_status || "unknown");
      const actualStatus = String(pi.status || "unknown");

      if (expectedStatus !== actualStatus) {
        const logId = crypto.randomUUID();

        await pgConnection.raw(
          `INSERT INTO payment_reconciliation_log
            (id, order_id, expected_status, actual_status, amount)
           VALUES (?, ?, ?, ?, ?)`,
          [logId, row.order_id, expectedStatus, actualStatus, Number(row.total || 0)],
        );

        await eventBus.emit("payment.reconciliation_alert", {
          id: logId,
          order_id: row.order_id,
          expected_status: expectedStatus,
          actual_status: actualStatus,
          amount: Number(row.total || 0),
        });
      }
    }
  } catch (err: any) {
    logger.error(`[payment-reconciliation-job] Error: ${err.message}`);
  }
}

export const config = {
  name: "payment-reconciliation",
  schedule: "0 3 * * *",
};
