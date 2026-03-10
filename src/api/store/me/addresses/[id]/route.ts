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

export async function PATCH(req: MedusaRequest, res: MedusaResponse) {
  const customerService = req.scope.resolve(Modules.CUSTOMER) as any
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any

  const customerId = (req as any).auth_context?.actor_id
  if (!customerId) {
    return res.status(401).json({ error: "Authentication required" })
  }

  const addressId = (req.params as any)?.id
  const body = (req.body || {}) as any

  await ensureMetadataTable(pgConnection)

  const updatePayload: Record<string, any> = {}
  const updatableFields = [
    "address_1",
    "address_2",
    "city",
    "country_code",
    "postal_code",
    "first_name",
    "last_name",
    "phone",
    "province",
    "company",
  ]

  for (const field of updatableFields) {
    if (body[field] !== undefined) {
      updatePayload[field] = body[field]
    }
  }

  if (Object.keys(updatePayload).length > 0) {
    const updateMethods = [
      () => customerService.updateAddresses(addressId, updatePayload),
      () => customerService.updateCustomerAddresses(addressId, updatePayload),
    ]

    let updated = false
    for (const fn of updateMethods) {
      try {
        await fn()
        updated = true
        break
      } catch {
        // fallback
      }
    }

    if (!updated) {
      return res.status(500).json({ error: "Failed to update address" })
    }
  }

  if (body.is_default === true) {
    await pgConnection.raw(
      `UPDATE customer_address_metadata
       SET is_default = false, updated_at = NOW()
       WHERE customer_id = ?`,
      [customerId]
    )
  }

  if (body.label !== undefined || body.is_default !== undefined) {
    await pgConnection.raw(
      `INSERT INTO customer_address_metadata (customer_id, address_id, label, is_default, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())
       ON CONFLICT (customer_id, address_id)
       DO UPDATE SET
         label = COALESCE(EXCLUDED.label, customer_address_metadata.label),
         is_default = EXCLUDED.is_default,
         updated_at = NOW()`,
      [
        customerId,
        addressId,
        body.label !== undefined ? body.label : null,
        body.is_default === true,
      ]
    )
  }

  const customer = await customerService.retrieveCustomer(customerId, {
    relations: ["addresses"],
  })
  const address = (customer?.addresses || []).find((item: any) => item.id === addressId)

  const metadataResult = await pgConnection.raw(
    `SELECT label, is_default FROM customer_address_metadata WHERE customer_id = ? AND address_id = ?`,
    [customerId, addressId]
  )
  const metadata = metadataResult.rows?.[0]

  return res.status(200).json({
    address: {
      ...address,
      label: metadata?.label || null,
      is_default: Boolean(metadata?.is_default),
    },
  })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const customerService = req.scope.resolve(Modules.CUSTOMER) as any
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any

  const customerId = (req as any).auth_context?.actor_id
  if (!customerId) {
    return res.status(401).json({ error: "Authentication required" })
  }

  const addressId = (req.params as any)?.id

  await ensureMetadataTable(pgConnection)

  const metadataResult = await pgConnection.raw(
    `SELECT is_default FROM customer_address_metadata WHERE customer_id = ? AND address_id = ?`,
    [customerId, addressId]
  )

  if (metadataResult.rows?.[0]?.is_default) {
    return res
      .status(400)
      .json({ error: "Cannot delete default address. Set another address as default first." })
  }

  const deleteMethods = [
    () => customerService.deleteAddresses(addressId),
    () => customerService.deleteCustomerAddresses(addressId),
  ]

  let deleted = false
  for (const fn of deleteMethods) {
    try {
      await fn()
      deleted = true
      break
    } catch {
      // fallback
    }
  }

  if (!deleted) {
    return res.status(500).json({ error: "Failed to delete address" })
  }

  await pgConnection.raw(
    `DELETE FROM customer_address_metadata WHERE customer_id = ? AND address_id = ?`,
    [customerId, addressId]
  )

  return res.status(200).json({ id: addressId, object: "address", deleted: true })
}
