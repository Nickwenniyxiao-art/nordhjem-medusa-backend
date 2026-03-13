import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";

export default async function orderNotesEventsHandler({
  event,
  container,
}: SubscriberArgs<Record<string, unknown>>) {
  const webhookUrl = process.env.WEBHOOK_RELAY_URL;
  if (!webhookUrl) {
    return;
  }

  const logger = container.resolve("logger") as {
    info: (m: string) => void;
    error: (m: string) => void;
  };

  const eventName = (event as any).name || "unknown";

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-NordHjem-Event": eventName,
        ...(process.env.WEBHOOK_RELAY_SECRET
          ? { "X-Webhook-Secret": process.env.WEBHOOK_RELAY_SECRET }
          : {}),
      },
      body: JSON.stringify({
        event: eventName,
        data: event.data,
        timestamp: new Date().toISOString(),
        source: "nordhjem-medusa",
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      logger.error(`[order-notes-events] Failed to relay ${eventName}: HTTP ${response.status}`);
    } else {
      logger.info(`[order-notes-events] Relayed ${eventName} → ${response.status}`);
    }
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : JSON.stringify(error);
    logger.error(`[order-notes-events] Error relaying ${eventName}: ${errMsg}`);
  }
}

export const config: SubscriberConfig = {
  event: ["order.note.created", "order.stats.generated"],
};
