import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function customerPasswordResetHandler({
  event,
  container,
}: SubscriberArgs<{ id: string; email: string; token: string }>) {
  const notificationService = container.resolve(Modules.NOTIFICATION)

  const resetUrl = `${process.env.STOREFRONT_URL}/account/reset-password?token=${event.data.token}&email=${event.data.email}`

  await notificationService.createNotifications({
    to: event.data.email,
    channel: "email",
    template: "password-reset",
    data: {
      resetUrl,
      email: event.data.email,
      subject: "NordHjem 密码重置 | Password Reset",
    },
  })
}

export const config: SubscriberConfig = {
  event: "customer.password_reset",
}
