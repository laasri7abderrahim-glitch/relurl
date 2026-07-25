import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"

const updateWebhookSchema = z.object({
  url: z.string().url().optional(),
  secret: z.string().max(500).nullable().optional(),
  events: z.array(z.enum(["link.clicked", "link.created", "link.updated", "link.deleted"])).optional(),
  isActive: z.boolean().optional(),
})

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const webhook = await prisma.webhook.findUnique({
      where: { id },
      include: { _count: { select: { logs: true } } },
    })

    if (!webhook) {
      return NextResponse.json({ data: null, error: "Webhook not found" }, { status: 404 })
    }
    if (webhook.userId !== session.user.id) {
      return NextResponse.json({ data: null, error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json({ data: webhook, error: null })
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
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
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const existing = await prisma.webhook.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ data: null, error: "Webhook not found" }, { status: 404 })
    }
    if (existing.userId !== session.user.id) {
      return NextResponse.json({ data: null, error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const parsed = updateWebhookSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: parsed.error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      )
    }

    const data: Record<string, unknown> = {}
    if (parsed.data.url !== undefined) data.url = parsed.data.url
    if (parsed.data.secret !== undefined) data.secret = parsed.data.secret
    if (parsed.data.events !== undefined) data.events = JSON.stringify(parsed.data.events)
    if (parsed.data.isActive !== undefined) data.isActive = parsed.data.isActive

    const webhook = await prisma.webhook.update({ where: { id }, data })

    createAuditLog({ userId: session.user.id, action: "UPDATE", entity: "Webhook", entityId: id })

    return NextResponse.json({ data: webhook, error: null })
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
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
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const existing = await prisma.webhook.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ data: null, error: "Webhook not found" }, { status: 404 })
    }
    if (existing.userId !== session.user.id) {
      return NextResponse.json({ data: null, error: "Forbidden" }, { status: 403 })
    }

    await prisma.webhook.delete({ where: { id } })

    createAuditLog({ userId: session.user.id, action: "DELETE", entity: "Webhook", entityId: id })

    return NextResponse.json({ data: { id }, error: null })
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
