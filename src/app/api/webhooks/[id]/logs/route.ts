import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const webhook = await prisma.webhook.findUnique({ where: { id } })
    if (!webhook) {
      return NextResponse.json({ data: null, error: "Webhook not found" }, { status: 404 })
    }
    if (webhook.userId !== session.user.id) {
      return NextResponse.json({ data: null, error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20")))

    const [logs, total] = await Promise.all([
      prisma.webhookLog.findMany({
        where: { webhookId: id },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.webhookLog.count({ where: { webhookId: id } }),
    ])

    return NextResponse.json({ data: { logs, total, page, limit }, error: null })
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
