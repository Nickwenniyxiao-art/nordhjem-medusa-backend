import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";

export default async function exchangeCreatedHandler({
  event,
  container,
}: SubscriberArgs<{ order_id: string; exchange_id: string }>) {
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
    template: "exchange-created",
    data: {
      order,
      exchangeId: event.data.exchange_id,
      subject: `NordHjem 换货确认 | Exchange Confirmed #${order.display_id}`,
    },
  });
}

export const config: SubscriberConfig = {
  event: "order.exchange_created",
};
