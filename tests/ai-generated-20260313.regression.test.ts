import test from "node:test"
import assert from "node:assert/strict"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { GET } from "../src/api/admin/inventory/report/route"

function createRes() {
  const res: any = { statusCode: 200, body: null }
  res.status = (code: number) => ((res.statusCode = code), res)
  res.json = (payload: unknown) => ((res.body = payload), res)
  return res
}

test("inventory report calculates total inventory value and stockout rate", async () => {
  const req: any = {
    scope: {
      resolve: (key: string) => {
        if (key === ContainerRegistrationKeys.PG_CONNECTION) {
          return {
            raw: async () => ({
              rows: [
                { total_stock: 10, unit_cost: "5.00" },
                { total_stock: 5, unit_cost: "10.00" },
              ],
            }),
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
  assert.equal(res.body.total_inventory_value, 75)
  assert.equal(res.body.stockout_rate, 0)
})

test("inventory report handles invalid unit cost gracefully", async () => {
  const req: any = {
    scope: {
      resolve: (key: string) => {
        if (key === ContainerRegistrationKeys.PG_CONNECTION) {
          return {
            raw: async () => ({
              rows: [
                { total_stock: 10, unit_cost: "invalid" },
                { total_stock: 5, unit_cost: "20.00" },
              ],
            }),
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
  assert.equal(res.body.total_inventory_value, 100)
})

test("inventory report returns error on query failure", async () => {
  const req: any = {
    scope: {
      resolve: (key: string) => {
        if (key === ContainerRegistrationKeys.PG_CONNECTION) {
          return {
            raw: async () => {
              throw new Error("Database error")
            },
          }
        }
        if (key === "logger") return { error: (msg: string) => assert.equal(msg, "[inventory-report] Query error: Database error") }
        return null
      },
    },
  }
  const res = createRes()
  await GET(req, res)

  assert.equal(res.statusCode, 500)
  assert.deepEqual(res.body, { error: "Failed to generate inventory report" })
})

test("inventory report handles missing data gracefully", async () => {
  const req: any = {
    scope: {
      resolve: (key: string) => {
        if (key === ContainerRegistrationKeys.PG_CONNECTION) {
          return {
            raw: async () => ({
              rows: [],
            }),
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
  assert.equal(res.body.total_inventory_value, 0)
  assert.equal(res.body.stockout_rate, 0)
})
