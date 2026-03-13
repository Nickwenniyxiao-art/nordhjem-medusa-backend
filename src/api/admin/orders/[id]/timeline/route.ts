import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

type TimelineEvent = {
  type: string
  timestamp: string
  description: string
  actor: string | null
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any
  const orderId = req.params.id

  const orderResult = await pgConnection.raw(
    `SELECT id, status, created_at, updated_at, canceled_at FROM "order" WHERE id = ? LIMIT 1`,
    [orderId]
  )

  const order = orderResult?.rows?.[0]
  if (!order) {
    return res.status(404).json({ error: "Order not found" })
  }

  const events: TimelineEvent[] = []

  // 1. Order created
  events.push({
    type: "order.created",
    timestamp: order.created_at,
    description: "Order was created",
    actor: null,
  })

  // 2. Order notes
  try {
    const notesResult = await pgConnection.raw(
      `SELECT content, author, created_at FROM order_note WHERE order_id = ? ORDER BY created_at ASC`,
      [orderId]
    )
    for (const note of notesResult?.rows || []) {
      events.push({
        type: "order.note_added",
        timestamp: note.created_at,
        description: `Note: ${note.content}`,
        actor: note.author || null,
      })
    }
  } catch {
    // order_note table may not exist yet
  }

  // 3. Return requests
  try {
    const returnsResult = await pgConnection.raw(
      `SELECT id, status, created_at FROM "return" WHERE order_id = ? ORDER BY created_at ASC`,
      [orderId]
    )
    for (const ret of returnsResult?.rows || []) {
      events.push({
        type: "order.return_requested",
        timestamp: ret.created_at,
        description: `Return request ${ret.id} created (status: ${ret.status})`,
        actor: null,
      })
    }
  } catch {
    // return table may not exist
  }

  // 4. Exchanges
  try {
    const exchangesResult = await pgConnection.raw(
      `SELECT id, status, created_at FROM order_exchange WHERE order_id = ? ORDER BY created_at ASC`,
      [orderId]
    )
    for (const exch of exchangesResult?.rows || []) {
      events.push({
        type: "order.exchange_created",
        timestamp: exch.created_at,
        description: `Exchange ${exch.id} created (status: ${exch.status})`,
        actor: null,
      })
    }
  } catch {
    // order_exchange table may not exist
  }

  // 5. Payment captures
  try {
    const paymentsResult = await pgConnection.raw(
      `SELECT pc.id, pc.amount, pc.created_at
       FROM payment_capture pc
       JOIN payment p ON p.id = pc.payment_id
       JOIN payment_collection pcol ON pcol.id = p.payment_collection_id
       JOIN order_payment_collection opc ON opc.payment_collection_id = pcol.id
       WHERE opc.order_id = ?
       ORDER BY pc.created_at ASC`,
      [orderId]
    )
    for (const capture of paymentsResult?.rows || []) {
      events.push({
        type: "order.payment_captured",
        timestamp: capture.created_at,
        description: `Payment captured: ${capture.amount}`,
        actor: null,
      })
    }
  } catch {
    // payment tables may not exist in all setups
  }

  // 6. Fulfillments
  try {
    const fulfillmentsResult = await pgConnection.raw(
      `SELECT id, created_at, shipped_at, delivered_at FROM fulfillment WHERE order_id = ? ORDER BY created_at ASC`,
      [orderId]
    )
    for (const ful of fulfillmentsResult?.rows || []) {
      events.push({
        type: "order.fulfillment_created",
        timestamp: ful.created_at,
        description: `Fulfillment ${ful.id} created`,
        actor: null,
      })
      if (ful.shipped_at) {
        events.push({
          type: "order.shipped",
          timestamp: ful.shipped_at,
          description: `Fulfillment ${ful.id} shipped`,
          actor: null,
        })
      }
      if (ful.delivered_at) {
        events.push({
          type: "order.delivered",
          timestamp: ful.delivered_at,
          description: `Fulfillment ${ful.id} delivered`,
          actor: null,
        })
      }
    }
  } catch {
    // fulfillment table may not exist
  }

  // 7. Canceled
  if (order.canceled_at) {
    events.push({
      type: "order.canceled",
      timestamp: order.canceled_at,
      description: "Order was canceled",
      actor: null,
    })
  }

  // Sort chronologically
  events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  return res.status(200).json({ events })
}
