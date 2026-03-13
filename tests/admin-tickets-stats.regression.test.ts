import test from "node:test"
import assert from "node:assert/strict"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { GET } from "../src/api/admin/tickets/stats/route"

function createRes() {
  const res: any = { statusCode: 200, body: null }
  res.status = (code: number) => ((res.statusCode = code), res)
  res.json = (payload: unknown) => ((res.body = payload), res)
  return res
}

test("ticket stats computes payload and emits analytics event", async () => {
  let call = 0
  let emitted = false
  const req: any = {
    scope: {
      resolve: (key: string) => {
        if (key === ContainerRegistrationKeys.PG_CONNECTION) {
          return {
            raw: async () => {
              call += 1
              if (call < 3) return { rows: [] }
              return { rows: [{ total_tickets: 12, open_tickets: 3, avg_resolution_time_hours: 10.5, sla_compliance_rate: 0.95 }] }
            },
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
  assert.equal(res.body.total_tickets, 12)
  assert.equal(res.body.sla_compliance_rate, 0.95)
  assert.equal(emitted, true)
})

test("ticket stats returns 500 when query fails", async () => {
  const req: any = {
    scope: {
      resolve: (key: string) => {
        if (key === ContainerRegistrationKeys.PG_CONNECTION) return { raw: async () => { throw new Error("broken") } }
        if (key === Modules.EVENT_BUS) return { emit: async () => undefined }
        if (key === "logger") return { error: () => undefined }
        return null
      },
    },
  }
  const res = createRes()
  await GET(req, res)
  assert.equal(res.statusCode, 500)
  assert.equal(res.body.error, "Failed to generate ticket stats")
})
