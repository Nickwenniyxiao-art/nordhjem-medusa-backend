import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { createRestockSubscriptionWorkflow } from "../../../workflows/create-restock-subscription";
import { StoreCreateRestockSubscriptionType } from "./validators";

type StoreCreateRestockSubscriptionRequest = StoreCreateRestockSubscriptionType;

export const POST = async (
  req: AuthenticatedMedusaRequest<StoreCreateRestockSubscriptionRequest>,
  res: MedusaResponse,
) => {
  const body = req.validatedBody;
  const publishableSalesChannelId = req.publishable_key_context?.sales_channel_ids?.[0];

  const customer =
    req.auth_context?.actor_type === "customer"
      ? {
          id: req.auth_context.actor_id,
          email: (req.auth_context as Record<string, any>)?.app_metadata?.email,
        }
      : undefined;

  const { result } = await createRestockSubscriptionWorkflow(req.scope).run({
    input: {
      variant_id: body.variant_id,
      sales_channel_id: body.sales_channel_id ?? publishableSalesChannelId,
      customer,
      email: body.email,
    },
  });

  res.status(200).json({ restock_subscription: result });
};
