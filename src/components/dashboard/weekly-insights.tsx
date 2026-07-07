"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SkeletonCard } from "@/components/ui/loading"
import { formatNumber } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus, MousePointerClick, Globe, ExternalLink } from "lucide-react"

interface TopLink {
  id: string
  slug: string
  title: string | null
  url: string
  clicks: number
}

interface InsightData {
  thisWeekClicks: number
  lastWeekClicks: number
  changePercent: number
  topLinks: TopLink[]
  topReferrers: { source: string; count: number }[]
  topCountries: { country: string; count: number }[]
  totalLinks: number
}

export function WeeklyInsights() {
  const [data, setData] = useState<InsightData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/insights")
      .then((r) => r.json())
      .then((json) => {
        if (json.error) throw new Error(json.error)
        setData(json.data)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <SkeletonCard />
  if (error) return null
  if (!data || data.thisWeekClicks === 0 && data.lastWeekClicks === 0) return null

  const trendIcon = data.changePercent > 0
    ? <TrendingUp className="w-4 h-4 text-emerald-500" />
    : data.changePercent < 0
      ? <TrendingDown className="w-4 h-4 text-red-500" />
      : <Minus className="w-4 h-4 text-dark-100" />

  const trendColor = data.changePercent > 0
    ? "text-emerald-500"
    : data.changePercent < 0
      ? "text-red-500"
      : "text-dark-100"

  return (
    <Card className="border-dark-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Weekly Insights</CardTitle>
          <Badge variant="outline" className="text-xs">This week vs last week</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-300/50 border border-dark-100">
          <MousePointerClick className="w-8 h-8 text-primary" />
          <div className="flex-1">
            <p className="text-sm text-dark-100">Clicks this week</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-dark-50">{formatNumber(data.thisWeekClicks)}</span>
              <span className={`flex items-center gap-1 text-sm ${trendColor}`}>
                {trendIcon}
                {Math.abs(data.changePercent)}%
              </span>
            </div>
          </div>
        </div>

        {data.topLinks.length > 0 && (
          <div>
            <p className="text-xs font-medium text-dark-100 mb-2 flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> Top Links
            </p>
            <div className="space-y-1.5">
              {data.topLinks.slice(0, 3).map((link, i) => (
                <div key={link.id} className="flex items-center justify-between text-sm">
                  <span className="text-dark-50 truncate max-w-[180px]">{link.title || link.slug}</span>
                  <span className="text-dark-100 font-mono text-xs">{formatNumber(link.clicks)} clicks</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.topReferrers.length > 0 && (
          <div>
            <p className="text-xs font-medium text-dark-100 mb-2">Top Referrers</p>
            <div className="space-y-1.5">
              {data.topReferrers.slice(0, 3).map((r, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-dark-50 truncate max-w-[180px]">{r.source === "Direct" ? "Direct" : new URL(r.source).hostname}</span>
                  <span className="text-dark-100 font-mono text-xs">{formatNumber(r.count)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.topCountries.length > 0 && (
          <div>
            <p className="text-xs font-medium text-dark-100 mb-2 flex items-center gap-1">
              <Globe className="w-3 h-3" /> Top Countries
            </p>
            <div className="space-y-1.5">
              {data.topCountries.slice(0, 3).map((c, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-dark-50">{c.country}</span>
                  <span className="text-dark-100 font-mono text-xs">{formatNumber(c.count)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
