import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

type RestockNotificationInput = {
  id: string
  email: string
  variant_id: string
  product_variant?: {
    title?: string
    product?: {
      title?: string
    }
  }
}

export const sendRestockNotificationStep = createStep(
  "send-restock-notification",
  async (input: RestockNotificationInput[], { container }) => {
    const notificationModuleService = container.resolve(Modules.NOTIFICATION) as {
      createNotifications: (data: Record<string, unknown>) => Promise<unknown>
    }

    for (const subscription of input) {
      await notificationModuleService.createNotifications({
        to: subscription.email,
        channel: "email",
        template: "variant-restock",
        data: {
          subject: "NordHjem 商品已补货 | Item back in stock",
          variant_id: subscription.variant_id,
          variant_title: subscription.product_variant?.title,
          product_title: subscription.product_variant?.product?.title,
        },
      })

      if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
        const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`
        const text = `🔔 Restock notice sent\nEmail: ${subscription.email}\nVariant: ${subscription.variant_id}`

        await fetch(telegramUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text,
          }),
        })
      }
    }

    return new StepResponse(input)
  }
)
