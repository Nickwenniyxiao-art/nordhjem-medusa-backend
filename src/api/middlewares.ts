import { defineMiddlewares, authenticate, validateAndTransformBody } from "@medusajs/framework/http"
import { securityAuditMiddleware } from "./middlewares/security-audit"
import { stripeWebhookAuditMiddleware } from "./middlewares/stripe-webhook-audit"
import { loginTrackerMiddleware } from "./middlewares/login-tracker"
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
      middlewares: [
        authenticate("customer", ["bearer", "session"]),
        securityAuditMiddleware,
      ],
    },
    {
      matcher: "/store/customers/me/data-erasure",
      method: "DELETE",
      middlewares: [
        authenticate("customer", ["bearer", "session"]),
        securityAuditMiddleware,
      ],
    },
    {
      matcher: "/admin/security/audit-logs",
      method: "GET",
      middlewares: [authenticate("user", ["bearer", "session"])],
    },
    {
      matcher: "/admin/security/roles",
      method: ["GET", "POST"],
      middlewares: [
        authenticate("user", ["bearer", "session"]),
        securityAuditMiddleware,
      ],
    },
    {
      matcher: "/admin/security/roles/:id",
      method: ["GET", "PATCH", "DELETE"],
      middlewares: [
        authenticate("user", ["bearer", "session"]),
        securityAuditMiddleware,
      ],
    },
    {
      matcher: "/admin/analytics/*",
      method: "GET",
      middlewares: [authenticate("user", ["bearer", "session"])],
    },
    {
      matcher: "/admin/analytics/reports",
      method: "POST",
      middlewares: [authenticate("user", ["bearer", "session"])],
    },
    {
      matcher: "/admin/analytics/events",
      method: ["GET", "POST"],
      middlewares: [authenticate("user", ["bearer", "session"])],
    },
    {
      matcher: "/admin/analytics/funnel",
      method: "GET",
      middlewares: [authenticate("user", ["bearer", "session"])],
    },
    {
      matcher: "/admin/analytics/export",
      method: "GET",
      middlewares: [authenticate("user", ["bearer", "session"])],
    },
    {
      matcher: "/admin/finance/tax-rates",
      method: ["GET", "POST"],
      middlewares: [authenticate("user", ["bearer", "session"])],
    },
    {
      matcher: "/admin/finance/tax-rates/:id",
      method: ["PATCH", "DELETE"],
      middlewares: [authenticate("user", ["bearer", "session"])],
    },
    {
      matcher: "/admin/orders/:id/return-request",
      method: "POST",
      middlewares: [authenticate("user", ["bearer", "session"])],
    },
    {
      matcher: "/admin/orders/:id/exchange",
      method: "POST",
      middlewares: [authenticate("user", ["bearer", "session"])],
    },
    {
      matcher: "/admin/orders/batch",
      method: "POST",
      middlewares: [authenticate("user", ["bearer", "session"])],
    },
    {
      matcher: "/admin/inventory/batch",
      method: "POST",
      middlewares: [authenticate("user", ["bearer", "session"])],
    },
    {
      matcher: "/admin/inventory/:id/logs",
      method: "GET",
      middlewares: [authenticate("user", ["bearer", "session"])],
    },
    {
      matcher: "/admin/orders/export",
      method: "GET",
      middlewares: [authenticate("user", ["bearer", "session"])],
    },
    {
      matcher: "/admin/finance/*",
      method: "GET",
      middlewares: [authenticate("user", ["bearer", "session"])],
    },
    {
      matcher: "/admin/tickets",
      method: ["GET", "POST"],
      middlewares: [authenticate("user", ["bearer", "session"])],
    },
    {
      matcher: "/admin/tickets/:id",
      method: ["GET", "PATCH"],
      middlewares: [authenticate("user", ["bearer", "session"])],
    },
    {
      matcher: "/admin/tickets/:id/messages",
      method: ["GET", "POST"],
      middlewares: [authenticate("user", ["bearer", "session"])],
    },
    {
      matcher: "/store/checkout/shipping-addresses",
      method: ["GET", "POST"],
      middlewares: [
        authenticate("customer", ["bearer", "session"], {
          allowUnauthenticated: true,
        }),
      ],
    },
    {
      matcher: "/admin/gift-cards",
      method: ["GET", "POST"],
      middlewares: [authenticate("user", ["bearer", "session"])],
    },
    {
      matcher: "/store/cart/gift-card",
      method: ["GET", "POST"],
      middlewares: [
        authenticate("customer", ["bearer", "session"], {
          allowUnauthenticated: true,
        }),
      ],
    },
    {
      matcher: "/store/checkout/reserve",
      method: ["POST", "DELETE"],
      middlewares: [
        authenticate("customer", ["bearer", "session"], {
          allowUnauthenticated: true,
        }),
      ],
    },
    {
      matcher: "/store/checkout/idempotency",
      method: "POST",
      middlewares: [
        authenticate("customer", ["bearer", "session"], {
          allowUnauthenticated: true,
        }),
      ],
    },
    {
      matcher: "/store/me/addresses",
      method: ["GET", "POST"],
      middlewares: [authenticate("customer", ["bearer", "session"])],
    },
    {
      matcher: "/store/me/addresses/:id",
      method: ["PATCH", "DELETE"],
      middlewares: [authenticate("customer", ["bearer", "session"])],
    },
    {
      matcher: "/store/me/orders",
      method: "GET",
      middlewares: [authenticate("customer", ["bearer", "session"])],
    },
    {
      matcher: "/store/me/preferences",
      method: ["GET", "PATCH"],
      middlewares: [authenticate("customer", ["bearer", "session"])],
    },
    {
      matcher: "/store/me/login-history",
      method: "GET",
      middlewares: [authenticate("customer", ["bearer", "session"])],
    },
    {
      matcher: "/auth/customer/emailpass",
      method: "POST",
      middlewares: [loginTrackerMiddleware],
    },
  ],
})
