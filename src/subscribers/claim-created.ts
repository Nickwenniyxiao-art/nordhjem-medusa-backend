import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function claimCreatedHandler({
  event,
  container,
}: SubscriberArgs<{ order_id: string; claim_id: string }>) {
  const notificationService = container.resolve(Modules.NOTIFICATION)
  const orderService = container.resolve(Modules.ORDER)

  const order = await orderService.retrieveOrder(event.data.order_id, {
    relations: ["items", "shipping_address"],
  })

  if (!order.email) {
    return
  }

  await notificationService.createNotifications({
    to: order.email,
    channel: "email",
    template: "claim-created",
    data: {
      order,
      claimId: event.data.claim_id,
      subject: `NordHjem 索赔确认 | Claim Confirmed #${order.display_id}`,
    },
  })
}

export const config: SubscriberConfig = {
  event: "order.claim_created",
}
