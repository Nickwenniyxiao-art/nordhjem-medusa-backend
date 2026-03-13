import { useQueryGraphStep } from "@medusajs/medusa/core-flows"
import { transform } from "@medusajs/framework/workflows-sdk"
import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { getDistinctSubscriptionsStep } from "./steps/get-distinct-subscriptions"
import { getRestockedStep } from "./steps/get-restocked"
import { sendRestockNotificationStep } from "./steps/send-restock-notification"
import { deleteRestockSubscriptionsStep } from "./steps/delete-restock-subscriptions"

export const sendRestockNotificationsWorkflow = createWorkflow("send-restock-notifications", () => {
  const distinctSubscriptions = getDistinctSubscriptionsStep()
  const restocked = getRestockedStep(distinctSubscriptions)

  const subscriptionFilters = transform({ restocked }, (data) => {
    if (!data.restocked.length) {
      return { id: "__none__" }
    }

    return {
      $or: data.restocked.map((item) => ({
        variant_id: item.variant_id,
        sales_channel_id: item.sales_channel_id,
      })),
    }
  })

  const { data: subscriptions } = useQueryGraphStep({
    entity: "restock_subscription",
    fields: [
      "id",
      "email",
      "variant_id",
      "sales_channel_id",
      "customer_id",
      "product_variant.*",
      "product_variant.product.*",
    ],
    filters: subscriptionFilters,
  })

  const sent = sendRestockNotificationStep(subscriptions as any)
  deleteRestockSubscriptionsStep(sent as any)

  return new WorkflowResponse({ sent_count: transform({ sent }, (data) => data.sent.length) })
})
