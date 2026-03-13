import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

async function ensureDeadLetterTable(pgConnection: any) {
  await pgConnection.raw(
    `CREATE TABLE IF NOT EXISTS webhook_dead_letter (
      id UUID PRIMARY KEY,
      provider VARCHAR(32) NOT NULL,
      event_type VARCHAR(128) NOT NULL,
      event_id VARCHAR(128) NOT NULL UNIQUE,
      payload_json JSONB NOT NULL DEFAULT '{}'::jsonb,
      error_message TEXT,
      retry_count INT NOT NULL DEFAULT 0,
      last_retry_at TIMESTAMPTZ,
      status VARCHAR(32) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
  );
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as any;
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any;

  const query = req.query as any;
  const status = query.status ? String(query.status) : null;
  const limit = Math.min(200, Number.parseInt(String(query.limit || "50"), 10) || 50);
  const offset = Number.parseInt(String(query.offset || "0"), 10) || 0;

  try {
    await ensureDeadLetterTable(pgConnection);

    let sql = `SELECT * FROM webhook_dead_letter WHERE 1=1`;
    const params: any[] = [];

    if (status) {
      sql += ` AND status = ?`;
      params.push(status);
    }

    sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const result = await pgConnection.raw(sql, params);

    let countSql = `SELECT COUNT(*)::int AS count FROM webhook_dead_letter WHERE 1=1`;
    const countParams: any[] = [];
    if (status) {
      countSql += ` AND status = ?`;
      countParams.push(status);
    }

    const countResult = await pgConnection.raw(countSql, countParams);

    return res.status(200).json({
      events: result?.rows || [],
      count: Number(countResult?.rows?.[0]?.count || 0),
    });
  } catch (err: any) {
    logger.error(`[admin-webhook-dead-letter] GET error: ${err.message}`);
    return res.status(500).json({ error: "Failed to fetch dead-letter events" });
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as any;
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any;
  const eventBus = req.scope.resolve(Modules.EVENT_BUS) as any;

  const body = (req.body || {}) as any;
  const eventId = String(body.event_id || "").trim();

  if (!eventId) {
    return res.status(400).json({ error: "event_id is required" });
  }

  try {
    await ensureDeadLetterTable(pgConnection);

    const existing = await pgConnection.raw(
      `SELECT * FROM webhook_dead_letter WHERE event_id = ? LIMIT 1`,
      [eventId],
    );

    const eventRow = existing?.rows?.[0];
    if (!eventRow) {
      return res.status(404).json({ error: "Dead-letter event not found" });
    }

    const newRetryCount = Number(eventRow.retry_count || 0) + 1;
    const newStatus = newRetryCount >= 5 ? "exhausted" : "retrying";

    await eventBus.emit(String(eventRow.event_type), eventRow.payload_json || {});

    await pgConnection.raw(
      `UPDATE webhook_dead_letter
       SET retry_count = ?, last_retry_at = NOW(), status = ?
       WHERE event_id = ?`,
      [newRetryCount, newStatus, eventId],
    );

    return res.status(200).json({ retried: true, new_status: newStatus });
  } catch (err: any) {
    logger.error(`[admin-webhook-dead-letter] POST error: ${err.message}`);
    return res.status(500).json({ error: "Failed to retry dead-letter event" });
  }
}
