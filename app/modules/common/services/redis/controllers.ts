import { redis } from "./connection";

export async function getCache<T>(key: string): Promise<T | null> {
  const cached = await redis.get(key);
  return cached ? (JSON.parse(cached) as T) : null;
}

export async function setCache<T>(key: string, value: T, ttlSeconds = 60) {
  await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
}

export async function deleteCache(key: string) {
  await redis.del(key);
}
