import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { getVariantAvailability } from "@medusajs/framework/utils"

import { DistinctSubscription } from "./get-distinct-subscriptions"

export const getRestockedStep = createStep(
  "get-restocked-variants",
  async (input: DistinctSubscription[], { container }) => {
    const restocked: DistinctSubscription[] = []

    for (const subscription of input) {
      const [availability] = await getVariantAvailability(
        container,
        subscription.variant_id,
        subscription.sales_channel_id ? { sales_channel_id: subscription.sales_channel_id } : {}
      )

      if (availability?.availability && availability.availability > 0) {
        restocked.push(subscription)
      }
    }

    return new StepResponse(restocked)
  }
)
