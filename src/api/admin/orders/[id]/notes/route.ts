import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils";

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS order_note (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    order_id TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    metadata JSONB DEFAULT '{}'
  )
`;

async function ensureOrderNoteTable(pgConnection: any) {
  await pgConnection.raw(CREATE_TABLE_SQL);
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any;
  const orderId = req.params.id;

  await ensureOrderNoteTable(pgConnection);

  const result = await pgConnection.raw(
    `SELECT id, order_id, content, author, created_at, metadata
     FROM order_note
     WHERE order_id = ?
     ORDER BY created_at DESC`,
    [orderId],
  );

  return res.status(200).json({ notes: result?.rows || [] });
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any;
  const eventBus = req.scope.resolve(Modules.EVENT_BUS) as any;
  const orderId = req.params.id;

  const { content, author, metadata = {} } = (req.body || {}) as Record<string, any>;

  if (!content || !author) {
    return res.status(400).json({ error: "content and author are required" });
  }

  await ensureOrderNoteTable(pgConnection);

  const insertResult = await pgConnection.raw(
    `INSERT INTO order_note (order_id, content, author, metadata)
     VALUES (?, ?, ?, ?::jsonb)
     RETURNING id, order_id, content, author, created_at, metadata`,
    [orderId, content, author, JSON.stringify(metadata || {})],
  );

  const note = insertResult?.rows?.[0];

  await eventBus.emit("order.note.created", {
    order_id: orderId,
    note,
  });

  return res.status(201).json({ note });
}
