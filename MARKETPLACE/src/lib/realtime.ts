import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export interface RealtimeMessage {
  id: string
  content: string
  senderId: string
  senderName: string
  conversationId: string
  createdAt: string
}

export async function publishMessage(channel: string, message: RealtimeMessage) {
  await redis.publish(channel, JSON.stringify(message))
  return message
}

export async function subscribeToChannel(
  channel: string,
  callback: (message: RealtimeMessage) => void
) {
  const subscriber = redis
  subscriber.subscribe(channel, (err) => {
    if (err) console.error("Redis subscribe error:", err)
  })
  subscriber.on("message", (_ch, message) => {
    try {
      callback(JSON.parse(message))
    } catch (e) {
      console.error("Failed to parse message:", e)
    }
  })
  return () => {
    subscriber.unsubscribe(channel)
  }
}

export async function markMessageRead(messageId: string, conversationId: string) {
  await redis.hset(`conversation:${conversationId}:reads`, {
    [messageId]: Date.now().toString(),
  })
}

export async function getUnreadCount(userId: string, conversationId: string): Promise<number> {
  const key = `user:${userId}:unread:${conversationId}`
  const count = await redis.get(key)
  return Number(count) || 0
}

export async function incrementUnread(userId: string, conversationId: string) {
  await redis.incr(`user:${userId}:unread:${conversationId}`)
}

export async function clearUnread(userId: string, conversationId: string) {
  await redis.set(`user:${userId}:unread:${conversationId}`, 0)
}

export async function storeOnlineStatus(userId: string, online: boolean) {
  if (online) {
    await redis.set(`user:${userId}:online`, "1", { ex: 300 })
  } else {
    await redis.del(`user:${userId}:online`)
  }
}

export async function isUserOnline(userId: string): Promise<boolean> {
  const status = await redis.get(`user:${userId}:online`)
  return status === "1"
}

export async function getOnlineUsers(userIds: string[]): Promise<Record<string, boolean>> {
  const pipeline = userIds.map((id) => redis.get(`user:${id}:online`))
  const results = await Promise.all(pipeline)
  return userIds.reduce((acc, id, i) => {
    acc[id] = results[i] === "1"
    return acc
  }, {} as Record<string, boolean>)
}

export default redis