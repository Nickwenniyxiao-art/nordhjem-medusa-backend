import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

type HealthStatus = "ok" | "error";

type RedisClient = {
  ping: () => Promise<unknown>;
};

type PgConnection = {
  raw: (query: string) => Promise<unknown>;
};

type RedisConstructor = new (
  url: string,
  opts: Record<string, unknown>
) => {
  connect: () => Promise<void>;
  ping: () => Promise<string>;
  disconnect: () => void;
};

const API_VERSION = "1.0.0";

const resolveRedisClient = (req: MedusaRequest): RedisClient | null => {
  const candidateKeys = ["redis", "redisClient", "cache"];

  for (const key of candidateKeys) {
    try {
      const candidate = req.scope.resolve(key) as Partial<RedisClient>;
      if (candidate && typeof candidate.ping === "function") {
        return candidate as RedisClient;
      }
    } catch {
      continue;
    }
  }

  return null;
};

const checkDatabase = async (req: MedusaRequest): Promise<HealthStatus> => {
  try {
    const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION) as PgConnection;
    await pgConnection.raw("SELECT 1");
    return "ok";
  } catch {
    return "error";
  }
};

const checkRedis = async (req: MedusaRequest): Promise<HealthStatus> => {
  try {
    // First try DI container
    const redisClient = resolveRedisClient(req);
    if (redisClient) {
      await redisClient.ping();
      return "ok";
    }

    // Fallback: direct connection test using REDIS_URL
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      return "ok"; // No Redis configured, not an error
    }

    const ioredis = await import("ioredis");
    const Redis = ioredis.default as unknown as RedisConstructor;
    const testClient = new Redis(redisUrl, {
      connectTimeout: 5000,
      maxRetriesPerRequest: 1,
      lazyConnect: true,
    });

    try {
      await testClient.connect();
      await testClient.ping();
      return "ok";
    } finally {
      testClient.disconnect();
    }
  } catch {
    return "error";
  }
};

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const [database, redis] = await Promise.all([checkDatabase(req), checkRedis(req)]);
  const isHealthy = database === "ok" && redis === "ok";

  return res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? "ok" : "error",
    timestamp: new Date().toISOString(),
    version: API_VERSION,
    checks: {
      database,
      redis,
    },
  });
}
