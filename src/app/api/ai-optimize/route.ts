import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const optimizeSchema = z.object({
  linkId: z.string().uuid(),
  url: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
})

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

async function analyzeClickData(linkId: string) {
  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

  const clicks = await prisma.linkClick.findMany({
    where: {
      linkId,
      timestamp: { gte: ninetyDaysAgo },
    },
    select: {
      timestamp: true,
      referer: true,
      isUnique: true,
      device: true,
    },
  })

  const totalClicks = clicks.length

  if (totalClicks === 0) {
    return {
      hasData: false,
      suggestions: [
        "Your link has no clicks yet — try sharing it on social media platforms where your audience is active",
        "Add UTM parameters to track which channels drive the most traffic",
        "Consider A/B testing different headlines and descriptions for your link",
        "Share your link in relevant online communities and forums",
        "Schedule posts during peak engagement hours (typically 9-11 AM and 2-4 PM weekdays)",
      ],
    }
  }

  const hourCounts: Record<number, number> = {}
  const dayCounts: Record<number, number> = {}
  const referrerCounts: Record<string, number> = {}
  let mobileCount = 0
  let uniqueCount = 0

  for (const click of clicks) {
    const d = new Date(click.timestamp)
    const hour = d.getUTCHours()
    hourCounts[hour] = (hourCounts[hour] || 0) + 1

    const day = d.getUTCDay()
    dayCounts[day] = (dayCounts[day] || 0) + 1

    if (click.referer) {
      try {
        const domain = new URL(click.referer).hostname.replace("www.", "")
        referrerCounts[domain] = (referrerCounts[domain] || 0) + 1
      } catch {
        // ignore invalid referer URLs
      }
    }

    if (click.device?.toLowerCase() === "mobile" || click.device?.toLowerCase() === "tablet") mobileCount++
    if (click.isUnique) uniqueCount++
  }

  const peakHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]
  const bestDayEntry = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]
  const topReferrerEntry = Object.entries(referrerCounts).sort((a, b) => b[1] - a[1])[0]

  const mobilePercentage = Math.round((mobileCount / totalClicks) * 100)
  const averageClicksPerDay = Math.round((totalClicks / 90) * 10) / 10
  const predictedCtr = totalClicks > 0 ? Math.round((uniqueCount / totalClicks) * 1000) / 10 : 0

  let confidence: string
  if (totalClicks < 10) confidence = "low"
  else if (totalClicks < 100) confidence = "medium"
  else confidence = "high"

  const bestDayName = DAY_NAMES[parseInt(bestDayEntry[0])]
  const peakHourNum = parseInt(peakHour[0])
  const bestTime = `${bestDayName} at ${peakHourNum}:00 UTC`

  const suggestions: string[] = []

  suggestions.push(`Your link performs best on ${bestDayName}s — consider scheduling posts for ${bestDayName}`)

  if (topReferrerEntry) {
    suggestions.push(`${topReferrerEntry[0]} is your top referrer — optimize your posting strategy on that platform`)
  }

  if (mobilePercentage > 50) {
    suggestions.push(`Mobile users account for ${mobilePercentage}% of clicks — ensure your landing page is mobile-optimized`)
  } else {
    suggestions.push(`Desktop users account for ${100 - mobilePercentage}% of clicks — consider desktop-specific optimizations`)
  }

  if (totalClicks < 30) {
    suggestions.push("You have limited click data — consider running targeted campaigns to gather more insights")
  }

  suggestions.push(`Your estimated CTR is ${predictedCtr}% — ${predictedCtr > 3 ? "above" : "below"} typical benchmark of 3%`)

  // === Expiry Prediction ===
  const weeks: Record<number, number> = {}
  for (let i = 1; i <= 13; i++) weeks[i] = 0

  const now = new Date()
  for (const click of clicks) {
    const d = new Date(click.timestamp)
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
    const weekNumber = Math.min(13, Math.max(1, Math.floor(diffDays / 7) + 1))
    weeks[weekNumber]++
  }

  const activeWeeks = Object.values(weeks).filter((c) => c > 0).length
  let trend: "growing" | "stable" | "declining" | "insufficient_data" = "insufficient_data"
  let healthScore = 50
  let healthStatus: "healthy" | "declining" | "at_risk" = "healthy"
  let estimatedDaysRemaining: number | null = null
  let weeklyChange = 0
  let recommendation = "Not enough data to predict trends. Share your link more to gather sufficient click data."

  if (activeWeeks >= 2) {
    const weekNumbers = Object.keys(weeks).map(Number)
    const n = weekNumbers.length
    const sumX = weekNumbers.reduce((s, x) => s + x, 0)
    const sumY = weekNumbers.reduce((s, x) => s + weeks[x], 0)
    const sumXY = weekNumbers.reduce((s, x) => s + x * weeks[x], 0)
    const sumX2 = weekNumbers.reduce((s, x) => s + x * x, 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)

    if (slope < -0.5) trend = "declining"
    else if (slope > 0.5) trend = "growing"
    else trend = "stable"

    const slopePerDay = slope / 7
    const currentWeeklyClicks = weeks[13]
    const prevWeeklyClicks = weeks[12] || 1

    if (trend === "declining" && slopePerDay < 0) {
      estimatedDaysRemaining = Math.round(currentWeeklyClicks / Math.abs(slopePerDay))
    }

    weeklyChange = Math.round(((currentWeeklyClicks - prevWeeklyClicks) / prevWeeklyClicks) * 100)

    if (trend === "growing") {
      healthScore = Math.min(100, 70 + Math.round(Math.abs(slope) * 5))
    } else if (trend === "stable") {
      healthScore = Math.min(70, 40 + Math.round(currentWeeklyClicks * 2))
    } else {
      healthScore = Math.max(10, 50 - Math.round(Math.abs(slope) * 10))
    }
    healthScore = Math.max(0, Math.min(100, healthScore))

    if (healthScore > 70) healthStatus = "healthy"
    else if (healthScore >= 40) healthStatus = "declining"
    else healthStatus = "at_risk"

    if (trend === "growing") {
      recommendation = "Your link traffic is growing. Keep up the good work and consider increasing your posting frequency."
    } else if (trend === "declining") {
      recommendation = "Traffic is declining. Try refreshing your content, sharing on new platforms, or running a targeted campaign."
      if (estimatedDaysRemaining !== null && estimatedDaysRemaining < 30) {
        recommendation += " Act soon to maintain visibility."
      }
    } else {
      recommendation = "Traffic is stable. To grow further, try A/B testing different headlines or sharing strategies."
    }
  }

  const expiryPrediction = {
    trend,
    healthScore,
    healthStatus,
    estimatedDaysRemaining,
    weeklyChange,
    recommendation,
  }

  return {
    hasData: true,
    bestTime,
    predictedCtr,
    confidence,
    suggestions,
    insights: {
      peakHour: peakHourNum,
      bestDay: bestDayName,
      totalClicks,
      uniqueVisitors: uniqueCount,
      topReferrer: topReferrerEntry ? topReferrerEntry[0] : "direct",
      mobilePercentage,
      averageClicksPerDay,
    },
    expiryPrediction,
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = optimizeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: parsed.error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      )
    }

    const { linkId } = parsed.data

    const link = await prisma.shortLink.findFirst({
      where: { id: linkId, userId: session.user.id },
    })
    if (!link) {
      return NextResponse.json({ data: null, error: "Link not found" }, { status: 404 })
    }

    const aiResult = await analyzeClickData(linkId)

    await prisma.shortLink.update({
      where: { id: linkId },
      data: {
        aiBestTime: aiResult.hasData ? aiResult.bestTime : null,
        aiPredictedCtr: aiResult.hasData ? aiResult.predictedCtr : null,
        aiSuggestions: JSON.stringify(aiResult),
        aiTrend: aiResult.hasData ? aiResult.expiryPrediction?.trend ?? null : null,
        aiHealthScore: aiResult.hasData ? aiResult.expiryPrediction?.healthScore ?? null : null,
        aiHealthStatus: aiResult.hasData ? aiResult.expiryPrediction?.healthStatus ?? null : null,
        aiEstimatedDaysRemaining: aiResult.hasData ? aiResult.expiryPrediction?.estimatedDaysRemaining ?? null : null,
        aiWeeklyChange: aiResult.hasData ? aiResult.expiryPrediction?.weeklyChange ?? null : null,
        aiRecommendation: aiResult.hasData ? aiResult.expiryPrediction?.recommendation ?? null : null,
      },
    })

    return NextResponse.json({ data: { ...aiResult, link }, error: null })
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const linkId = searchParams.get("linkId")

    if (!linkId) {
      return NextResponse.json({ data: null, error: "linkId required" }, { status: 400 })
    }

    const link = await prisma.shortLink.findFirst({
      where: { id: linkId, userId: session.user.id },
      select: {
        id: true,
        aiBestTime: true,
        aiPredictedCtr: true,
        aiSuggestions: true,
        aiTrend: true,
        aiHealthScore: true,
        aiHealthStatus: true,
        aiEstimatedDaysRemaining: true,
        aiWeeklyChange: true,
        aiRecommendation: true,
      },
    })

    return NextResponse.json({ data: link, error: null })
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
