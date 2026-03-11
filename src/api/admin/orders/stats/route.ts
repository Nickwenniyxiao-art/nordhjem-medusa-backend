import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

async function getRangeStats(pgConnection: any, range: string) {
  let result: any
  try {
    result = await pgConnection.raw(
      `SELECT
        COUNT(*)::int AS count,
        COALESCE(SUM(COALESCE((to_jsonb(os)->>'total')::numeric, 0)), 0) AS gmv,
        COALESCE(AVG(COALESCE((to_jsonb(os)->>'total')::numeric, 0)), 0) AS avg_order_value
       FROM "order" o
       LEFT JOIN order_summary os ON os.order_id = o.id
       WHERE o.created_at >= ${range}
         AND o.created_at <= now()
         AND o.canceled_at IS NULL`
    )
  } catch {
    return {
      count: 0,
      gmv: 0,
      avg_order_value: 0,
    }
  }

  const row = result?.rows?.[0] || {}
  return {
    count: Number(row.count || 0),
    gmv: Number(row.gmv || 0),
    avg_order_value: Number(row.avg_order_value || 0),
  }
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any
  const eventBus = req.scope.resolve(Modules.EVENT_BUS) as any

  const today = await getRangeStats(pgConnection, "date_trunc('day', now())")
  const thisWeek = await getRangeStats(pgConnection, "date_trunc('week', now())")
  const thisMonth = await getRangeStats(pgConnection, "date_trunc('month', now())")

  const payload = {
    today,
    this_week: thisWeek,
    this_month: thisMonth,
  }

  await eventBus.emit("order.stats.generated", payload)

  return res.status(200).json(payload)
}
