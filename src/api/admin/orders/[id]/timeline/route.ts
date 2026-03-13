import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

interface TimelineEvent {
  type: string
  timestamp: string
  description: string
  actor: string | null
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any
  const orderId = req.params.id

  // Verify order exists
  const orderResult = await pgConnection.raw(
    `SELECT id, status, created_at, updated_at, canceled_at FROM "order" WHERE id = ?`,
    [orderId]
  )
  const order = orderResult?.rows?.[0]

  if (!order) {
    return res.status(404).json({ error: "Order not found" })
  }

  const events: TimelineEvent[] = []

  // 1. Order created event
  events.push({
    type: "order.created",
    timestamp: order.created_at,
    description: "Order was placed",
    actor: null,
  })

  // 2. Order canceled event (if applicable)
  if (order.canceled_at) {
    events.push({
      type: "order.canceled",
      timestamp: order.canceled_at,
      description: "Order was canceled",
      actor: null,
    })
  }

  // 3. Notes
  try {
    const notesResult = await pgConnection.raw(
      `SELECT id, content, author, created_at FROM order_note WHERE order_id = ? ORDER BY created_at ASC`,
      [orderId]
    )
    for (const note of notesResult?.rows || []) {
      events.push({
        type: "order.note_added",
        timestamp: note.created_at,
        description: `Note added: ${note.content}`,
        actor: note.author || null,
      })
    }
  } catch {
    // order_note table may not exist yet – skip
  }

  // 4. Return requests
  try {
    const returnsResult = await pgConnection.raw(
      `SELECT id, status, reason, created_at FROM "return" WHERE order_id = ? ORDER BY created_at ASC`,
      [orderId]
    )
    for (const ret of returnsResult?.rows || []) {
      events.push({
        type: "order.return_requested",
        timestamp: ret.created_at,
        description: `Return requested${ret.reason ? ": " + ret.reason : ""}`,
        actor: null,
      })
    }
  } catch {
    // return table may not exist – skip
  }

  // 5. Exchanges
  try {
    const exchangesResult = await pgConnection.raw(
      `SELECT id, created_at FROM "order_exchange" WHERE order_id = ? ORDER BY created_at ASC`,
      [orderId]
    )
    for (const exchange of exchangesResult?.rows || []) {
      events.push({
        type: "order.exchange_created",
        timestamp: exchange.created_at,
        description: "Exchange was created",
        actor: null,
      })
    }
  } catch {
    // order_exchange table may not exist – skip
  }

  // 6. Fulfillments
  try {
    const fulfillmentsResult = await pgConnection.raw(
      `SELECT id, created_at, shipped_at, delivered_at FROM "fulfillment" WHERE order_id = ? ORDER BY created_at ASC`,
      [orderId]
    )
    for (const ful of fulfillmentsResult?.rows || []) {
      events.push({
        type: "order.fulfillment_created",
        timestamp: ful.created_at,
        description: "Fulfillment created",
        actor: null,
      })
      if (ful.shipped_at) {
        events.push({
          type: "order.shipped",
          timestamp: ful.shipped_at,
          description: "Order was shipped",
          actor: null,
        })
      }
      if (ful.delivered_at) {
        events.push({
          type: "order.delivered",
          timestamp: ful.delivered_at,
          description: "Order was delivered",
          actor: null,
        })
      }
    }
  } catch {
    // fulfillment table may not exist – skip
  }

  // 7. Payment captures
  try {
    const paymentsResult = await pgConnection.raw(
      `SELECT id, captured_at, created_at FROM "payment" WHERE order_id = ? ORDER BY created_at ASC`,
      [orderId]
    )
    for (const payment of paymentsResult?.rows || []) {
      if (payment.captured_at) {
        events.push({
          type: "payment.captured",
          timestamp: payment.captured_at,
          description: "Payment was captured",
          actor: null,
        })
      }
    }
  } catch {
    // payment table may not exist in this schema – skip
  }

  // Sort chronologically
  events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  return res.status(200).json({ events })
}
