"use client"

import { useEffect, useRef } from "react"
import { useSession } from "next-auth/react"

export function useLiveAnalytics({
  onRefresh,
  onLiveVisitor,
}: {
  onRefresh?: () => void
  onLiveVisitor?: () => void
}) {
  const { data: session } = useSession()
  const onRefreshRef = useRef(onRefresh)
  const onLiveVisitorRef = useRef(onLiveVisitor)

  onRefreshRef.current = onRefresh
  onLiveVisitorRef.current = onLiveVisitor

  useEffect(() => {
    if (!session?.user?.id) return

    const eventSource = new EventSource(`/api/analytics/live?userId=${session.user.id}`)

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === "connected") return
        if (data.type === "click") {
          onLiveVisitorRef.current?.()
          onRefreshRef.current?.()
        }
      } catch {
        // ignore parse errors
      }
    }

    eventSource.onerror = () => {
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [session?.user?.id])
}
