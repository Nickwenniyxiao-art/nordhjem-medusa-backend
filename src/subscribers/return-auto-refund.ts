import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import Stripe from "stripe"

const MAX_RETRIES = 3
const RETRY_DELAY_MS = 2000

interface ReturnReceivedData {
  order_id: string
  return_id: string
}

function toStripeMinorUnit(amountInMajorUnit: number) {
  return Math.round(amountInMajorUnit * 100)
}

export default async function returnAutoRefundHandler({
  event,
  container,
}: SubscriberArgs<ReturnReceivedData>) {
  const logger = container.resolve("logger") as any
  const orderService = container.resolve(Modules.ORDER) as any
  const paymentService = container.resolve(Modules.PAYMENT) as any
  const pgConnection = container.resolve(
    ContainerRegistrationKeys.PG_CONNECTION
  ) as any

  const { order_id, return_id } = event.data

  logger.info(
    `[return-auto-refund] Processing return ${return_id} for order ${order_id}`
  )

  try {
    const order = await orderService.retrieveOrder(order_id, {
      relations: ["items", "returns", "returns.items"],
    })

    if (!order) {
      logger.error(`[return-auto-refund] Order ${order_id} not found`)
      return
    }

    const returnObj = order.returns?.find((r: any) => r.id === return_id)
    if (!returnObj) {
      logger.info(
        `[return-auto-refund] Return ${return_id} not found in order ${order_id}, skipping`
      )
      return
    }

    let refundAmountMajor = 0
    for (const returnItem of returnObj.items || []) {
      const orderItem = order.items?.find((oi: any) => oi.id === returnItem.item_id)
      if (!orderItem) {
        continue
      }

      refundAmountMajor +=
        Number(orderItem.unit_price || 0) * Number(returnItem.quantity || 1)
    }

    if (refundAmountMajor <= 0) {
      logger.info(
        `[return-auto-refund] Refund amount is 0 for return ${return_id}, skipping`
      )
      return
    }

    const linkResult = await pgConnection.raw(
      `SELECT payment_collection_id FROM order_payment_collection WHERE order_id = ? LIMIT 1`,
      [order_id]
    )

    const paymentCollectionId = linkResult?.rows?.[0]?.payment_collection_id
    if (!paymentCollectionId) {
      logger.error(
        `[return-auto-refund] No payment collection found for order ${order_id}`
      )
      return
    }

    const paymentCollection = await paymentService.retrievePaymentCollection(
      paymentCollectionId,
      {
        relations: ["payments"],
      }
    )

    const payment = paymentCollection?.payments?.find(
      (p: any) => p.provider_id === "pp_stripe_stripe"
    )

    if (!payment?.data?.id) {
      logger.info(
        `[return-auto-refund] No Stripe payment found for order ${order_id}, skipping auto-refund`
      )
      return
    }

    const paymentIntentId = payment.data.id as string

    try {
      const duplicateCheck = await pgConnection.raw(
        `SELECT id FROM data_processing_log
         WHERE action_type = 'auto_refund'
           AND details LIKE ?
         LIMIT 1`,
        [`%${return_id}%`]
      )

      if (duplicateCheck?.rows?.length > 0) {
        logger.info(
          `[return-auto-refund] Refund already processed for return ${return_id}, skipping`
        )
        return
      }
    } catch (err: any) {
      logger.warn(
        `[return-auto-refund] Duplicate check unavailable: ${err.message}`
      )
    }

    const stripeApiKey = process.env.STRIPE_API_KEY
    if (!stripeApiKey) {
      logger.error("[return-auto-refund] STRIPE_API_KEY not configured")
      return
    }

    const refundAmountMinor = toStripeMinorUnit(refundAmountMajor)
    const stripe = new Stripe(stripeApiKey)

    let refundResult: Stripe.Refund | null = null
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        refundResult = await stripe.refunds.create({
          payment_intent: paymentIntentId,
          amount: refundAmountMinor,
          reason: "requested_by_customer",
          metadata: {
            nordhjem_order_id: order_id,
            nordhjem_return_id: return_id,
            nordhjem_display_id: String(order.display_id || ""),
          },
        })

        logger.info(
          `[return-auto-refund] Stripe refund created: ${refundResult.id} amount_minor=${refundAmountMinor} amount_major=${refundAmountMajor} (attempt ${attempt})`
        )
        break
      } catch (err: any) {
        lastError = err
        logger.error(
          `[return-auto-refund] Stripe refund attempt ${attempt}/${MAX_RETRIES} failed: ${err.message}`
        )

        if (attempt < MAX_RETRIES) {
          await new Promise((resolve) =>
            setTimeout(resolve, RETRY_DELAY_MS * attempt)
          )
        }
      }
    }

    const details = JSON.stringify({
      order_id,
      return_id,
      payment_intent_id: paymentIntentId,
      amount_major: refundAmountMajor,
      amount_minor: refundAmountMinor,
      stripe_refund_id: refundResult?.id || null,
      status: refundResult ? "success" : "failed",
      error: lastError?.message || null,
    })

    try {
      await pgConnection.raw(
        `INSERT INTO data_processing_log (customer_id, action_type, details)
         VALUES (?, 'auto_refund', ?)`,
        [order.customer_id || null, details]
      )
    } catch (err: any) {
      logger.warn(
        `[return-auto-refund] Failed to write data_processing_log entry: ${err.message}`
      )
    }

    if (refundResult) {
      logger.info(
        `[return-auto-refund] ✅ Refund ${refundResult.id} completed for order #${order.display_id}, return ${return_id}, amount_major=${refundAmountMajor}, amount_minor=${refundAmountMinor}`
      )
    } else {
      logger.error(
        `[return-auto-refund] ❌ All ${MAX_RETRIES} refund attempts failed for return ${return_id}: ${lastError?.message}`
      )
    }
  } catch (err: any) {
    logger.error(`[return-auto-refund] Unexpected error: ${err.message}`)
  }
}

export const config: SubscriberConfig = {
  event: "order.return_received",
}
