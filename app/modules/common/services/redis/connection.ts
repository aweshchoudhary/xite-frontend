import Redis from "ioredis";

const getRedis = () => {
  const globalForRedis = global as unknown as {
    redis?: Redis;
  };

  const redis =
    globalForRedis.redis ??
    new Redis({
      host: process.env.REDIS_SERVER_HOST,
      port: Number(process.env.REDIS_SERVER_PORT),
      maxRetriesPerRequest: null,
    });

  if (process.env.NODE_ENV !== "production") {
    globalForRedis.redis = redis;
  }

  return redis;
};

export { getRedis };
