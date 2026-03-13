import { model } from "@medusajs/framework/utils";

const TicketMessage = model.define("ticket_message", {
  id: model.id().primaryKey(),
  ticket_id: model.text(),
  sender_type: model.enum(["customer", "admin"]),
  sender_id: model.text().nullable(),
  body: model.text(),
  metadata: model.json().nullable(),
});

export default TicketMessage;
