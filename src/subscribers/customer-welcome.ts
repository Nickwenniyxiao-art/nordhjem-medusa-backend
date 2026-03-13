import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";

export default async function customerWelcomeHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationService = container.resolve(Modules.NOTIFICATION);
  const customerService = container.resolve(Modules.CUSTOMER);

  const customer = await customerService.retrieveCustomer(event.data.id);

  if (!customer.email) {
    return;
  }

  await notificationService.createNotifications({
    to: customer.email,
    channel: "email",
    template: "customer-welcome",
    data: {
      customer,
      firstName: customer.first_name || "",
      subject: `欢迎加入 NordHjem | Welcome to NordHjem`,
    },
  });
}

export const config: SubscriberConfig = {
  event: "customer.created",
};
