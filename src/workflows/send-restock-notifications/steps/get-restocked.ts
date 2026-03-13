import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { Modules } from "@medusajs/framework/utils";

import { DistinctSubscription } from "./get-distinct-subscriptions";

export const getRestockedStep = createStep(
  "get-restocked-variants",
  async (input: DistinctSubscription[], { container }) => {
    const restocked: DistinctSubscription[] = [];
    const query = container.resolve("query");

    for (const subscription of input) {
      try {
        const { data: variants } = await query.graph({
          entity: "product_variant",
          fields: ["id", "inventory_items.inventory.location_levels.*"],
          filters: { id: subscription.variant_id },
        });

        if (variants && variants.length > 0) {
          const variant = variants[0] as any;
          const inventoryItems = variant.inventory_items || [];
          let totalAvailable = 0;

          for (const ii of inventoryItems) {
            const levels = ii?.inventory?.location_levels || [];
            for (const level of levels) {
              totalAvailable += (level.stocked_quantity || 0) - (level.reserved_quantity || 0);
            }
          }

          if (totalAvailable > 0) {
            restocked.push(subscription);
          }
        }
      } catch {
        // Skip variants that can't be found
      }
    }

    return new StepResponse(restocked);
  },
);
