import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";
import { TICKET_MODULE } from "../../../../../modules/ticket";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const ticketService = req.scope.resolve(TICKET_MODULE) as any;

  try {
    await ticketService.retrieveTicket(req.params.id);
    const messages = await ticketService.listTicketMessages(
      { ticket_id: req.params.id },
      { order: { created_at: "ASC" } },
    );

    return res.status(200).json({ messages });
  } catch (err: any) {
    if (err.message?.includes("does not exist")) {
      return res.status(200).json({ note: "ticket tables not yet created. Run migrations." });
    }

    if (err.message?.toLowerCase().includes("not found")) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    return res.status(500).json({ error: "Failed to list messages" });
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const ticketService = req.scope.resolve(TICKET_MODULE) as any;
  const eventBus = req.scope.resolve(Modules.EVENT_BUS) as any;

  const { sender_type, sender_id, body, metadata } = req.body as Record<string, any>;

  if (!body?.trim()) {
    return res.status(400).json({ error: "Message body required" });
  }

  if (!["customer", "admin"].includes(sender_type)) {
    return res.status(400).json({ error: "Invalid sender_type" });
  }

  try {
    await ticketService.retrieveTicket(req.params.id);

    const message = await ticketService.createTicketMessages({
      ticket_id: req.params.id,
      sender_type,
      sender_id: sender_id || null,
      body,
      metadata: metadata || null,
    });

    await eventBus.emit("ticket.message_sent", {
      id: message.id,
      ticket_id: req.params.id,
    });

    return res.status(200).json({ message });
  } catch (err: any) {
    if (err.message?.toLowerCase().includes("not found")) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    return res.status(500).json({ error: "Failed to send message" });
  }
}
