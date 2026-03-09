/**
 * Migration script to create data_processing_log table.
 *
 * Run with: npx medusa exec src/scripts/create-data-processing-log.ts
 *
 * This table records all GDPR-related data processing activities
 * (exports, erasures) for compliance auditing.
 */
import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function createDataProcessingLog({
  container,
}: ExecArgs) {
  const logger = container.resolve("logger") as any
  const pgConnection = container.resolve(
    ContainerRegistrationKeys.PG_CONNECTION
  ) as any

  logger.info("[data-processing-log] Creating data_processing_log table...")

  try {
    const tableExistsResult = await pgConnection.raw(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'data_processing_log'
      ) AS exists
    `)

    if (tableExistsResult?.rows?.[0]?.exists) {
      logger.info(
        "[data-processing-log] Table already exists, skipping creation"
      )
      return
    }

    await pgConnection.raw(`
      CREATE TABLE data_processing_log (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        customer_id VARCHAR(255) NOT NULL,
        action_type VARCHAR(50) NOT NULL,
        ip_address VARCHAR(45),
        details JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      )
    `)

    await pgConnection.raw(`
      CREATE INDEX idx_dpl_customer_id ON data_processing_log (customer_id)
    `)
    await pgConnection.raw(`
      CREATE INDEX idx_dpl_action_type ON data_processing_log (action_type)
    `)
    await pgConnection.raw(`
      CREATE INDEX idx_dpl_created_at ON data_processing_log (created_at)
    `)

    logger.info("[data-processing-log] ✅ Table created successfully")
  } catch (error: any) {
    logger.error(
      `[data-processing-log] Error creating table: ${error.message}`
    )
    throw error
  }
}
