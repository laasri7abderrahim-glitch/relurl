import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ tag: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 })
    }

    const { tag } = await params
    const decodedTag = decodeURIComponent(tag)

    const links = await prisma.shortLink.findMany({
      where: { userId: session.user.id, tags: { not: null } },
      select: { id: true, tags: true },
    })

    let removedCount = 0
    for (const link of links) {
      if (!link.tags) continue
      try {
        const parsed = JSON.parse(link.tags)
        if (!Array.isArray(parsed)) continue
        const filtered = parsed.filter((t: string) => t !== decodedTag)
        if (filtered.length !== parsed.length) {
          await prisma.shortLink.update({
            where: { id: link.id },
            data: { tags: JSON.stringify(filtered) },
          })
          removedCount++
        }
      } catch { }
    }

    createAuditLog({ userId: session.user.id, action: "DELETE", entity: "Tag", entityId: decodedTag })

    return NextResponse.json({
      data: { tag: decodedTag, removedFromLinks: removedCount },
      error: null,
    })
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
