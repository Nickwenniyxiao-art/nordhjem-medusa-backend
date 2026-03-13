import test from "node:test"
import assert from "node:assert/strict"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { GET } from "../src/api/admin/orders/stats/route"

function createRes() {
  const res: any = { statusCode: 200, body: null }
  res.status = (code: number) => {
    res.statusCode = code
    return res
  }
  res.json = (payload: unknown) => {
    res.body = payload
    return res
  }
  return res
}

test("orders stats returns normalized ranges and emits event", async () => {
  const calls: string[] = []
  const pgConnection = {
    raw: async (_query: string) => {
      calls.push("raw")
      const rows = [
        { count: 2, gmv: 100, avg_order_value: 50 },
        { count: 3, gmv: 210, avg_order_value: 70 },
        { count: 4, gmv: 320, avg_order_value: 80 },
      ]
      return { rows: [rows[calls.length - 1]] }
    },
  }
  let emitted: any = null
  const req: any = {
    scope: {
      resolve: (key: string) => {
        if (key === ContainerRegistrationKeys.PG_CONNECTION) return pgConnection
        if (key === Modules.EVENT_BUS) return { emit: async (_n: string, data: any) => (emitted = data) }
        return null
      },
    },
  }

  const res = createRes()
  await GET(req, res)

  assert.equal(res.statusCode, 200)
  assert.deepEqual(res.body.today, { count: 2, gmv: 100, avg_order_value: 50 })
  assert.deepEqual(res.body.this_week, { count: 3, gmv: 210, avg_order_value: 70 })
  assert.deepEqual(res.body.this_month, { count: 4, gmv: 320, avg_order_value: 80 })
  assert.deepEqual(emitted, res.body)
})

test("orders stats falls back to zeros when query throws", async () => {
  const req: any = {
    scope: {
      resolve: (key: string) => {
        if (key === ContainerRegistrationKeys.PG_CONNECTION) return { raw: async () => { throw new Error("db down") } }
        if (key === Modules.EVENT_BUS) return { emit: async () => undefined }
        return null
      },
    },
  }
  const res = createRes()
  await GET(req, res)

  assert.equal(res.statusCode, 200)
  assert.deepEqual(res.body.today, { count: 0, gmv: 0, avg_order_value: 0 })
})
