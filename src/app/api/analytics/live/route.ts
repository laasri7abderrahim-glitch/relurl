import { NextRequest } from "next/server"
import { addClient, removeClient } from "@/lib/sse"

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId")
  if (!userId) {
    return new Response("userId required", { status: 400 })
  }

  let streamController: ReadableStreamController<any> | null = null

  const stream = new ReadableStream({
    start(controller) {
      streamController = controller
      addClient(userId, controller)
      controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ type: "connected" })}\n\n`))
    },
    cancel() {
      if (streamController) {
        removeClient(userId, streamController)
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
