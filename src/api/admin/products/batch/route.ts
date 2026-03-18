import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";

type ProductBatchAction = "publish" | "unpublish" | "update_prices" | "update_inventory";

type ProductBatchBody = {
  action?: ProductBatchAction;
  product_ids?: string[];
  data?: {
    status?: string;
    prices?: Array<{ id?: string; amount?: number; currency_code?: string }>;
    inventory_quantity?: number;
    [key: string]: unknown;
  };
};


function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error";
}

function isValidAction(action: string | undefined): action is ProductBatchAction {
  return !!action && ["publish", "unpublish", "update_prices", "update_inventory"].includes(action);
}

function buildUpdatePayload(
  action: ProductBatchAction,
  productId: string,
  data: ProductBatchBody["data"],
): Record<string, unknown> {
  if (action === "publish") {
    return { id: productId, status: data?.status ?? "published" };
  }

  if (action === "unpublish") {
    return { id: productId, status: data?.status ?? "draft" };
  }

  if (action === "update_prices") {
    return {
      id: productId,
      variants: [
        {
          prices: Array.isArray(data?.prices) ? data?.prices : [],
        },
      ],
    };
  }

  return {
    id: productId,
    metadata: {
      inventory_quantity: data?.inventory_quantity ?? 0,
    },
  };
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const body = (req.body ?? {}) as ProductBatchBody;

  if (!isValidAction(body.action)) {
    return res
      .status(400)
      .json({ error: "action must be one of publish, unpublish, update_prices, update_inventory" });
  }

  if (!Array.isArray(body.product_ids) || body.product_ids.length === 0) {
    return res.status(400).json({ error: "product_ids cannot be empty" });
  }

  const productService = req.scope.resolve(Modules.PRODUCT) as any;
  const errors: Array<{ product_id: string; error: string }> = [];
  let success = 0;

  for (const productId of body.product_ids) {
    try {
      if (!productId) {
        throw new Error("product_id is required");
      }

      if (typeof productService.retrieveProduct === "function") {
        await productService.retrieveProduct(productId);
      }

      if (typeof productService.updateProducts !== "function") {
        throw new Error("ProductModuleService.updateProducts is unavailable");
      }

      await productService.updateProducts([buildUpdatePayload(body.action, productId, body.data)]);
      success += 1;
    } catch (error) {
      errors.push({
        product_id: productId,
        error: getErrorMessage(error),
      });
    }
  }

  return res.status(200).json({
    success,
    failed: errors.length,
    errors,
  });
}
