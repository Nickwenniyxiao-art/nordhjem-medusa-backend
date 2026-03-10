import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

type Logger = {
  info: (message: string) => void
}

type BrandEventPayload = {
  id: string
}

async function logBrandEvent({ event, container }: SubscriberArgs<BrandEventPayload>) {
  const logger = container.resolve("logger") as Logger
  logger.info(`[brand-events] ${event.name} received for brand ${event.data.id}`)
}

export default logBrandEvent

export const config: SubscriberConfig = {
  event: ["brand.created", "brand.updated", "brand.deleted"],
}
