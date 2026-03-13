import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";

export default async function returnRequestedHandler({
  event,
  container,
}: SubscriberArgs<{ order_id: string; return_id: string }>) {
  const notificationService = container.resolve(Modules.NOTIFICATION);
  const orderService = container.resolve(Modules.ORDER);

  const order = await orderService.retrieveOrder(event.data.order_id, {
    relations: ["items", "shipping_address"],
  });

  if (!order.email) {
    return;
  }

  await notificationService.createNotifications({
    to: order.email,
    channel: "email",
    template: "return-requested",
    data: {
      order,
      returnId: event.data.return_id,
      subject: `NordHjem 退货申请确认 | Return Request Confirmed #${order.display_id}`,
    },
  });
}

export const config: SubscriberConfig = {
  event: "order.return_requested",
};
