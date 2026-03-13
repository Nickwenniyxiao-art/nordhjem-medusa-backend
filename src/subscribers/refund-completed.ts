import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function refundCompletedHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger") as any
  const notificationService = container.resolve(Modules.NOTIFICATION)
  const paymentService = container.resolve(Modules.PAYMENT) as any
  const orderService = container.resolve(Modules.ORDER) as any
  const pgConnection = container.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any

  try {
    const payment = await paymentService.retrievePayment(event.data.id)

    if (!payment?.payment_collection_id) {
      return
    }

    // Query the link table to resolve order from payment_collection
    // (payment_collection_id is not a direct Order field — it lives in the
    //  order_payment_collection link table)
    const linkResult = await pgConnection.raw(
      `SELECT order_id FROM order_payment_collection WHERE payment_collection_id = ? LIMIT 1`,
      [payment.payment_collection_id]
    )

    const orderId = linkResult?.rows?.[0]?.order_id
    if (!orderId) {
      return
    }

    const order = await orderService.retrieveOrder(orderId, {
      relations: ["items", "shipping_address"],
    })

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
  } catch (err: any) {
    logger.error(`[refund-completed] Error: ${err.message}`)
  }
}

export const config: SubscriberConfig = {
  event: "payment.refunded",
}
