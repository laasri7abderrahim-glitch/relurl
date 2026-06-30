interface ClickContext {
  ip: string
  userAgent: string
  linkId: string
  timestamp: Date
  referer?: string | null
}

interface FraudCheckResult {
  isSuspicious: boolean
  reasons: string[]
  score: number
}

const BOT_PATTERNS = [
  /bot/i, /crawl/i, /spider/i, /scrape/i, /headless/i,
  /python/i, /curl/i, /wget/i, /go-http-client/i,
  /java/i, /perl/i, /ruby/i, /php/i, /axios/i,
  /node/i, /fetch/i, /http-client/i,
]

export async function detectClickFraud(
  context: ClickContext,
  getClickHistory: (linkId: string, ip: string, since: Date) => Promise<number>
): Promise<FraudCheckResult> {
  const reasons: string[] = []
  let score = 0

  const ua = context.userAgent?.toLowerCase() || ""
  for (const pattern of BOT_PATTERNS) {
    if (pattern.test(ua)) {
      reasons.push(`Suspicious user agent: ${context.userAgent?.slice(0, 50)}`)
      score += 40
      break
    }
  }

  if (!context.userAgent || context.userAgent.length < 10) {
    reasons.push("Missing or minimal user agent")
    score += 20
  }

  const recentClicks = await getClickHistory(
    context.linkId,
    context.ip,
    new Date(Date.now() - 60000)
  )
  if (recentClicks > 10) {
    reasons.push(`Rapid clicks from IP: ${recentClicks} in 60s`)
    score += 30
  } else if (recentClicks > 5) {
    reasons.push(`Elevated click rate from IP: ${recentClicks} in 60s`)
    score += 15
  }

  if (!context.referer && score > 20) {
    reasons.push("Direct traffic with other suspicious signals")
    score += 10
  }

  return {
    isSuspicious: score >= 30,
    reasons,
    score,
  }
}
