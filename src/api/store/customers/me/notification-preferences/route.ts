import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

type NotificationPreferences = {
  order_updates: boolean;
  promotions: boolean;
  newsletter: boolean;
};

const DEFAULT_PREFERENCES: NotificationPreferences = {
  order_updates: true,
  promotions: true,
  newsletter: true,
};

function normalizePreferences(input: any): NotificationPreferences {
  return {
    order_updates:
      typeof input?.order_updates === "boolean"
        ? input.order_updates
        : DEFAULT_PREFERENCES.order_updates,
    promotions:
      typeof input?.promotions === "boolean" ? input.promotions : DEFAULT_PREFERENCES.promotions,
    newsletter:
      typeof input?.newsletter === "boolean" ? input.newsletter : DEFAULT_PREFERENCES.newsletter,
  };
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const customerService = req.scope.resolve("customerModuleService") as any;
    const customerId = (req as any).auth_context?.actor_id;

    if (!customerId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const customer = await customerService.retrieveCustomer(customerId);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const preferences = normalizePreferences(customer?.metadata?.notification_preferences);
    return res.status(200).json({ notification_preferences: preferences });
  } catch (err: any) {
    console.error("[customers][notification-preferences][GET]", err);
    return res.status(500).json({ error: "Failed to fetch notification preferences" });
  }
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  try {
    const customerService = req.scope.resolve("customerModuleService") as any;
    const customerId = (req as any).auth_context?.actor_id;

    if (!customerId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const body = (req.body || {}) as Partial<NotificationPreferences>;
    const updatedPreferences = normalizePreferences(body);

    const customer = await customerService.retrieveCustomer(customerId);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const nextMetadata = {
      ...(customer.metadata || {}),
      notification_preferences: updatedPreferences,
    };

    await customerService.updateCustomers(customerId, {
      metadata: nextMetadata,
    });

    return res.status(200).json({ notification_preferences: updatedPreferences });
  } catch (err: any) {
    console.error("[customers][notification-preferences][PUT]", err);
    return res.status(500).json({ error: "Failed to update notification preferences" });
  }
}
