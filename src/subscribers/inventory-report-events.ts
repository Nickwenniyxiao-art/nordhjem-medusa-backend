import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

export default async function inventoryReportEventsSubscriber({
  event,
  container,
}: SubscriberArgs<Record<string, unknown>>) {
  const relayUrl = process.env.WEBHOOK_RELAY_URL
  if (!relayUrl) {
    return
  }

  const logger = container.resolve("logger") as {
    info: (msg: string) => void
    error: (msg: string) => void
  }

  const eventName = (event as any)?.name || "unknown"

  try {
    const response = await fetch(relayUrl, {
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
        data: (event as any)?.data || {},
        source: "nordhjem-medusa",
        timestamp: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      logger.error(
        `[inventory-report-events] Failed to relay ${eventName}: HTTP ${response.status}`
      )
      return
    }

    logger.info(`[inventory-report-events] Relayed ${eventName}: HTTP ${response.status}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : JSON.stringify(error)
    logger.error(`[inventory-report-events] Error relaying ${eventName}: ${message}`)
  }
}

export const config: SubscriberConfig = {
  event: ["inventory.turnover.calculated", "inventory.report.generated"],
}
