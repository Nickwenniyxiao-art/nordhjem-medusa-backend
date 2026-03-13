import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import crypto from "crypto"

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as any
  const customerService = req.scope.resolve(Modules.CUSTOMER) as any
  const orderService = req.scope.resolve(Modules.ORDER) as any
  const notificationService = req.scope.resolve(Modules.NOTIFICATION)
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any

  const customerId = (req as any).auth_context?.actor_id
  if (!customerId) {
    return res.status(401).json({ error: "Authentication required" })
  }

  const { confirmation_token } = req.body as { confirmation_token?: string }

  try {
    const customer = await customerService.retrieveCustomer(customerId, {
      relations: ["addresses"],
    })

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" })
    }

    if (!confirmation_token) {
      const token = crypto.randomBytes(32).toString("hex")
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

      await customerService.updateCustomers(customerId, {
        metadata: {
          ...customer.metadata,
          erasure_token: token,
          erasure_token_expires: expiresAt.toISOString(),
        },
      })

      await notificationService.createNotifications({
        to: customer.email,
        channel: "email",
        template: "data-erasure-confirm",
        data: {
          customer,
          confirmation_token: token,
          expires_at: expiresAt.toISOString(),
          subject: "NordHjem 账户数据删除确认 | Data Erasure Confirmation",
        },
      })

      logger.info(
        `[gdpr-erasure] Erasure request initiated for ${customerId}, confirmation email sent to ${customer.email}`
      )

      return res.status(202).json({
        message:
          "Erasure request initiated. A confirmation email has been sent. Please include the confirmation_token in a follow-up DELETE request to proceed.",
        expires_at: expiresAt.toISOString(),
      })
    }

    const storedToken = customer.metadata?.erasure_token
    const storedExpiry = customer.metadata?.erasure_token_expires

    if (!storedToken || storedToken !== confirmation_token) {
      logger.error(`[gdpr-erasure] Invalid token for customer ${customerId}`)
      return res.status(403).json({ error: "Invalid confirmation token" })
    }

    if (storedExpiry && new Date(storedExpiry) < new Date()) {
      logger.error(`[gdpr-erasure] Expired token for customer ${customerId}`)
      return res.status(403).json({ error: "Confirmation token expired" })
    }

    const timestamp = Date.now()
    const anonymizedEmail = `deleted_${timestamp}@nordhjem.store`
    const originalEmailHash = crypto.createHash("sha256").update(customer.email).digest("hex")

    await customerService.updateCustomers(customerId, {
      first_name: "Anonymous",
      last_name: "User",
      email: anonymizedEmail,
      phone: null,
      metadata: {
        anonymized: true,
        anonymized_at: new Date().toISOString(),
        original_email_hash: originalEmailHash,
      },
    })

    for (const addr of customer.addresses || []) {
      try {
        await customerService.deleteAddresses(addr.id)
      } catch (err: any) {
        logger.error(`[gdpr-erasure] Failed to delete address ${addr.id}: ${err.message}`)
      }
    }

    const [orders] = await orderService.listOrders(
      { customer_id: customerId },
      {
        relations: ["shipping_address", "billing_address"],
        take: 1000,
      }
    )

    for (const order of orders || []) {
      try {
        if (order.shipping_address?.id) {
          await pgConnection.raw(
            `UPDATE order_address SET
              first_name = 'Anonymous',
              last_name = 'User',
              phone = NULL,
              address_1 = '[REDACTED]',
              address_2 = NULL
            WHERE id = $1`,
            [order.shipping_address.id]
          )
        }

        if (order.billing_address?.id && order.billing_address.id !== order.shipping_address?.id) {
          await pgConnection.raw(
            `UPDATE order_address SET
              first_name = 'Anonymous',
              last_name = 'User',
              phone = NULL,
              address_1 = '[REDACTED]',
              address_2 = NULL
            WHERE id = $1`,
            [order.billing_address.id]
          )
        }
      } catch (err: any) {
        logger.error(`[gdpr-erasure] Error anonymizing order ${order.id} addresses: ${err.message}`)
      }
    }

    try {
      await pgConnection.raw(
        `INSERT INTO data_processing_log (customer_id, action_type, ip_address, details, created_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [
          customerId,
          "data_erasure",
          req.ip || "unknown",
          JSON.stringify({
            original_email_hash: originalEmailHash,
            orders_anonymized: (orders || []).length,
            addresses_deleted: (customer.addresses || []).length,
          }),
        ]
      )
    } catch {
      // Table may not exist yet (C-035f)
    }

    logger.info(
      `[gdpr-erasure] ✅ Customer ${customerId} (${customer.email}) data erasure completed. ${(orders || []).length} orders anonymized, ${(customer.addresses || []).length} addresses deleted.`
    )

    return res.status(200).json({
      message: "Data erasure completed successfully",
      anonymized_fields: [
        "customer.first_name",
        "customer.last_name",
        "customer.email",
        "customer.phone",
        "customer.addresses (all deleted)",
        "order.shipping_address (name/phone/address redacted)",
        "order.billing_address (name/phone/address redacted)",
      ],
      note: "Order records are preserved for financial compliance with anonymized PII.",
    })
  } catch (err: any) {
    logger.error(`[gdpr-erasure] Error for customer ${customerId}: ${err.message}`)
    return res.status(500).json({ error: "Erasure failed" })
  }
}
