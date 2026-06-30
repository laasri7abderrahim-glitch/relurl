import { NextResponse } from "next/server"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown"
    const rateLimitResult = await rateLimit(ip, { windowMs: 60_000, maxRequests: 3 })
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

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
