import type { MedusaNextFunction, MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

async function ensureLoginHistoryTable(pgConnection: any) {
  await pgConnection.raw(
    `CREATE TABLE IF NOT EXISTS customer_login_history (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      customer_id TEXT,
      ip_address TEXT,
      user_agent TEXT,
      login_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      status TEXT NOT NULL
    )`
  )
}

function getIp(req: MedusaRequest) {
  const forwarded = req.headers["x-forwarded-for"]
  if (Array.isArray(forwarded)) {
    return forwarded[0]?.split(",")[0]?.trim() || req.ip || null
  }

  if (typeof forwarded === "string") {
    return forwarded.split(",")[0]?.trim() || req.ip || null
  }

  return req.ip || null
}

export async function loginTrackerMiddleware(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any

  await ensureLoginHistoryTable(pgConnection)

  let responseBody: any = null
  const originalJson = res.json.bind(res)
  ;(res as any).json = (body: any) => {
    responseBody = body
    return originalJson(body)
  }

  res.on("finish", async () => {
    const status = res.statusCode === 200 ? "success" : "failed"

    let customerId: string | null = null
    if (status === "success") {
      customerId =
        responseBody?.customer?.id ||
        responseBody?.customer_id ||
        responseBody?.actor_id ||
        (res as any).locals?.auth_context?.actor_id ||
        null
    }

    if (!customerId) {
      const body = (req.body || {}) as any
      if (body.email) {
        const result = await pgConnection.raw(`SELECT id FROM customer WHERE email = ? LIMIT 1`, [
          body.email,
        ])
        customerId = result.rows?.[0]?.id || null
      }
    }

    await pgConnection.raw(
      `INSERT INTO customer_login_history (customer_id, ip_address, user_agent, login_at, status)
       VALUES (?, ?, ?, NOW(), ?)`,
      [customerId, getIp(req), req.headers["user-agent"] || null, status]
    )
  })

  next()
}
