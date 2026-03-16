import test from "node:test"
import assert from "node:assert/strict"
import { adminRequest, getAdminToken, runStep } from "./helpers"

test("客户管理回归测试", async () => {
  const token = await getAdminToken()
  let customerId: string | undefined

  await runStep("客户列表查询", async () => {
    const { response, data } = await adminRequest<{ customers?: Array<{ id: string; email?: string }> }>({
      token,
      path: "/admin/customers",
    })
    assert.equal(response.status, 200, `客户列表查询失败: ${response.status}`)
    assert.ok(Array.isArray(data.customers), "customers 字段不是数组")
    customerId = data.customers?.[0]?.id
  })

  if (!customerId) {
    console.log("未找到客户数据，跳过详情/搜索/订单历史步骤")
    return
  }

  await runStep("客户详情", async () => {
    const { response } = await adminRequest({
      token,
      path: `/admin/customers/${customerId}`,
    })
    assert.equal(response.status, 200, `客户详情查询失败: ${response.status}`)
  })

  await runStep("客户搜索", async () => {
    const { response } = await adminRequest({
      token,
      path: "/admin/customers?q=test",
    })
    assert.equal(response.status, 200, `客户搜索失败: ${response.status}`)
  })

  await runStep("客户订单历史", async () => {
    const { response } = await adminRequest({
      token,
      path: `/admin/orders?customer_id=${customerId}`,
    })
    assert.equal(response.status, 200, `客户订单历史查询失败: ${response.status}`)
  })
})
