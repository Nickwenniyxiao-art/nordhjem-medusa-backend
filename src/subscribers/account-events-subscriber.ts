import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

export default async function accountEventsSubscriber({
  event,
  container,
}: SubscriberArgs<Record<string, unknown>>) {
  const webhookUrl = process.env.WEBHOOK_RELAY_URL
  if (!webhookUrl) {
    return
  }

  const logger = container.resolve("logger") as {
    info: (message: string) => void
    error: (message: string) => void
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
        metadata: (event as any).metadata ?? null,
        timestamp: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      logger.error(
        `[account-events-subscriber] Failed to relay ${eventName}: HTTP ${response.status}`
      )
      return
    }

    logger.info(
      `[account-events-subscriber] Relayed ${eventName} with status ${response.status}`
    )
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : JSON.stringify(error)
    logger.error(`[account-events-subscriber] Error relaying ${eventName}: ${errMsg}`)
  }
}

export const config: SubscriberConfig = {
  event: [
    "customer.email_change.requested",
    "customer.email_change.confirmed",
    "customer.account.deleted",
  ],
}
