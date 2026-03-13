import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { randomUUID } from "crypto"

export default async function checkoutEventsHandler({
  event,
  container,
}: SubscriberArgs<Record<string, any>>) {
  const pgConnection = container.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any
  const logger = container.resolve("logger") as any

  await pgConnection.raw(
    `CREATE TABLE IF NOT EXISTS checkout_events (
      id uuid PRIMARY KEY,
      cart_id text,
      order_id text,
      event_name text NOT NULL,
      event_data jsonb,
      created_at timestamptz NOT NULL DEFAULT now()
    )`
  )

  const eventName = event.name
  const mappedName =
    eventName === "cart.created"
      ? "checkout.started"
      : eventName === "order.placed"
        ? "checkout.completed"
        : eventName

  const eventData = (event.data || {}) as any

  await pgConnection.raw(
    `INSERT INTO checkout_events (id, cart_id, order_id, event_name, event_data)
     VALUES (?, ?, ?, ?, ?::jsonb)`,
    [
      randomUUID(),
      eventData.cart_id || eventData.id || null,
      eventData.order_id || eventData.id || null,
      mappedName,
      JSON.stringify(eventData),
    ]
  )

  const webhookUrl = process.env.WEBHOOK_RELAY_URL
  if (!webhookUrl) {
    return
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-NordHjem-Event": mappedName,
      },
      body: JSON.stringify({
        event: mappedName,
        source_event: eventName,
        data: eventData,
        timestamp: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(10000),
    })
  } catch (error: any) {
    logger.error(`[checkout-events] webhook relay failed: ${error?.message || String(error)}`)
  }
}

export const config: SubscriberConfig = {
  event: ["cart.created", "cart.updated", "order.placed"],
}
