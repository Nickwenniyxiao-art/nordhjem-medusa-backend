import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { RESTOCK_MODULE } from "../../modules/restock";

type CreateRestockSubscriptionInput = {
  variant_id: string;
  sales_channel_id?: string;
  customer?: {
    id?: string;
    email?: string;
  };
  email?: string;
};

const createRestockSubscriptionStep = createStep(
  "create-restock-subscription-step",
  async (input: CreateRestockSubscriptionInput, { container }) => {
    const restockService = container.resolve(RESTOCK_MODULE) as {
      createRestockSubscriptions: (payload: {
        variant_id: string;
        sales_channel_id?: string;
        customer_id?: string;
        email: string;
      }) => Promise<unknown>;
    };

    const email = input.email ?? input.customer?.email;

    if (!email) {
      throw new Error("Email is required to create a restock subscription");
    }

    const subscription = await restockService.createRestockSubscriptions({
      variant_id: input.variant_id,
      sales_channel_id: input.sales_channel_id,
      customer_id: input.customer?.id,
      email,
    });

    return new StepResponse(subscription);
  },
);

export const createRestockSubscriptionWorkflow = createWorkflow(
  "create-restock-subscription-workflow",
  (input: CreateRestockSubscriptionInput) => {
    const created = createRestockSubscriptionStep(input);

    return new WorkflowResponse(created);
  },
);
