import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import Stripe from "stripe"

function toMinorUnit(amount: number) {
  return Math.round(amount * 100)
}

async function ensureRefundTable(pgConnection: any) {
  await pgConnection.raw(
    `CREATE TABLE IF NOT EXISTS refund_records (
      id UUID PRIMARY KEY,
      order_id VARCHAR(64) NOT NULL,
      payment_intent_id VARCHAR(128) NOT NULL,
      stripe_refund_id VARCHAR(128),
      amount INT NOT NULL,
      currency_code VARCHAR(16) NOT NULL,
      reason TEXT NOT NULL,
      note TEXT,
      status VARCHAR(32) NOT NULL,
      ticket_id VARCHAR(64),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`
  )
}

async function resolvePaymentIntentId(pgConnection: any, orderId: string) {
  const result = await pgConnection.raw(
    `SELECT p.data
     FROM payment p
     WHERE p.payment_collection_id IN (
       SELECT opc.payment_collection_id
       FROM order_payment_collection opc
       WHERE opc.order_id = ?
     )
     ORDER BY p.created_at DESC
     LIMIT 1`,
    [orderId]
  )

  const data = result?.rows?.[0]?.data || {}
  return String(data.id || data.payment_intent || data.payment_intent_id || "")
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as any
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any
  const orderService = req.scope.resolve(Modules.ORDER) as any
  const eventBus = req.scope.resolve(Modules.EVENT_BUS) as any

  const body = (req.body || {}) as any
  const orderId = String(body.order_id || "").trim()
  const amountMajor = Number(body.amount || 0)
  const reason = String(body.reason || "").trim()
  const note = body.note ? String(body.note) : null
  const ticketId = body.ticket_id ? String(body.ticket_id) : null

  if (!orderId || !reason || !Number.isFinite(amountMajor) || amountMajor <= 0) {
    return res.status(400).json({ error: "order_id, amount, reason are required" })
  }

  try {
    await ensureRefundTable(pgConnection)

    const order = await orderService.retrieveOrder(orderId)
    if (!order) {
      return res.status(404).json({ error: "Order not found" })
    }

    const paymentIntentId = await resolvePaymentIntentId(pgConnection, orderId)
    if (!paymentIntentId) {
      return res.status(400).json({ error: "No Stripe Payment Intent found for order" })
    }

    const stripeApiKey = process.env.STRIPE_API_KEY
    if (!stripeApiKey) {
      return res.status(500).json({ error: "STRIPE_API_KEY not configured" })
    }

    const stripe = new Stripe(stripeApiKey)
    const refundResult = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: toMinorUnit(amountMajor),
      reason: "requested_by_customer",
      metadata: {
        order_id: orderId,
        note: note || "",
      },
    })

    const id = crypto.randomUUID()
    const currencyCode = String(refundResult.currency || order.currency_code || "usd")
    const status = String(refundResult.status || "pending")

    await pgConnection.raw(
      `INSERT INTO refund_records
        (id, order_id, payment_intent_id, stripe_refund_id, amount, currency_code, reason, note, status, ticket_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        orderId,
        paymentIntentId,
        refundResult.id,
        toMinorUnit(amountMajor),
        currencyCode,
        reason,
        note,
        status,
        ticketId,
      ]
    )

    await eventBus.emit("refund.created", {
      id,
      order_id: orderId,
      amount: toMinorUnit(amountMajor),
      currency_code: currencyCode,
      stripe_refund_id: refundResult.id,
      status,
      metadata: {
        actor_id: (req as any).auth_context?.actor_id || null,
        ip_address: req.ip || null,
      },
    })

    return res.status(200).json({
      refund: {
        id,
        order_id: orderId,
        amount: toMinorUnit(amountMajor),
        status,
        stripe_refund_id: refundResult.id,
      },
    })
  } catch (err: any) {
    logger.error(`[admin-refunds] POST error: ${err.message}`)
    return res.status(500).json({ error: "Failed to create refund" })
  }
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as any
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any

  const query = req.query as any
  const orderId = query.order_id ? String(query.order_id) : null
  const limit = Math.min(200, Number.parseInt(String(query.limit || "50"), 10) || 50)
  const offset = Number.parseInt(String(query.offset || "0"), 10) || 0

  try {
    await ensureRefundTable(pgConnection)

    let sql = `SELECT * FROM refund_records WHERE 1=1`
    const params: any[] = []

    if (orderId) {
      sql += ` AND order_id = ?`
      params.push(orderId)
    }

    sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`
    params.push(limit, offset)

    const result = await pgConnection.raw(sql, params)

    let countSql = `SELECT COUNT(*)::int AS count FROM refund_records WHERE 1=1`
    const countParams: any[] = []
    if (orderId) {
      countSql += ` AND order_id = ?`
      countParams.push(orderId)
    }

    const countResult = await pgConnection.raw(countSql, countParams)

    return res.status(200).json({
      refunds: result?.rows || [],
      count: Number(countResult?.rows?.[0]?.count || 0),
    })
  } catch (err: any) {
    logger.error(`[admin-refunds] GET error: ${err.message}`)
    return res.status(500).json({ error: "Failed to query refunds" })
  }
}
