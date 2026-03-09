import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

const ALLOWED_ROLES = new Set(["admin", "manager", "staff"])

const DEFAULT_PERMISSIONS = {
  products: { read: true, write: false, delete: false },
  orders: { read: true, write: false, delete: false },
  customers: { read: true, write: false, delete: false },
}

async function ensureUserRoleTable(pgConnection: {
  raw: (query: string, params?: unknown[]) => Promise<{ rows?: Record<string, unknown>[] }>
}) {
  await pgConnection.raw(
    `CREATE TABLE IF NOT EXISTS user_role (
      id BIGSERIAL PRIMARY KEY,
      role VARCHAR(32) NOT NULL UNIQUE,
      permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`
  )
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as { error: (message: string) => void }
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as {
    raw: (query: string, params?: unknown[]) => Promise<{ rows?: Record<string, unknown>[] }>
  }

  try {
    await ensureUserRoleTable(pgConnection)
    const result = await pgConnection.raw(`SELECT * FROM user_role ORDER BY created_at ASC`)
    return res.status(200).json({ roles: result?.rows || [] })
  } catch (err: any) {
    logger.error(`[security-roles] GET error: ${err.message}`)
    return res.status(500).json({ error: "Failed to fetch roles" })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as { error: (message: string) => void }
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as {
    raw: (query: string, params?: unknown[]) => Promise<{ rows?: Record<string, unknown>[] }>
  }

  const body = (req.body as any) || {}
  const role = typeof body.role === "string" ? body.role : ""
  const permissions = body.permissions ?? DEFAULT_PERMISSIONS

  if (!ALLOWED_ROLES.has(role)) {
    return res.status(400).json({
      error: "Invalid role. Allowed values: admin, manager, staff",
    })
  }

  try {
    await ensureUserRoleTable(pgConnection)

    const result = await pgConnection.raw(
      `INSERT INTO user_role (role, permissions)
       VALUES (?, ?::jsonb)
       ON CONFLICT (role)
       DO UPDATE SET permissions = EXCLUDED.permissions, updated_at = NOW()
       RETURNING *`,
      [role, JSON.stringify(permissions)]
    )

    return res.status(200).json({ role: result?.rows?.[0] || null })
  } catch (err: any) {
    logger.error(`[security-roles] POST error: ${err.message}`)
    return res.status(500).json({ error: "Failed to create role" })
  }
}
