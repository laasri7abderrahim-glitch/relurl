import { redis } from "@/lib/cache"

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitOptions {
  windowMs?: number;
  maxRequests?: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

const inMemory = new Map<string, RateLimitEntry>();
const CLEANUP_INTERVAL = 60_000;

let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function startCleanup(windowMs: number): void {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of inMemory.entries()) {
      if (entry.resetTime <= now) {
        inMemory.delete(key);
      }
    }
  }, Math.min(CLEANUP_INTERVAL, windowMs));
}

export async function rateLimit(
  ip: string,
  options: RateLimitOptions = {}
): Promise<RateLimitResult> {
  const { windowMs = 60_000, maxRequests = 10 } = options;
  const now = Date.now();

  if (process.env.UPSTASH_REDIS_REST_URL) {
    const key = `ratelimit:${ip}`;
    const current = await redis.incr(key);
    if (current === 1) {
      await redis.expire(key, Math.ceil(windowMs / 1000));
    }
    const ttl = await redis.ttl(key);
    return {
      success: current <= maxRequests,
      remaining: Math.max(0, maxRequests - current),
      resetTime: now + (ttl > 0 ? ttl * 1000 : windowMs),
    };
  }

  startCleanup(windowMs);

  const entry = inMemory.get(ip);
  if (!entry || entry.resetTime <= now) {
    inMemory.set(ip, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: maxRequests - 1, resetTime: now + windowMs };
  }

  if (entry.count >= maxRequests) {
    return { success: false, remaining: 0, resetTime: entry.resetTime };
  }

  entry.count++;
  return {
    success: true,
    remaining: maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

export function resetRateLimit(ip: string): void {
  inMemory.delete(ip);
  if (process.env.UPSTASH_REDIS_REST_URL) {
    redis.del(`ratelimit:${ip}`).catch(() => {});
  }
}

export function clearRateLimits(): void {
  inMemory.clear();
}
