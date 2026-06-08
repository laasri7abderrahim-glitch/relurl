"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Check, X } from "lucide-react"

interface SmartRoute {
  id: string
  name: string
  conditions: string
  destination: string
  priority: number
  isActive: boolean
  matchMode: string
  routeGroup: number
}

interface RoutePreviewProps {
  routes: SmartRoute[]
}

function timeMatchesRange(hour: number, start: string, end: string): boolean {
  const startHour = parseInt(start.split(":")[0])
  const endHour = parseInt(end.split(":")[0])
  if (startHour <= endHour) {
    return hour >= startHour && hour <= endHour
  }
  return hour >= startHour || hour <= endHour
}

export function RoutePreview({ routes }: RoutePreviewProps) {
  const [country, setCountry] = useState("")
  const [device, setDevice] = useState("desktop")
  const [language, setLanguage] = useState("")
  const [hour, setHour] = useState(new Date().getHours())
  const [day, setDay] = useState(new Date().getDay())
  const [matchedRoute, setMatchedRoute] = useState<string | null>(null)
  const [tested, setTested] = useState(false)

  const runTest = () => {
    const activeRoutes = routes.filter((r) => r.isActive)
    const sorted = [...activeRoutes].sort((a, b) => {
      if (a.routeGroup !== b.routeGroup) return a.routeGroup - b.routeGroup
      return b.priority - a.priority
    })

    // Group routes
    const grouped = new Map<number, SmartRoute[]>()
    for (const route of sorted) {
      const g = route.routeGroup || 0
      if (!grouped.has(g)) grouped.set(g, [])
      grouped.get(g)!.push(route)
    }

    const sortedGroups = Array.from(grouped.entries()).sort(([a], [b]) => a - b)

    for (const [, groupRoutes] of sortedGroups) {
      const matchMode = groupRoutes[0]?.matchMode || "first"

      if (matchMode === "all") {
        const allMatch = groupRoutes.every((route) => {
          const conditions = JSON.parse(route.conditions)
          return checkConditions(conditions, country, device, language, hour, day)
        })
        if (allMatch) {
          const winner = groupRoutes[groupRoutes.length - 1]
          setMatchedRoute(winner.id)
          setTested(true)
          return
        }
      } else {
        for (const route of groupRoutes) {
          const conditions = JSON.parse(route.conditions)
          if (checkConditions(conditions, country, device, language, hour, day)) {
            setMatchedRoute(route.id)
            setTested(true)
            return
          }
        }
      }
    }

    setMatchedRoute(null)
    setTested(true)
  }

  const checkConditions = (
    conditions: Record<string, unknown>,
    ctry: string,
    dev: string,
    lang: string,
    h: number,
    d: number
  ): boolean => {
    const c = conditions as {
      countries?: string[]
      devices?: string[]
      languages?: string[]
      timeRanges?: { start: string; end: string; days?: number[] }[]
    }

    if (c.countries?.length && ctry) {
      if (!c.countries.includes(ctry.toUpperCase())) return false
    }
    if (c.devices?.length) {
      if (!c.devices.includes(dev)) return false
    }
    if (c.languages?.length && lang) {
      if (!c.languages.includes(lang.toLowerCase())) return false
    }
    if (c.timeRanges?.length) {
      const timeMatch = c.timeRanges.some((tr) => {
        const dayMatch = !tr.days?.length || tr.days.includes(d)
        return dayMatch && timeMatchesRange(h, tr.start, tr.end)
      })
      if (!timeMatch) return false
    }
    return true
  }

  return (
    <Card className="border-dark-100">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Play className="w-4 h-4 text-primary" />
          Test Routing Rules
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-medium text-dark-100 mb-1 block">Country Code</label>
            <Input
              placeholder="e.g. US"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-dark-100 mb-1 block">Device</label>
            <Select
              value={device}
              onChange={(e) => setDevice(e.target.value)}
              className="h-8 text-sm"
            >
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile</option>
              <option value="tablet">Tablet</option>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-dark-100 mb-1 block">Language</label>
            <Input
              placeholder="e.g. en"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-dark-100 mb-1 block">Hour (0-23)</label>
            <Input
              type="number"
              min={0}
              max={23}
              value={hour}
              onChange={(e) => setHour(parseInt(e.target.value) || 0)}
              className="h-8 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button size="sm" onClick={runTest}>
            <Play className="w-3 h-3 mr-1" />
            Test
          </Button>
          {tested && (
            <div className="flex items-center gap-2 text-sm">
              {matchedRoute ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-500">
                    Match: <strong>{routes.find((r) => r.id === matchedRoute)?.name}</strong>
                  </span>
                </>
              ) : (
                <>
                  <X className="w-4 h-4 text-dark-100" />
                  <span className="text-dark-100">No match — default URL will be used</span>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
