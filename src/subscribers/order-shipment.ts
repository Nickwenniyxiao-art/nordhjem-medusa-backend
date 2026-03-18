import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";

export default async function orderShipmentHandler({
  event,
  container,
}: SubscriberArgs<{
  order_id: string;
  fulfillment_id: string;
  no_notification?: boolean;
}>) {
  const logger = container.resolve("logger") as {
    info: (m: string) => void;
    error: (m: string) => void;
  };
  const notificationService = container.resolve(Modules.NOTIFICATION);
  const orderService = container.resolve(Modules.ORDER);
  const fulfillmentService = container.resolve(Modules.FULFILLMENT);

  try {
    const order = await orderService.retrieveOrder(event.data.order_id, {
      relations: ["items", "shipping_address"],
    });

    if (!order.email) {
      logger.info(`[order-shipment] Order ${event.data.order_id} has no email, skipping`);
      return;
    }

    const fulfillment = await fulfillmentService.retrieveFulfillment(event.data.fulfillment_id, {
      relations: ["labels"],
    });

    const trackingNumber =
      (fulfillment as any).tracking_links?.[0]?.tracking_number ??
      fulfillment.labels?.[0]?.tracking_number ??
      null;

    if (!trackingNumber || typeof trackingNumber !== "string" || trackingNumber.trim() === "") {
      logger.info(
        `[order-shipment] Fulfillment ${event.data.fulfillment_id} has no tracking number, skipping email`,
      );
      return;
    }

    const trackingUrl = `https://t.17track.net/zh-cn/track?nums=${encodeURIComponent(trackingNumber)}`;

    await (notificationService as any).createNotifications({
      to: order.email,
      channel: "email",
      template: "shipping-notification",
      data: {
        order,
        fulfillment,
        trackingNumber,
        trackingUrl,
        subject: `NordHjem \u53d1\u8d27\u901a\u77e5 | Shipping Notification #${order.display_id}`,
      },
    });

    logger.info(
      `[order-shipment] Shipping notification sent for order ${order.display_id}, tracking: ${trackingNumber}`,
    );

    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      try {
        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: `\ud83d\udce6 \u53d1\u8d27\u901a\u77e5\u5df2\u53d1\u9001\nOrder #${order.display_id}\nTracking: ${trackingNumber}\nEmail: ${order.email}`,
          }),
        });
      } catch {
        // Non-critical
      }
    }
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : JSON.stringify(error);
    logger.error(`[order-shipment] Failed: ${errMsg}`);
  }
}

export const config: SubscriberConfig = {
  event: "order.fulfillment_created",
};
