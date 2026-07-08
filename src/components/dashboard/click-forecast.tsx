"use client"

import { useMemo } from "react"
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, MinusIcon } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface ClickDay {
  date: string
  clicks: number
}

function linearRegression(data: { x: number; y: number }[]) {
  const n = data.length
  if (n < 2) return { slope: 0, intercept: 0, r2: 0 }
  const sumX = data.reduce((s, d) => s + d.x, 0)
  const sumY = data.reduce((s, d) => s + d.y, 0)
  const sumXY = data.reduce((s, d) => s + d.x * d.y, 0)
  const sumXX = data.reduce((s, d) => s + d.x * d.x, 0)
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n
  const yMean = sumY / n
  const ssRes = data.reduce((s, d) => s + (d.y - (slope * d.x + intercept)) ** 2, 0)
  const ssTot = data.reduce((s, d) => s + (d.y - yMean) ** 2, 0)
  const r2 = ssTot === 0 ? 0 : 1 - ssRes / ssTot
  return { slope, intercept, r2 }
}

export default function ClickForecast({ clicksByDay }: { clicksByDay?: ClickDay[] }) {
  const forecast = useMemo(() => {
    if (!clicksByDay || clicksByDay.length < 3) return null

    const sorted = [...clicksByDay].sort((a, b) => a.date.localeCompare(b.date))
    const points = sorted.map((d, i) => ({ x: i, y: d.clicks }))
    const { slope, intercept, r2 } = linearRegression(points)

    const lastClicks = sorted[sorted.length - 1].clicks
    const avgClicks = Math.round(sorted.reduce((s, d) => s + d.clicks, 0) / sorted.length)

    let weeklyChange = 0
    if (sorted.length >= 7) {
      const first = sorted.slice(0, 7).reduce((s, d) => s + d.clicks, 0)
      const last = sorted.slice(-7).reduce((s, d) => s + d.clicks, 0)
      weeklyChange = Math.round(((last - first) / Math.max(first, 1)) * 100)
    }

    const projectedDays = 7
    const projected: ClickDay[] = []
    const nextDate = new Date(sorted[sorted.length - 1].date)
    let totalProjected = 0
    for (let i = 1; i <= projectedDays; i++) {
      const x = points.length - 1 + i
      const y = Math.max(0, Math.round(slope * x + intercept))
      nextDate.setDate(nextDate.getDate() + 1)
      const dateStr = nextDate.toISOString().slice(0, 10)
      projected.push({ date: dateStr, clicks: y })
      totalProjected += y
    }

    const trend = slope > 0.5 ? "growing" : slope < -0.5 ? "declining" : "stable"
    const healthScore = Math.round(Math.min(100, Math.max(5, (r2 * 60 + 35) + (trend === "growing" ? 15 : trend === "stable" ? 5 : -10))))
    const healthStatus = healthScore >= 60 ? "healthy" : healthScore >= 35 ? "declining" : "at_risk"

    const recommendations: Record<string, string> = {
      growing: "Traffic is trending up. Create more links and double down on what works.",
      declining: "Traffic is slowing. Try refreshing old links or promoting your best content again.",
      stable: "Traffic is steady. Keep testing new channels and optimizing your links.",
    }

    const combined = [...sorted.slice(-14), ...projected]

    return {
      trend,
      healthScore,
      healthStatus,
      weeklyChange,
      avgClicks,
      totalProjected,
      projected,
      combined,
      recommendation: recommendations[trend] || "Monitor your traffic regularly.",
    }
  }, [clicksByDay])

  if (!forecast || !clicksByDay || clicksByDay.length < 3) return null

  const chartData = forecast.combined.map((d, i) => {
    const isProjected = i >= forecast.combined.length - forecast.projected.length
    return {
      date: formatDate(d.date, "MMM d"),
      [isProjected ? "projected" : "actual"]: d.clicks,
      actual: i < forecast.combined.length - forecast.projected.length ? d.clicks : null,
      projected: isProjected ? d.clicks : null,
    }
  })

  const trendIcon = forecast.trend === "growing" ? (
    <TrendingUp className="h-4 w-4 text-emerald-500" />
  ) : forecast.trend === "declining" ? (
    <TrendingDown className="h-4 w-4 text-red-500" />
  ) : (
    <MinusIcon className="h-4 w-4 text-yellow-500" />
  )

  const trendLabel = forecast.trend === "growing" ? "Growing" : forecast.trend === "declining" ? "Declining" : "Stable"
  const changeColor = forecast.weeklyChange > 0 ? "text-emerald-500" : forecast.weeklyChange < 0 ? "text-red-500" : "text-dark-50"

  return (
    <Card className="border-dark-100">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-accent" />
          7-Day Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 mb-4">
          <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-dark-500 border border-dark-100">
            <div className="flex items-center gap-1 mb-1">
              {trendIcon}
              <span className="text-sm font-medium text-dark-50">{trendLabel}</span>
            </div>
            <p className="text-xs text-dark-100">Trend</p>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-dark-500 border border-dark-100">
            <p className={`text-lg font-bold ${changeColor}`}>
              {forecast.weeklyChange > 0 ? "↑" : forecast.weeklyChange < 0 ? "↓" : "→"} {Math.abs(forecast.weeklyChange)}%
            </p>
            <p className="text-xs text-dark-100">Weekly change</p>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-dark-500 border border-dark-100">
            <p className="text-lg font-bold text-dark-50">{forecast.totalProjected.toLocaleString()}</p>
            <p className="text-xs text-dark-100">Next 7 days</p>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-dark-500 border border-dark-100">
            <p className="text-lg font-bold text-dark-50">{forecast.avgClicks.toLocaleString()}</p>
            <p className="text-xs text-dark-100">Daily avg</p>
          </div>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null
                  return (
                    <div className="rounded-lg border border-dark-100 bg-dark-500 px-3 py-2 shadow-xl">
                      <p className="text-xs text-dark-100">{label}</p>
                      {payload.filter(p => p.value !== null).map((entry, i) => (
                        <p key={i} className="text-sm font-medium" style={{ color: entry.color }}>
                          {entry.name}: {entry.value}
                        </p>
                      ))}
                    </div>
                  )
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#14b8a6" strokeWidth={2} dot={false} name="Actual" connectNulls />
              <Line type="monotone" dataKey="projected" stroke="#14b8a6" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Projected" connectNulls />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-3 text-xs text-dark-100 leading-relaxed">{forecast.recommendation}</p>
      </CardContent>
    </Card>
  )
}
