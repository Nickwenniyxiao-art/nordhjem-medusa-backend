import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function returnReceivedHandler({
  event,
  container,
}: SubscriberArgs<{ id: string; return_id: string }>) {
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
    template: "return-received",
    data: {
      order,
      returnId: event.data.return_id,
      subject: `NordHjem 退货已收到 | Return Received #${order.display_id}`,
    },
  })
}

export const config: SubscriberConfig = {
  event: "order.return_received",
}
