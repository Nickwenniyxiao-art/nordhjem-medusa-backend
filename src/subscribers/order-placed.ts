import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

export default async function orderPlacedHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationService = container.resolve("notification")
  const orderService = container.resolve("order")

  const order = await orderService.retrieveOrder(event.data.id, {
    relations: ["items", "shipping_address"],
  })

  await notificationService.createNotifications({
    to: order.email,
    channel: "email",
    template: "order-confirmation",
    data: {
      order,
      subject: `NordHjem 订单确认 | Order Confirmation #${order.display_id}`,
    },
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
