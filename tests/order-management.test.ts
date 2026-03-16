import test from "node:test"
import assert from "node:assert/strict"
import { adminRequest, getAdminToken, runStep } from "./helpers"

test("订单管理回归测试", async () => {
  const token = await getAdminToken()
  let orderId: string | undefined

  await runStep("查看订单列表", async () => {
    const { response, data } = await adminRequest<{ orders?: Array<{ id: string }> }>({
      token,
      path: "/admin/orders",
    })
    assert.equal(response.status, 200, `订单列表查询失败: ${response.status}`)
    assert.ok(Array.isArray(data.orders), "orders 字段不是数组")
    orderId = data.orders?.[0]?.id
    console.log("当前可用订单 ID:", orderId || "无")
  })

  if (!orderId) {
    console.log("未找到可操作订单，跳过订单详情/状态流转/发货/取消步骤")
    return
  }

  await runStep("查看订单详情", async () => {
    const { response } = await adminRequest({
      token,
      path: `/admin/orders/${orderId}`,
    })
    assert.equal(response.status, 200, `订单详情查询失败: ${response.status}`)
  })

  await runStep("订单状态流转", async () => {
    const { response } = await adminRequest({
      token,
      method: "POST",
      path: `/admin/orders/${orderId}/archive`,
      body: {},
    })
    assert.ok([200].includes(response.status), `订单状态流转失败: ${response.status}`)
  })

  await runStep("标记发货", async () => {
    const { response } = await adminRequest({
      token,
      method: "POST",
      path: `/admin/orders/${orderId}/fulfillments`,
      body: {},
    })
    assert.ok([200, 201, 400].includes(response.status), `标记发货返回异常状态: ${response.status}`)
  })

  await runStep("取消订单", async () => {
    const { response } = await adminRequest({
      token,
      method: "POST",
      path: `/admin/orders/${orderId}/cancel`,
      body: {},
    })
    assert.ok([200, 400].includes(response.status), `取消订单返回异常状态: ${response.status}`)
  })
})
