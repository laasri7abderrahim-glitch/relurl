import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 })
    }

    const schedule = await prisma.reportSchedule.findUnique({
      where: { userId: session.user.id },
    })

    return NextResponse.json({ data: schedule, error: null })
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { frequency, dayOfWeek, dayOfMonth, isActive } = body

    if (frequency && !["daily", "weekly", "monthly"].includes(frequency)) {
      return NextResponse.json({ data: null, error: "Invalid frequency" }, { status: 400 })
    }

    if (frequency === "weekly" && (dayOfWeek === undefined || dayOfWeek === null)) {
      return NextResponse.json({ data: null, error: "dayOfWeek is required for weekly frequency" }, { status: 400 })
    }

    if (frequency === "monthly" && (dayOfMonth === undefined || dayOfMonth === null)) {
      return NextResponse.json({ data: null, error: "dayOfMonth is required for monthly frequency" }, { status: 400 })
    }

    const schedule = await prisma.reportSchedule.upsert({
      where: { userId: session.user.id },
      update: {
        ...(frequency && { frequency }),
        ...(dayOfWeek !== undefined && { dayOfWeek }),
        ...(dayOfMonth !== undefined && { dayOfMonth }),
        ...(isActive !== undefined && { isActive }),
      },
      create: {
        userId: session.user.id,
        frequency: frequency || "daily",
        dayOfWeek: dayOfWeek ?? null,
        dayOfMonth: dayOfMonth ?? null,
        isActive: isActive ?? true,
      },
    })

    return NextResponse.json({ data: schedule, error: null })
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
