import { test, expect } from '@playwright/test';

test.describe('Health & Availability', () => {
  test('GET /health returns 200', async ({ request }) => {
    const res = await request.get('/health');
    expect(res.status()).toBe(200);
  });

  test('GET /admin redirects or returns 200', async ({ request }) => {
    const res = await request.get('/admin');
    expect([200, 301, 302, 401]).toContain(res.status());
  });
});
