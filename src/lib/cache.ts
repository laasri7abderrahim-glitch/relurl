import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
})

export async function getCachedOrFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 300
): Promise<T> {
  if (!process.env.UPSTASH_REDIS_REST_URL) {
    return fetcher()
  }
  const cached = await redis.get<T>(key)
  if (cached !== null) return cached
  const fresh = await fetcher()
  await redis.setex(key, ttlSeconds, JSON.stringify(fresh))
  return fresh
}

export async function invalidateCache(key: string): Promise<void> {
  if (process.env.UPSTASH_REDIS_REST_URL) {
    await redis.del(key)
  }
}

export { redis }
