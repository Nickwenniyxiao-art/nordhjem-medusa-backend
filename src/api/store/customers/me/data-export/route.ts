import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as any
  const customerService = req.scope.resolve(Modules.CUSTOMER) as any
  const orderService = req.scope.resolve(Modules.ORDER) as any
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any

  const customerId = (req as any).auth_context?.actor_id
  if (!customerId) {
    return res.status(401).json({ error: "Authentication required" })
  }

  try {
    const customer = await customerService.retrieveCustomer(customerId, {
      relations: ["addresses"],
    })

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" })
    }

    const [orders] = await orderService.listOrders(
      { customer_id: customerId },
      {
        relations: ["items", "shipping_address", "billing_address"],
        order: { created_at: "DESC" },
        take: 1000,
      }
    )

    const orderSummaries = (orders || []).map((order: any) => ({
      order_id: order.id,
      display_id: order.display_id,
      status: order.status,
      total: order.total,
      currency_code: order.currency_code,
      created_at: order.created_at,
      items: (order.items || []).map((item: any) => ({
        title: item.title,
        variant_title: item.variant_title,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })),
      shipping_address: order.shipping_address
        ? {
            first_name: order.shipping_address.first_name,
            last_name: order.shipping_address.last_name,
            address_1: order.shipping_address.address_1,
            address_2: order.shipping_address.address_2,
            city: order.shipping_address.city,
            province: order.shipping_address.province,
            postal_code: order.shipping_address.postal_code,
            country_code: order.shipping_address.country_code,
            phone: order.shipping_address.phone,
          }
        : null,
    }))

    const exportData = {
      export_metadata: {
        generated_at: new Date().toISOString(),
        format_version: "1.0",
        gdpr_article: "Article 20 - Right to Data Portability",
        store: "NordHjem",
      },
      profile: {
        id: customer.id,
        email: customer.email,
        first_name: customer.first_name,
        last_name: customer.last_name,
        phone: customer.phone,
        created_at: customer.created_at,
        updated_at: customer.updated_at,
        metadata: customer.metadata,
      },
      addresses: (customer.addresses || []).map((addr: any) => ({
        id: addr.id,
        first_name: addr.first_name,
        last_name: addr.last_name,
        address_1: addr.address_1,
        address_2: addr.address_2,
        city: addr.city,
        province: addr.province,
        postal_code: addr.postal_code,
        country_code: addr.country_code,
        phone: addr.phone,
        is_default_shipping: addr.is_default_shipping,
        is_default_billing: addr.is_default_billing,
      })),
      orders: orderSummaries,
      total_orders: orderSummaries.length,
    }

    logger.info(
      `[gdpr-export] Data export for customer ${customerId} (${customer.email}), ${orderSummaries.length} orders`
    )

    try {
      await pgConnection.raw(
        `INSERT INTO data_processing_log (customer_id, action_type, ip_address, details, created_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [
          customerId,
          "data_export",
          req.ip || "unknown",
          JSON.stringify({
            orders_count: orderSummaries.length,
            addresses_count: customer.addresses?.length || 0,
          }),
        ]
      )
    } catch {
      // Table may not exist yet (C-035f), silently continue
    }

    res.setHeader("Content-Type", "application/json; charset=utf-8")
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="nordhjem-data-export-${Date.now()}.json"`
    )
    return res.status(200).json(exportData)
  } catch (err: any) {
    logger.error(`[gdpr-export] Error for customer ${customerId}: ${err.message}`)
    return res.status(500).json({ error: "Export failed" })
  }
}
