import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

type HealthStatus = "ok" | "error";
type RedisStatus = HealthStatus | "skipped";

type RedisClient = {
  ping: () => Promise<unknown>;
};

type PgConnection = {
  raw: (query: string) => Promise<unknown>;
};

const APP_VERSION = "0.0.1";

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

const checkRedis = async (req: MedusaRequest): Promise<RedisStatus> => {
  if (!process.env.REDIS_URL) {
    return "skipped";
  }

  try {
    const redisClient = resolveRedisClient(req);
    if (!redisClient) {
      return "error";
    }

    await redisClient.ping();
    return "ok";
  } catch {
    return "error";
  }
};

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const [database, redis] = await Promise.all([checkDatabase(req), checkRedis(req)]);

  return res.status(200).json({
    status: "ok",
    version: APP_VERSION,
    timestamp: new Date().toISOString(),
    checks: {
      database,
      redis,
    },
  });
}
