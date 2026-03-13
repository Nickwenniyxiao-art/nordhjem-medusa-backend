/**
 * Admin API: GET /admin/analytics/traffic
 *
 * 返回转化漏斗数据：
 * - visitors: null（GA4 未集成时返回 null）
 * - cart_created_count: 创建的购物车总数
 * - checkout_started_count: 进入结账流程的购物车数
 * - order_completed_count: 完成支付的订单数
 * - conversion_rates: 各环节转化率
 */
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger") as any
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any

  const { date_from, date_to } = req.query as Record<string, string>

  try {
    const cartConditions: string[] = []
    const params: any[] = []
    if (date_from) {
      cartConditions.push("created_at >= ?::timestamptz")
      params.push(date_from)
    }

    if (date_to) {
      cartConditions.push("created_at < (?::date + interval '1 day')")
      params.push(date_to)
    }

    const cartWhere = cartConditions.length ? `WHERE ${cartConditions.join(" AND ")}` : ""

    const orderWhere = cartConditions.length
      ? `WHERE ${cartConditions
          .map((condition) => condition.replace(/created_at/g, "o.created_at"))
          .join(" AND ")}`
      : ""

    const cartsQuery = `SELECT COUNT(*)::int AS count FROM cart ${cartWhere}`
    const cartsResult = await pgConnection.raw(cartsQuery, params)
    const cartCreatedCount = parseInt(cartsResult?.rows?.[0]?.count || "0", 10)

    const checkoutQuery = `
      SELECT COUNT(*)::int AS count FROM cart
      ${cartWhere ? `${cartWhere} AND` : "WHERE"}
      (completed_at IS NOT NULL OR shipping_address_id IS NOT NULL)
    `
    const checkoutResult = await pgConnection.raw(checkoutQuery, params)
    const checkoutStartedCount = parseInt(checkoutResult?.rows?.[0]?.count || "0", 10)

    const ordersQuery = `
      SELECT COUNT(DISTINCT o.id)::int AS count
      FROM "order" o
      ${orderWhere}
      ${orderWhere ? "AND" : "WHERE"} o.canceled_at IS NULL
    `
    const ordersResult = await pgConnection.raw(ordersQuery, params)
    const orderCompletedCount = parseInt(ordersResult?.rows?.[0]?.count || "0", 10)

    const safeRate = (num: number, den: number): number =>
      den > 0 ? Math.round((num / den) * 10000) / 100 : 0

    return res.status(200).json({
      visitors: null,
      cart_created_count: cartCreatedCount,
      checkout_started_count: checkoutStartedCount,
      order_completed_count: orderCompletedCount,
      conversion_rates: {
        cart_to_checkout: safeRate(checkoutStartedCount, cartCreatedCount),
        checkout_to_order: safeRate(orderCompletedCount, checkoutStartedCount),
      },
      date_from: date_from || null,
      date_to: date_to || null,
      note: "visitors is null because GA4 is not integrated. Cart/checkout/order counts from Medusa database.",
    })
  } catch (err: any) {
    logger.error(`[traffic] Query error: ${err.message}`)

    if (err.message?.includes("does not exist")) {
      return res.status(200).json({
        visitors: null,
        cart_created_count: 0,
        checkout_started_count: 0,
        order_completed_count: 0,
        conversion_rates: { cart_to_checkout: 0, checkout_to_order: 0 },
        date_from: date_from || null,
        date_to: date_to || null,
        note: "Cart/order tables not initialized.",
      })
    }

    return res.status(500).json({ error: "Failed to query traffic data" })
  }
}
