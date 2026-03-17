import { describe, expect, it } from "@jest/globals";
import { StoreCreateRestockSubscription } from "../api/store/restock-subscriptions/validators";

describe("StoreCreateRestockSubscription schema", () => {
  it("parses valid payload with required field only", () => {
    const parsed = StoreCreateRestockSubscription.parse({ variant_id: "variant_123" });

    expect(parsed).toEqual({ variant_id: "variant_123" });
  });

  it("rejects empty variant_id", () => {
    expect(() =>
      StoreCreateRestockSubscription.parse({
        variant_id: "",
        email: "valid@example.com",
      }),
    ).toThrow();
  });

  it("rejects invalid email format when email is provided", () => {
    expect(() =>
      StoreCreateRestockSubscription.parse({
        variant_id: "variant_123",
        email: "not-an-email",
      }),
    ).toThrow();
  });
});
