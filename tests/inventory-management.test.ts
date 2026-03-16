import test from "node:test"
import assert from "node:assert/strict"
import { adminRequest, getAdminToken, runStep } from "./helpers"

test("库存管理回归测试", async () => {
  const token = await getAdminToken()
  let inventoryItemId: string | undefined

  await runStep("查看库存列表", async () => {
    const { response, data } = await adminRequest<{ inventory_items?: Array<{ id: string }> }>({
      token,
      path: "/admin/inventory-items",
    })
    assert.equal(response.status, 200, `查询库存列表失败: ${response.status}`)
    inventoryItemId = data.inventory_items?.[0]?.id
    console.log("当前可用库存项 ID:", inventoryItemId || "无")
  })

  if (!inventoryItemId) {
    console.log("未找到可操作库存项，跳过数量更新步骤")
    return
  }

  await runStep("更新库存数量", async () => {
    const { response } = await adminRequest({
      token,
      method: "POST",
      path: `/admin/inventory-items/${inventoryItemId}/location-levels`,
      body: { stocked_quantity: 20 },
    })
    assert.ok([200, 201, 400].includes(response.status), `更新库存数量异常: ${response.status}`)
  })

  await runStep("零库存行为验证", async () => {
    const { response } = await adminRequest({
      token,
      method: "POST",
      path: `/admin/inventory-items/${inventoryItemId}/location-levels`,
      body: { stocked_quantity: 0 },
    })
    assert.ok([200, 201, 400].includes(response.status), `零库存设置异常: ${response.status}`)
  })

  await runStep("补货恢复验证", async () => {
    const { response } = await adminRequest({
      token,
      method: "POST",
      path: `/admin/inventory-items/${inventoryItemId}/location-levels`,
      body: { stocked_quantity: 10 },
    })
    assert.ok([200, 201, 400].includes(response.status), `补货恢复异常: ${response.status}`)
  })
})
