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

function generateAISuggestions(url: string, tags: string[], category: string) {
  const bestTimes = [
    "Tuesday 10:00 AM EST",
    "Wednesday 2:00 PM EST",
    "Thursday 11:00 AM EST",
    "Friday 9:00 AM EST",
    "Saturday 1:00 PM EST",
  ]
  
  const domain = new URL(url).hostname.replace("www.", "")
  let ctr = 2.5
  
  if (category === "product") ctr += 1.2
  if (category === "blog") ctr += 0.8
  if (category === "social") ctr += 1.5
  
  if (tags.includes("sale") || tags.includes("discount")) ctr += 2.0
  if (tags.includes("free")) ctr += 1.8
  if (tags.includes("tutorial") || tags.includes("guide")) ctr += 1.0
  
  const suggestions = []
  
  if (domain.includes("twitter") || domain.includes("x.com")) {
    suggestions.push("Post during peak hours (9-11 AM EST) for maximum engagement")
    suggestions.push("Add relevant hashtags to increase discoverability")
  } else if (domain.includes("youtube")) {
    suggestions.push("Include a compelling thumbnail to increase CTR by 30%")
    suggestions.push("Post 2-3 hours before peak viewing hours (8-10 PM)")
  } else if (domain.includes("linkedin")) {
    suggestions.push("Post on Tuesday-Thursday for best B2B engagement")
    suggestions.push("Add a professional image to increase engagement by 2x")
  } else {
    suggestions.push("Add UTM parameters to track campaign performance")
    suggestions.push("Test different link titles to optimize click-through rates")
  }
  
  suggestions.push(`Optimal posting time: ${bestTimes[Math.floor(Math.random() * bestTimes.length)]}`)
  suggestions.push("Consider A/B testing different destination URLs")
  
  return {
    bestTime: bestTimes[Math.floor(Math.random() * bestTimes.length)],
    predictedCtr: Math.min(15, ctr).toFixed(1),
    suggestions,
    confidence: Math.floor(70 + Math.random() * 25),
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

    const { linkId, url, tags, category } = parsed.data

    const link = await prisma.shortLink.findFirst({
      where: { id: linkId, userId: session.user.id },
    })
    if (!link) {
      return NextResponse.json({ data: null, error: "Link not found" }, { status: 404 })
    }

    const targetUrl = url || link.url
    const targetTags = tags || (link.tags ? JSON.parse(link.tags) : [])
    const targetCategory = category || link.category || "general"

    const aiResult = generateAISuggestions(targetUrl, targetTags, targetCategory)

    const updated = await prisma.shortLink.update({
      where: { id: linkId },
      data: {
        aiBestTime: aiResult.bestTime,
        aiPredictedCtr: parseFloat(aiResult.predictedCtr),
        aiSuggestions: JSON.stringify(aiResult),
      },
    })

    return NextResponse.json({ data: { ...aiResult, link: updated }, error: null })
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
