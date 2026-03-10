# Environment Variables

Below are the environment variables used by this backend for infrastructure and integrations.

| Variable | Required | Default | Example |
| --- | --- | --- | --- |
| `DATABASE_URL` | Yes | None | `postgres://USER:PASSWORD@HOST:5432/DB_NAME` |
| `REDIS_URL` | No | None (`/store/health` reports Redis as `skipped`) | `redis://:PASSWORD@HOST:6379` |
| `STORE_CORS` | Yes | None | `http://localhost:8000,https://store.example.com` |
| `ADMIN_CORS` | Yes | None | `http://localhost:9000` |
| `AUTH_CORS` | Yes | None | `http://localhost:8000,https://store.example.com` |
| `STRIPE_API_KEY` | Yes (if using Stripe payments) | None | `sk_test_xxx` |
| `STRIPE_WEBHOOK_SECRET` | Yes (if using Stripe webhooks) | None | `whsec_xxx` |
| `RESEND_API_KEY` | Yes (if using Resend email) | None | `re_xxx` |
| `RESEND_FROM_EMAIL` | Yes (if using Resend email) | None | `NordHjem <noreply@example.com>` |
| `WEBHOOK_RELAY_URL` | No | None | `https://n8n.example.com/webhook/order-events` |
| `WEBHOOK_RELAY_SECRET` | No | None | `relay_secret_123` |
| `DISABLE_MEDUSA_ADMIN` | No | `false` | `true` |

## Notes
- `DATABASE_URL` is mandatory for server startup.
- `REDIS_URL` is optional; when unset, Redis-dependent checks and features should degrade gracefully.
- `DISABLE_MEDUSA_ADMIN=true` disables Admin UI build output for backend-only deployments.
