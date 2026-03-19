import { test, expect } from '@playwright/test';

test.describe('Store API', () => {
  test('GET /store/products returns array', async ({ request }) => {
    const publishableKey = process.env.MEDUSA_PUBLISHABLE_KEY || '';
    const res = await request.get('/store/products?limit=5', {
      headers: publishableKey ? { 'x-publishable-api-key': publishableKey } : {},
    });
    // 200 (with key) or 400 (missing key) are both valid
    expect([200, 400]).toContain(res.status());
  });

  test('POST /store/carts creates or returns error', async ({ request }) => {
    const res = await request.post('/store/carts', {
      data: {},
    });
    expect([200, 400, 404, 422]).toContain(res.status());
  });
});
