import type { MedusaNextFunction, MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

function extractResourceId(req: MedusaRequest): string | null {
  const paramId = (req.params as Record<string, string | undefined> | undefined)?.id;
  if (paramId) {
    return paramId;
  }

  const path = req.path || "";
  const segments = path.split("/").filter(Boolean);

  if (segments.length < 3) {
    return null;
  }

  const lastSegment = segments[segments.length - 1];
  if (["admin", "store"].includes(lastSegment)) {
    return null;
  }

  return lastSegment;
}

export async function adminAuditLogMiddleware(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction,
) {
  const logger = req.scope.resolve("logger") as { error: (message: string) => void };
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as {
    raw: (query: string, params?: unknown[]) => Promise<{ rows?: Record<string, unknown>[] }>;
  };

  const method = (req.method || "").toUpperCase();
  const actorId = (req as Record<string, any>).auth_context?.actor_id ?? null;
  const resourcePath = req.path || "";
  const resourceId = extractResourceId(req);
  const requestBodySummary = JSON.stringify(req.body ?? {}).substring(0, 500);

  res.on("finish", async () => {
    if (res.statusCode >= 400) {
      return;
    }

    try {
      await pgConnection.raw(
        `CREATE TABLE IF NOT EXISTS audit_log (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          action_type TEXT NOT NULL,
          resource TEXT NOT NULL,
          resource_id TEXT,
          actor_id TEXT,
          timestamp TIMESTAMPTZ DEFAULT now(),
          request_body_summary TEXT,
          metadata JSONB DEFAULT '{}'
        )`,
      );

      await pgConnection.raw(
        `INSERT INTO audit_log (
          id,
          action_type,
          resource,
          resource_id,
          actor_id,
          timestamp,
          request_body_summary,
          metadata
        ) VALUES (
          gen_random_uuid()::text,
          ?,
          ?,
          ?,
          ?,
          now(),
          ?,
          ?::jsonb
        )`,
        [method, resourcePath, resourceId, actorId, requestBodySummary, JSON.stringify({})],
      );
    } catch (err: any) {
      logger.error(`[admin-audit-log] write error: ${err.message}`);
    }
  });

  next();
}
