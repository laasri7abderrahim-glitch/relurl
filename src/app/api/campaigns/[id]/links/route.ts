import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const campaign = await prisma.campaign.findFirst({
      where: { id, userId: session.user.id },
    })
    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    const body = await req.json()
    const { linkIds } = body

    if (!Array.isArray(linkIds) || linkIds.length === 0) {
      return NextResponse.json({ error: "linkIds array is required" }, { status: 400 })
    }

    await prisma.shortLink.updateMany({
      where: {
        id: { in: linkIds },
        userId: session.user.id,
      },
      data: { campaignId: id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to assign links" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const campaign = await prisma.campaign.findFirst({
      where: { id, userId: session.user.id },
    })
    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    const body = await req.json()
    const { linkIds } = body

    if (!Array.isArray(linkIds) || linkIds.length === 0) {
      return NextResponse.json({ error: "linkIds array is required" }, { status: 400 })
    }

    await prisma.shortLink.updateMany({
      where: {
        id: { in: linkIds },
        campaignId: id,
        userId: session.user.id,
      },
      data: { campaignId: null },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to remove links" }, { status: 500 })
  }
}
