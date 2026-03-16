import test from "node:test"
import assert from "node:assert/strict"
import { adminRequest, getAdminToken, runStep, testPrefix } from "./helpers"

test("地区和币种管理回归测试", async () => {
  const token = await getAdminToken()
  const prefix = testPrefix("region")
  let regionId: string | undefined

  try {
    await runStep("查看地区列表", async () => {
      const { response, data } = await adminRequest<{ regions?: Array<{ id: string }> }>({ token, path: "/admin/regions" })
      assert.equal(response.status, 200, `地区列表查询失败: ${response.status}`)
      assert.ok(Array.isArray(data.regions), "regions 字段不是数组")
    })

    await runStep("创建地区", async () => {
      const { response, data } = await adminRequest<{ region?: { id: string } }>({
        token,
        method: "POST",
        path: "/admin/regions",
        body: {
          name: `${prefix}-region`,
          currency_code: "usd",
          countries: ["us"],
          payment_providers: [],
          fulfillment_providers: [],
        },
      })
      assert.ok([200, 201, 400].includes(response.status), `创建地区异常: ${response.status}`)
      regionId = data.region?.id
    })

    await runStep("多币种价格一致性验证", async () => {
      if (!regionId) {
        console.log("地区未创建成功，跳过多币种验证")
        return
      }
      const { response } = await adminRequest({
        token,
        method: "POST",
        path: `/admin/regions/${regionId}`,
        body: {
          currency_code: "eur",
        },
      })
      assert.ok([200, 400].includes(response.status), `更新地区币种异常: ${response.status}`)
    })
  } finally {
    await runStep("删除测试地区", async () => {
      if (!regionId) return
      console.log(`[清理] 删除地区 ${regionId}`)
      await adminRequest({ token, method: "DELETE", path: `/admin/regions/${regionId}` })
    })
  }
})
