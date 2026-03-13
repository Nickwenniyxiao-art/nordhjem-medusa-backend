import test from "node:test"
import assert from "node:assert/strict"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { GET } from "../src/api/admin/inventory/report/route"

function createRes() {
  const res: any = { statusCode: 200, body: null }
  res.status = (code: number) => ((res.statusCode = code), res)
  res.json = (payload: unknown) => ((res.body = payload), res)
  return res
}

test("inventory report returns typed numbers and metadata", async () => {
  let emitted = false
  const req: any = {
    scope: {
      resolve: (key: string) => {
        if (key === ContainerRegistrationKeys.PG_CONNECTION) {
          return {
            raw: async () => ({ rows: [{ total_inventory_value: "12.5", stockout_rate: "0.2", avg_turnover_days: 25, items_below_threshold: "3", total_items: 10 }] }),
          }
        }
        if (key === Modules.EVENT_BUS) return { emit: async () => { emitted = true } }
        return null
      },
    },
  }
  const res = createRes()
  await GET(req, res)

  assert.equal(res.statusCode, 200)
  assert.equal(res.body.total_inventory_value, 12.5)
  assert.equal(res.body.items_below_threshold, 3)
  assert.deepEqual(res.body.metadata, {})
  assert.equal(emitted, true)
})

test("inventory report returns schema failure fallback payload", async () => {
  const req: any = {
    scope: {
      resolve: (key: string) => {
        if (key === ContainerRegistrationKeys.PG_CONNECTION) return { raw: async () => { throw new Error("bad query") } }
        if (key === Modules.EVENT_BUS) return { emit: async () => undefined }
        return null
      },
    },
  }
  const res = createRes()
  await GET(req, res)
  assert.equal(res.statusCode, 200)
  assert.equal(res.body.message, "Query failed, check schema")
})
