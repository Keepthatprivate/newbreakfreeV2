import Redis from "ioredis";

// Redis is optional for BreakFree — no caching if not configured
const createRedisClient = () => {
  if (!process.env.REDIS_URL) {
    // Return a no-op mock client so the app builds without Redis
    const noop = () => Promise.resolve(null);
    return {
      get: noop,
      set: noop,
      setex: noop,
      del: noop,
      sadd: noop,
      smembers: () => Promise.resolve([]),
      on: () => undefined,
      disconnect: noop,
    } as unknown as Redis;
  }

  return new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
      if (times > 3) return null;
      return Math.min(times * 50, 2000);
    },
    lazyConnect: false,
  });
};

export const redisClient = createRedisClient();
