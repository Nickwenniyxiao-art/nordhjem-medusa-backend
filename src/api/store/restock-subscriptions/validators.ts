import { z } from "zod";

export const StoreCreateRestockSubscription = z.object({
  variant_id: z.string().min(1),
  email: z.string().email().optional(),
  sales_channel_id: z.string().optional(),
});

export type StoreCreateRestockSubscriptionType = z.infer<typeof StoreCreateRestockSubscription>;
