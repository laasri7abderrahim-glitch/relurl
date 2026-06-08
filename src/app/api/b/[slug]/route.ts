import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const page = await prisma.bioPage.findUnique({
      where: { slug, isPublic: true },
      include: {
        links: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
        user: {
          select: { name: true, image: true },
        },
      },
    })

    if (!page) {
      return NextResponse.json({ data: null, error: "Page not found" }, { status: 404 })
    }

    await prisma.bioPage.update({
      where: { id: page.id },
      data: { views: { increment: 1 } },
    })

    return NextResponse.json({ data: page, error: null })
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
