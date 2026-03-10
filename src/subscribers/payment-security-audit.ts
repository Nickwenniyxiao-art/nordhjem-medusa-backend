import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

async function ensureAuditColumns(pgConnection: any) {
  await pgConnection.raw(
    `CREATE TABLE IF NOT EXISTS security_audit_log (
      id BIGSERIAL PRIMARY KEY,
      action VARCHAR(64) NOT NULL,
      actor_id VARCHAR(128),
      target_id VARCHAR(128),
      resource VARCHAR(128),
      metadata JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`
  )

  await pgConnection.raw(`ALTER TABLE security_audit_log ADD COLUMN IF NOT EXISTS resource_type VARCHAR(128)`)
  await pgConnection.raw(`ALTER TABLE security_audit_log ADD COLUMN IF NOT EXISTS resource_id VARCHAR(128)`)
  await pgConnection.raw(`ALTER TABLE security_audit_log ADD COLUMN IF NOT EXISTS details_json JSONB DEFAULT '{}'::jsonb`)
  await pgConnection.raw(`ALTER TABLE security_audit_log ADD COLUMN IF NOT EXISTS ip_address VARCHAR(128)`)
}

export default async function paymentSecurityAuditHandler({
  event,
  container,
}: SubscriberArgs<Record<string, unknown>>) {
  const logger = container.resolve("logger") as any
  const pgConnection = container.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any

  const eventName = String((event as any).name || "unknown")
  const payload = (event.data || {}) as any
  const metadata = (payload.metadata || {}) as any

  try {
    await ensureAuditColumns(pgConnection)

    await pgConnection.raw(
      `INSERT INTO security_audit_log
        (action, actor_id, resource_type, resource_id, details_json, ip_address)
       VALUES (?, ?, ?, ?, ?::jsonb, ?)`,
      [
        eventName,
        metadata.actor_id || null,
        "payment",
        payload.id || payload.order_id || payload.provider_id || null,
        JSON.stringify(payload),
        metadata.ip_address || null,
      ]
    )
  } catch (err: any) {
    logger.error(`[payment-security-audit] Error writing audit log: ${err.message}`)
  }
}

export const config: SubscriberConfig = {
  event: [
    "payment.captured",
    "payment.refunded",
    "refund.created",
    "payment.method_updated",
  ],
}
