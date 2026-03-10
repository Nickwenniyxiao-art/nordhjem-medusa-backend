import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

const defaultPreferences = {
  language: "en",
  currency_code: "usd",
  notification_email: true,
  notification_sms: false,
  marketing_opt_in: false,
}

async function ensurePreferencesTable(pgConnection: any) {
  await pgConnection.raw(
    `CREATE TABLE IF NOT EXISTS customer_preferences (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      customer_id TEXT UNIQUE NOT NULL,
      language TEXT,
      currency_code TEXT,
      notification_email BOOLEAN NOT NULL DEFAULT true,
      notification_sms BOOLEAN NOT NULL DEFAULT false,
      marketing_opt_in BOOLEAN NOT NULL DEFAULT false,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`
  )
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any

  const customerId = (req as any).auth_context?.actor_id
  if (!customerId) {
    return res.status(401).json({ error: "Authentication required" })
  }

  await ensurePreferencesTable(pgConnection)

  const result = await pgConnection.raw(
    `SELECT language, currency_code, notification_email, notification_sms, marketing_opt_in
     FROM customer_preferences
     WHERE customer_id = ?`,
    [customerId]
  )

  const row = result.rows?.[0]

  return res.status(200).json({
    preferences: row
      ? {
          language: row.language || defaultPreferences.language,
          currency_code: row.currency_code || defaultPreferences.currency_code,
          notification_email: row.notification_email,
          notification_sms: row.notification_sms,
          marketing_opt_in: row.marketing_opt_in,
        }
      : defaultPreferences,
  })
}

export async function PATCH(req: MedusaRequest, res: MedusaResponse) {
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any
  const eventBus = req.scope.resolve(Modules.EVENT_BUS) as any

  const customerId = (req as any).auth_context?.actor_id
  if (!customerId) {
    return res.status(401).json({ error: "Authentication required" })
  }

  const body = (req.body || {}) as any

  await ensurePreferencesTable(pgConnection)

  await pgConnection.raw(
    `INSERT INTO customer_preferences (
      customer_id,
      language,
      currency_code,
      notification_email,
      notification_sms,
      marketing_opt_in,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, NOW())
    ON CONFLICT (customer_id)
    DO UPDATE SET
      language = COALESCE(EXCLUDED.language, customer_preferences.language),
      currency_code = COALESCE(EXCLUDED.currency_code, customer_preferences.currency_code),
      notification_email = COALESCE(EXCLUDED.notification_email, customer_preferences.notification_email),
      notification_sms = COALESCE(EXCLUDED.notification_sms, customer_preferences.notification_sms),
      marketing_opt_in = COALESCE(EXCLUDED.marketing_opt_in, customer_preferences.marketing_opt_in),
      updated_at = NOW()`,
    [
      customerId,
      body.language ?? null,
      body.currency_code ?? null,
      body.notification_email ?? null,
      body.notification_sms ?? null,
      body.marketing_opt_in ?? null,
    ]
  )

  const result = await pgConnection.raw(
    `SELECT language, currency_code, notification_email, notification_sms, marketing_opt_in
     FROM customer_preferences
     WHERE customer_id = ?`,
    [customerId]
  )
  const preferences = result.rows?.[0] || defaultPreferences

  await eventBus.emit({
    name: "customer.preferences_updated",
    data: { customer_id: customerId, preferences },
  })

  return res.status(200).json({ preferences })
}
