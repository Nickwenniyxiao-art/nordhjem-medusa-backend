import { model } from "@medusajs/framework/utils";

const Ticket = model.define("ticket", {
  id: model.id().primaryKey(),
  order_id: model.text(),
  customer_id: model.text().nullable(),
  type: model.enum(["return", "exchange", "complaint", "inquiry"]),
  status: model.enum(["open", "in_progress", "resolved", "closed", "refunded"]).default("open"),
  priority: model.enum(["low", "medium", "high", "urgent"]).default("medium"),
  subject: model.text(),
  description: model.text().nullable(),
  metadata: model.json().nullable(),
  resolved_at: model.dateTime().nullable(),
  resolution_time_hours: model.number().nullable(),
  sla_deadline: model.dateTime().nullable(),
  closed_at: model.dateTime().nullable(),
});

export default Ticket;
