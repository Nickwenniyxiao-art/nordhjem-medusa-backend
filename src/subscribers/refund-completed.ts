import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function refundCompletedHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationService = container.resolve(Modules.NOTIFICATION)
  const paymentService = container.resolve(Modules.PAYMENT) as any
  const orderService = container.resolve(Modules.ORDER) as any

  const payment = await paymentService.retrievePayment(event.data.id)

  if (!payment?.payment_collection_id) {
    return
  }

  const [order] = await orderService.listOrders(
    { payment_collection_id: payment.payment_collection_id },
    { relations: ["items", "shipping_address"], take: 1 }
  )

  if (!order?.email) {
    return
  }

  await notificationService.createNotifications({
    to: order.email,
    channel: "email",
    template: "refund-completed",
    data: {
      order,
      payment,
      subject: `NordHjem 退款完成 | Refund Completed #${order.display_id}`,
    },
  })
}

export const config: SubscriberConfig = {
  event: "payment.refunded",
}
