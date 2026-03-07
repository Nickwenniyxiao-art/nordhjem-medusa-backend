import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

export default async function orderShipmentHandler({
  event,
  container,
}: SubscriberArgs<{ id: string; fulfillment_id: string }>) {
  const notificationService = container.resolve("notification")
  const orderService = container.resolve("order")
  const fulfillmentService = container.resolve("fulfillment")

  const order = await orderService.retrieveOrder(event.data.id, {
    relations: ["items", "shipping_address"],
  })

  const fulfillment = await fulfillmentService.retrieveFulfillment(
    event.data.fulfillment_id,
    { relations: ["tracking_links"] }
  )

  await notificationService.createNotifications({
    to: order.email,
    channel: "email",
    template: "shipping-notification",
    data: {
      order,
      fulfillment,
      trackingNumber: fulfillment.tracking_links?.[0]?.tracking_number,
      subject: `NordHjem 发货通知 | Shipping Notification #${order.display_id}`,
    },
  })
}

export const config: SubscriberConfig = {
  event: "order.fulfillment_created",
}
