import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as any
  const customerService = req.scope.resolve(Modules.CUSTOMER) as any
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any

  const customerId = (req as any).auth_context?.actor_id
  if (!customerId) {
    return res.status(401).json({ error: "Authentication required" })
  }

  try {
    const customer = await customerService.retrieveCustomer(customerId)

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" })
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
            status: "requested",
            requested_at: new Date().toISOString(),
          }),
        ]
      )
    } catch {
      // Table may not exist yet (C-035f), silently continue
    }

    logger.info(`[gdpr-erasure] Data erasure request for customer ${customerId} (${customer.email})`)

    return res.status(202).json({
      message: "Data erasure request received",
      status: "pending",
      customer_id: customerId,
      requested_at: new Date().toISOString(),
      gdpr_article: "Article 17 - Right to Erasure",
    })
  } catch (err: any) {
    logger.error(`[gdpr-erasure] Error for customer ${customerId}: ${err.message}`)
    return res.status(500).json({ error: "Failed to process erasure request" })
  }
}
