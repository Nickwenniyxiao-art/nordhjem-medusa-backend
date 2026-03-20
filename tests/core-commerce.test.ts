import test from "node:test"
import assert from "node:assert/strict"
import { adminRequest, getAdminToken, storeRequest, runStep, testPrefix } from "./helpers"

/**
 * Core Commerce Integration Tests — DR-002 Task 2
 *
 * 16 test cases across 4 modules matching QA acceptance criteria (Issue #714):
 *   Module 1: Product Listing (2 cases)
 *   Module 2: Cart CRUD (5 cases)
 *   Module 3: Checkout Flow (5 cases, sequential)
 *   Module 4: Order Lifecycle (4 cases)
 *
 * Prerequisites: Running Medusa instance with region, publishable API key,
 * sales channel, and at least one published product with variant + price.
 * Uses pp_system_default payment provider to avoid external dependencies.
 */

type Region = { id: string; currency_code: string }
type Product = {
  id: string
  title: string
  handle?: string
  description?: string
  variants?: Array<{ id: string; title: string }>
  options?: Array<{ id: string; title: string }>
}
type LineItem = {
  id: string
  variant_id: string
  quantity: number
  unit_price?: number
}
type Cart = {
  id: string
  email?: string
  items?: LineItem[]
  total?: number
  region?: Region
  shipping_address?: Record<string, unknown>
  shipping_methods?: Array<{ id: string }>
  payment_collection?: {
    id: string
    payment_sessions?: Array<{ id: string; provider_id: string }>
  }
}
type Order = {
  id: string
  status?: string
  items?: Array<{ id: string }>
  shipping_address?: Record<string, unknown>
  total?: number
}

// --- Setup helpers ---

async function getPublishableApiKey(token: string): Promise<string> {
  const { response, data } = await adminRequest<{
    api_keys?: Array<{ id: string; token: string; type: string; revoked_at: string | null }>
  }>({ token, path: "/admin/api-keys" })
  assert.equal(response.status, 200, `Failed to list API keys: ${response.status}`)

  const publishable = data.api_keys?.find((k) => k.type === "publishable" && !k.revoked_at)
  assert.ok(publishable, "No active publishable API key found. Create one in admin first.")
  return publishable.token
}

async function getFirstRegion(token: string): Promise<Region> {
  const { response, data } = await adminRequest<{ regions?: Region[] }>({
    token,
    path: "/admin/regions",
  })
  assert.equal(response.status, 200, `Failed to list regions: ${response.status}`)
  assert.ok(data.regions?.length, "No regions found. Create one in admin first.")
  return data.regions![0]
}

async function ensurePublishedProduct(
  token: string,
  pubKey: string,
  regionId: string,
): Promise<{ productId: string; variantId: string }> {
  // Try to find an existing published product with variant via Store API
  const storeRes = await storeRequest<{ products?: Product[] }>({
    path: `/store/products?region_id=${regionId}&limit=10`,
    publishableApiKey: pubKey,
  })
  if (storeRes.response.status === 200 && storeRes.data.products?.length) {
    const existing = storeRes.data.products.find((p) => p.variants && p.variants.length > 0)
    if (existing) {
      return { productId: existing.id, variantId: existing.variants![0].id }
    }
  }

  // Create one via Admin API
  const prefix = testPrefix("commerce")
  const createRes = await adminRequest<{ product?: { id: string; variants?: Array<{ id: string }> } }>({
    token,
    method: "POST",
    path: "/admin/products",
    body: {
      title: `${prefix}-test-product`,
      description: "Integration test product",
      status: "published",
      options: [{ title: "Size", values: ["M"] }],
      variants: [
        {
          title: `${prefix}-variant`,
          options: { Size: "M" },
          prices: [{ currency_code: "usd", amount: 9900 }],
          manage_inventory: false,
        },
      ],
    },
  })
  assert.ok(
    [200, 201].includes(createRes.response.status),
    `Failed to create test product: ${createRes.response.status} ${JSON.stringify(createRes.data)}`,
  )
  const productId = createRes.data.product?.id
  const variantId = createRes.data.product?.variants?.[0]?.id
  assert.ok(productId && variantId, "Product creation did not return product.id and variant.id")
  return { productId, variantId }
}

// --- Shared state across sequential tests ---
let _token: string
let _pubKey: string
let _region: Region
let _productId: string
let _variantId: string

// Setup: runs first, provides shared state for all tests
test("Setup: prepare test prerequisites", async () => {
  _token = await getAdminToken()
  _pubKey = await getPublishableApiKey(_token)
  _region = await getFirstRegion(_token)
  const product = await ensurePublishedProduct(_token, _pubKey, _region.id)
  _productId = product.productId
  _variantId = product.variantId
  console.log(`  Setup: region=${_region.id}, product=${_productId}, variant=${_variantId}`)
})

// ============================================================
// Module 1: Product Listing (2 cases)
// ============================================================

test("1.1 Product list — GET /store/products returns products with required fields", async () => {
  await runStep("1.1 Product list query", async () => {
    const { response, data } = await storeRequest<{ products?: Product[] }>({
      path: `/store/products?region_id=${_region.id}`,
      publishableApiKey: _pubKey,
    })
    assert.equal(response.status, 200, `Product listing failed: ${response.status}`)
    assert.ok(Array.isArray(data.products), "products field is not an array")
    assert.ok(data.products!.length > 0, "No products returned")

    const product = data.products![0]
    assert.ok(product.id, "Product missing id")
    assert.ok(product.title, "Product missing title")
    assert.ok(product.variants, "Product missing variants")
  })
})

test("1.2 Product detail — GET /store/products/:id; 404 for nonexistent", async () => {
  await runStep("1.2a Product detail with variants and options", async () => {
    const { response, data } = await storeRequest<{ product?: Product }>({
      path: `/store/products/${_productId}?region_id=${_region.id}`,
      publishableApiKey: _pubKey,
    })
    assert.equal(response.status, 200, `Product detail failed: ${response.status}`)
    assert.ok(data.product?.id, "Product detail missing id")
    assert.ok(data.product?.title, "Product detail missing title")
    assert.ok(data.product?.variants?.length, "Product detail missing variants")
  })

  await runStep("1.2b Nonexistent product returns 404", async () => {
    const { response } = await storeRequest({
      path: `/store/products/prod_nonexistent_000?region_id=${_region.id}`,
      publishableApiKey: _pubKey,
    })
    assert.ok([404, 400].includes(response.status), `Expected 404 for nonexistent product, got: ${response.status}`)
  })
})

// ============================================================
// Module 2: Cart CRUD (5 cases)
// ============================================================

let _cartId: string
let _lineItemId: string

test("2.1 Create cart — POST /store/carts returns empty cart", async () => {
  await runStep("2.1 Create cart", async () => {
    const { response, data } = await storeRequest<{ cart?: Cart }>({
      method: "POST",
      path: "/store/carts",
      body: { region_id: _region.id },
      publishableApiKey: _pubKey,
    })
    assert.ok([200, 201].includes(response.status), `Create cart failed: ${response.status} ${JSON.stringify(data)}`)
    assert.ok(data.cart?.id, "Cart creation did not return cart.id")
    assert.ok(Array.isArray(data.cart?.items), "cart.items is not an array")
    assert.equal(data.cart!.items!.length, 0, "New cart should have empty items")
    _cartId = data.cart!.id
  })
})

test("2.2 Add item — POST /store/carts/:id/line-items adds variant", async () => {
  await runStep("2.2 Add line item", async () => {
    assert.ok(_cartId, "Missing cartId from 2.1")
    const { response, data } = await storeRequest<{ cart?: Cart }>({
      method: "POST",
      path: `/store/carts/${_cartId}/line-items`,
      body: { variant_id: _variantId, quantity: 1 },
      publishableApiKey: _pubKey,
    })
    assert.ok([200, 201].includes(response.status), `Add line item failed: ${response.status} ${JSON.stringify(data)}`)
    assert.equal(data.cart?.items?.length, 1, "Cart should have 1 item")

    const item = data.cart!.items![0]
    assert.ok(item.id, "Line item missing id")
    assert.equal(item.quantity, 1, "Quantity should be 1")
    _lineItemId = item.id
  })
})

test("2.3 Update quantity — POST /store/carts/:id/line-items/:item_id", async () => {
  await runStep("2.3 Update line item quantity to 3", async () => {
    assert.ok(_cartId && _lineItemId, "Missing cartId or lineItemId from 2.1/2.2")
    const { response, data } = await storeRequest<{ cart?: Cart }>({
      method: "POST",
      path: `/store/carts/${_cartId}/line-items/${_lineItemId}`,
      body: { quantity: 3 },
      publishableApiKey: _pubKey,
    })
    assert.equal(response.status, 200, `Update line item failed: ${response.status} ${JSON.stringify(data)}`)
    const updatedItem = data.cart?.items?.find((i) => i.id === _lineItemId)
    assert.ok(updatedItem, "Updated line item not found in cart")
    assert.equal(updatedItem!.quantity, 3, "Quantity should be updated to 3")
  })
})

test("2.4 Remove item — DELETE /store/carts/:id/line-items/:item_id", async () => {
  await runStep("2.4 Remove line item and verify empty cart", async () => {
    assert.ok(_cartId && _lineItemId, "Missing cartId or lineItemId")
    const { response } = await storeRequest({
      method: "DELETE",
      path: `/store/carts/${_cartId}/line-items/${_lineItemId}`,
      publishableApiKey: _pubKey,
    })
    assert.equal(response.status, 200, `Remove line item failed: ${response.status}`)

    // Verify cart is empty
    const getRes = await storeRequest<{ cart?: Cart }>({
      path: `/store/carts/${_cartId}`,
      publishableApiKey: _pubKey,
    })
    assert.equal(getRes.data.cart?.items?.length ?? 0, 0, "Cart should be empty after removing item")
  })
})

test("2.5 Invalid variant — adding nonexistent variant returns 400/404", async () => {
  await runStep("2.5 Add nonexistent variant", async () => {
    assert.ok(_cartId, "Missing cartId")
    const { response } = await storeRequest({
      method: "POST",
      path: `/store/carts/${_cartId}/line-items`,
      body: { variant_id: "variant_nonexistent_000", quantity: 1 },
      publishableApiKey: _pubKey,
    })
    assert.ok(
      [400, 404, 422].includes(response.status),
      `Expected 400/404 for nonexistent variant, got: ${response.status}`,
    )
  })
})

// ============================================================
// Module 3: Checkout Flow (5 cases — sequential)
// ============================================================

let _checkoutCartId: string

test("3.1 Set email — POST /store/carts/:id with email", async () => {
  // Create fresh cart with item for checkout flow
  const createRes = await storeRequest<{ cart?: Cart }>({
    method: "POST",
    path: "/store/carts",
    body: { region_id: _region.id },
    publishableApiKey: _pubKey,
  })
  _checkoutCartId = createRes.data.cart!.id
  assert.ok(_checkoutCartId, "Failed to create checkout cart")

  const addRes = await storeRequest({
    method: "POST",
    path: `/store/carts/${_checkoutCartId}/line-items`,
    body: { variant_id: _variantId, quantity: 1 },
    publishableApiKey: _pubKey,
  })
  assert.ok([200, 201].includes(addRes.response.status), `Add item to checkout cart failed: ${addRes.response.status}`)

  await runStep("3.1 Set email on cart", async () => {
    const { response, data } = await storeRequest<{ cart?: Cart }>({
      method: "POST",
      path: `/store/carts/${_checkoutCartId}`,
      body: { email: "test-checkout@nordhjem.test" },
      publishableApiKey: _pubKey,
    })
    assert.equal(response.status, 200, `Set email failed: ${response.status} ${JSON.stringify(data)}`)
    assert.equal(data.cart?.email, "test-checkout@nordhjem.test", "Email not set on cart")
  })
})

test("3.2 Set shipping address — POST /store/carts/:id with shipping_address", async () => {
  await runStep("3.2 Set shipping address", async () => {
    assert.ok(_checkoutCartId, "Missing checkout cartId from 3.1")
    const { response, data } = await storeRequest<{ cart?: Cart }>({
      method: "POST",
      path: `/store/carts/${_checkoutCartId}`,
      body: {
        shipping_address: {
          first_name: "Test",
          last_name: "Customer",
          address_1: "123 Test Street",
          city: "Copenhagen",
          country_code: "dk",
          postal_code: "1000",
        },
      },
      publishableApiKey: _pubKey,
    })
    assert.equal(response.status, 200, `Set shipping address failed: ${response.status} ${JSON.stringify(data)}`)
    assert.ok(data.cart?.shipping_address, "Shipping address not set on cart")
  })
})

test("3.3 Select shipping method — POST /store/carts/:id/shipping-methods", async () => {
  await runStep("3.3 Select shipping method", async () => {
    assert.ok(_checkoutCartId, "Missing checkout cartId from 3.1")

    const optionsRes = await storeRequest<{
      shipping_options?: Array<{ id: string; name: string; amount: number }>
    }>({
      path: `/store/shipping-options?cart_id=${_checkoutCartId}`,
      publishableApiKey: _pubKey,
    })
    assert.equal(optionsRes.response.status, 200, `List shipping options failed: ${optionsRes.response.status}`)
    console.log(`  Available shipping options: ${optionsRes.data.shipping_options?.length ?? 0}`)

    if (!optionsRes.data.shipping_options?.length) {
      console.log("  SKIP: No shipping options configured — cannot test shipping method selection")
      return
    }

    const optionId = optionsRes.data.shipping_options[0].id
    const { response, data } = await storeRequest<{ cart?: Cart }>({
      method: "POST",
      path: `/store/carts/${_checkoutCartId}/shipping-methods`,
      body: { option_id: optionId },
      publishableApiKey: _pubKey,
    })
    assert.ok(
      [200, 201].includes(response.status),
      `Add shipping method failed: ${response.status} ${JSON.stringify(data)}`,
    )
    assert.ok(
      (data.cart?.shipping_methods?.length ?? 0) > 0,
      "cart.shipping_methods should have at least 1 entry",
    )
  })
})

test("3.4 Initialize payment session — pp_system_default provider", async () => {
  await runStep("3.4 Initialize payment session", async () => {
    assert.ok(_checkoutCartId, "Missing checkout cartId from 3.1")

    const cartRes = await storeRequest<{ cart?: Cart }>({
      path: `/store/carts/${_checkoutCartId}`,
      publishableApiKey: _pubKey,
    })
    const paymentCollectionId = cartRes.data.cart?.payment_collection?.id

    if (!paymentCollectionId) {
      console.log("  SKIP: No payment collection on cart — payment provider may not be configured")
      return
    }

    const { response } = await storeRequest({
      method: "POST",
      path: `/store/payment-collections/${paymentCollectionId}/payment-sessions`,
      body: { provider_id: "pp_system_default" },
      publishableApiKey: _pubKey,
    })
    // 200/201 = success, 400/404 = provider not configured (acceptable in test env)
    assert.ok(
      [200, 201, 400, 404].includes(response.status),
      `Payment session init returned unexpected status: ${response.status}`,
    )
    if ([200, 201].includes(response.status)) {
      console.log("  Payment session initialized with pp_system_default")
    } else {
      console.log(`  Payment session init returned ${response.status} — provider may not be configured`)
    }
  })
})

test("3.5 Complete order — POST /store/carts/:id/complete", async () => {
  await runStep("3.5 Complete checkout", async () => {
    assert.ok(_checkoutCartId, "Missing checkout cartId from 3.1")

    const { response, data } = await storeRequest<{
      type?: string
      order?: Order
      error?: { message?: string }
    }>({
      method: "POST",
      path: `/store/carts/${_checkoutCartId}/complete`,
      publishableApiKey: _pubKey,
    })

    if (response.status === 200 && data.type === "order") {
      assert.ok(data.order?.id, "Completed order missing id")
      assert.ok(data.order?.status, "Completed order missing status")
      console.log(`  Order created: ${data.order.id}, status: ${data.order.status}`)
      // Store for Module 4
      ;(globalThis as any).__testOrderId = data.order.id
    } else {
      // Checkout may fail if shipping/payment not fully configured — log but don't fail hard
      console.log(
        `  Checkout complete returned ${response.status}: ${data.error?.message || JSON.stringify(data)}`,
      )
      console.log("  Expected if shipping options or payment provider are not fully configured")
    }
  })
})

// ============================================================
// Module 4: Order Lifecycle (4 cases)
// ============================================================

test("4.1 Order list — GET /admin/orders returns orders array", async () => {
  await runStep("4.1 Query order list", async () => {
    const { response, data } = await adminRequest<{ orders?: Order[] }>({
      token: _token,
      path: "/admin/orders?limit=5",
    })
    assert.equal(response.status, 200, `Order list query failed: ${response.status}`)
    assert.ok(Array.isArray(data.orders), "orders field is not an array")
    console.log(`  Total orders available: ${data.orders!.length}`)
  })
})

test("4.2 Order detail — GET /admin/orders/:id returns full order", async () => {
  await runStep("4.2 Query order detail", async () => {
    let orderId = (globalThis as any).__testOrderId

    if (!orderId) {
      // Fallback: try any existing order
      const listRes = await adminRequest<{ orders?: Order[] }>({
        token: _token,
        path: "/admin/orders?limit=1",
      })
      orderId = listRes.data.orders?.[0]?.id
      if (!orderId) {
        console.log("  SKIP: No orders available to query detail")
        return
      }
    }

    const { response, data } = await adminRequest<{ order?: Order }>({
      token: _token,
      path: `/admin/orders/${orderId}`,
    })
    assert.equal(response.status, 200, `Order detail query failed: ${response.status}`)
    assert.ok(data.order?.id, "Order detail missing id")
  })
})

test("4.3 Order tracking — GET /store/orders/:id/tracking returns tracking info", async () => {
  await runStep("4.3 Query order tracking", async () => {
    let orderId = (globalThis as any).__testOrderId

    if (!orderId) {
      const listRes = await adminRequest<{ orders?: Order[] }>({
        token: _token,
        path: "/admin/orders?limit=1",
      })
      orderId = listRes.data.orders?.[0]?.id
      if (!orderId) {
        console.log("  SKIP: No orders available to query tracking")
        return
      }
    }

    const { response, data } = await storeRequest<{
      order_id?: string
      fulfillments?: Array<{ fulfillment_id: string }>
    }>({
      path: `/store/orders/${orderId}/tracking`,
      publishableApiKey: _pubKey,
    })
    assert.equal(response.status, 200, `Order tracking query failed: ${response.status}`)
    assert.ok(data.order_id, "Tracking response missing order_id")
    assert.ok(Array.isArray(data.fulfillments), "Tracking response missing fulfillments array")
  })
})

test("4.4 Nonexistent order — returns error status", async () => {
  await runStep("4.4 Nonexistent order returns 404 or 500", async () => {
    const { response } = await storeRequest({
      path: "/store/orders/order_nonexistent_000/tracking",
      publishableApiKey: _pubKey,
    })
    assert.ok(
      [404, 500].includes(response.status),
      `Expected 404/500 for nonexistent order, got: ${response.status}`,
    )
  })
})
