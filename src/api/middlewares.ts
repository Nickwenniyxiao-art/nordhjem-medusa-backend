import { defineMiddlewares, authenticate, validateAndTransformBody } from "@medusajs/framework/http"
import { stripeWebhookAuditMiddleware } from "./middlewares/stripe-webhook-audit"
import { StoreCreateRestockSubscription } from "./store/restock-subscriptions/validators"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/hooks/payment/stripe_stripe",
      method: "POST",
      middlewares: [stripeWebhookAuditMiddleware],
    },
    {
      matcher: "/store/restock-subscriptions",
      method: "POST",
      middlewares: [
        authenticate("customer", ["bearer", "session"], {
          allowUnauthenticated: true,
        }),
        validateAndTransformBody(StoreCreateRestockSubscription),
      ],
    },
    {
      matcher: "/store/orders/:id/tracking",
      method: "GET",
      middlewares: [
        authenticate("customer", ["bearer", "session"], {
          allowUnauthenticated: true,
        }),
      ],
    },
    {
      matcher: "/admin/data-processing-log",
      method: "GET",
      middlewares: [authenticate("user", ["bearer", "session"])],
    },
    {
      matcher: "/admin/analytics/top-products",
      method: "GET",
      middlewares: [authenticate("user", ["bearer", "session"])],
    },
    {
      matcher: "/store/customers/me/data-export",
      method: "GET",
      middlewares: [authenticate("customer", ["bearer", "session"])],
    },
    {
      matcher: "/store/customers/me/data-erasure",
      method: "DELETE",
      middlewares: [authenticate("customer", ["bearer", "session"])],
    },
    {
      matcher: "/admin/analytics/*",
      method: "GET",
      middlewares: [authenticate("user", ["bearer", "session"])],
    },
    {
      matcher: "/admin/finance/*",
      method: "GET",
      middlewares: [authenticate("user", ["bearer", "session"])],
    },
  ],
})
