import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { randomUUID } from "crypto"

const ensureTable = async (pgConnection: any) => {
  await pgConnection.raw(
    `CREATE TABLE IF NOT EXISTS checkout_shipping_addresses (
      id uuid PRIMARY KEY,
      cart_id text NOT NULL,
      line_item_id text NOT NULL,
      address_json jsonb NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )`
  )
}

const toAddressGroups = (rows: any[]) => {
  const grouped = new Map<string, { address: any; line_item_ids: string[]; estimated_items_count: number }>()

  for (const row of rows) {
    const address = row.address_json
    const key = JSON.stringify(address)
    const existing = grouped.get(key)

    if (existing) {
      existing.line_item_ids.push(row.line_item_id)
      existing.estimated_items_count += 1
      continue
    }

    grouped.set(key, {
      address,
      line_item_ids: [row.line_item_id],
      estimated_items_count: 1,
    })
  }

  return Array.from(grouped.values())
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const body = (req.body || {}) as any
  const cartId = body.cart_id
  const items = Array.isArray(body.items) ? body.items : []

  if (!cartId || !items.length) {
    return res.status(400).json({ message: "cart_id and items are required" })
  }

  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any

  await ensureTable(pgConnection)
  await pgConnection.raw(`DELETE FROM checkout_shipping_addresses WHERE cart_id = ?`, [cartId])

  for (const item of items) {
    if (!item?.line_item_id || !item?.address) {
      continue
    }

    await pgConnection.raw(
      `INSERT INTO checkout_shipping_addresses (id, cart_id, line_item_id, address_json)
       VALUES (?, ?, ?, ?::jsonb)`,
      [randomUUID(), cartId, item.line_item_id, JSON.stringify(item.address)]
    )
  }

  const result = await pgConnection.raw(
    `SELECT line_item_id, address_json
     FROM checkout_shipping_addresses
     WHERE cart_id = ?
     ORDER BY created_at ASC`,
    [cartId]
  )

  return res.status(200).json({
    address_groups: toAddressGroups(result.rows || []),
  })
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const cartId = (req.query.cart_id as string) || ""
  if (!cartId) {
    return res.status(400).json({ message: "cart_id is required" })
  }

  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any
  await ensureTable(pgConnection)

  const result = await pgConnection.raw(
    `SELECT line_item_id, address_json
     FROM checkout_shipping_addresses
     WHERE cart_id = ?
     ORDER BY created_at ASC`,
    [cartId]
  )

  return res.status(200).json({
    address_groups: toAddressGroups(result.rows || []),
  })
}
