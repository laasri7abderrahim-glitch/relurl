"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import type { RealtimeMessage } from "@/MARKETPLACE/src/lib/realtime"

export function useRealtimeMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<RealtimeMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)

  const connect = useCallback(() => {
    if (!conversationId) return

    const eventSource = new EventSource(
      `/api/marketplace/messages/stream?conversationId=${conversationId}`
    )

    eventSource.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as RealtimeMessage
        setMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) return prev
          return [...prev, message]
        })
      } catch (e) {
        console.error("Failed to parse SSE message:", e)
      }
    }

    eventSource.onerror = () => {
      setIsConnected(false)
      setTimeout(connect, 3000)
    }

    eventSource.onopen = () => setIsConnected(true)
    eventSourceRef.current = eventSource
  }, [conversationId])

  useEffect(() => {
    connect()
    return () => {
      eventSourceRef.current?.close()
    }
  }, [connect])

  const sendMessage = async (content: string, senderId: string, senderName: string) => {
    const res = await fetch("/api/marketplace/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        senderId,
        senderName,
        conversationId,
      }),
    })
    return res.json()
  }

  return { messages, isConnected, sendMessage }
}