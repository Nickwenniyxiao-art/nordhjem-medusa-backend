import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

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
    )`,
  );
}

async function seedDefaultMethod(pgConnection: any) {
  const result = await pgConnection.raw(
    `SELECT COUNT(*)::int AS count FROM payment_methods_config`,
  );
  const count = Number(result?.rows?.[0]?.count || 0);
  if (count > 0) {
    return;
  }

  await pgConnection.raw(
    `INSERT INTO payment_methods_config
      (id, provider_id, display_name, is_enabled, config_json, priority)
     VALUES (?, ?, ?, ?, ?::jsonb, ?),
            (?, ?, ?, ?, ?::jsonb, ?)`,
    [
      crypto.randomUUID(),
      "stripe",
      "Credit Card (Stripe)",
      true,
      JSON.stringify({}),
      1,
      crypto.randomUUID(),
      "paypal",
      "PayPal (Coming Soon)",
      false,
      JSON.stringify({ mode: "placeholder" }),
      2,
    ],
  );
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as any;
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any;

  try {
    await ensureMethodsTable(pgConnection);
    await seedDefaultMethod(pgConnection);

    const result = await pgConnection.raw(
      `SELECT id, provider_id, display_name, is_enabled, config_json, priority, created_at, updated_at
       FROM payment_methods_config
       ORDER BY priority ASC, created_at ASC`,
    );

    return res.status(200).json({ methods: result?.rows || [] });
  } catch (err: any) {
    logger.error(`[admin-payment-methods] GET error: ${err.message}`);
    return res.status(500).json({ error: "Failed to fetch payment methods" });
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as any;
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any;
  const eventBus = req.scope.resolve(Modules.EVENT_BUS) as any;

  const body = (req.body || {}) as any;
  const providerId = String(body.provider_id || "")
    .trim()
    .toLowerCase();
  const displayName = String(body.display_name || "").trim();
  const isEnabled = Boolean(body.is_enabled);
  const priority = Number.isFinite(Number(body.priority)) ? Number(body.priority) : 100;
  const config = body.config && typeof body.config === "object" ? body.config : {};

  if (!providerId || !displayName) {
    return res.status(400).json({ error: "provider_id and display_name are required" });
  }

  try {
    await ensureMethodsTable(pgConnection);

    const existing = await pgConnection.raw(
      `SELECT id FROM payment_methods_config WHERE provider_id = ? LIMIT 1`,
      [providerId],
    );

    if (existing?.rows?.length) {
      await pgConnection.raw(
        `UPDATE payment_methods_config
         SET display_name = ?, is_enabled = ?, config_json = ?::jsonb, priority = ?, updated_at = NOW()
         WHERE provider_id = ?`,
        [displayName, isEnabled, JSON.stringify(config), priority, providerId],
      );
    } else {
      await pgConnection.raw(
        `INSERT INTO payment_methods_config
          (id, provider_id, display_name, is_enabled, config_json, priority)
         VALUES (?, ?, ?, ?, ?::jsonb, ?)`,
        [crypto.randomUUID(), providerId, displayName, isEnabled, JSON.stringify(config), priority],
      );
    }

    const result = await pgConnection.raw(
      `SELECT id, provider_id, display_name, is_enabled, config_json, priority, created_at, updated_at
       FROM payment_methods_config
       WHERE provider_id = ?
       LIMIT 1`,
      [providerId],
    );

    const method = result?.rows?.[0] || null;

    await eventBus.emit("payment.method_updated", {
      provider_id: providerId,
      display_name: displayName,
      is_enabled: isEnabled,
      priority,
      metadata: {
        actor_id: (req as any).auth_context?.actor_id || null,
        ip_address: req.ip || null,
      },
    });

    return res.status(200).json({ method });
  } catch (err: any) {
    logger.error(`[admin-payment-methods] POST error: ${err.message}`);
    return res.status(500).json({ error: "Failed to upsert payment method" });
  }
}
