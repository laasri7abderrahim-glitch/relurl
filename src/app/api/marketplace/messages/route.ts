import { NextRequest, NextResponse } from "next/server"
import { publishMessage, type RealtimeMessage } from "@/MARKETPLACE/src/lib/realtime"
import { z } from "zod"

const messageSchema = z.object({
  content: z.string().min(1).max(5000),
  senderId: z.string().uuid(),
  senderName: z.string(),
  conversationId: z.string().uuid(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = messageSchema.parse(body)

    const message: RealtimeMessage = {
      id: crypto.randomUUID(),
      content: data.content,
      senderId: data.senderId,
      senderName: data.senderName,
      conversationId: data.conversationId,
      createdAt: new Date().toISOString(),
    }

    await publishMessage(`conversation:${data.conversationId}`, message)

    return NextResponse.json({
      success: true,
      data: message,
      message: "Message envoyé",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }
    console.error("Message send error:", error)
    return NextResponse.json(
      { success: false, error: "Erreur lors de l'envoi" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const conversationId = searchParams.get("conversationId")

  if (!conversationId) {
    return NextResponse.json(
      { success: false, error: "conversationId requis" },
      { status: 400 }
    )
  }

  return NextResponse.json({
    success: true,
    data: [],
    message: "Connectez-vous via WebSocket pour recevoir les messages en temps réel",
  })
}