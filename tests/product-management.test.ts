import test from "node:test"
import assert from "node:assert/strict"
import { adminRequest, getAdminToken, runStep, testPrefix } from "./helpers"

test("商品管理回归测试", async () => {
  const token = await getAdminToken()
  const prefix = testPrefix("product")

  let productId: string | undefined
  let variantId: string | undefined

  try {
    await runStep("创建商品（唯一前缀）", async () => {
      const { response, data } = await adminRequest<{ product?: { id: string } }>({
        token,
        method: "POST",
        path: "/admin/products",
        body: {
          title: `${prefix}-chair`,
          description: `${prefix}-desc`,
          status: "draft",
          options: [{ title: "尺寸", values: ["M"] }],
        },
      })
      assert.ok([200, 201].includes(response.status), `创建商品失败: ${response.status}`)
      productId = data.product?.id
      assert.ok(productId, "创建商品后未返回 product.id")
    })

    await runStep("编辑商品标题和描述", async () => {
      assert.ok(productId, "缺少 productId")
      const { response } = await adminRequest({
        token,
        method: "POST",
        path: `/admin/products/${productId}`,
        body: {
          title: `${prefix}-chair-updated`,
          description: `${prefix}-desc-updated`,
        },
      })
      assert.ok([200].includes(response.status), `编辑商品失败: ${response.status}`)
    })

    await runStep("添加变体和价格", async () => {
      assert.ok(productId, "缺少 productId")
      const { response, data } = await adminRequest<{ variant?: { id: string }; product?: { variants?: Array<{ id: string }> } }>({
        token,
        method: "POST",
        path: `/admin/products/${productId}/variants`,
        body: {
          title: `${prefix}-variant`,
          options: { 尺寸: "M" },
          prices: [{ currency_code: "usd", amount: 19900 }],
          manage_inventory: false,
        },
      })
      assert.ok([200, 201].includes(response.status), `添加变体失败: ${response.status}`)
      variantId = data.variant?.id ?? data.product?.variants?.[0]?.id
      assert.ok(variantId, "添加变体后未返回 variant.id")
    })

    await runStep("发布商品", async () => {
      assert.ok(productId, "缺少 productId")
      const { response } = await adminRequest({
        token,
        method: "POST",
        path: `/admin/products/${productId}/publish`,
        body: {},
      })
      assert.ok([200].includes(response.status), `发布商品失败: ${response.status}`)
    })

    await runStep("下架商品", async () => {
      assert.ok(productId, "缺少 productId")
      const { response } = await adminRequest({
        token,
        method: "POST",
        path: `/admin/products/${productId}/unpublish`,
        body: {},
      })
      assert.ok([200].includes(response.status), `下架商品失败: ${response.status}`)
    })

    await runStep("删除商品并验证不可查询", async () => {
      assert.ok(productId, "缺少 productId")
      const deleteResult = await adminRequest({
        token,
        method: "DELETE",
        path: `/admin/products/${productId}`,
      })
      assert.ok([200].includes(deleteResult.response.status), `删除商品失败: ${deleteResult.response.status}`)

      const getResult = await adminRequest({
        token,
        path: `/admin/products/${productId}`,
      })
      assert.ok([404].includes(getResult.response.status), `删除后仍可查询商品: ${getResult.response.status}`)
      productId = undefined
    })
  } finally {
    if (productId) {
      console.log(`[清理] 删除商品 ${productId}`)
      await adminRequest({ token, method: "DELETE", path: `/admin/products/${productId}` })
    }

    if (variantId) {
      console.log(`[清理提示] 变体 ${variantId} 会随商品删除`) 
    }
  }
})
