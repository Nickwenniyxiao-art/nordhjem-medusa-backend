import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

const MAX_AUTO_RETRY = 3;

async function ensureDeadLetterTable(pgConnection: any) {
  await pgConnection.raw(
    `CREATE TABLE IF NOT EXISTS webhook_dead_letter (
      id UUID PRIMARY KEY,
      provider VARCHAR(32) NOT NULL,
      event_type VARCHAR(128) NOT NULL,
      event_id VARCHAR(128) NOT NULL UNIQUE,
      payload_json JSONB NOT NULL DEFAULT '{}'::jsonb,
      error_message TEXT,
      retry_count INT NOT NULL DEFAULT 0,
      last_retry_at TIMESTAMPTZ,
      status VARCHAR(32) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
  );
}

export default async function webhookRetryHandler({
  event,
  container,
}: SubscriberArgs<Record<string, unknown>>) {
  const logger = container.resolve("logger") as any;
  const pgConnection = container.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any;
  const eventBus = container.resolve(Modules.EVENT_BUS) as any;

  const payload = (event.data || {}) as any;
  const eventId = String(payload.event_id || payload.id || crypto.randomUUID());
  const eventType = String(payload.event_type || "stripe.webhook.unknown");
  const provider = String(payload.provider || "stripe");
  const errorMessage = String(payload.error_message || "Webhook processing failed");
  const retryCount = Number(payload.retry_count || 0);

  try {
    await ensureDeadLetterTable(pgConnection);

    await pgConnection.raw(
      `INSERT INTO webhook_dead_letter
        (id, provider, event_type, event_id, payload_json, error_message, retry_count, status)
       VALUES (?, ?, ?, ?, ?::jsonb, ?, ?, ?)
       ON CONFLICT (event_id)
       DO UPDATE SET
         error_message = EXCLUDED.error_message,
         payload_json = EXCLUDED.payload_json,
         retry_count = webhook_dead_letter.retry_count + 1,
         status = CASE
           WHEN webhook_dead_letter.retry_count + 1 >= 5 THEN 'exhausted'
           ELSE 'retrying'
         END,
         last_retry_at = NOW()`,
      [
        crypto.randomUUID(),
        provider,
        eventType,
        eventId,
        JSON.stringify(payload.payload || payload),
        errorMessage,
        retryCount,
        retryCount >= 5 ? "exhausted" : "pending",
      ],
    );

    if (retryCount < MAX_AUTO_RETRY) {
      const delayMs = Math.pow(2, retryCount) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delayMs));

      await eventBus.emit(eventType, {
        ...(payload.payload || payload),
        retry_count: retryCount + 1,
      });
    }

    const relayUrl = process.env.N8N_WEBHOOK_RELAY_URL || process.env.WEBHOOK_RELAY_URL;
    if (relayUrl) {
      await fetch(relayUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.WEBHOOK_RELAY_SECRET
            ? { "X-Webhook-Secret": process.env.WEBHOOK_RELAY_SECRET }
            : {}),
        },
        body: JSON.stringify({
          alert_type: "stripe_webhook_failed",
          event_id: eventId,
          event_type: eventType,
          provider,
          retry_count: retryCount,
          error_message: errorMessage,
          timestamp: new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(10000),
      });
    }
  } catch (err: any) {
    logger.error(`[webhook-retry] Error handling failed webhook ${eventId}: ${err.message}`);
  }
}

export const config: SubscriberConfig = {
  event: "stripe.webhook.failed",
};
