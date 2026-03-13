import test from "node:test"
import assert from "node:assert/strict"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { GET } from "../src/api/admin/analytics/sales-summary/route"

function createRes() {
  const res: any = { statusCode: 200, body: null }
  res.status = (code: number) => ((res.statusCode = code), res)
  res.json = (payload: unknown) => ((res.body = payload), res)
  return res
}

test("sales summary calculates totals, aov and refund rate", async () => {
  let call = 0
  const req: any = {
    query: { currency_code: "USD", granularity: "month" },
    scope: {
      resolve: (key: string) => {
        if (key === ContainerRegistrationKeys.PG_CONNECTION) {
          return {
            raw: async () => {
              call += 1
              if (call === 1) {
                return { rows: [{ date: "2026-02-01", sales: "200", orders: "4" }, { date: "2026-01-01", sales: "100", orders: "1" }] }
              }
              return { rows: [{ refunded: "2" }] }
            },
          }
        }
        if (key === "logger") return { error: () => undefined }
        return null
      },
    },
  }
  const res = createRes()
  await GET(req, res)

  assert.equal(res.statusCode, 200)
  assert.equal(res.body.total_sales, 300)
  assert.equal(res.body.order_count, 5)
  assert.equal(res.body.avg_order_value, 60)
  assert.equal(res.body.refund_rate, 40)
})
