import {
  createWorkflow,
  WorkflowResponse,
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk";

const sendAbandonedCartEmailStep = createStep(
  "send-abandoned-cart-email",
  async (input: { cartId: string; email: string; items: unknown[] }, { container }) => {
    const notificationService = container.resolve("notification");

    await notificationService.createNotifications({
      to: input.email,
      channel: "email",
      template: "abandoned-cart",
      data: {
        cartId: input.cartId,
        items: input.items,
        subject: "NordHjem 您的购物车还在等您 | Your Cart is Waiting",
      },
    });

    return new StepResponse({ sent: true });
  },
);

export const abandonedCartWorkflow = createWorkflow(
  "abandoned-cart-email",
  (input: { cartId: string; email: string; items: unknown[] }) => {
    const result = sendAbandonedCartEmailStep(input);
    return new WorkflowResponse(result);
  },
);
