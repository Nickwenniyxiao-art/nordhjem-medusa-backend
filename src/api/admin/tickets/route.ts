import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { TICKET_MODULE } from "../../../modules/ticket";

async function ensureTicketSlaColumns(pgConnection: any) {
  await pgConnection.raw(
    `ALTER TABLE IF EXISTS ticket ADD COLUMN IF NOT EXISTS sla_deadline TIMESTAMPTZ`,
  );
  await pgConnection.raw(
    `ALTER TABLE IF EXISTS ticket ADD COLUMN IF NOT EXISTS resolution_time_hours DOUBLE PRECISION`,
  );
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const ticketService = req.scope.resolve(TICKET_MODULE) as any;

  const {
    status,
    type,
    order_id,
    limit = "20",
    offset = "0",
  } = req.query as Record<string, string>;

  try {
    const filters: Record<string, unknown> = {};
    if (status) filters.status = status;
    if (type) filters.type = type;
    if (order_id) filters.order_id = order_id;

    const safeLimit = Number.parseInt(limit, 10) || 20;
    const safeOffset = Number.parseInt(offset, 10) || 0;

    const [tickets, count] = await ticketService.listAndCountTickets(filters, {
      take: safeLimit,
      skip: safeOffset,
      order: { created_at: "DESC" },
    });

    return res.status(200).json({
      tickets,
      count,
      limit: safeLimit,
      offset: safeOffset,
    });
  } catch (err: any) {
    if (err.message?.includes("does not exist")) {
      return res.status(200).json({
        tickets: [],
        count: 0,
        note: "ticket tables not yet created. Run migrations.",
      });
    }

    return res.status(500).json({ error: "Failed to list tickets" });
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const ticketService = req.scope.resolve(TICKET_MODULE) as any;
  const orderService = req.scope.resolve(Modules.ORDER) as any;
  const eventBus = req.scope.resolve(Modules.EVENT_BUS) as any;
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any;

  const { order_id, customer_id, type, subject, description, priority, metadata, sla_hours } =
    req.body as Record<string, any>;

  if (!order_id || !type || !subject) {
    return res.status(400).json({ error: "order_id, type and subject are required" });
  }

  try {
    await orderService.retrieveOrder(order_id);
  } catch {
    return res.status(400).json({ error: "Order not found" });
  }

  try {
    await ensureTicketSlaColumns(pgConnection);
    const parsedSlaHours = Number(sla_hours);
    const finalSlaHours =
      Number.isFinite(parsedSlaHours) && parsedSlaHours > 0 ? parsedSlaHours : 24;
    const slaDeadline = new Date(Date.now() + finalSlaHours * 60 * 60 * 1000);

    const ticket = await ticketService.createTickets({
      order_id,
      customer_id: customer_id || null,
      type,
      subject,
      description: description || null,
      priority: priority || "medium",
      metadata: metadata || null,
      status: "open",
      sla_deadline: slaDeadline,
    });

    await eventBus.emit("ticket.created", { id: ticket.id });

    return res.status(200).json({ ticket });
  } catch {
    return res.status(500).json({ error: "Failed to create ticket" });
  }
}
