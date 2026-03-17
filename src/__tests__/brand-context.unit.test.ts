import { describe, expect, it, jest } from "@jest/globals";
import { brandContextMiddleware } from "../api/middlewares/brand-context";

const brandA = {
  id: "brand_1",
  name: "Brand A",
  slug: "brand-a",
  logo_url: null,
  primary_color: null,
  domain: "example.com",
  metadata: { sales_channel_id: "sc_1" },
};

describe("brandContextMiddleware", () => {
  it("resolves brand context from x-brand-id header", async () => {
    const retrieveBrand = jest.fn().mockResolvedValue(brandA);
    const listBrands = jest.fn();
    const next = jest.fn();

    const req: any = {
      headers: { "x-brand-id": "brand_1" },
      scope: { resolve: () => ({ retrieveBrand, listBrands }) },
    };

    await brandContextMiddleware(req, {} as any, next);

    expect(retrieveBrand).toHaveBeenCalledWith("brand_1");
    expect(listBrands).not.toHaveBeenCalled();
    expect(req.brand_context).toEqual({ brand_id: "brand_1", sales_channel_id: "sc_1" });
    expect(next).toHaveBeenCalled();
  });

  it("falls back to host-based brand lookup when header is absent", async () => {
    const retrieveBrand = jest.fn();
    const listBrands = jest.fn().mockResolvedValue([brandA]);
    const next = jest.fn();

    const req: any = {
      headers: { host: "Example.com:9000" },
      scope: { resolve: () => ({ retrieveBrand, listBrands }) },
    };

    await brandContextMiddleware(req, {} as any, next);

    expect(listBrands).toHaveBeenCalledWith({ domain: "example.com" }, { take: 1 });
    expect(req.brand_context).toEqual({ brand_id: "brand_1", sales_channel_id: "sc_1" });
    expect(next).toHaveBeenCalled();
  });

  it("leaves brand_context undefined when no brand is found", async () => {
    const next = jest.fn();

    const req: any = {
      headers: { host: "unknown.com" },
      scope: {
        resolve: () => ({ retrieveBrand: jest.fn(), listBrands: jest.fn().mockResolvedValue([]) }),
      },
    };

    await brandContextMiddleware(req, {} as any, next);

    expect(req.brand_context).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });
});
