import { expect, test } from "@playwright/test"

test("health endpoint responds successfully", async ({ request }) => {
  const response = await request.get("/health")

  expect(response.ok()).toBeTruthy()
})
