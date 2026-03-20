import { loadEnv, defineConfig } from "@medusajs/framework/utils"
loadEnv(process.env.NODE_ENV || "production", process.cwd())

if (process.env.NODE_ENV === "production") {
  const required = ["JWT_SECRET", "COOKIE_SECRET", "DATABASE_URL"] as const
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required env var: ${key}`)
    }
  }
}
module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseDriverOptions: { ssl: false },
    redisUrl: process.env.REDIS_URL,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
    },
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET!,
      cookieSecret: process.env.COOKIE_SECRET!,
    },
  },
  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
  },
  modules: [
    {
      resolve: "./src/modules/brand",
    },
    {
      resolve: "./src/modules/restock",
    },
    {
      resolve: "./src/modules/ticket",
    },
    {
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [
          {
            resolve: "./src/modules/resend-notification",
            id: "resend-notification",
            options: {
              channels: ["email"],
              apiKey: process.env.RESEND_API_KEY,
              fromEmail: process.env.RESEND_FROM_EMAIL || "NordHjem <noreply@nordhjem.store>",
              replyToEmail: process.env.RESEND_REPLY_TO || "support@nordhjem.store",
            },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/payment-stripe",
            id: "stripe",
            options: {
              apiKey: process.env.STRIPE_API_KEY,
              webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
              capture: true,
            },
          },
        ],
      },
    },
  ],
})
