import test from "node:test"
import assert from "node:assert/strict"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { GET } from "../src/api/admin/finance/summary/route"

function createRes() {
  const res: any = { statusCode: 200, body: null }
  res.status = (code: number) => ((res.statusCode = code), res)
  res.json = (payload: unknown) => ((res.body = payload), res)
  return res
}

test("finance summary aggregates data points and rounds fee", async () => {
  let call = 0
  const pgConnection = {
    raw: async () => {
      call += 1
      if (call === 1) {
        return { rows: [{ period: "2026-01-01", revenue: 100.1, refunds: 10, net: 90.1 }] }
      }
      if (call === 2) {
        return { rows: [{ estimated_fees: 3.205 }] }
      }
      return { rows: [{ pending: 4.5 }] }
    },
  }

  const req: any = {
    query: { currency_code: "EUR", granularity: "invalid" },
    scope: {
      resolve: (key: string) => {
        if (key === ContainerRegistrationKeys.PG_CONNECTION) return pgConnection
        if (key === "logger") return { error: () => undefined }
        return null
      },
    },
  }

  const res = createRes()
  await GET(req, res)

  assert.equal(res.statusCode, 200)
  assert.equal(res.body.currency_code, "eur")
  assert.equal(res.body.total_revenue, 100.1)
  assert.equal(res.body.total_refunds, 10)
  assert.equal(res.body.net_revenue, 90.1)
  assert.equal(res.body.estimated_stripe_fees, 3.21)
  assert.equal(res.body.pending_refunds, 4.5)
})

test("finance summary returns 200 with note when table missing", async () => {
  const req: any = {
    query: {},
    scope: {
      resolve: (key: string) => {
        if (key === ContainerRegistrationKeys.PG_CONNECTION) {
          return { raw: async () => { throw new Error('relation "order" does not exist') } }
        }
        if (key === "logger") return { error: () => undefined }
        return null
      },
    },
  }

  const res = createRes()
  await GET(req, res)
  assert.equal(res.statusCode, 200)
  assert.equal(res.body.note, "Order table not initialized.")
})
