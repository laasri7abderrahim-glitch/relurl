"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { TimeRangePicker, type TimeRange } from "./TimeRangePicker"
import {
  Plus, X, Save, Trash2, Power, PowerOff, GripVertical,
  Globe, Smartphone, Languages, Clock, Link2, Zap
} from "lucide-react"

interface SmartRoute {
  id: string
  name: string
  conditions: string
  destination: string
  priority: number
  isActive: boolean
  hitCount: number
  lastHitAt: string | null
  utmParams: string | null
  matchMode: string
  routeGroup: number
}

interface RouteBuilderProps {
  linkId: string
  routes: SmartRoute[]
  onRoutesChange: (routes: SmartRoute[]) => void
}

const COUNTRY_PRESETS = [
  { label: "United States", code: "US" },
  { label: "United Kingdom", code: "GB" },
  { label: "Canada", code: "CA" },
  { label: "Germany", code: "DE" },
  { label: "France", code: "FR" },
  { label: "Japan", code: "JP" },
  { label: "Brazil", code: "BR" },
  { label: "Australia", code: "AU" },
  { label: "India", code: "IN" },
  { label: "Nigeria", code: "NG" },
]

export function RouteBuilder({ linkId, routes, onRoutesChange }: RouteBuilderProps) {
  const [creating, setCreating] = useState(false)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: "",
    destination: "",
    countries: [] as string[],
    devices: [] as string[],
    languages: [] as string[],
    timeRanges: [] as TimeRange[],
    priority: 0,
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmContent: "",
    utmTerm: "",
    matchMode: "first" as "first" | "all",
    routeGroup: 0,
  })

  const resetForm = () => {
    setForm({
      name: "", destination: "", countries: [], devices: [], languages: [],
      timeRanges: [], priority: 0, utmSource: "", utmMedium: "",
      utmCampaign: "", utmContent: "", utmTerm: "", matchMode: "first", routeGroup: 0,
    })
    setError("")
  }

  const buildConditions = () => {
    const c: Record<string, unknown> = {}
    if (form.countries.length) c.countries = form.countries
    if (form.devices.length) c.devices = form.devices
    if (form.languages.length) c.languages = form.languages
    if (form.timeRanges.length) c.timeRanges = form.timeRanges
    return c
  }

  const buildUtmParams = () => {
    const hasUtm = form.utmSource || form.utmMedium || form.utmCampaign || form.utmContent || form.utmTerm
    if (!hasUtm) return null
    const utm: Record<string, string> = {}
    if (form.utmSource) utm.source = form.utmSource
    if (form.utmMedium) utm.medium = form.utmMedium
    if (form.utmCampaign) utm.campaign = form.utmCampaign
    if (form.utmContent) utm.content = form.utmContent
    if (form.utmTerm) utm.term = form.utmTerm
    return utm
  }

  const createRoute = async () => {
    if (!form.name || !form.destination) return
    setCreating(true)
    setError("")
    try {
      const res = await fetch("/api/smart-routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          linkId,
          name: form.name,
          destination: form.destination,
          conditions: buildConditions(),
          priority: form.priority,
          utmParams: buildUtmParams(),
          matchMode: form.matchMode,
          routeGroup: form.routeGroup,
        }),
      })
      const data = await res.json()
      if (res.ok && data.data) {
        onRoutesChange([data.data, ...routes])
        resetForm()
      } else {
        setError(data.error || "Failed to create route")
      }
    } catch {
      setError("Network error")
    } finally {
      setCreating(false)
    }
  }

  const updateRoute = async (id: string, updates: Partial<SmartRoute>) => {
    setSavingId(id)
    try {
      const body: Record<string, unknown> = {}
      if (updates.name !== undefined) body.name = updates.name
      if (updates.destination !== undefined) body.destination = updates.destination
      if (updates.priority !== undefined) body.priority = updates.priority
      if (updates.isActive !== undefined) body.isActive = updates.isActive

      const res = await fetch(`/api/smart-routes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        onRoutesChange(routes.map((r) => (r.id === id ? { ...r, ...updates } : r)))
      }
    } finally {
      setSavingId(null)
    }
  }

  const deleteRoute = async (id: string) => {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/smart-routes/${id}`, { method: "DELETE" })
      if (res.ok) {
        onRoutesChange(routes.filter((r) => r.id !== id))
      }
    } finally {
      setDeletingId(null)
    }
  }

  const addCountry = (code: string) => {
    if (code && !form.countries.includes(code)) {
      setForm({ ...form, countries: [...form.countries, code.toUpperCase()] })
    }
  }

  const removeCountry = (code: string) => {
    setForm({ ...form, countries: form.countries.filter((c) => c !== code) })
  }

  const addDevice = (device: string) => {
    if (device && !form.devices.includes(device)) {
      setForm({ ...form, devices: [...form.devices, device] })
    }
  }

  const addLanguage = (lang: string) => {
    if (lang && !form.languages.includes(lang.toLowerCase())) {
      setForm({ ...form, languages: [...form.languages, lang.toLowerCase()] })
    }
  }

  const parseConditions = (conditions: string) => {
    try {
      return JSON.parse(conditions)
    } catch {
      return {}
    }
  }

  return (
    <div className="space-y-6">
      {/* Create Form */}
      <Card className="border-dark-100">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold">Create Smart Route</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-dark-100 mb-1 block">Route Name</label>
              <Input
                placeholder="e.g. US Desktop Users"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-dark-100 mb-1 block">Destination URL</label>
              <Input
                placeholder="https://example.com/landing"
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
                className="h-8 text-sm"
              />
            </div>
          </div>

          {/* Conditions */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-dark-100 mb-1 flex items-center gap-1">
                <Globe className="w-3 h-3" /> Countries
              </label>
              <div className="flex flex-wrap gap-1 mb-2">
                {form.countries.map((c) => (
                  <span key={c} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    {c}
                    <button onClick={() => removeCountry(c)}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
              <Select
                value=""
                onChange={(e) => { addCountry(e.target.value); e.target.value = "" }}
                className="h-8 text-sm"
              >
                <option value="">Add country...</option>
                {COUNTRY_PRESETS.map((c) => (
                  <option key={c.code} value={c.code}>{c.label} ({c.code})</option>
                ))}
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-dark-100 mb-1 flex items-center gap-1">
                <Smartphone className="w-3 h-3" /> Devices
              </label>
              <div className="flex gap-1">
                {["desktop", "mobile", "tablet"].map((d) => (
                  <Button
                    key={d}
                    type="button"
                    variant={form.devices.includes(d) ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-xs capitalize"
                    onClick={() =>
                      form.devices.includes(d)
                        ? setForm({ ...form, devices: form.devices.filter((x) => x !== d) })
                        : addDevice(d)
                    }
                  >
                    {d}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-dark-100 mb-1 flex items-center gap-1">
                <Languages className="w-3 h-3" /> Languages
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. en"
                  value=""
                  onChange={(e) => { if (e.target.value) addLanguage(e.target.value); e.target.value = "" }}
                  className="h-8 text-sm"
                />
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {form.languages.map((l) => (
                  <span key={l} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    {l}
                    <button onClick={() => setForm({ ...form, languages: form.languages.filter((x) => x !== l) })}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-dark-100 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Time Ranges
              </label>
              <TimeRangePicker
                value={form.timeRanges}
                onChange={(ranges) => setForm({ ...form, timeRanges: ranges })}
              />
            </div>
          </div>

          {/* UTM + Group + Priority */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-medium text-dark-100 mb-1 block">UTM Source</label>
              <Input
                placeholder="e.g. facebook"
                value={form.utmSource}
                onChange={(e) => setForm({ ...form, utmSource: e.target.value })}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-dark-100 mb-1 block">UTM Medium</label>
              <Input
                placeholder="e.g. social"
                value={form.utmMedium}
                onChange={(e) => setForm({ ...form, utmMedium: e.target.value })}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-dark-100 mb-1 block">UTM Campaign</label>
              <Input
                placeholder="e.g. spring_sale"
                value={form.utmCampaign}
                onChange={(e) => setForm({ ...form, utmCampaign: e.target.value })}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-dark-100 mb-1 block">Priority</label>
              <Input
                type="number"
                min={0}
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) || 0 })}
                className="h-8 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-dark-100 mb-1 block">Route Group (AND logic)</label>
              <Input
                type="number"
                min={0}
                value={form.routeGroup}
                onChange={(e) => setForm({ ...form, routeGroup: parseInt(e.target.value) || 0 })}
                className="h-8 text-sm"
                placeholder="0 = default group"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-dark-100 mb-1 block">Match Mode</label>
              <Select
                value={form.matchMode}
                onChange={(e) => setForm({ ...form, matchMode: e.target.value as "first" | "all" })}
                className="h-8 text-sm"
              >
                <option value="first">First Match (OR)</option>
                <option value="all">All Must Match (AND)</option>
              </Select>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <Button onClick={createRoute} disabled={creating || !form.name || !form.destination} size="sm">
            <Plus className="w-3 h-3 mr-1" />
            {creating ? "Creating..." : "Create Route"}
          </Button>
        </CardContent>
      </Card>

      {/* Route List */}
      <div className="space-y-3">
        {routes.length === 0 && (
          <p className="text-sm text-dark-100 text-center py-8">
            No smart routes yet. Create one above to start routing traffic conditionally.
          </p>
        )}
        {routes.map((route) => {
          const conditions = parseConditions(route.conditions)
          const utm = route.utmParams ? JSON.parse(route.utmParams) : null

          return (
            <Card key={route.id} className={`border-dark-100 ${!route.isActive ? "opacity-60" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 pt-1">
                    <GripVertical className="w-4 h-4 text-dark-100" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{route.name}</span>
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                        route.isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-dark-300 text-dark-100"
                      }`}>
                        {route.isActive ? "Active" : "Inactive"}
                      </span>
                      {route.routeGroup > 0 && (
                        <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-rose-500/10 text-rose-500">
                          Group {route.routeGroup}
                        </span>
                      )}
                      <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-dark-300 text-dark-100">
                        {route.matchMode === "all" ? "AND" : "OR"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-dark-100 mb-2">
                      <Link2 className="w-3 h-3" />
                      <span className="truncate">{route.destination}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {conditions.countries?.map((c: string) => (
                        <span key={c} className="px-1.5 py-0.5 rounded-full text-xs bg-blue-500/10 text-blue-500 border border-blue-500/20">
                          {c}
                        </span>
                      ))}
                      {conditions.devices?.map((d: string) => (
                        <span key={d} className="px-1.5 py-0.5 rounded-full text-xs bg-purple-500/10 text-purple-500 border border-purple-500/20 capitalize">
                          {d}
                        </span>
                      ))}
                      {conditions.languages?.map((l: string) => (
                        <span key={l} className="px-1.5 py-0.5 rounded-full text-xs bg-amber-500/10 text-amber-500 border border-amber-500/20">
                          {l}
                        </span>
                      ))}
                      {conditions.timeRanges?.length > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          {conditions.timeRanges.length} time range(s)
                        </span>
                      )}
                      {utm && (
                        <span className="px-1.5 py-0.5 rounded-full text-xs bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                          UTM
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-dark-100 mt-2">
                      <span>Priority: {route.priority}</span>
                      <span>·</span>
                      <span>{route.hitCount} hits</span>
                      {route.lastHitAt && (
                        <>
                          <span>·</span>
                          <span>Last: {new Date(route.lastHitAt).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateRoute(route.id, { isActive: !route.isActive })}
                      disabled={savingId === route.id}
                      title={route.isActive ? "Disable" : "Enable"}
                    >
                      {route.isActive ? <PowerOff className="w-3 h-3" /> : <Power className="w-3 h-3" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-500"
                      onClick={() => deleteRoute(route.id)}
                      disabled={deletingId === route.id}
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
