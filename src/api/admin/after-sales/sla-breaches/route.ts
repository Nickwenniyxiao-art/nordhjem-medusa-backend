import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

function toPositiveInt(value: unknown, fallback: number) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback
  }
  return Math.floor(parsed)
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const pgConnection = req.scope.resolve("pgConnection") as any

    const query = req.query as Record<string, string | undefined>
    const status = query.status
    const severity = query.severity
    const page = toPositiveInt(query.page, 1)
    const limit = Math.min(toPositiveInt(query.limit, 20), 100)
    const offset = (page - 1) * limit

    const conditions: string[] = [
      "t.sla_deadline IS NOT NULL",
      "NOW() > t.sla_deadline",
      "(t.status IS DISTINCT FROM 'resolved')",
    ]
    const params: unknown[] = []

    if (status) {
      params.push(status)
      conditions.push(`t.status = $${params.length}`)
    }

    if (severity) {
      params.push(severity)
      conditions.push(`t.priority = $${params.length}`)
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""

    const totalQuery = `
      SELECT COUNT(*)::int AS total
      FROM ticket t
      ${whereClause}
    `
    const totalResult = await pgConnection.raw(totalQuery, params)
    const total = Number(totalResult?.rows?.[0]?.total ?? 0)

    const listParams = [...params, limit, offset]

    const listQuery = `
      SELECT
        t.id,
        t.order_id,
        t.customer_id,
        t.subject,
        t.status,
        t.priority AS severity,
        t.created_at,
        t.sla_deadline,
        EXTRACT(EPOCH FROM (NOW() - t.sla_deadline))::int AS overdue_seconds
      FROM ticket t
      ${whereClause}
      ORDER BY t.sla_deadline ASC
      LIMIT $${listParams.length - 1}
      OFFSET $${listParams.length}
    `

    const result = await pgConnection.raw(listQuery, listParams)

    return res.status(200).json({
      page,
      limit,
      total,
      sla_breaches: (result?.rows || []).map((row: any) => ({
        id: row.id,
        order_id: row.order_id,
        customer_id: row.customer_id,
        subject: row.subject,
        status: row.status,
        severity: row.severity,
        created_at: row.created_at,
        sla_deadline: row.sla_deadline,
        overdue_seconds: Number(row.overdue_seconds || 0),
      })),
    })
  } catch (err: any) {
    console.error("[after-sales][sla-breaches][GET]", err)
    return res.status(500).json({ error: "Failed to fetch SLA breaches" })
  }
}
