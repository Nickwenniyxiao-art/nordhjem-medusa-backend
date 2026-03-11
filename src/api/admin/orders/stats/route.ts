import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

async function getRangeStats(pgConnection: any, range: string) {
  const result = await pgConnection.raw(
    `SELECT
      COUNT(*)::int AS count,
      COALESCE(SUM(COALESCE((o.raw_total->>'value')::numeric, o.total, 0)), 0) AS gmv,
      COALESCE(AVG(COALESCE((o.raw_total->>'value')::numeric, o.total, 0)), 0) AS avg_order_value
     FROM "order" o
     WHERE o.created_at >= ${range}
       AND o.created_at <= now()`
  )

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
