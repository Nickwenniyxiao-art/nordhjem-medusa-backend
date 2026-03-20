import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:9000",
    trace: "on-first-retry",
    extraHTTPHeaders: process.env.MEDUSA_PUBLISHABLE_KEY
      ? { "x-publishable-api-key": process.env.MEDUSA_PUBLISHABLE_KEY }
      : undefined,
  },
})
