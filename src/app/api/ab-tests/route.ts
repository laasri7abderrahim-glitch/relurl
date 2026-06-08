import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const abTestSchema = z.object({
  linkId: z.string().uuid(),
  name: z.string().min(1),
  urls: z.array(z.string().url()).min(2).max(5),
  weights: z.array(z.number().min(0)).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = abTestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: parsed.error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      )
    }

    const { linkId, name, urls, weights } = parsed.data

    const link = await prisma.shortLink.findFirst({
      where: { id: linkId, userId: session.user.id },
    })
    if (!link) {
      return NextResponse.json({ data: null, error: "Link not found" }, { status: 404 })
    }

    const existing = await prisma.aBTest.findFirst({
      where: { linkId, isActive: true },
    })
    if (existing) {
      return NextResponse.json(
        { data: null, error: "Active A/B test already exists for this link" },
        { status: 409 }
      )
    }

    const test = await prisma.aBTest.create({
      data: {
        linkId,
        name,
        urls: JSON.stringify(urls),
        weights: weights ? JSON.stringify(weights) : null,
      },
    })

    return NextResponse.json({ data: test, error: null })
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

    const tests = await prisma.aBTest.findMany({
      where: { link: { id: linkId, userId: session.user.id } },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ data: tests, error: null })
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
