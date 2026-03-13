import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { RESTOCK_MODULE } from "../../../modules/restock";

export type DistinctSubscription = {
  variant_id: string;
  sales_channel_id: string | null;
};

export const getDistinctSubscriptionsStep = createStep(
  "get-distinct-restock-subscriptions",
  async (_, { container }) => {
    const restockService = container.resolve(RESTOCK_MODULE) as {
      getUniqueSubscriptions: () => Promise<DistinctSubscription[]>;
    };

    const subscriptions = await restockService.getUniqueSubscriptions();

    return new StepResponse(subscriptions);
  },
);
