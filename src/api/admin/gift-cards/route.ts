import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { randomBytes, randomUUID } from "crypto";

const ensureTable = async (pgConnection: any) => {
  await pgConnection.raw(
    `CREATE TABLE IF NOT EXISTS gift_cards (
      id uuid PRIMARY KEY,
      code varchar(16) UNIQUE NOT NULL,
      value numeric NOT NULL,
      balance numeric NOT NULL,
      currency_code text NOT NULL DEFAULT 'usd',
      is_active boolean NOT NULL DEFAULT true,
      expires_at timestamptz,
      metadata jsonb,
      created_at timestamptz NOT NULL DEFAULT now()
    )`,
  );
};

const generateCode = () => randomBytes(8).toString("hex").toUpperCase();

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const body = (req.body || {}) as any;
  const value = Number(body.value);

  if (!value || value <= 0) {
    return res.status(400).json({ message: "value must be a positive number" });
  }

  const currencyCode = String(body.currency_code || "usd").toLowerCase();
  const expiresAt = body.expires_at ? new Date(body.expires_at) : null;

  if (expiresAt && Number.isNaN(expiresAt.getTime())) {
    return res.status(400).json({ message: "expires_at is invalid" });
  }

  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any;
  const eventBus = req.scope.resolve(Modules.EVENT_BUS) as any;

  await ensureTable(pgConnection);

  let code = generateCode();
  let inserted;

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      inserted = await pgConnection.raw(
        `INSERT INTO gift_cards (id, code, value, balance, currency_code, expires_at, metadata)
         VALUES (?, ?, ?, ?, ?, ?, ?::jsonb)
         RETURNING *`,
        [
          randomUUID(),
          code,
          value,
          value,
          currencyCode,
          expiresAt ? expiresAt.toISOString() : null,
          JSON.stringify(body.metadata || {}),
        ],
      );
      break;
    } catch (error: any) {
      if (error?.message?.includes("gift_cards_code_key")) {
        code = generateCode();
        continue;
      }
      throw error;
    }
  }

  if (!inserted?.rows?.[0]) {
    return res.status(500).json({ message: "failed to create gift card" });
  }

  const giftCard = inserted.rows[0];

  await eventBus.emit({
    name: "gift_card.created",
    data: {
      gift_card_id: giftCard.id,
      code: giftCard.code,
      value: giftCard.value,
      currency_code: giftCard.currency_code,
    },
  });

  return res.status(200).json({ gift_card: giftCard });
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const limit = Number(req.query.limit || 50);
  const offset = Number(req.query.offset || 0);

  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any;
  await ensureTable(pgConnection);

  const rowsResult = await pgConnection.raw(
    `SELECT * FROM gift_cards ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [limit, offset],
  );
  const countResult = await pgConnection.raw(`SELECT COUNT(*)::int AS count FROM gift_cards`);

  return res.status(200).json({
    gift_cards: rowsResult.rows || [],
    count: countResult.rows?.[0]?.count || 0,
    limit,
    offset,
  });
};
