import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { RESTOCK_MODULE } from "../../../modules/restock"

type RestockSubscription = {
  id: string
  variant_id: string
  sales_channel_id?: string | null
  email: string
  customer_id?: string | null
}

export const deleteRestockSubscriptionsStep = createStep(
  "delete-restock-subscriptions",
  async (input: RestockSubscription[], { container }) => {
    const restockService = container.resolve(RESTOCK_MODULE) as any

    const ids = input.map((subscription) => subscription.id)

    if (ids.length) {
      await restockService.deleteRestockSubscriptions(ids)
    }

    return new StepResponse(ids, input)
  },
  async (input, { container }) => {
    if (!input?.length) {
      return
    }

    const restockService = container.resolve(RESTOCK_MODULE) as any

    await restockService.createRestockSubscriptions(
      input.map(({ id: _id, ...subscription }: any) => subscription)
    )
  }
)

