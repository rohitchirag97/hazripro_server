import Redis from "ioredis";
import { env } from "./env";

const withRedis = async <T>(operation: (client: Redis) => Promise<T>) => {
  const client = new Redis(env.REDIS_URL, {
    lazyConnect: true,
    connectTimeout: 5000,
    maxRetriesPerRequest: 1,
    retryStrategy: () => null,
  });

  try {
    await client.connect();
    return await operation(client);
  } finally {
    client.disconnect();
  }
};

export const set = async (
  key: string,
  value: string,
  expireInSeconds?: number,
) => {
  if (expireInSeconds) {
    return withRedis((client) =>
      expireInSeconds
        ? client.set(key, value, "EX", expireInSeconds)
        : client.set(key, value),
    );
  } else {
    return withRedis((client) => client.set(key, value));
  }
};

export const get = async (key: string) => {
  return withRedis((client) => client.get(key));
};

export const del = async (key: string) => {
  return withRedis((client) => client.del(key));
};
