"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeftRight, TrendingUp, TrendingDown } from "lucide-react"

interface ClickDay {
  date: string
  clicks: number
}

export default function QuickCompare({ clicksByDay }: { clicksByDay?: ClickDay[] }) {
  const data = useMemo(() => {
    if (!clicksByDay || clicksByDay.length < 3) return null

    const sorted = [...clicksByDay].sort((a, b) => a.date.localeCompare(b.date))
    const hasComparison = sorted.length >= 14

    const current = sorted.slice(-7)
    const currentTotal = current.reduce((s, d) => s + d.clicks, 0)
    const currentAvg = current.length > 0 ? Math.round(currentTotal / current.length) : 0

    let previousTotal = 0
    let change = 0
    if (hasComparison) {
      previousTotal = sorted.slice(-14, -7).reduce((s, d) => s + d.clicks, 0)
      change = previousTotal > 0 ? Math.round(((currentTotal - previousTotal) / previousTotal) * 100) : currentTotal > 0 ? 100 : 0
    }

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const currentBars = current.map((d) => {
      const day = new Date(d.date).getDay()
      return { day: days[day === 0 ? 6 : day - 1], clicks: d.clicks }
    })

    const bestDay = [...currentBars].sort((a, b) => b.clicks - a.clicks)[0]

    return { currentTotal, previousTotal, change, hasComparison, currentAvg, currentBars, bestDay }
  }, [clicksByDay])

  if (!data) return null

  const changeColor = data.change > 0 ? "text-emerald-500" : data.change < 0 ? "text-red-500" : "text-dark-50"
  const changeIcon = data.change > 0 ? "↑" : data.change < 0 ? "↓" : "→"

  return (
    <Card className="border-dark-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <ArrowLeftRight className="h-4 w-4 text-accent" />
          {data.hasComparison ? "This Week vs Last" : "This Period"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs text-dark-100">Total clicks</p>
            <p className="text-lg font-bold text-dark-50">{data.currentTotal.toLocaleString()}</p>
          </div>
          {data.hasComparison && (
            <div className="text-right">
              <p className="text-xs text-dark-100">vs last week</p>
              <p className={`text-lg font-bold ${changeColor}`}>{changeIcon} {Math.abs(data.change)}%</p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-dark-100 mb-2">
          <TrendingUp className="h-3 w-3 text-emerald-500" />
          <span>{data.currentAvg.toLocaleString()} avg / day</span>
          {data.bestDay && (
            <>
              <span className="text-dark-200">·</span>
              <span>Best: {data.bestDay.day} ({data.bestDay.clicks})</span>
            </>
          )}
        </div>
        <div className="grid grid-cols-7 gap-1 h-24 items-end">
          {data.currentBars.map((d, i) => {
            const maxVal = Math.max(...data.currentBars.map((x) => x.clicks), 1)
            const height = (d.clicks / maxVal) * 100
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-full rounded-t bg-accent/80 transition-all" style={{ height: `${height}%`, minHeight: d.clicks > 0 ? 4 : 0 }} />
                <span className="text-[10px] text-dark-100">{d.day.slice(0, 2)}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
