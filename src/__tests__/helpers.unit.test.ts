import { describe, expect, it } from "@jest/globals";
import { testPrefix } from "../../tests/helpers";

describe("testPrefix", () => {
  it("adds test prefix and scope", () => {
    const value = testPrefix("orders");

    expect(value.startsWith("test-orders-")).toBe(true);
  });

  it("returns different values for consecutive calls", async () => {
    const first = testPrefix("scope");
    await new Promise((resolve) => setTimeout(resolve, 1));
    const second = testPrefix("scope");

    expect(first).not.toEqual(second);
  });

  it("preserves arbitrary scope values", () => {
    const value = testPrefix("checkout-flow");

    expect(value).toMatch(/^test-checkout-flow-\d+$/);
  });
});
