"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AreaChart, BarChart, PieChart } from "@/components/ui/chart"
import { StatCard } from "@/components/ui/stat-card"
import { SectionHeader } from "@/components/ui/section-header"
import { SkeletonStats, SkeletonChart } from "@/components/ui/loading"
import { useLiveAnalytics } from "@/hooks/use-live-analytics"
import { ErrorState } from "@/components/ui/error-state"
import { EmptyState } from "@/components/ui/empty-state"
import { formatNumber, cn } from "@/lib/utils"
import {
  MousePointerClick,
  Users,
  TrendingUp,
  Trophy,
  Download,
  Globe,
  Monitor,
} from "lucide-react"

type DateRange = "7d" | "30d" | "90d" | "custom"

const dateRangeOptions: { value: DateRange; labelKey: string }[] = [
  { value: "7d", labelKey: "sevenDays" },
  { value: "30d", labelKey: "thirtyDays" },
  { value: "90d", labelKey: "ninetyDays" },
  { value: "custom", labelKey: "customDate" },
]

interface AnalyticsData {
  clicks: number
  uniqueVisitors: number
  totalLinks: number
  clicksByDay: { date: string; clicks: number }[]
  referrers: { referrer: string; count: number }[]
  countries: { country: string; count: number }[]
  browsers: { browser: string; count: number }[]
  devices: { device: string; count: number }[]
  os: { os: string; count: number }[]
  topLink: { url: string; slug: string; clicks: number } | null
  suspiciousClicks: number
}

function pct(value: number, total: number): number {
  if (total === 0) return 0
  return Math.round((value / total) * 1000) / 10
}

function pctChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

export default function AnalyticsPage() {
  const { data: session } = useSession()
  const t = useTranslations("dashboard.analytics")
  const dateRangeLabels: Record<DateRange, string> = {
    "7d": t("sevenDays"),
    "30d": t("thirtyDays"),
    "90d": t("ninetyDays"),
    custom: t("customDate"),
  }
  const [dateRange, setDateRange] = useState<DateRange>("7d")
  const [customFrom, setCustomFrom] = useState("")
  const [customTo, setCustomTo] = useState("")
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [prevData, setPrevData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retry, setRetry] = useState(0)
  const [compareEnabled, setCompareEnabled] = useState(false)
  const [liveVisitors, setLiveVisitors] = useState(0)

  const refreshData = useCallback(() => {
    setRetry((c) => c + 1)
  }, [])

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      setPrevData(null)
      try {
        let url = "/api/analytics?"
        if (dateRange === "custom") {
          if (!customFrom || !customTo) {
            setLoading(false)
            return
          }
          url += `from=${encodeURIComponent(customFrom)}&to=${encodeURIComponent(customTo)}`
        } else {
          url += `period=${dateRange}`
        }

        const fetches: Promise<AnalyticsData>[] = [
          fetch(url).then(async (r) => {
            if (!r.ok) throw new Error(`Request failed (${r.status})`)
            return r.json()
          }),
        ]

        if (compareEnabled) {
          const days = dateRange === "custom" ? 0 : dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90
          let prevUrl: string
          if (days > 0) {
            const now = Date.now()
            const prevTo = new Date(now - days * 86400000)
            const prevFrom = new Date(prevTo.getTime() - days * 86400000)
            prevUrl = `/api/analytics?from=${prevFrom.toISOString().split("T")[0]}&to=${prevTo.toISOString().split("T")[0]}`
          } else {
            const from = new Date(customFrom)
            const to = new Date(customTo)
            const diff = to.getTime() - from.getTime()
            const prevTo = new Date(from.getTime() - 1)
            const prevFrom = new Date(prevTo.getTime() - diff)
            prevUrl = `/api/analytics?from=${prevFrom.toISOString().split("T")[0]}&to=${prevTo.toISOString().split("T")[0]}`
          }
          fetches.push(
            fetch(prevUrl).then(async (r) => {
              if (!r.ok) return null as unknown as AnalyticsData
              return r.json()
            }),
          )
        }

        const [currentResult, prevResult] = await Promise.all(fetches)

        if (!cancelled) {
          setData(currentResult)
          if (prevResult) setPrevData(prevResult)
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : t("errorTitle"))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    return () => { cancelled = true }
  }, [dateRange, customFrom, customTo, retry, compareEnabled])

  useLiveAnalytics({
    onLiveVisitor: () => setLiveVisitors((c) => c + 1),
  })

  useEffect(() => {
    if (liveVisitors === 0) return
    const timer = setTimeout(() => {
      setLiveVisitors(0)
    }, 10000)
    return () => clearTimeout(timer)
  }, [liveVisitors])

  useEffect(() => {
    if (liveVisitors === 0) return
    const timer = setTimeout(() => {
      refreshData()
    }, 3000)
    return () => clearTimeout(timer)
  }, [liveVisitors, refreshData])

  const trends = {
    clicks: compareEnabled && prevData
      ? { value: Math.abs(pctChange(data?.clicks ?? 0, prevData.clicks)), positive: (data?.clicks ?? 0) >= prevData.clicks }
      : undefined,
    visitors: compareEnabled && prevData
      ? { value: Math.abs(pctChange(data?.uniqueVisitors ?? 0, prevData.uniqueVisitors)), positive: (data?.uniqueVisitors ?? 0) >= prevData.uniqueVisitors }
      : undefined,
    links: compareEnabled && prevData
      ? { value: Math.abs(pctChange(data?.totalLinks ?? 0, prevData.totalLinks)), positive: (data?.totalLinks ?? 0) >= prevData.totalLinks }
      : undefined,
    topLink: compareEnabled && prevData
      ? { value: Math.abs(pctChange(data?.topLink?.clicks ?? 0, prevData.topLink?.clicks ?? 0)), positive: (data?.topLink?.clicks ?? 0) >= (prevData.topLink?.clicks ?? 0) }
      : undefined,
  }

  const referrers = (data?.referrers ?? []).map((r) => ({
    name: r.referrer,
    count: r.count,
    percentage: pct(r.count, data?.clicks ?? 1),
  }))

  const countries = (data?.countries ?? []).map((c) => ({
    name: c.country,
    count: c.count,
    percentage: pct(c.count, data?.clicks ?? 1),
  }))

  const devices = (data?.devices ?? []).map((d) => ({ name: d.device, value: d.count }))
  const browsers = (data?.browsers ?? []).map((b) => ({ name: b.browser, value: b.count }))
  const os = (data?.os ?? []).map((o) => ({ name: o.os, value: o.count }))

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-dark-50">{t("title")}</div>
            <p className="mt-1 text-sm text-dark-100">{t("description")}</p>
          </div>
        </div>
        <SkeletonStats />
        <SkeletonChart />
        <SkeletonChart />
        <SkeletonChart />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <SectionHeader title={t("title")} description={t("description")} />
        <ErrorState
          title={t("errorTitle")}
          message={error}
          onRetry={() => setRetry((c) => c + 1)}
        />
      </div>
    )
  }

  if (!data) return null

  if (data.clicks === 0) {
    return (
      <div className="space-y-6">
        <SectionHeader title={t("title")} description={t("description")} />
        <EmptyState
          icon={<TrendingUp className="h-6 w-6" />}
          title={t("emptyTitle")}
          description={t("emptyDescription")}
        />
      </div>
    )
  }

  const exportCSV = () => {
    if (!data) return
    const rows = [
      [t("metric"), t("value")],
      [t("totalClicks"), data.clicks],
      [t("uniqueVisitors"), data.uniqueVisitors],
      [t("totalLinks"), data.totalLinks],
      [],
      [t("date"), t("clicks")],
      ...data.clicksByDay.map((d) => [d.date, d.clicks]),
      [],
      [t("referrer"), t("count")],
      ...data.referrers.map((r) => [r.referrer, r.count]),
      [],
      [t("country"), t("count")],
      ...data.countries.map((c) => [c.country, c.count]),
      [],
      [t("browser"), t("count")],
      ...data.browsers.map((b) => [b.browser, b.count]),
      [],
      [t("device"), t("count")],
      ...data.devices.map((d) => [d.device, d.count]),
      [],
      [t("os"), t("count")],
      ...data.os.map((o) => [o.os, o.count]),
    ]
    const csv = rows.map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `analytics-${dateRange}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportPDF = () => {
    if (!data) return
    const periodLabel = dateRange === "custom"
      ? `${customFrom} ${t("to")} ${customTo}`
      : dateRangeLabels[dateRange]
    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${t("reportTitle")}</title>
<style>body{font-family:sans-serif;padding:40px;color:#222}h1{color:#1F6F5F}table{border-collapse:collapse;width:100%;margin:20px 0}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#1F6F5F;color:white}</style>
</head><body>
<h1>${t("reportTitle")}</h1>
<p>${t("period")}: ${periodLabel}</p>
<h2>${t("summary")}</h2>
<table><tr><th>${t("metric")}</th><th>${t("value")}</th></tr>
<tr><td>${t("totalClicks")}</td><td>${data.clicks}</td></tr>
<tr><td>${t("uniqueVisitors")}</td><td>${data.uniqueVisitors}</td></tr>
<tr><td>${t("totalLinks")}</td><td>${data.totalLinks}</td></tr></table>
<h2>${t("clicksByDay")}</h2>
<table><tr><th>${t("date")}</th><th>${t("clicks")}</th></tr>
${data.clicksByDay.map((d) => `<tr><td>${d.date}</td><td>${d.clicks}</td></tr>`).join("")}</table>
<h2>${t("topReferrers")}</h2>
<table><tr><th>${t("referrer")}</th><th>${t("count")}</th></tr>
${data.referrers.slice(0, 10).map((r) => `<tr><td>${r.referrer}</td><td>${r.count}</td></tr>`).join("")}</table>
<h2>${t("topCountries")}</h2>
<table><tr><th>${t("country")}</th><th>${t("count")}</th></tr>
${data.countries.slice(0, 10).map((c) => `<tr><td>${c.country}</td><td>${c.count}</td></tr>`).join("")}</table>
<h2>${t("browsers")}</h2>
<table><tr><th>${t("browser")}</th><th>${t("count")}</th></tr>
${data.browsers.map((b) => `<tr><td>${b.browser}</td><td>${b.count}</td></tr>`).join("")}</table>
<h2>${t("devices")}</h2>
<table><tr><th>${t("device")}</th><th>${t("count")}</th></tr>
${data.devices.map((d) => `<tr><td>${d.device}</td><td>${d.count}</td></tr>`).join("")}</table>
</body></html>`
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `analytics-report-${dateRange}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div>
        <SectionHeader
          title={t("title")}
          description={t("description")}
          action={
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-xs font-medium text-emerald-400">{t("live")}</span>
              </div>
              <div className="flex rounded-lg border border-dark-100 bg-dark-500 p-0.5">
                {dateRangeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setDateRange(opt.value)}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                      dateRange === opt.value
                        ? "bg-primary-500 text-white shadow-sm"
                        : "text-dark-100 hover:text-dark-50",
                    )}
                  >
                    {dateRangeLabels[opt.value]}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCompareEnabled(!compareEnabled)}
                role="switch"
                aria-checked={compareEnabled}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                  compareEnabled
                    ? "border-primary-500 bg-primary-500/10 text-primary-500"
                    : "border-dark-100 text-dark-100 hover:border-dark-50 hover:text-dark-50",
                )}
              >
                <div
                  className={cn(
                    "flex h-4 w-8 rounded-full border transition-colors",
                    compareEnabled ? "border-primary-500 bg-primary-500" : "border-dark-100 bg-dark-300",
                  )}
                >
                  <div
                    className={cn(
                      "mt-px h-3 w-3 rounded-full bg-white transition-transform",
                      compareEnabled ? "translate-x-[14px]" : "translate-x-[1px]",
                    )}
                  />
                </div>
                {t("compare")}
              </button>
              <Button variant="outline" size="sm" onClick={exportCSV}>
                <Download className="mr-1.5 h-4 w-4" />
                {t("exportCsv")}
              </Button>
            </div>
          }
        />
        {dateRange === "custom" && (
          <div className="mt-4 flex items-center gap-2">
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="flex h-10 rounded-lg border border-dark-100 bg-dark-500 px-3 text-sm text-dark-50"
            />
            <span className="text-dark-100">{t("to")}</span>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="flex h-10 rounded-lg border border-dark-100 bg-dark-500 px-3 text-sm text-dark-50"
            />
          </div>
        )}
      </div>

      {data.suspiciousClicks > 0 && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
          {t("suspiciousActivity", { count: data.suspiciousClicks })}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label={t("totalClicks")}
          value={formatNumber(data.clicks)}
          icon={<MousePointerClick className="h-5 w-5" />}
          trend={trends.clicks}
        />
        <StatCard
          label={t("uniqueVisitors")}
          value={formatNumber(data.uniqueVisitors)}
          icon={<Users className="h-5 w-5" />}
          trend={trends.visitors}
        />
        <StatCard
          label={t("totalLinks")}
          value={formatNumber(data.totalLinks)}
          icon={<TrendingUp className="h-5 w-5" />}
          trend={trends.links}
        />
        <StatCard
          label={t("topLink")}
          value={data.topLink ? `${data.topLink.slug} (${formatNumber(data.topLink.clicks)})` : "—"}
          icon={<Trophy className="h-5 w-5" />}
          trend={trends.topLink}
        />
        <StatCard
          label={t("activeNow")}
          value={formatNumber(liveVisitors)}
          icon={
            <span className="relative flex h-5 w-5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
            </span>
          }
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("clicksOverTime")}</CardTitle>
        </CardHeader>
        <CardContent>
          <AreaChart data={data.clicksByDay} xKey="date" yKey="clicks" />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("topReferrers")}</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={referrers.slice(0, 6)} xKey="name" yKey="count" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("countries")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("country")}</TableHead>
                  <TableHead className="text-right">{t("clicks")}</TableHead>
                  <TableHead className="text-right">{t("percent")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {countries.map((c) => (
                  <TableRow key={c.name}>
                    <TableCell className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-dark-100" />
                      {c.name}
                    </TableCell>
                    <TableCell className="text-right text-dark-50">{formatNumber(c.count)}</TableCell>
                    <TableCell className="text-right text-dark-100">{c.percentage}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Monitor className="h-4 w-4 text-dark-100" />
              {t("devices")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart data={devices} showLegend />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("browsers")}</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart data={browsers} showLegend />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("operatingSystems")}</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart data={os} showLegend />
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button variant="outline" onClick={exportCSV}>
          <Download className="mr-2 h-4 w-4" />
          {t("exportCsv")}
        </Button>
        <Button variant="primary" onClick={exportPDF}>
          <Download className="mr-2 h-4 w-4" />
          {t("exportPdf")}
        </Button>
      </div>
    </div>
  )
}