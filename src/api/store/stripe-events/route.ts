import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import Stripe from "stripe";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as {
    error: (msg: string) => void;
    info: (msg: string) => void;
  };

  const signature = req.headers["stripe-signature"] as string | undefined;
  if (!signature) {
    logger.error(`[stripe-events] Rejected: no stripe-signature from ${req.ip}`);
    return res.status(400).json({ error: "Missing stripe-signature" });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    logger.error("[stripe-events] STRIPE_WEBHOOK_SECRET not configured");
    return res.status(500).json({ error: "Webhook not configured" });
  }

  try {
    const rawBody = typeof req.body === "string" ? req.body : JSON.stringify(req.body);

    const stripe = new Stripe(process.env.STRIPE_API_KEY || "", {
      apiVersion: "2025-02-24.acacia",
    });

    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

    logger.info(`[stripe-events] ✅ Verified event: type=${event.type} id=${event.id}`);

    const logEntry = {
      event_id: event.id,
      event_type: event.type,
      created: new Date(event.created * 1000).toISOString(),
      livemode: event.livemode,
      ip: req.ip,
      timestamp: new Date().toISOString(),
    };

    logger.info(`[stripe-events] Event data: ${JSON.stringify(logEntry)}`);

    return res.status(200).json({ received: true, event_id: event.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : JSON.stringify(err);
    logger.error(`[stripe-events] ❌ Signature verification failed from ${req.ip}: ${message}`);
    return res.status(400).json({ error: "Invalid signature" });
  }
}
