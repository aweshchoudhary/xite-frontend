import { getRedis } from "./connection";

export async function getCache<T>(key: string): Promise<T | null> {
  const cached = await getRedis().get(key);
  return cached ? (JSON.parse(cached) as T) : null;
}

export async function setCache<T>(key: string, value: T, ttlSeconds = 60) {
  await getRedis().set(key, JSON.stringify(value), "EX", ttlSeconds);
}

export async function deleteCache(key: string) {
  await getRedis().del(key);
}
