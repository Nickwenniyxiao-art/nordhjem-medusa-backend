import { expect, test } from "@playwright/test"

test("store products endpoint responds successfully", async ({ request }) => {
  const response = await request.get("/store/products")

  expect(response.ok()).toBeTruthy()
})
