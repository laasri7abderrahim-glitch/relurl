import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const smartRouteSchema = z.object({
  linkId: z.string().uuid(),
  name: z.string().min(1),
  conditions: z.object({
    countries: z.array(z.string()).optional(),
    devices: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
    timeRanges: z.array(z.object({
      start: z.string(),
      end: z.string(),
      days: z.array(z.number()).optional(),
    })).optional(),
  }),
  destination: z.string().url(),
  priority: z.number().min(0).default(0),
  utmParams: z.object({
    source: z.string().optional(),
    medium: z.string().optional(),
    campaign: z.string().optional(),
    content: z.string().optional(),
    term: z.string().optional(),
  }).nullable().optional(),
  matchMode: z.enum(["first", "all"]).default("first"),
  routeGroup: z.number().min(0).default(0),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = smartRouteSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: parsed.error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      )
    }

    const { linkId, name, conditions, destination, priority, utmParams, matchMode, routeGroup } = parsed.data

    const link = await prisma.shortLink.findFirst({
      where: { id: linkId, userId: session.user.id },
    })
    if (!link) {
      return NextResponse.json({ data: null, error: "Link not found" }, { status: 404 })
    }

    const route = await prisma.smartRoute.create({
      data: {
        linkId,
        name,
        conditions: JSON.stringify(conditions),
        destination,
        priority,
        utmParams: utmParams ? JSON.stringify(utmParams) : null,
        matchMode,
        routeGroup,
      },
    })

    return NextResponse.json({ data: route, error: null })
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

    const routes = await prisma.smartRoute.findMany({
      where: { link: { id: linkId, userId: session.user.id } },
      orderBy: [{ routeGroup: "asc" }, { priority: "desc" }],
    })

    return NextResponse.json({ data: routes, error: null })
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
