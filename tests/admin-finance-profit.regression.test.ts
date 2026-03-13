import test from "node:test"
import assert from "node:assert/strict"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { GET } from "../src/api/admin/finance/profit/route"

function createRes() {
  const res: any = { statusCode: 200, body: null }
  res.status = (code: number) => ((res.statusCode = code), res)
  res.json = (payload: unknown) => ((res.body = payload), res)
  return res
}

test("finance profit validates period parameter", async () => {
  const req: any = {
    query: { period: "yearly" },
    scope: { resolve: () => ({}) },
  }
  const res = createRes()
  await GET(req, res)
  assert.equal(res.statusCode, 400)
})

test("finance profit returns payload on successful query and emits event", async () => {
  let emitted = false
  const req: any = {
    query: { period: "weekly", metadata: "regression" },
    scope: {
      resolve: (key: string) => {
        if (key === ContainerRegistrationKeys.PG_CONNECTION) {
          return {
            raw: async () => ({ rows: [{ gross_profit: "15", net_profit: "12", total_revenue: "30", total_cost: "15", order_count: "3", period_start: "2026-01-01", period_end: "2026-01-07" }] }),
          }
        }
        if (key === Modules.EVENT_BUS) return { emit: async () => { emitted = true } }
        if (key === "logger") return { error: () => undefined }
        return null
      },
    },
  }
  const res = createRes()
  await GET(req, res)
  assert.equal(res.statusCode, 200)
  assert.equal(res.body.net_profit, 12)
  assert.equal(res.body.metadata, "regression")
  assert.equal(emitted, true)
})
