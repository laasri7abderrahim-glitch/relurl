import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
    },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true, data: user })
}

export async function PATCH(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, image } = body

    if (!name && !image) {
      return NextResponse.json(
        { error: "Nothing to update" },
        { status: 400 }
      )
    }

    const data: Record<string, string> = {}
    if (typeof name === "string" && name.trim().length >= 2) {
      data.name = name.trim()
    }
    if (typeof image === "string") {
      data.image = image
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "Invalid update data" },
        { status: 400 }
      )
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      },
    })

    createAuditLog({
      userId: session.user.id,
      action: "UPDATE",
      entity: "User",
      entityId: session.user.id,
      changes: data,
    })

    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    console.error("User update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
