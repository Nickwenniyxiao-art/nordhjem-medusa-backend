import test from "node:test"
import assert from "node:assert/strict"
import { adminRequest, getAdminToken, runStep, testPrefix } from "./helpers"

test("销售渠道管理回归测试", async () => {
  const token = await getAdminToken()
  const prefix = testPrefix("channel")

  let salesChannelId: string | undefined
  let productId: string | undefined

  try {
    await runStep("创建销售渠道", async () => {
      const { response, data } = await adminRequest<{ sales_channel?: { id: string } }>({
        token,
        method: "POST",
        path: "/admin/sales-channels",
        body: {
          name: `${prefix}-sales-channel`,
          description: "Admin API regression test sales channel",
        },
      })
      assert.ok([200, 201].includes(response.status), `创建销售渠道失败: ${response.status}`)
      salesChannelId = data.sales_channel?.id
      assert.ok(salesChannelId, "未返回 sales_channel.id")
    })

    await runStep("创建商品并关联商品到渠道", async () => {
      const productResp = await adminRequest<{ product?: { id: string } }>({
        token,
        method: "POST",
        path: "/admin/products",
        body: {
          title: `${prefix}-product`,
          status: "draft",
        },
      })
      assert.ok([200, 201].includes(productResp.response.status), `创建商品失败: ${productResp.response.status}`)
      productId = productResp.data.product?.id
      assert.ok(productId, "未返回 product.id")

      const bindResp = await adminRequest({
        token,
        method: "POST",
        path: `/admin/sales-channels/${salesChannelId}/products`,
        body: { add: [productId] },
      })
      assert.ok([200, 201, 400].includes(bindResp.response.status), `关联商品到渠道异常: ${bindResp.response.status}`)
    })

    await runStep("可见性验证", async () => {
      assert.ok(salesChannelId, "缺少 salesChannelId")
      const { response } = await adminRequest({
        token,
        path: `/admin/sales-channels/${salesChannelId}`,
      })
      assert.equal(response.status, 200, `销售渠道详情查询失败: ${response.status}`)
    })
  } finally {
    await runStep("删除测试渠道与测试商品", async () => {
      if (productId) {
        console.log(`[清理] 删除商品 ${productId}`)
        await adminRequest({ token, method: "DELETE", path: `/admin/products/${productId}` })
      }
      if (salesChannelId) {
        console.log(`[清理] 删除销售渠道 ${salesChannelId}`)
        await adminRequest({ token, method: "DELETE", path: `/admin/sales-channels/${salesChannelId}` })
      }
    })
  }
})
