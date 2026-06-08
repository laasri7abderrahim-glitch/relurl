import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  conditions: z
    .object({
      countries: z.array(z.string()).optional(),
      devices: z.array(z.string()).optional(),
      languages: z.array(z.string()).optional(),
      timeRanges: z
        .array(
          z.object({
            start: z.string(),
            end: z.string(),
            days: z.array(z.number()).optional(),
          })
        )
        .optional(),
    })
    .optional(),
  destination: z.string().url().optional(),
  priority: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
  utmParams: z
    .object({
      source: z.string().optional(),
      medium: z.string().optional(),
      campaign: z.string().optional(),
      content: z.string().optional(),
      term: z.string().optional(),
    })
    .nullable()
    .optional(),
  matchMode: z.enum(["first", "all"]).optional(),
  routeGroup: z.number().min(0).optional(),
})

async function verifyRouteOwner(routeId: string, userId: string) {
  const route = await prisma.smartRoute.findFirst({
    where: { id: routeId, link: { userId } },
    include: { link: { select: { userId: true } } },
  })
  return route
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { id } = await params
    const route = await verifyRouteOwner(id, session.user.id)
    if (!route) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 })
    }
    return NextResponse.json({ data: route })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { id } = await params
    const route = await verifyRouteOwner(id, session.user.id)
    if (!route) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 })
    }

    const body = await req.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      )
    }

    const data: Record<string, unknown> = { ...parsed.data }
    if (data.conditions) {
      data.conditions = JSON.stringify(data.conditions)
    }
    if (data.utmParams !== undefined) {
      data.utmParams = data.utmParams ? JSON.stringify(data.utmParams) : null
    }

    const updated = await prisma.smartRoute.update({
      where: { id },
      data,
    })

    return NextResponse.json({ data: updated })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { id } = await params
    const route = await verifyRouteOwner(id, session.user.id)
    if (!route) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 })
    }

    await prisma.smartRoute.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
