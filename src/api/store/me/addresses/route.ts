import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

async function ensureMetadataTable(pgConnection: any) {
  await pgConnection.raw(
    `CREATE TABLE IF NOT EXISTS customer_address_metadata (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      customer_id TEXT NOT NULL,
      address_id TEXT NOT NULL,
      label TEXT,
      is_default BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (customer_id, address_id)
    )`
  )
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const customerService = req.scope.resolve(Modules.CUSTOMER) as any
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any

  const customerId = (req as any).auth_context?.actor_id
  if (!customerId) {
    return res.status(401).json({ error: "Authentication required" })
  }

  await ensureMetadataTable(pgConnection)

  const customer = await customerService.retrieveCustomer(customerId, {
    relations: ["addresses"],
  })

  const addresses = customer?.addresses || []
  const metadataResult = await pgConnection.raw(
    `SELECT address_id, label, is_default FROM customer_address_metadata WHERE customer_id = ?`,
    [customerId]
  )
  const metadataRows = metadataResult.rows || []
  const metadataMap = new Map(metadataRows.map((row: any) => [row.address_id, row]))

  return res.status(200).json({
    addresses: addresses.map((address: any) => {
      const metadata = metadataMap.get(address.id) as any
      return {
        ...address,
        label: metadata?.label || null,
        is_default: Boolean(metadata?.is_default),
      }
    }),
  })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const customerService = req.scope.resolve(Modules.CUSTOMER) as any
  const eventBus = req.scope.resolve(Modules.EVENT_BUS) as any
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any

  const customerId = (req as any).auth_context?.actor_id
  if (!customerId) {
    return res.status(401).json({ error: "Authentication required" })
  }

  const body = (req.body || {}) as any

  await ensureMetadataTable(pgConnection)

  const customer = await customerService.retrieveCustomer(customerId, {
    relations: ["addresses"],
  })

  if ((customer?.addresses || []).length >= 10) {
    return res.status(400).json({ error: "Address limit reached (max 10)" })
  }

  const addressPayload = {
    first_name: body.first_name,
    last_name: body.last_name,
    address_1: body.address_1,
    city: body.city,
    country_code: body.country_code,
    postal_code: body.postal_code,
    phone: body.phone,
  }

  const createMethods = [
    () => customerService.addAddresses(customerId, [addressPayload]),
    () => customerService.createAddresses(customerId, [addressPayload]),
    () => customerService.createCustomerAddresses(customerId, [addressPayload]),
  ]

  let created: any = null
  for (const fn of createMethods) {
    try {
      const result = await fn()
      created = Array.isArray(result) ? result[0] : result?.[0] || result
      if (created) {
        break
      }
    } catch {
      // fallback to next supported method
    }
  }

  if (!created?.id) {
    return res.status(500).json({ error: "Failed to create address" })
  }

  if (body.is_default === true) {
    await pgConnection.raw(
      `UPDATE customer_address_metadata SET is_default = false, updated_at = NOW() WHERE customer_id = ?`,
      [customerId]
    )
  }

  await pgConnection.raw(
    `INSERT INTO customer_address_metadata (customer_id, address_id, label, is_default, created_at, updated_at)
     VALUES (?, ?, ?, ?, NOW(), NOW())
     ON CONFLICT (customer_id, address_id)
     DO UPDATE SET label = EXCLUDED.label, is_default = EXCLUDED.is_default, updated_at = NOW()`,
    [customerId, created.id, body.label || null, body.is_default === true]
  )

  await eventBus.emit({
    name: "customer.address_created",
    data: { customer_id: customerId, address_id: created.id },
  })

  return res.status(200).json({
    address: {
      ...created,
      label: body.label || null,
      is_default: body.is_default === true,
    },
  })
}
