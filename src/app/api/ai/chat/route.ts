import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { answer: "Sign in to use AI Assistant", type: "error" as const },
        { status: 401 }
      )
    }

    const { query } = await req.json()
    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { answer: "Please provide a query.", type: "error" as const },
        { status: 400 }
      )
    }

    const q = query.toLowerCase().trim()
    const userId = session.user.id

    if (q.includes("how many links") || q === "how many links") {
      const count = await prisma.shortLink.count({ where: { userId } })
      return NextResponse.json({
        answer: `You have ${count} link${count !== 1 ? "s" : ""} total.`,
        type: "insight",
      })
    }

    if (q.includes("how many clicks") || q === "how many clicks") {
      const count = await prisma.linkClick.count({
        where: { link: { userId } },
      })
      return NextResponse.json({
        answer: `Your links have received ${count} click${count !== 1 ? "s" : ""} in total.`,
        type: "insight",
      })
    }

    if (q.includes("clicks this week") || q.includes("this week")) {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      weekAgo.setHours(0, 0, 0, 0)
      const count = await prisma.linkClick.count({
        where: { link: { userId }, timestamp: { gte: weekAgo } },
      })
      return NextResponse.json({
        answer: `Your links received ${count} click${count !== 1 ? "s" : ""} in the last 7 days.`,
        type: "insight",
      })
    }

    if (q.includes("clicks this month") || q.includes("this month")) {
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)
      const count = await prisma.linkClick.count({
        where: { link: { userId }, timestamp: { gte: startOfMonth } },
      })
      return NextResponse.json({
        answer: `Your links received ${count} click${count !== 1 ? "s" : ""} this month.`,
        type: "insight",
      })
    }

    if (q.includes("best link") || q.includes("top link") || q.includes("most clicks")) {
      const topLinkGroup = await prisma.linkClick.groupBy({
        by: ["linkId"],
        where: { link: { userId } },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 1,
      })
      if (topLinkGroup.length === 0) {
        return NextResponse.json({
          answer: "No clicks recorded yet. Share your links to start tracking!",
          type: "insight",
        })
      }
      const link = await prisma.shortLink.findUnique({
        where: { id: topLinkGroup[0].linkId },
        select: { slug: true, url: true },
      })
      return NextResponse.json({
        answer: link
          ? `Your top link is "${link.slug}" (${topLinkGroup[0]._count.id} clicks) pointing to ${link.url}.`
          : "Could not find the top link.",
        type: "insight",
      })
    }

    if (q.includes("country") || q.includes("countries")) {
      const countries = await prisma.linkClick.groupBy({
        by: ["country"],
        where: { link: { userId }, country: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 5,
      })
      if (countries.length === 0) {
        return NextResponse.json({
          answer: "No country data available yet. Clicks will be tracked once your links get traffic.",
          type: "insight",
        })
      }
      const lines = countries
        .map((c) => `- ${c.country}: ${c._count.id} click${c._count.id !== 1 ? "s" : ""}`)
        .join("\n")
      return NextResponse.json({
        answer: `Here are your top countries by clicks:\n${lines}`,
        type: "insight",
      })
    }

    if (q.includes("device") || q.includes("devices")) {
      const devices = await prisma.linkClick.groupBy({
        by: ["device"],
        where: { link: { userId }, device: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 5,
      })
      if (devices.length === 0) {
        return NextResponse.json({
          answer: "No device data available yet. Clicks will show device info once your links get traffic.",
          type: "insight",
        })
      }
      const lines = devices
        .map((d) => `- ${d.device}: ${d._count.id} click${d._count.id !== 1 ? "s" : ""}`)
        .join("\n")
      return NextResponse.json({
        answer: `Here are your top devices:\n${lines}`,
        type: "insight",
      })
    }

    if (q.includes("referrer") || q.includes("referrers") || q.includes("source") || q.includes("sources")) {
      const referrers = await prisma.linkClick.groupBy({
        by: ["referer"],
        where: { link: { userId }, referer: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 5,
      })
      const direct = await prisma.linkClick.count({
        where: { link: { userId }, referer: null },
      })
      const lines = referrers
        .map((r) => `- ${r.referer}: ${r._count.id} click${r._count.id !== 1 ? "s" : ""}`)
        .join("\n")
      const directLine = direct > 0 ? `\n- Direct / Unknown: ${direct} click${direct !== 1 ? "s" : ""}` : ""
      return NextResponse.json({
        answer: referrers.length === 0 && direct === 0
          ? "No referrer data available yet."
          : `Here are your traffic sources:\n${lines}${directLine}`,
        type: "insight",
      })
    }

    if (q.includes("suggestion") || q.includes("improve") || q.includes("tips")) {
      const totalLinks = await prisma.shortLink.count({ where: { userId } })
      const totalClicks = await prisma.linkClick.count({ where: { link: { userId } } })
      const topLinkGroup = await prisma.linkClick.groupBy({
        by: ["linkId"],
        where: { link: { userId } },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 1,
      })

      const tips: string[] = []
      if (totalLinks === 0) {
        tips.push("Create your first link to start tracking clicks and analytics.")
      }
      if (totalClicks === 0 && totalLinks > 0) {
        tips.push("Share your links on social media, email, or your website to start getting clicks.")
      }
      if (totalLinks > 0 && totalClicks > 0 && topLinkGroup.length > 0) {
        const topLink = await prisma.shortLink.findUnique({
          where: { id: topLinkGroup[0].linkId },
          select: { slug: true },
        })
        if (topLink) {
          tips.push(
            `Your link "${topLink.slug}" is performing well with ${topLinkGroup[0]._count.id} clicks. Consider creating similar content.`
          )
        }
      }
      if (totalLinks > 10) {
        tips.push(
          "You have more than 10 links — use tags and categories to keep them organized."
        )
      }
      tips.push(
        "Use UTM parameters to track campaigns more accurately.",
        "Enable link expiration for time-sensitive promotions."
      )

      return NextResponse.json({
        answer: `Here are some tips based on your data:\n${tips.map((t) => `- ${t}`).join("\n")}`,
        type: "action",
      })
    }

    return NextResponse.json({
      answer:
        "I can help with questions like:\n" +
        '- "how many links"\n' +
        '- "how many clicks"\n' +
        '- "best link" / "top link"\n' +
        '- "clicks this week" / "clicks this month"\n' +
        '- "countries" / "devices" / "referrers"\n' +
        '- "suggestions" / "tips"',
      type: "insight",
    })
  } catch (error) {
    return NextResponse.json(
      {
        answer: "Sorry, something went wrong. Please try again.",
        type: "error" as const,
      },
      { status: 500 }
    )
  }
}
