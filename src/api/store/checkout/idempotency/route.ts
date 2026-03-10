import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { randomUUID } from "crypto"

const ensureTable = async (pgConnection: any) => {
  await pgConnection.raw(
    `CREATE TABLE IF NOT EXISTS checkout_idempotency (
      id uuid PRIMARY KEY,
      cart_id text NOT NULL,
      idempotency_key text UNIQUE NOT NULL,
      status text NOT NULL,
      result_json jsonb,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )`
  )
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const body = (req.body || {}) as any
  const cartId = body.cart_id
  const idempotencyKey = body.idempotency_key

  if (!cartId || !idempotencyKey) {
    return res.status(400).json({ message: "cart_id and idempotency_key are required" })
  }

  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any
  await ensureTable(pgConnection)

  const existingResult = await pgConnection.raw(
    `SELECT * FROM checkout_idempotency WHERE idempotency_key = ? LIMIT 1`,
    [idempotencyKey]
  )
  const existing = existingResult.rows?.[0]

  if (existing?.status === "completed") {
    return res.status(200).json({
      is_duplicate: true,
      previous_result: existing.result_json || {},
    })
  }

  if (existing?.status === "processing") {
    return res.status(409).json({
      message: "request with this idempotency_key is processing",
      is_duplicate: true,
    })
  }

  if (existing?.status === "failed") {
    await pgConnection.raw(
      `UPDATE checkout_idempotency
       SET cart_id = ?, status = 'processing', result_json = NULL, updated_at = now()
       WHERE idempotency_key = ?`,
      [cartId, idempotencyKey]
    )
  } else {
    await pgConnection.raw(
      `INSERT INTO checkout_idempotency (id, cart_id, idempotency_key, status)
       VALUES (?, ?, ?, 'processing')`,
      [randomUUID(), cartId, idempotencyKey]
    )
  }

  return res.status(200).json({ is_duplicate: false })
}
