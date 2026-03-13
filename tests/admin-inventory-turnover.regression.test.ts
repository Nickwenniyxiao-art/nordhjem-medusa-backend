import test from "node:test"
import assert from "node:assert/strict"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { GET } from "../src/api/admin/inventory/turnover/route"

function createRes() {
  const res: any = { statusCode: 200, body: null }
  res.status = (code: number) => ((res.statusCode = code), res)
  res.json = (payload: unknown) => ((res.body = payload), res)
  return res
}

test("inventory turnover maps rows and includes period bounds", async () => {
  const req: any = {
    query: { start_date: "2026-01-01", end_date: "2026-01-31" },
    scope: {
      resolve: (key: string) => {
        if (key === ContainerRegistrationKeys.PG_CONNECTION) {
          return {
            raw: async () => ({ rows: [{ product_id: "prod_1", product_title: "Chair", sold_quantity: "10", avg_inventory: "5", turnover_rate: "2" }] }),
          }
        }
        if (key === Modules.EVENT_BUS) return { emit: async () => undefined }
        return null
      },
    },
  }

  const res = createRes()
  await GET(req, res)

  assert.equal(res.statusCode, 200)
  assert.equal(res.body.items[0].turnover_rate, 2)
  assert.equal(res.body.period_start, "2026-01-01")
})
