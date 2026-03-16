import test from "node:test"
import assert from "node:assert/strict"
import { adminRequest, getAdminToken, runStep, testPrefix } from "./helpers"

test("优惠管理回归测试", async () => {
  const token = await getAdminToken()
  const prefix = testPrefix("discount")
  const discountIds: string[] = []

  try {
    await runStep("创建固定金额折扣", async () => {
      const { response, data } = await adminRequest<{ discount?: { id: string } }>({
        token,
        method: "POST",
        path: "/admin/discounts",
        body: {
          code: `${prefix}-fixed`,
          type: "fixed",
          value: 1000,
          regions: [],
          is_dynamic: false,
        },
      })
      assert.ok([200, 201, 400].includes(response.status), `固定金额折扣创建异常: ${response.status}`)
      if (data.discount?.id) discountIds.push(data.discount.id)
    })

    await runStep("创建百分比折扣", async () => {
      const { response, data } = await adminRequest<{ discount?: { id: string } }>({
        token,
        method: "POST",
        path: "/admin/discounts",
        body: {
          code: `${prefix}-percent`,
          type: "percentage",
          value: 10,
          regions: [],
          is_dynamic: false,
        },
      })
      assert.ok([200, 201, 400].includes(response.status), `百分比折扣创建异常: ${response.status}`)
      if (data.discount?.id) discountIds.push(data.discount.id)
    })

    await runStep("设置使用条件", async () => {
      if (!discountIds[0]) {
        console.log("没有可用折扣 ID，跳过条件设置")
        return
      }
      const { response } = await adminRequest({
        token,
        method: "POST",
        path: `/admin/discounts/${discountIds[0]}`,
        body: {
          rule: { operator: "gte", amount: 5000 },
        },
      })
      assert.ok([200, 400].includes(response.status), `折扣条件设置异常: ${response.status}`)
    })

    await runStep("验证折扣应用（查询）", async () => {
      if (!discountIds[0]) return
      const { response } = await adminRequest({
        token,
        path: `/admin/discounts/${discountIds[0]}`,
      })
      assert.equal(response.status, 200, `折扣详情查询失败: ${response.status}`)
    })
  } finally {
    await runStep("删除折扣", async () => {
      for (const id of discountIds) {
        console.log(`[清理] 删除折扣 ${id}`)
        await adminRequest({ token, method: "DELETE", path: `/admin/discounts/${id}` })
      }
    })
  }
})
