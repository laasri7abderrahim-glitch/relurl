import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const bulkActionSchema = z.object({
  ids: z.array(z.string()).min(1, "At least one ID is required"),
  action: z.enum(["activate", "deactivate", "delete"]),
})

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = bulkActionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: parsed.error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      )
    }

    const { ids, action } = parsed.data

    if (action === "delete") {
      const result = await prisma.shortLink.deleteMany({
        where: { id: { in: ids }, userId: session.user.id },
      })
      return NextResponse.json({ data: { success: true, count: result.count }, error: null })
    }

    const isActive = action === "activate"
    const result = await prisma.shortLink.updateMany({
      where: { id: { in: ids }, userId: session.user.id },
      data: { isActive },
    })

    return NextResponse.json({ data: { success: true, count: result.count }, error: null })
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
