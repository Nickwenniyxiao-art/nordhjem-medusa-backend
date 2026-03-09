import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

export default async function orderWebhookRelayHandler({
  event,
  container,
}: SubscriberArgs<Record<string, unknown>>) {
  const webhookUrl = process.env.WEBHOOK_RELAY_URL
  if (!webhookUrl) {
    return
  }

  const logger = container.resolve("logger") as {
    info: (m: string) => void
    error: (m: string) => void
  }

  const eventName = (event as any).name || "unknown"

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
    })

    if (!response.ok) {
      logger.error(
        `[webhook-relay] Failed to relay ${eventName}: HTTP ${response.status}`
      )
    } else {
      logger.info(`[webhook-relay] Relayed ${eventName} → ${response.status}`)
    }
  } catch (error) {
    const errMsg =
      error instanceof Error ? error.message : JSON.stringify(error)
    logger.error(`[webhook-relay] Error relaying ${eventName}: ${errMsg}`)
  }
}

export const config: SubscriberConfig = {
  event: [
    "order.placed",
    "order.canceled",
    "order.fulfillment_created",
    "order.claim_created",
    "order.exchange_created",
    "order.return_requested",
    "order.status_updated",
    "order.refund_created",
    "ticket.created",
    "ticket.status_changed",
  ],
}
