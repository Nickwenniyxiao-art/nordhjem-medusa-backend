import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";

const relayWebhook = async (
  eventName: string,
  payload: Record<string, unknown>,
  container: any,
) => {
  const webhookUrl = process.env.WEBHOOK_RELAY_URL;
  if (!webhookUrl) {
    return;
  }

  const logger = container.resolve("logger") as {
    info: (m: string) => void;
    error: (m: string) => void;
  };

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
        data: payload,
        timestamp: new Date().toISOString(),
        source: "nordhjem-medusa",
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      logger.error(`[return-status-events] Failed to relay ${eventName}: HTTP ${response.status}`);
    } else {
      logger.info(`[return-status-events] Relayed ${eventName} → ${response.status}`);
    }
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : JSON.stringify(error);
    logger.error(`[return-status-events] Error relaying ${eventName}: ${errMsg}`);
  }
};

export default async function returnStatusEventsHandler({
  event,
  container,
}: SubscriberArgs<Record<string, any>>) {
  const name = (event as any).name;

  if (name === "return.requested") {
    await relayWebhook(
      name,
      {
        order_id: event.data.order_id,
        return_id: event.data.return_id,
        status: "return_requested",
      },
      container,
    );
  }

  if (name === "return.received") {
    await relayWebhook(
      name,
      {
        order_id: event.data.order_id,
        return_id: event.data.return_id,
        status: "received",
      },
      container,
    );
  }

  if (name === "refund.created") {
    await relayWebhook(
      name,
      {
        order_id: event.data.order_id,
        return_id: event.data.return_id,
        status: "refunded",
      },
      container,
    );
  }
}

export const config: SubscriberConfig = {
  event: ["return.requested", "return.received", "refund.created"],
};
