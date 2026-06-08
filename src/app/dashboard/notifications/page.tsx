"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/toast"
import { formatRelativeTime } from "@/lib/utils"
import {
  Bell,
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  MousePointerClick,
  Users,
  Clock,
  DollarSign,
  CreditCard,
  CheckCheck,
  Trash2,
  Inbox,
} from "lucide-react"
type NotificationType = "INFO" | "WARNING" | "ERROR" | "SUCCESS" | "LINK_CLICKED" | "TEAM_INVITE" | "SUBSCRIPTION_EXPIRED" | "TRIAL_ENDING" | "PAYMENT_RECEIVED" | "PAYMENT_FAILED"

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string | null
  read: boolean
  link: string | null
  createdAt: string
}

const typeConfig: Record<NotificationType, { icon: typeof Bell; color: string; bg: string }> = {
  INFO: { icon: Info, color: "text-blue-400", bg: "bg-blue-500/10" },
  WARNING: { icon: AlertTriangle, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  ERROR: { icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10" },
  SUCCESS: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  LINK_CLICKED: { icon: MousePointerClick, color: "text-primary-400", bg: "bg-primary-500/10" },
  TEAM_INVITE: { icon: Users, color: "text-purple-400", bg: "bg-purple-500/10" },
  SUBSCRIPTION_EXPIRED: { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10" },
  TRIAL_ENDING: { icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  PAYMENT_RECEIVED: { icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  PAYMENT_FAILED: { icon: CreditCard, color: "text-red-400", bg: "bg-red-500/10" },
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [markingAll, setMarkingAll] = useState(false)
  const { addToast } = useToast()

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/notifications?limit=50")
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Failed to fetch notifications")
      setNotifications(json.data.notifications ?? [])
      setUnreadCount(json.data.unreadCount ?? 0)
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Failed to load notifications", "error")
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const handleMarkAsRead = async (id: string) => {
    const notification = notifications.find((n) => n.id === id)
    if (!notification || notification.read) return

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))

    try {
      const res = await fetch(`/api/notifications/${id}`, { method: "PATCH" })
      if (!res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: false } : n))
        )
        setUnreadCount((prev) => prev + 1)
      }
    } catch {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: false } : n))
      )
      setUnreadCount((prev) => prev + 1)
    }
  }

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return
    setMarkingAll(true)
    try {
      const res = await fetch("/api/notifications/read-all", { method: "POST" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Failed to mark all as read")
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
      addToast(`Marked ${json.data.count} notification(s) as read`, "success")
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Failed to mark all as read", "error")
    } finally {
      setMarkingAll(false)
    }
  }

  const handleDelete = async (id: string) => {
    const notification = notifications.find((n) => n.id === id)
    if (!notification) return

    setNotifications((prev) => prev.filter((n) => n.id !== id))
    if (!notification.read) setUnreadCount((prev) => Math.max(0, prev - 1))

    try {
      const res = await fetch(`/api/notifications/${id}`, { method: "DELETE" })
      if (!res.ok) {
        fetchNotifications()
      }
    } catch {
      fetchNotifications()
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <Card>
          <CardContent className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-dark-50">Notifications</h1>
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount}</Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-dark-100">
            Stay updated on your account activity
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            onClick={handleMarkAllRead}
            disabled={markingAll}
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-dark-300 p-4 mb-4">
                <Inbox className="h-8 w-8 text-dark-100" />
              </div>
              <h3 className="text-lg font-medium text-dark-50 mb-1">
                No notifications
              </h3>
              <p className="text-sm text-dark-100 max-w-sm">
                You&apos;re all caught up! Notifications will appear here when there&apos;s activity on your account.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-dark-100">
              {notifications.map((notification) => {
                const config = typeConfig[notification.type]
                const Icon = config.icon

                return (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 transition-colors ${
                      !notification.read
                        ? "bg-dark-300/30"
                        : "hover:bg-dark-300/20"
                    }`}
                  >
                    <div className={`rounded-lg p-2 shrink-0 ${config.bg}`}>
                      <Icon className={`h-5 w-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className={`text-sm font-medium ${
                            !notification.read ? "text-dark-50" : "text-dark-100"
                          }`}>
                            {notification.title}
                            {!notification.read && (
                              <span className="ml-2 inline-block h-2 w-2 rounded-full bg-primary-500" />
                            )}
                          </p>
                          {notification.message && (
                            <p className="mt-1 text-sm text-dark-100 line-clamp-2">
                              {notification.message}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-xs text-dark-100 whitespace-nowrap">
                            {formatRelativeTime(notification.createdAt)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDelete(notification.id)}
                            className="rounded-lg p-1.5 text-dark-100 hover:text-red-400 hover:bg-dark-300 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            Mark read
                          </Button>
                        )}
                        {notification.link && (
                          <Link
                            href={notification.link}
                            onClick={() => {
                              if (!notification.read) handleMarkAsRead(notification.id)
                            }}
                            className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
                          >
                            View details
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
