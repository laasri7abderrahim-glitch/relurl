"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select } from "@/components/ui/select"
import { LineChart, BarChart, PieChart } from "@/components/ui/chart"
import { formatNumber } from "@/lib/utils"
import {
  MousePointerClick,
  Users,
  TrendingUp,
  Trophy,
  Download,
  Globe,
  Monitor,
  AlertCircle,
  RefreshCw,
} from "lucide-react"

type DateRange = "7d" | "30d" | "90d" | "custom"

const dateRangeOptions: { value: DateRange; label: string }[] = [
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
  { value: "custom", label: "Custom" },
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
}

function pct(value: number, total: number): number {
  if (total === 0) return 0
  return Math.round((value / total) * 1000) / 10
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>("7d")
  const [customFrom, setCustomFrom] = useState("")
  const [customTo, setCustomTo] = useState("")
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      setLoading(true)
      setError(null)
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
        const res = await fetch(url)
        if (!res.ok) throw new Error(`Request failed (${res.status})`)
        const json: AnalyticsData = await res.json()
        if (!cancelled) setData(json)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load analytics")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    return () => { cancelled = true }
  }, [dateRange, customFrom, customTo, retry])

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
            <h1 className="text-2xl font-bold text-dark-50">Analytics</h1>
            <p className="mt-1 text-sm text-dark-100">Track your link performance</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 animate-pulse rounded-lg bg-dark-300" />
                  <div className="space-y-2">
                    <div className="h-3 w-20 animate-pulse rounded bg-dark-300" />
                    <div className="h-5 w-16 animate-pulse rounded bg-dark-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="h-64 animate-pulse rounded bg-dark-300" />
          </CardContent>
        </Card>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="h-48 animate-pulse rounded bg-dark-300" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="h-48 animate-pulse rounded bg-dark-300" />
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-48 animate-pulse rounded bg-dark-300" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark-50">Analytics</h1>
            <p className="mt-1 text-sm text-dark-100">Track your link performance</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
            <AlertCircle className="h-12 w-12 text-red-400" />
            <p className="text-lg font-medium text-dark-50">Failed to load analytics</p>
            <p className="text-sm text-dark-100">{error}</p>
            <Button variant="outline" onClick={() => setRetry((c) => c + 1)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) return null

  const exportCSV = () => {
    if (!data) return
    const rows = [
      ["Metric", "Value"],
      ["Total Clicks", data.clicks],
      ["Unique Visitors", data.uniqueVisitors],
      ["Total Links", data.totalLinks],
      [],
      ["Date", "Clicks"],
      ...data.clicksByDay.map((d) => [d.date, d.clicks]),
      [],
      ["Referrer", "Count"],
      ...data.referrers.map((r) => [r.referrer, r.count]),
      [],
      ["Country", "Count"],
      ...data.countries.map((c) => [c.country, c.count]),
      [],
      ["Browser", "Count"],
      ...data.browsers.map((b) => [b.browser, b.count]),
      [],
      ["Device", "Count"],
      ...data.devices.map((d) => [d.device, d.count]),
      [],
      ["OS", "Count"],
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
    const win = window.open("", "_blank")
    if (!win) return
    win.document.write(`
      <html><head><title>RELURL Analytics Report</title>
      <style>body{font-family:sans-serif;padding:40px}h1{color:#1F6F5F}table{border-collapse:collapse;width:100%;margin:20px 0}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#1F6F5F;color:white}</style>
      </head><body>
      <h1>RELURL Analytics Report</h1>
      <p>Period: ${dateRange === "custom" ? `${customFrom} to ${customTo}` : dateRange}</p>
      <h2>Summary</h2>
      <table><tr><th>Metric</th><th>Value</th></tr>
      <tr><td>Total Clicks</td><td>${data.clicks}</td></tr>
      <tr><td>Unique Visitors</td><td>${data.uniqueVisitors}</td></tr>
      <tr><td>Total Links</td><td>${data.totalLinks}</td></tr></table>
      <h2>Clicks by Day</h2>
      <table><tr><th>Date</th><th>Clicks</th></tr>
      ${data.clicksByDay.map((d) => `<tr><td>${d.date}</td><td>${d.clicks}</td></tr>`).join("")}</table>
      <h2>Top Referrers</h2>
      <table><tr><th>Referrer</th><th>Count</th></tr>
      ${data.referrers.slice(0, 10).map((r) => `<tr><td>${r.referrer}</td><td>${r.count}</td></tr>`).join("")}</table>
      <h2>Top Countries</h2>
      <table><tr><th>Country</th><th>Count</th></tr>
      ${data.countries.slice(0, 10).map((c) => `<tr><td>${c.country}</td><td>${c.count}</td></tr>`).join("")}</table>
      <h2>Browsers</h2>
      <table><tr><th>Browser</th><th>Count</th></tr>
      ${data.browsers.map((b) => `<tr><td>${b.browser}</td><td>${b.count}</td></tr>`).join("")}</table>
      <h2>Devices</h2>
      <table><tr><th>Device</th><th>Count</th></tr>
      ${data.devices.map((d) => `<tr><td>${d.device}</td><td>${d.count}</td></tr>`).join("")}</table>
      </body></html>
    `)
    win.document.close()
    win.print()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-50">Analytics</h1>
          <p className="mt-1 text-sm text-dark-100">Track your link performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as DateRange)}
            className="w-40"
          >
            {dateRangeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Select>
          {dateRange === "custom" && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="flex h-10 rounded-lg border border-dark-100 bg-dark-500 px-3 text-sm text-dark-50"
              />
              <span className="text-dark-100">to</span>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="flex h-10 rounded-lg border border-dark-100 bg-dark-500 px-3 text-sm text-dark-50"
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-dark-300 p-3">
                <MousePointerClick className="h-5 w-5 text-primary-500" />
              </div>
              <div>
                <p className="text-sm text-dark-100">Total Clicks</p>
                <p className="text-2xl font-bold text-dark-50">{formatNumber(data.clicks)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-dark-300 p-3">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-dark-100">Unique Visitors</p>
                <p className="text-2xl font-bold text-dark-50">{formatNumber(data.uniqueVisitors)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-dark-300 p-3">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-dark-100">Total Links</p>
                <p className="text-2xl font-bold text-dark-50">{formatNumber(data.totalLinks)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-dark-300 p-3">
                <Trophy className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-dark-100">Top Link</p>
                <p className="text-xl font-bold text-dark-50 truncate">-</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Clicks Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart data={data.clicksByDay} xKey="date" yKey="clicks" />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Referrers</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={referrers.slice(0, 6)} xKey="name" yKey="count" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Country</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">%</TableHead>
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
            <CardTitle className="text-lg flex items-center gap-2">
              <Monitor className="h-4 w-4 text-dark-100" />
              Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart data={devices} showLegend />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Browsers</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart data={browsers} showLegend />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Operating Systems</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart data={os} showLegend />
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button variant="outline" onClick={exportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
        <Button variant="primary" onClick={exportPDF}>
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </div>
    </div>
  )
}
