import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { TICKET_MODULE } from "../../../../modules/ticket"

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  open: ["in_progress", "resolved", "closed", "refunded"],
  in_progress: ["resolved", "closed", "refunded"],
  resolved: ["closed", "open", "refunded"],
  closed: ["open"],
  refunded: ["closed", "open"],
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const ticketService = req.scope.resolve(TICKET_MODULE) as any

  try {
    const ticket = await ticketService.retrieveTicket(req.params.id)
    const messages = await ticketService.listTicketMessages(
      { ticket_id: req.params.id },
      { order: { created_at: "ASC" } }
    )

    return res.status(200).json({ ticket, messages })
  } catch (err: any) {
    if (err.message?.includes("does not exist")) {
      return res.status(200).json({ note: "ticket tables not yet created. Run migrations." })
    }

    if (err.message?.toLowerCase().includes("not found")) {
      return res.status(404).json({ error: "Ticket not found" })
    }

    return res.status(500).json({ error: "Failed to retrieve ticket" })
  }
}

export async function PATCH(req: MedusaRequest, res: MedusaResponse) {
  const ticketService = req.scope.resolve(TICKET_MODULE) as any
  const eventBus = req.scope.resolve(Modules.EVENT_BUS) as any

  try {
    const ticket = await ticketService.retrieveTicket(req.params.id)
    const body = req.body as any
    const nextStatus = body?.status as string | undefined

    const patch: Record<string, unknown> = {
      ...(body?.priority ? { priority: body.priority } : {}),
      ...(body?.subject ? { subject: body.subject } : {}),
      ...(body?.description !== undefined ? { description: body.description } : {}),
      ...(body?.metadata !== undefined ? { metadata: body.metadata } : {}),
      ...(nextStatus ? { status: nextStatus } : {}),
    }

    if (nextStatus && nextStatus !== ticket.status) {
      if (!ALLOWED_TRANSITIONS[ticket.status]?.includes(nextStatus)) {
        return res.status(400).json({ error: "Invalid status transition" })
      }

      if (nextStatus === "resolved") {
        patch.resolved_at = new Date()
      }

      if (nextStatus === "closed") {
        patch.closed_at = new Date()
      }

      if (nextStatus === "open") {
        patch.closed_at = null
      }
    }

    const updated = await ticketService.updateTickets(req.params.id, patch)

    if (nextStatus && nextStatus !== ticket.status) {
      await eventBus.emit("ticket.status_changed", {
        id: ticket.id,
        old_status: ticket.status,
        new_status: nextStatus,
      })

      await eventBus.emit("ticket.status.changed", {
        id: ticket.id,
        old_status: ticket.status,
        new_status: nextStatus,
      })
    }

    return res.status(200).json({ ticket: updated })
  } catch (err: any) {
    if (err.message?.toLowerCase().includes("not found")) {
      return res.status(404).json({ error: "Ticket not found" })
    }

    return res.status(500).json({ error: "Failed to update ticket" })
  }
}
