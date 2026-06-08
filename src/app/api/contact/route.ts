import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    console.log("[Contact Form]", { name, email, subject, message, timestamp: new Date().toISOString() })

    return NextResponse.json({ success: true, message: "Message received. We'll get back to you within 24 hours." })
  } catch {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
