import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function loginTrackerSubscriber({ event, container }: SubscriberArgs<any>) {
  const pgConnection = container.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any;

  await pgConnection.raw(
    `CREATE TABLE IF NOT EXISTS customer_login_history (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      customer_id TEXT,
      ip_address TEXT,
      user_agent TEXT,
      login_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      status TEXT NOT NULL
    )`,
  );

  const customerId = event.data?.customer_id || event.data?.actor_id || event.data?.id || null;
  if (!customerId) {
    return;
  }

  await pgConnection.raw(
    `INSERT INTO customer_login_history (customer_id, ip_address, user_agent, login_at, status)
     VALUES (?, ?, ?, NOW(), ?)`,
    [customerId, null, null, "success"],
  );
}

export const config: SubscriberConfig = {
  event: "auth.authenticated",
};
