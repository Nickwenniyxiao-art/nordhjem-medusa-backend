import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function orderCanceledHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationService = container.resolve(Modules.NOTIFICATION)
  const orderService = container.resolve(Modules.ORDER)

  const order = await orderService.retrieveOrder(event.data.id, {
    relations: ["items", "shipping_address"],
  })

  if (!order.email) {
    return
  }

  await notificationService.createNotifications({
    to: order.email,
    channel: "email",
    template: "order-canceled",
    data: {
      order,
      subject: `NordHjem 订单取消通知 | Order Canceled #${order.display_id}`,
    },
  })
}

export const config: SubscriberConfig = {
  event: "order.canceled",
}
