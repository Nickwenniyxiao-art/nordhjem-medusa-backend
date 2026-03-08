import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function orderShipmentHandler({
  event,
  container,
}: SubscriberArgs<{ id: string; fulfillment_id: string }>) {
  const notificationService = container.resolve(Modules.NOTIFICATION)
  const orderService = container.resolve(Modules.ORDER)
  const fulfillmentService = container.resolve(Modules.FULFILLMENT)

  const order = await orderService.retrieveOrder(event.data.id, {
    relations: ["items", "shipping_address"],
  })

  if (!order.email) {
    return
  }

  const fulfillment = await fulfillmentService.retrieveFulfillment(
    event.data.fulfillment_id,
    { relations: ["labels"] }
  )

  const trackingNumber =
    (fulfillment as any).tracking_links?.[0]?.tracking_number ??
    fulfillment.labels?.[0]?.tracking_number ??
    null

  await notificationService.createNotifications({
    to: order.email,
    channel: "email",
    template: "shipping-notification",
    data: {
      order,
      fulfillment,
      trackingNumber,
      subject: `NordHjem 发货通知 | Shipping Notification #${order.display_id}`,
    },
  })
}

export const config: SubscriberConfig = {
  event: "order.fulfillment_created",
}
