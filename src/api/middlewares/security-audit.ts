import type { MedusaNextFunction, MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

type AuditAction = "role_change" | "data_export" | "data_deletion";

function getAction(req: MedusaRequest): AuditAction | null {
  const path = req.path || "";
  const method = req.method.toUpperCase();

  if (path.startsWith("/admin/security/roles") && ["POST", "PATCH", "DELETE"].includes(method)) {
    return "role_change";
  }

  if (path === "/store/customers/me/data-export" && method === "GET") {
    return "data_export";
  }

  if (path === "/store/customers/me/data-erasure" && method === "DELETE") {
    return "data_deletion";
  }

  return null;
}

export async function securityAuditMiddleware(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction,
) {
  const logger = req.scope.resolve("logger") as { error: (message: string) => void };
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as {
    raw: (query: string, params?: unknown[]) => Promise<{ rows?: Record<string, unknown>[] }>;
  };

  const action = getAction(req);
  if (!action) {
    next();
    return;
  }

  const actorId = (req as any).auth_context?.actor_id ?? null;

  res.on("finish", async () => {
    if (res.statusCode >= 400) {
      return;
    }

    const targetId = (req.params as any)?.id ?? null;

    try {
      await pgConnection.raw(
        `CREATE TABLE IF NOT EXISTS security_audit_log (
          id BIGSERIAL PRIMARY KEY,
          action VARCHAR(64) NOT NULL,
          actor_id VARCHAR(128),
          target_id VARCHAR(128),
          resource VARCHAR(128),
          metadata JSONB DEFAULT '{}'::jsonb,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )`,
      );

      await pgConnection.raw(
        `INSERT INTO security_audit_log (action, actor_id, target_id, resource, metadata)
         VALUES (?, ?, ?, ?, ?::jsonb)`,
        [
          action,
          actorId,
          targetId,
          req.path,
          JSON.stringify({ method: req.method, query: req.query ?? {} }),
        ],
      );
    } catch (err: any) {
      logger.error(`[security-audit] write error: ${err.message}`);
    }
  });

  next();
}
