import { prisma } from "@/lib/prisma"

export async function triggerWebhooks(event: string, payload: Record<string, unknown>) {
  const webhooks = await prisma.webhook.findMany({
    where: { isActive: true },
  })

  const matching = webhooks.filter((w) => {
    try {
      const events = JSON.parse(w.events)
      return Array.isArray(events) && events.includes(event)
    } catch {
      return false
    }
  })

  for (const webhook of matching) {
    const start = Date.now()
    try {
      const body = JSON.stringify({
        event,
        ...payload,
        timestamp: new Date().toISOString(),
      })

      const res = await fetch(webhook.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(webhook.secret ? { "X-Webhook-Secret": webhook.secret } : {}),
          "X-RelURL-Event": event,
        },
        body,
        signal: AbortSignal.timeout(10000),
      })

      const duration = Date.now() - start
      const responseText = await res.text().catch(() => "")

      await prisma.webhookLog.create({
        data: {
          webhookId: webhook.id,
          event,
          url: webhook.url,
          status: res.status,
          response: responseText.slice(0, 1000),
          duration,
        },
      })

      await prisma.webhook.update({
        where: { id: webhook.id },
        data: { lastTriggeredAt: new Date() },
      })
    } catch (err) {
      const duration = Date.now() - start
      await prisma.webhookLog.create({
        data: {
          webhookId: webhook.id,
          event,
          url: webhook.url,
          status: null,
          response: err instanceof Error ? err.message.slice(0, 1000) : "Unknown error",
          duration,
        },
      })
    }
  }
}
