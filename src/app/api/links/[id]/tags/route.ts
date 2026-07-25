import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"

const updateTagsSchema = z.object({
  tags: z.array(z.string().max(50)).max(20, "Maximum 20 tags allowed"),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const link = await prisma.shortLink.findUnique({ where: { id } })
    if (!link) {
      return NextResponse.json({ data: null, error: "Link not found" }, { status: 404 })
    }
    if (link.userId !== session.user.id) {
      return NextResponse.json({ data: null, error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const parsed = updateTagsSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: parsed.error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      )
    }

    const updated = await prisma.shortLink.update({
      where: { id },
      data: { tags: JSON.stringify(parsed.data.tags) },
    })

    createAuditLog({ userId: session.user.id, action: "UPDATE", entity: "ShortLink", entityId: id })

    return NextResponse.json({ data: { id: updated.id, tags: JSON.parse(updated.tags || "[]") }, error: null })
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
