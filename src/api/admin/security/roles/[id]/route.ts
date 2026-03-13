import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

const ALLOWED_ROLES = new Set(["admin", "manager", "staff"]);

async function ensureUserRoleTable(pgConnection: {
  raw: (query: string, params?: unknown[]) => Promise<{ rows?: Record<string, unknown>[] }>;
}) {
  await pgConnection.raw(
    `CREATE TABLE IF NOT EXISTS user_role (
      id BIGSERIAL PRIMARY KEY,
      role VARCHAR(32) NOT NULL UNIQUE,
      permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
  );
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as { error: (message: string) => void };
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as {
    raw: (query: string, params?: unknown[]) => Promise<{ rows?: Record<string, unknown>[] }>;
  };

  try {
    await ensureUserRoleTable(pgConnection);
    const result = await pgConnection.raw(`SELECT * FROM user_role WHERE id = ?`, [req.params.id]);

    if (!result?.rows?.[0]) {
      return res.status(404).json({ error: "Role not found" });
    }

    return res.status(200).json({ role: result.rows[0] });
  } catch (err: any) {
    logger.error(`[security-roles:id] GET error: ${err.message}`);
    return res.status(500).json({ error: "Failed to fetch role" });
  }
}

export async function PATCH(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as { error: (message: string) => void };
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as {
    raw: (query: string, params?: unknown[]) => Promise<{ rows?: Record<string, unknown>[] }>;
  };

  const body = (req.body as any) || {};
  const role = body.role;
  const permissions = body.permissions;

  if (typeof role === "string" && !ALLOWED_ROLES.has(role)) {
    return res.status(400).json({ error: "Invalid role. Allowed values: admin, manager, staff" });
  }

  try {
    await ensureUserRoleTable(pgConnection);

    const result = await pgConnection.raw(
      `UPDATE user_role
       SET role = COALESCE(?, role),
           permissions = COALESCE(?::jsonb, permissions),
           updated_at = NOW()
       WHERE id = ?
       RETURNING *`,
      [role ?? null, permissions ? JSON.stringify(permissions) : null, req.params.id],
    );

    if (!result?.rows?.[0]) {
      return res.status(404).json({ error: "Role not found" });
    }

    return res.status(200).json({ role: result.rows[0] });
  } catch (err: any) {
    logger.error(`[security-roles:id] PATCH error: ${err.message}`);
    return res.status(500).json({ error: "Failed to update role" });
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as { error: (message: string) => void };
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as {
    raw: (query: string, params?: unknown[]) => Promise<{ rows?: Record<string, unknown>[] }>;
  };

  try {
    await ensureUserRoleTable(pgConnection);
    const result = await pgConnection.raw(`DELETE FROM user_role WHERE id = ? RETURNING id`, [
      req.params.id,
    ]);

    if (!result?.rows?.[0]) {
      return res.status(404).json({ error: "Role not found" });
    }

    return res.status(200).json({ id: result.rows[0].id, deleted: true });
  } catch (err: any) {
    logger.error(`[security-roles:id] DELETE error: ${err.message}`);
    return res.status(500).json({ error: "Failed to delete role" });
  }
}
