import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { GET } from "../api/health/route";

type ScopeResolver = (key: string) => unknown;

const createReq = (resolve: ScopeResolver) =>
  ({
    scope: { resolve },
  }) as any;

const createRes = () => {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });

  return {
    status,
    json,
  };
};

describe("api health GET", () => {
  afterEach(() => {
    delete process.env.REDIS_URL;
  });

  it("returns 200 when database and redis checks pass", async () => {
    const resolve: ScopeResolver = (key) => {
      if (key === ContainerRegistrationKeys.PG_CONNECTION) {
        return { raw: jest.fn().mockResolvedValue({}) };
      }

      if (key === "redis") {
        return { ping: jest.fn().mockResolvedValue("PONG") };
      }

      throw new Error("not found");
    };

    const req = createReq(resolve);
    const res = createRes();

    await GET(req, res as any);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "ok",
        checks: { database: "ok", redis: "ok" },
      }),
    );
  });

  it("returns 503 when database check fails", async () => {
    const resolve: ScopeResolver = (key) => {
      if (key === ContainerRegistrationKeys.PG_CONNECTION) {
        return { raw: jest.fn().mockRejectedValue(new Error("db down")) };
      }

      if (key === "redis") {
        return { ping: jest.fn().mockResolvedValue("PONG") };
      }

      throw new Error("not found");
    };

    const req = createReq(resolve);
    const res = createRes();

    await GET(req, res as any);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "error",
        checks: { database: "error", redis: "ok" },
      }),
    );
  });

  it("treats missing redis client as ok when REDIS_URL is not set", async () => {
    const resolve: ScopeResolver = (key) => {
      if (key === ContainerRegistrationKeys.PG_CONNECTION) {
        return { raw: jest.fn().mockResolvedValue({}) };
      }

      throw new Error(`missing ${key}`);
    };

    const req = createReq(resolve);
    const res = createRes();

    await GET(req, res as any);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ checks: { database: "ok", redis: "ok" } }),
    );
  });
});
