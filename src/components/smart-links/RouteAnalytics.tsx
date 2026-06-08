"use client"

import { BarChart3, Clock, TrendingUp } from "lucide-react"

interface RouteStats {
  id: string
  name: string
  destination: string
  hitCount: number
  lastHitAt: string | null
  isActive: boolean
  routeGroup: number
  priority: number
}

interface RouteAnalyticsProps {
  routes: RouteStats[]
}

export function RouteAnalytics({ routes }: RouteAnalyticsProps) {
  const totalHits = routes.reduce((sum, r) => sum + r.hitCount, 0)
  const topRoute = routes.reduce(
    (best, r) => (r.hitCount > (best?.hitCount ?? 0) ? r : best),
    routes[0] ?? null
  )
  const maxHits = Math.max(...routes.map((r) => r.hitCount), 1)

  if (routes.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-lg bg-dark-300/50 border border-dark-100 text-center">
          <div className="text-2xl font-bold text-dark-50">{totalHits}</div>
          <div className="text-xs text-dark-100">Total Hits</div>
        </div>
        <div className="p-3 rounded-lg bg-dark-300/50 border border-dark-100 text-center">
          <div className="text-2xl font-bold text-dark-50">{routes.length}</div>
          <div className="text-xs text-dark-100">Routes</div>
        </div>
        <div className="p-3 rounded-lg bg-dark-300/50 border border-dark-100 text-center">
          <div className="text-2xl font-bold text-dark-50 truncate" title={topRoute?.name || "N/A"}>
            {topRoute?.name ? (topRoute.name.length > 10 ? topRoute.name.slice(0, 10) + "..." : topRoute.name) : "N/A"}
          </div>
          <div className="text-xs text-dark-100">Top Route</div>
        </div>
      </div>

      <div className="space-y-2">
        {routes.map((route) => (
          <div key={route.id} className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium truncate">{route.name}</span>
                {!route.isActive && (
                  <span className="text-xs text-dark-100">(disabled)</span>
                )}
              </div>
              <div className="h-2 rounded-full bg-dark-300 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${maxHits > 0 ? (route.hitCount / maxHits) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="flex items-center gap-1 text-sm font-medium">
                <BarChart3 className="w-3 h-3 text-dark-100" />
                {route.hitCount}
              </div>
              {route.lastHitAt && (
                <div className="flex items-center gap-1 text-xs text-dark-100">
                  <Clock className="w-3 h-3" />
                  {new Date(route.lastHitAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
