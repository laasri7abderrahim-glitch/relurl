import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"

const createWebhookSchema = z.object({
  url: z.string().url("Must be a valid URL"),
  secret: z.string().max(500).optional(),
  events: z.array(z.enum(["link.clicked", "link.created", "link.updated", "link.deleted"])).min(1),
})

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 })
    }

    const webhooks = await prisma.webhook.findMany({
      where: { userId: session.user.id },
      include: { _count: { select: { logs: true } } },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ data: { webhooks, total: webhooks.length }, error: null })
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = createWebhookSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: parsed.error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      )
    }

    const webhook = await prisma.webhook.create({
      data: {
        userId: session.user.id,
        url: parsed.data.url,
        secret: parsed.data.secret || null,
        events: JSON.stringify(parsed.data.events),
      },
    })

    createAuditLog({ userId: session.user.id, action: "CREATE", entity: "Webhook", entityId: webhook.id })

    return NextResponse.json({ data: webhook, error: null }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
