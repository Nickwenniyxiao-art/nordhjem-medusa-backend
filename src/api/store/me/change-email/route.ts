import { randomUUID } from "node:crypto";
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

async function ensureEmailChangeTable(pgConnection: any) {
  await pgConnection.raw(
    `CREATE TABLE IF NOT EXISTS email_change_request (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      customer_id TEXT NOT NULL,
      new_email TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      confirmed BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,
  );
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any;
  const eventBus = req.scope.resolve(Modules.EVENT_BUS) as any;

  const customerId = (req as any).auth_context?.actor_id;
  if (!customerId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const body = (req.body || {}) as { new_email?: string };
  const newEmail = body.new_email?.trim().toLowerCase();

  if (!newEmail) {
    return res.status(400).json({ error: "new_email is required" });
  }

  await ensureEmailChangeTable(pgConnection);

  const token = randomUUID();

  await pgConnection.raw(
    `INSERT INTO email_change_request (customer_id, new_email, token, expires_at, confirmed, created_at)
     VALUES (?, ?, ?, NOW() + INTERVAL '24 hours', false, NOW())`,
    [customerId, newEmail, token],
  );

  await eventBus.emit({
    name: "customer.email_change.requested",
    data: {
      customer_id: customerId,
      new_email: newEmail,
      token,
    },
  });

  return res.status(200).json({ message: "Verification email sent", token });
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any;
  const eventBus = req.scope.resolve(Modules.EVENT_BUS) as any;

  const token = (req.query.token as string | undefined)?.trim();

  if (!token) {
    return res.status(400).json({ error: "token is required" });
  }

  await ensureEmailChangeTable(pgConnection);

  const requestResult = await pgConnection.raw(
    `SELECT customer_id, new_email
     FROM email_change_request
     WHERE token = ?
       AND confirmed = false
       AND expires_at > NOW()
     LIMIT 1`,
    [token],
  );

  const requestRow = requestResult.rows?.[0];

  if (!requestRow) {
    return res.status(404).json({ error: "Invalid or expired token" });
  }

  await pgConnection.raw(`UPDATE customer SET email = ? WHERE id = ?`, [
    requestRow.new_email,
    requestRow.customer_id,
  ]);

  await pgConnection.raw(
    `UPDATE email_change_request
     SET confirmed = true
     WHERE token = ?`,
    [token],
  );

  await eventBus.emit({
    name: "customer.email_change.confirmed",
    data: {
      customer_id: requestRow.customer_id,
      new_email: requestRow.new_email,
      token,
    },
  });

  return res.status(200).json({ message: "Email updated successfully" });
}
