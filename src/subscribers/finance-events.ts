import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

export default async function financeEventsSubscriber({
  event,
  container,
}: SubscriberArgs<Record<string, unknown>>) {
  const webhookUrl = process.env.WEBHOOK_RELAY_URL
  if (!webhookUrl) {
    return
  }

  const logger = container.resolve("logger") as any
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
      logger.error(`[finance-events] Failed to relay ${eventName}: HTTP ${response.status}`)
      return
    }

    logger.info(`[finance-events] Relayed ${eventName}: HTTP ${response.status}`)
  } catch (error: any) {
    logger.error(`[finance-events] Error relaying ${eventName}: ${error?.message || String(error)}`)
  }
}

export const config: SubscriberConfig = {
  event: ["finance.tax_report.generated", "finance.profit.calculated", "finance.export.completed"],
}
