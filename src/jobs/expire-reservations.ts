import type { MedusaContainer } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export default async function expireReservationsJob(container: MedusaContainer) {
  const pgConnection = container.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any;
  const eventBus = container.resolve(Modules.EVENT_BUS) as any;

  await pgConnection.raw(
    `CREATE TABLE IF NOT EXISTS stock_reservations (
      id uuid PRIMARY KEY,
      cart_id text NOT NULL,
      variant_id text NOT NULL,
      quantity integer NOT NULL,
      expires_at timestamptz NOT NULL,
      status text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )`,
  );

  const expiredResult = await pgConnection.raw(
    `SELECT id, cart_id, variant_id, quantity
     FROM stock_reservations
     WHERE status = 'active' AND expires_at < now()`,
  );

  const expiredRows = expiredResult.rows || [];

  if (!expiredRows.length) {
    return;
  }

  await pgConnection.raw(
    `UPDATE stock_reservations
     SET status = 'expired'
     WHERE status = 'active' AND expires_at < now()`,
  );

  for (const row of expiredRows) {
    await eventBus.emit({
      name: "checkout.reservation_expired",
      data: {
        reservation_id: row.id,
        cart_id: row.cart_id,
        variant_id: row.variant_id,
        quantity: row.quantity,
      },
    });
  }
}

export const config = {
  name: "expire-reservations",
  schedule: "*/5 * * * *",
};
