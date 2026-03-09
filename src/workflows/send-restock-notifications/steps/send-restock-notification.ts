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
    const notificationModuleService: any = container.resolve(Modules.NOTIFICATION)
    const logger = container.resolve("logger") as { info: (m: string) => void; error: (m: string) => void }

    if (!input || input.length === 0) {
      logger.info("[restock-notification] No subscriptions to notify")
      return new StepResponse([])
    }

    const sent: RestockNotificationInput[] = []

    for (const subscription of input) {
      try {
        await notificationModuleService.createNotifications({
          to: subscription.email,
          channel: "email",
          template: "variant-restock",
          data: {
            subject: "NordHjem \u5546\u54c1\u5df2\u8865\u8d27 | Item back in stock",
            variant_id: subscription.variant_id,
            variant_title: subscription.product_variant?.title,
            product_title: subscription.product_variant?.product?.title,
          },
        })
        sent.push(subscription)
      } catch (emailError) {
        const errMsg = emailError instanceof Error ? emailError.message : JSON.stringify(emailError)
        logger.error(`[restock-notification] Email failed for ${subscription.email}: ${errMsg}`)
      }

      if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
        const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`
        const text = `\ud83d\udd14 Restock notice sent\nEmail: ${subscription.email}\nVariant: ${subscription.product_variant?.title || subscription.variant_id}`

        try {
          await fetch(telegramUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: process.env.TELEGRAM_CHAT_ID,
              text,
            }),
          })
        } catch (e) {
          logger.info(`[restock-notification] Telegram send failed: ${e}`)
        }
      }
    }

    logger.info(`[restock-notification] Sent ${sent.length}/${input.length} restock notifications`)
    return new StepResponse(sent)
  }
)
