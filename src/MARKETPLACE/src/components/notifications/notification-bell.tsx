"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import { Bell, Check, CheckCheck, X, Heart, MessageCircle, Star, Crown, AlertCircle } from "lucide-react"

interface Notification {
  id: string
  type: "INFO" | "OFFER" | "MESSAGE" | "FAVORITE" | "REVIEW" | "PROMOTION" | "SYSTEM"
  title: string
  message?: string
  link?: string
  read: boolean
  createdAt: string
}

interface Props {
  locale: string
}

const TYPE_ICONS: Record<string, typeof Bell> = {
  INFO: Bell,
  OFFER: AlertCircle,
  MESSAGE: MessageCircle,
  FAVORITE: Heart,
  REVIEW: Star,
  PROMOTION: Crown,
  SYSTEM: Bell,
}

const TYPE_COLORS: Record<string, string> = {
  INFO: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
  OFFER: "text-green-500 bg-green-50 dark:bg-green-900/20",
  MESSAGE: "text-purple-500 bg-purple-50 dark:bg-purple-900/20",
  FAVORITE: "text-red-500 bg-red-50 dark:bg-red-900/20",
  REVIEW: "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
  PROMOTION: "text-orange-500 bg-orange-50 dark:bg-orange-900/20",
  SYSTEM: "text-gray-500 bg-gray-50 dark:bg-gray-800",
}

export function NotificationBell({ locale }: Props) {
  const isArabic = locale === "ar"
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.read).length)
  }, [notifications])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return isArabic ? "الآن" : "À l'instant"
    if (minutes < 60) return `${minutes}${isArabic ? "د" : "min"}`
    if (hours < 24) return `${hours}${isArabic ? "س" : "h"}`
    return `${days}${isArabic ? "ي" : "j"}`
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {isArabic ? "الإشعارات" : "Notifications"}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3 h-3" />
                {isArabic ? "قراءة الكل" : "Tout marquer lu"}
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isArabic ? "لا إشعارات جديدة" : "Aucune notification"}
                </p>
              </div>
            ) : (
              notifications.map((notification) => {
                const Icon = TYPE_ICONS[notification.type] || Bell
                const colorClass = TYPE_COLORS[notification.type] || TYPE_COLORS.INFO
                return (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                      !notification.read ? "bg-primary/5 dark:bg-primary/10" : ""
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm ${!notification.read ? "font-medium" : ""} text-gray-900 dark:text-gray-100`}>
                          {notification.title}
                        </p>
                        <button
                          onClick={() => dismiss(notification.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      {notification.message && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-gray-400">
                          {formatTime(notification.createdAt)}
                        </span>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-[10px] text-primary hover:underline flex items-center gap-0.5"
                          >
                            <Check className="w-2.5 h-2.5" />
                            {isArabic ? "مقروء" : "Lu"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-800 text-center">
              <button className="text-xs text-primary hover:underline">
                {isArabic ? "عرض الكل" : "Voir toutes les notifications"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}