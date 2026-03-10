import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

async function ensureMethodsTable(pgConnection: any) {
  await pgConnection.raw(
    `CREATE TABLE IF NOT EXISTS payment_methods_config (
      id UUID PRIMARY KEY,
      provider_id VARCHAR(64) UNIQUE NOT NULL,
      display_name VARCHAR(128) NOT NULL,
      is_enabled BOOLEAN NOT NULL DEFAULT FALSE,
      config_json JSONB NOT NULL DEFAULT '{}'::jsonb,
      priority INT NOT NULL DEFAULT 100,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`
  )
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as any
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any

  try {
    await ensureMethodsTable(pgConnection)

    const result = await pgConnection.raw(
      `SELECT provider_id, display_name
       FROM payment_methods_config
       WHERE is_enabled = TRUE
       ORDER BY priority ASC, created_at ASC`
    )

    return res.status(200).json({ payment_methods: result?.rows || [] })
  } catch (err: any) {
    logger.error(`[store-payment-methods] GET error: ${err.message}`)
    return res.status(500).json({ error: "Failed to fetch payment methods" })
  }
}
