import { StoreCreateRestockSubscription } from "../api/store/restock-subscriptions/validators";

describe("StoreCreateRestockSubscription schema", () => {
  it("accepts a valid payload", () => {
    const result = StoreCreateRestockSubscription.parse({
      variant_id: "variant_123",
      email: "test@example.com",
      sales_channel_id: "sc_123",
    });

    expect(result.variant_id).toEqual("variant_123");
  });

  it("rejects payloads missing variant_id", () => {
    const parsed = StoreCreateRestockSubscription.safeParse({
      email: "test@example.com",
    });

    expect(parsed.success).toBe(false);
  });
});
