import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any
  const eventBus = req.scope.resolve(Modules.EVENT_BUS) as any

  const customerId = (req as any).auth_context?.actor_id
  if (!customerId) {
    return res.status(401).json({ error: "Authentication required" })
  }

  await pgConnection.raw(`UPDATE customer SET deleted_at = NOW() WHERE id = ?`, [
    customerId,
  ])

  await pgConnection.raw(
    `UPDATE customer
     SET email = '[DELETED_' || extract(epoch from NOW())::text || ']',
         first_name = '[DELETED]',
         last_name = '[DELETED]',
         phone = NULL
     WHERE id = ?`,
    [customerId]
  )

  await pgConnection.raw(
    `UPDATE customer_address
     SET deleted_at = NOW()
     WHERE customer_id = ?`,
    [customerId]
  )

  await eventBus.emit({
    name: "customer.account.deleted",
    data: { customer_id: customerId },
  })

  return res.status(200).json({ message: "Account deleted and anonymized" })
}
