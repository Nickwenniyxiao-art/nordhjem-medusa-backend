import { AbstractNotificationProviderService } from "@medusajs/framework/utils"
import { Resend } from "resend"
import { Logger } from "@medusajs/framework/types"

type ResendNotificationConfig = {
  apiKey: string
  fromEmail: string
  replyToEmail?: string
}

type SendNotificationInput = {
  to: string
  channel: string
  template: string
  data: Record<string, unknown>
}

type SendNotificationResult = {
  id: string
}

class ResendNotificationProviderService extends AbstractNotificationProviderService {
  static identifier = "resend-notification"
  private resend: Resend
  private fromEmail: string
  private replyToEmail?: string
  private logger: Logger

  constructor(container: Record<string, unknown>, config: ResendNotificationConfig) {
    super()
    this.logger = container.logger as Logger
    this.resend = new Resend(config.apiKey)
    this.fromEmail = config.fromEmail
    this.replyToEmail = config.replyToEmail
  }

  async send(notification: SendNotificationInput): Promise<SendNotificationResult> {
    if (notification.channel === "email") {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: notification.to,
        replyTo: this.replyToEmail,
        subject: (notification.data as Record<string, string>).subject || "NordHjem Notification",
        html: (notification.data as Record<string, string>).html || "",
      })

      if (error) {
        this.logger.error(`Resend send failed: ${JSON.stringify(error)}`)
        throw new Error(`Failed to send email: ${error.message}`)
      }

      this.logger.info(`Email sent via Resend: ${data?.id}`)
      return { id: data?.id || "unknown" }
    }

    throw new Error(`Channel ${notification.channel} not supported`)
  }
}

export default ResendNotificationProviderService
