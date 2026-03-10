import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { randomUUID } from "crypto"

const ensureTables = async (pgConnection: any) => {
  await pgConnection.raw(
    `CREATE TABLE IF NOT EXISTS gift_card_transactions (
      id uuid PRIMARY KEY,
      gift_card_id uuid NOT NULL,
      cart_id text NOT NULL,
      amount numeric NOT NULL,
      status text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )`
  )

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
    )`
  )
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const body = (req.body || {}) as any
  const cartId = body.cart_id
  const giftCardCode = String(body.gift_card_code || "").toUpperCase()

  if (!cartId || !giftCardCode) {
    return res.status(400).json({ message: "cart_id and gift_card_code are required" })
  }

  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any
  const eventBus = req.scope.resolve(Modules.EVENT_BUS) as any

  await ensureTables(pgConnection)

  const cardResult = await pgConnection.raw(`SELECT * FROM gift_cards WHERE code = ? LIMIT 1`, [giftCardCode])
  const giftCard = cardResult.rows?.[0]

  if (!giftCard) {
    return res.status(404).json({ message: "gift card not found" })
  }

  if (!giftCard.is_active) {
    return res.status(400).json({ message: "gift card is inactive" })
  }

  if (giftCard.expires_at && new Date(giftCard.expires_at).getTime() < Date.now()) {
    return res.status(400).json({ message: "gift card has expired" })
  }

  const balance = Number(giftCard.balance || 0)
  if (balance <= 0) {
    return res.status(400).json({ message: "gift card balance is zero" })
  }

  const cartResult = await pgConnection.raw(`SELECT id, total, metadata FROM cart WHERE id = ? LIMIT 1`, [cartId])
  const cart = cartResult.rows?.[0]
  if (!cart) {
    return res.status(404).json({ message: "cart not found" })
  }

  const cartTotal = Math.max(Number(cart.total || 0), 0)
  const appliedAmount = cartTotal > 0 ? Math.min(balance, cartTotal) : balance

  await pgConnection.raw(
    `INSERT INTO gift_card_transactions (id, gift_card_id, cart_id, amount, status)
     VALUES (?, ?, ?, ?, ?)`,
    [randomUUID(), giftCard.id, cartId, appliedAmount, "pending"]
  )

  await pgConnection.raw(
    `UPDATE cart
     SET metadata = COALESCE(metadata, '{}'::jsonb) || ?::jsonb
     WHERE id = ?`,
    [JSON.stringify({ gift_card: { code: giftCardCode, applied_amount: appliedAmount } }), cartId]
  )

  await eventBus.emit({
    name: "gift_card.applied",
    data: {
      gift_card_id: giftCard.id,
      cart_id: cartId,
      code: giftCardCode,
      applied_amount: appliedAmount,
    },
  })

  return res.status(200).json({
    applied: true,
    gift_card_code: giftCardCode,
    balance_remaining: balance,
    applied_amount: appliedAmount,
  })
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const cartId = (req.query.cart_id as string) || ""
  if (!cartId) {
    return res.status(400).json({ message: "cart_id is required" })
  }

  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any
  await ensureTables(pgConnection)

  const cartResult = await pgConnection.raw(`SELECT metadata FROM cart WHERE id = ? LIMIT 1`, [cartId])
  const txResult = await pgConnection.raw(
    `SELECT gct.*, gc.code
     FROM gift_card_transactions gct
     JOIN gift_cards gc ON gc.id = gct.gift_card_id
     WHERE gct.cart_id = ?
     ORDER BY gct.created_at DESC`,
    [cartId]
  )

  return res.status(200).json({
    cart_id: cartId,
    gift_card: cartResult.rows?.[0]?.metadata?.gift_card || null,
    transactions: txResult.rows || [],
  })
}
