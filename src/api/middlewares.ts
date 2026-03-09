import { defineMiddlewares, authenticate, validateAndTransformBody } from "@medusajs/framework/http"
import { StoreCreateRestockSubscription } from "./store/restock-subscriptions/validators"

export default defineMiddlewares({
  routes: [
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
  ],
})
