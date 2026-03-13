import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { randomUUID } from "crypto"

const ensureTable = async (pgConnection: any) => {
  await pgConnection.raw(
    `CREATE TABLE IF NOT EXISTS stock_reservations (
      id uuid PRIMARY KEY,
      cart_id text NOT NULL,
      variant_id text NOT NULL,
      quantity integer NOT NULL,
      expires_at timestamptz NOT NULL,
      status text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )`
  )
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const body = (req.body || {}) as any
  const cartId = body.cart_id

  if (!cartId) {
    return res.status(400).json({ message: "cart_id is required" })
  }

  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any
  const eventBus = req.scope.resolve(Modules.EVENT_BUS) as any

  await ensureTable(pgConnection)

  const lineItemsResult = await pgConnection.raw(
    `SELECT variant_id, quantity
     FROM cart_line_item
     WHERE cart_id = ?`,
    [cartId]
  )
  const lineItems = (lineItemsResult.rows || []).filter(
    (item: any) => item.variant_id && Number(item.quantity) > 0
  )

  if (!lineItems.length) {
    return res.status(404).json({ message: "no reservable line items found" })
  }

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()
  const reservationId = randomUUID()

  for (const item of lineItems) {
    await pgConnection.raw(
      `INSERT INTO stock_reservations (id, cart_id, variant_id, quantity, expires_at, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [randomUUID(), cartId, item.variant_id, Number(item.quantity), expiresAt, "active"]
    )
  }

  await eventBus.emit({
    name: "checkout.stock_reserved",
    data: {
      reservation_id: reservationId,
      cart_id: cartId,
      items_reserved: lineItems.length,
      expires_at: expiresAt,
    },
  })

  return res.status(200).json({
    reservation_id: reservationId,
    items_reserved: lineItems.length,
    expires_at: expiresAt,
  })
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const cartId = (req.query.cart_id as string) || ""

  if (!cartId) {
    return res.status(400).json({ message: "cart_id is required" })
  }

  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any
  await ensureTable(pgConnection)

  await pgConnection.raw(
    `UPDATE stock_reservations
     SET status = 'expired'
     WHERE cart_id = ? AND status = 'active'`,
    [cartId]
  )

  return res.status(200).json({ released: true })
}
