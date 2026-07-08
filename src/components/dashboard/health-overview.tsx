"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HeartPulse, CheckCircle2, XCircle, Clock } from "lucide-react"
import { formatRelativeTime } from "@/lib/utils"

interface HealthStats {
  total: number
  healthy: number
  unhealthy: number
  lastChecked: string
}

export default function HealthOverview({ stats }: { stats: HealthStats | null }) {
  if (!stats || stats.total === 0) return null

  const healthyPct = Math.round((stats.healthy / stats.total) * 100)
  const unhealthyPct = Math.round((stats.unhealthy / stats.total) * 100)

  return (
    <Card className="border-dark-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <HeartPulse className="h-4 w-4 text-accent" />
          Link Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span className="text-sm text-dark-50">{stats.healthy} healthy</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-dark-50">{stats.unhealthy} broken</span>
          </div>
        </div>
        <div className="h-2 rounded-full bg-dark-300 overflow-hidden flex">
          <div className="bg-emerald-500 transition-all" style={{ width: `${healthyPct}%` }} />
          <div className="bg-red-500 transition-all" style={{ width: `${unhealthyPct}%` }} />
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-dark-100">{healthyPct}% healthy</span>
          <span className="text-xs text-dark-100 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatRelativeTime(stats.lastChecked)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
