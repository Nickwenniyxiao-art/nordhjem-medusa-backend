import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

type SlaConfig = {
  response_time_hours: number
  resolution_time_hours: number
  escalation_enabled: boolean
}

const DEFAULT_CONFIG: SlaConfig = {
  response_time_hours: 24,
  resolution_time_hours: 72,
  escalation_enabled: true,
}

async function ensureSlaConfigTable(pgConnection: any) {
  await pgConnection.raw(`
    CREATE TABLE IF NOT EXISTS after_sales_sla_config (
      id INT PRIMARY KEY,
      response_time_hours INT NOT NULL DEFAULT 24,
      resolution_time_hours INT NOT NULL DEFAULT 72,
      escalation_enabled BOOLEAN NOT NULL DEFAULT true,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
}

async function getSlaConfig(pgConnection: any): Promise<SlaConfig> {
  const result = await pgConnection.raw(
    `SELECT response_time_hours, resolution_time_hours, escalation_enabled
     FROM after_sales_sla_config
     WHERE id = 1`
  )

  const row = result?.rows?.[0]
  if (!row) {
    await pgConnection.raw(
      `INSERT INTO after_sales_sla_config (id, response_time_hours, resolution_time_hours, escalation_enabled)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO NOTHING`,
      [
        1,
        DEFAULT_CONFIG.response_time_hours,
        DEFAULT_CONFIG.resolution_time_hours,
        DEFAULT_CONFIG.escalation_enabled,
      ]
    )
    return DEFAULT_CONFIG
  }

  return {
    response_time_hours: Number(row.response_time_hours ?? DEFAULT_CONFIG.response_time_hours),
    resolution_time_hours: Number(
      row.resolution_time_hours ?? DEFAULT_CONFIG.resolution_time_hours
    ),
    escalation_enabled: Boolean(row.escalation_enabled),
  }
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const pgConnection = req.scope.resolve("pgConnection") as any
    await ensureSlaConfigTable(pgConnection)

    const config = await getSlaConfig(pgConnection)

    return res.status(200).json({ sla_config: config })
  } catch (err: any) {
    console.error("[after-sales][sla-config][GET]", err)
    return res.status(500).json({ error: "Failed to fetch SLA config" })
  }
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  try {
    const pgConnection = req.scope.resolve("pgConnection") as any
    await ensureSlaConfigTable(pgConnection)

    const body = (req.body || {}) as Partial<SlaConfig>

    const responseTimeHours = Number(body.response_time_hours ?? DEFAULT_CONFIG.response_time_hours)
    const resolutionTimeHours = Number(
      body.resolution_time_hours ?? DEFAULT_CONFIG.resolution_time_hours
    )
    const escalationEnabled =
      typeof body.escalation_enabled === "boolean"
        ? body.escalation_enabled
        : DEFAULT_CONFIG.escalation_enabled

    await pgConnection.raw(
      `INSERT INTO after_sales_sla_config (id, response_time_hours, resolution_time_hours, escalation_enabled, updated_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (id)
       DO UPDATE SET
         response_time_hours = EXCLUDED.response_time_hours,
         resolution_time_hours = EXCLUDED.resolution_time_hours,
         escalation_enabled = EXCLUDED.escalation_enabled,
         updated_at = NOW()`,
      [1, responseTimeHours, resolutionTimeHours, escalationEnabled]
    )

    const config = await getSlaConfig(pgConnection)
    return res.status(200).json({ sla_config: config })
  } catch (err: any) {
    console.error("[after-sales][sla-config][PUT]", err)
    return res.status(500).json({ error: "Failed to update SLA config" })
  }
}
