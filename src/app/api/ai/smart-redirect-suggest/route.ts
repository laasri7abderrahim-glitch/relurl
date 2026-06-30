import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const suggestSchema = z.object({
  linkId: z.string().uuid(),
})

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

async function analyzeTraffic(linkId: string) {
  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

  const clicks = await prisma.linkClick.findMany({
    where: {
      linkId,
      timestamp: { gte: ninetyDaysAgo },
    },
    select: {
      country: true,
      device: true,
      timestamp: true,
    },
  })

  if (clicks.length === 0) return { suggestions: [] }

  const total = clicks.length
  const countryCounts: Record<string, number> = {}
  const deviceCounts: Record<string, number> = {}
  const hourCounts: Record<number, number> = {}

  for (const click of clicks) {
    if (click.country) countryCounts[click.country] = (countryCounts[click.country] || 0) + 1
    if (click.device) deviceCounts[click.device] = (deviceCounts[click.device] || 0) + 1
    const hour = new Date(click.timestamp).getUTCHours()
    hourCounts[hour] = (hourCounts[hour] || 0) + 1
  }

  const suggestions: Array<{
    name: string
    conditions: Record<string, unknown>
    destination: string
    priority: number
    reason: string
  }> = []

  const countryEntries = Object.entries(countryCounts)
    .map(([code, count]) => ({ code, percentage: (count / total) * 100 }))
    .sort((a, b) => b.percentage - a.percentage)

  for (const { code, percentage } of countryEntries) {
    if (percentage > 15 && suggestions.length < 3) {
      suggestions.push({
        name: `${code} Visitors Redirect`,
        conditions: { countries: [code] },
        destination: "",
        priority: 10,
        reason: `${code} accounts for ${Math.round(percentage)}% of your traffic — create a dedicated landing for this audience.`,
      })
    }
  }

  const deviceEntries = Object.entries(deviceCounts)
    .map(([name, count]) => ({ name, percentage: (count / total) * 100 }))
    .sort((a, b) => b.percentage - a.percentage)

  for (const { name, percentage } of deviceEntries) {
    if (percentage > 60 && suggestions.length < 3) {
      suggestions.push({
        name: `${name.charAt(0).toUpperCase() + name.slice(1)}-Optimized Redirect`,
        conditions: { devices: [name.toLowerCase()] },
        destination: "",
        priority: 5,
        reason: `${name} devices make up ${Math.round(percentage)}% of traffic — optimize the landing experience for this device type.`,
      })
    }
  }

  const hours = Object.keys(hourCounts).map(Number).sort((a, b) => a - b)
  for (let start = 0; start <= 20; start++) {
    let windowTotal = 0
    for (let h = start; h < start + 4; h++) {
      windowTotal += hourCounts[h] || 0
    }
    if (windowTotal / total > 0.6 && suggestions.length < 3) {
      const endHour = (start + 4) % 24
      const pad = (n: number) => n.toString().padStart(2, "0")
      suggestions.push({
        name: "Peak Hours Redirect",
        conditions: {
          timeRanges: [{ start: `${pad(start)}:00`, end: `${pad(endHour)}:00` }],
        },
        destination: "",
        priority: 8,
        reason: `${Math.round((windowTotal / total) * 100)}% of clicks happen between ${pad(start)}:00 and ${pad(endHour)}:00 UTC — serve a tailored experience during peak hours.`,
      })
      break
    }
  }

  return { suggestions: suggestions.slice(0, 3) }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ suggestions: [], error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = suggestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { suggestions: [], error: parsed.error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      )
    }

    const { linkId } = parsed.data

    const link = await prisma.shortLink.findFirst({
      where: { id: linkId, userId: session.user.id },
      select: { id: true, url: true },
    })
    if (!link) {
      return NextResponse.json({ suggestions: [], error: "Link not found" }, { status: 404 })
    }

    const result = await analyzeTraffic(linkId)

    const suggestions = result.suggestions.map((s) => ({
      ...s,
      destination: s.destination || link.url,
    }))

    return NextResponse.json({ suggestions, error: null })
  } catch (error) {
    return NextResponse.json(
      { suggestions: [], error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
