import { StoreCreateRestockSubscription } from '../api/store/restock-subscriptions/validators';

describe('restock subscription validators', () => {
  it('accepts a valid payload', () => {
    const payload = {
      variant_id: 'variant_123',
      email: 'test@example.com',
      sales_channel_id: 'sc_123',
    };

    expect(StoreCreateRestockSubscription.parse(payload)).toEqual(payload);
  });

  it('rejects payloads missing variant_id', () => {
    const parsed = StoreCreateRestockSubscription.safeParse({
      email: 'test@example.com',
    });

    expect(parsed.success).toBe(false);
  });
});
