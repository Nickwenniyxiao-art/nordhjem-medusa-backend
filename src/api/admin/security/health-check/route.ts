import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

function envEnabled(name: string) {
  const value = process.env[name];
  if (!value) {
    return false;
  }
  return ["1", "true", "yes", "enabled", "on"].includes(value.toLowerCase());
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const pgConnection = req.scope.resolve("pgConnection") as any;

    const middlewareText = await pgConnection.raw(
      `SELECT to_regclass('public.audit_log')::text AS audit_log_table`,
    );

    const rateLimitingEnabled =
      envEnabled("RATE_LIMIT_ENABLED") || envEnabled("MEDUSA_RATE_LIMIT_ENABLED");

    const corsConfigured =
      Boolean(process.env.STORE_CORS) ||
      Boolean(process.env.ADMIN_CORS) ||
      Boolean(process.env.AUTH_CORS);

    const helmetEnabled = envEnabled("HELMET_ENABLED") || envEnabled("MEDUSA_HELMET_ENABLED");
    const auditLoggingEnabled = Boolean(middlewareText?.rows?.[0]?.audit_log_table);

    return res.status(200).json({
      rate_limiting_enabled: rateLimitingEnabled,
      cors_configured: corsConfigured,
      helmet_enabled: helmetEnabled,
      audit_logging_enabled: auditLoggingEnabled,
    });
  } catch (err: any) {
    console.error("[security][health-check][GET]", err);
    return res.status(500).json({ error: "Failed to run security health check" });
  }
}
