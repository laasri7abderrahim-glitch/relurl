"use client"

import { useState, useEffect, useCallback } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { Link } from "@/i18n/navigation"
import {
  Link2,
  MousePointerClick,
  ToggleLeft,
  QrCode,
  UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface ActivityItem {
  id: string
  type: string
  message: string
  timestamp: string
  linkSlug?: string
  count?: number
  status?: string
  memberName?: string
}

type TimeKey = "justNow" | "minutesAgo" | "hoursAgo" | "daysAgo"

function formatRelativeTime(timestamp: string, t: (key: string, params?: Record<string, number>) => string): string {
  const now = Date.now()
  const then = new Date(timestamp).getTime()
  const diffMs = now - then
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSeconds < 60) return t("justNow")
  if (diffMinutes < 60) return t("minutesAgo", { m: diffMinutes })
  if (diffHours < 24) return t("hoursAgo", { h: diffHours })
  return t("daysAgo", { d: diffDays })
}

const typeConfig: Record<string, { icon: React.ElementType; color: string }> = {
  link_created: { icon: Link2, color: "#14B8A6" },
  link_clicked: { icon: MousePointerClick, color: "#0D9488" },
  link_toggled: { icon: ToggleLeft, color: "#6B7280" },
  qr_generated: { icon: QrCode, color: "#6B7280" },
  team_member_added: { icon: UserPlus, color: "#6B7280" },
}

export function ActivityFeed() {
  const t = useTranslations("dashboard.activity")
  const router = useRouter()
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchActivities = useCallback(() => {
    fetch("/api/activity?limit=10&offset=0")
      .then((res) => res.json())
      .then((data) => {
        if (data.activities) {
          setActivities(data.activities)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchActivities()
    const interval = setInterval(fetchActivities, 30000)
    return () => clearInterval(interval)
  }, [fetchActivities])

  function formatMessage(item: ActivityItem): string {
    switch (item.type) {
      case "link_created":
        return t("linkCreated", { slug: item.linkSlug ?? item.message })
      case "link_clicked":
        return t("linkClicked", { count: item.count ?? 0, slug: item.linkSlug ?? "" })
      case "link_toggled": {
        const status = item.status === "active" ? t("active") : t("inactive")
        const slug = item.linkSlug ?? ""
        return t("linkToggled", { status, slug })
      }
      case "qr_generated":
        return t("qrGenerated", { slug: item.linkSlug ?? item.message })
      case "team_member_added":
        return t("teamMemberAdded", { name: item.memberName ?? item.message })
      default:
        return item.message
    }
  }

  function handleClick(item: ActivityItem) {
    if (item.linkSlug) {
      router.push(`/dashboard/links/${item.linkSlug}`)
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-dark-100 bg-dark-500 p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold text-dark-50">{t("title")}</h3>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-dark-100 bg-dark-500 p-6 shadow-lg animate-fade-in-up">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark-50">{t("title")}</h3>
      </div>

      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-3 rounded-full bg-dark-100/20 p-3">
            <MousePointerClick className="h-5 w-5 text-dark-100" />
          </div>
          <p className="text-sm font-medium text-dark-50">{t("noActivity")}</p>
          <p className="mt-1 text-xs text-dark-100">{t("noActivityDesc")}</p>
        </div>
      ) : (
        <div className="space-y-0">
          {activities.map((item, index) => {
            const config = typeConfig[item.type] ?? typeConfig.link_created
            const Icon = config.icon
            const isLast = index === activities.length - 1

            return (
              <div
                key={item.id}
                onClick={() => handleClick(item)}
                className={`group relative flex items-start gap-3 pb-4 pl-0 ${
                  item.linkSlug ? "cursor-pointer" : ""
                }`}
              >
                <div className="flex flex-col items-center">
                  <div
                    className="z-10 flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${config.color}1A` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: config.color }} />
                  </div>
                  {!isLast && (
                    <div className="-mt-1 h-full w-px bg-dark-100/30" />
                  )}
                </div>
                <div className="flex-1 pt-1 min-w-0">
                  <p
                    className={`truncate text-sm ${
                      item.linkSlug
                        ? "font-medium text-dark-50 group-hover:text-[#14B8A6] transition-colors"
                        : "text-dark-50"
                    }`}
                  >
                    {formatMessage(item)}
                  </p>
                  <p className="mt-0.5 text-xs text-dark-100">
                    {formatRelativeTime(item.timestamp, t)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-2 border-t border-dark-100/20 pt-3">
        <Link href="/dashboard/links">
          <Button variant="outline" size="sm" className="w-full text-xs">
            {t("viewAll")}
          </Button>
        </Link>
      </div>
    </div>
  )
}
