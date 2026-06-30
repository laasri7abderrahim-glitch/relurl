"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RouteBuilder } from "@/components/smart-links/RouteBuilder"
import { RoutePreview } from "@/components/smart-links/RoutePreview"
import { RouteAnalytics } from "@/components/smart-links/RouteAnalytics"
import TrafficForecast from "@/components/dashboard/traffic-forecast"
import {
  ArrowLeft, Loader2, Save, Plus, Trash2, Power, PowerOff,
  Facebook, Globe, Zap, Linkedin, Twitter, Code, Sparkles,
  Check, Copy
} from "lucide-react"

interface LinkData {
  id: string
  slug: string
  url: string
  title: string | null
  facebookPixel: string | null
  googlePixel: string | null
  tiktokPixel: string | null
  linkedinPixel: string | null
  twitterPixel: string | null
  customPixels: string | null
  aiBestTime: string | null
  aiPredictedCtr: number | null
  aiSuggestions: string | null
}

interface ABTest {
  id: string
  name: string
  urls: string
  weights: string | null
  isActive: boolean
  totalClicks: number
}

interface AIInsights {
  peakHour: number
  bestDay: string
  totalClicks: number
  uniqueVisitors: number
  topReferrer: string
  mobilePercentage: number
  averageClicksPerDay: number
}

interface ExpiryPrediction {
  trend: string
  healthScore: number
  healthStatus: string
  estimatedDaysRemaining: number | null
  weeklyChange: number
  recommendation: string
}

interface AIResult {
  hasData: boolean
  bestTime?: string
  predictedCtr?: number
  confidence?: string
  suggestions: string[]
  insights?: AIInsights
  expiryPrediction?: ExpiryPrediction
}

interface SmartRedirectConditions {
  countries?: string[]
  devices?: string[]
  languages?: string[]
  timeRanges?: { start: string; end: string; days?: number[] }[]
}

interface SmartRedirectSuggestion {
  name: string
  conditions: SmartRedirectConditions
  destination: string
  priority: number
  reason: string
}

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

const pixelFields = [
  { key: "facebookPixel" as const, labelKey: "facebookPixelId", placeholder: "1234567890", icon: Facebook, color: "text-blue-500" },
  { key: "googlePixel" as const, labelKey: "googleAnalyticsId", placeholder: "G-XXXXXXXXXX", icon: Globe, color: "text-emerald-500" },
  { key: "tiktokPixel" as const, labelKey: "tiktokPixelId", placeholder: "Cxxxxxxxxxxxxxxxxx", icon: Zap, color: "text-dark-50" },
  { key: "linkedinPixel" as const, labelKey: "linkedinPixelId", placeholder: "1234567", icon: Linkedin, color: "text-blue-400" },
  { key: "twitterPixel" as const, labelKey: "twitterPixelId", placeholder: "o8xyz", icon: Twitter, color: "text-sky-500" },
] as const

export default function LinkDetailPage() {
  const t = useTranslations('dashboard.links.detail')
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const linkId = params.id as string

  const [link, setLink] = useState<LinkData | null>(null)
  const [activeTab, setActiveTab] = useState<"retargeting" | "abtest" | "smart" | "ai">("retargeting")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [pixels, setPixels] = useState({
    facebookPixel: "",
    googlePixel: "",
    tiktokPixel: "",
    linkedinPixel: "",
    twitterPixel: "",
    customPixels: "",
  })

  const [abTests, setAbTests] = useState<ABTest[]>([])
  const [newAbTest, setNewAbTest] = useState({ name: "", urls: "" })

  const [smartRoutes, setSmartRoutes] = useState<SmartRoute[]>([])

  const [aiResult, setAiResult] = useState<AIResult | null>(null)

  const [aiSuggestions, setAiSuggestions] = useState<SmartRedirectSuggestion[]>([])
  const [aiSuggestLoading, setAiSuggestLoading] = useState(false)
  const [aiSuggestError, setAiSuggestError] = useState<string | null>(null)
  const [applyingIdx, setApplyingIdx] = useState<number | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login")
    if (status === "authenticated") {
      Promise.all([
        fetch(`/api/retargeting?linkId=${linkId}`).then((r) => r.json()),
        fetch(`/api/ab-tests?linkId=${linkId}`).then((r) => r.json()),
        fetch(`/api/smart-routes?linkId=${linkId}`).then((r) => r.json()),
        fetch(`/api/ai-optimize?linkId=${linkId}`).then((r) => r.json()),
      ]).then(([retargeting, ab, smart, ai]) => {
        if (retargeting.data) {
          setLink(retargeting.data)
          setPixels({
            facebookPixel: retargeting.data.facebookPixel || "",
            googlePixel: retargeting.data.googlePixel || "",
            tiktokPixel: retargeting.data.tiktokPixel || "",
            linkedinPixel: retargeting.data.linkedinPixel || "",
            twitterPixel: retargeting.data.twitterPixel || "",
            customPixels: retargeting.data.customPixels || "",
          })
        }
        setAbTests(ab.data || [])
        setSmartRoutes(smart.data || [])
        if (ai.data?.aiSuggestions) {
          setAiResult(JSON.parse(ai.data.aiSuggestions))
        }
        setLoading(false)
      })
    }
  }, [status, router, linkId])

  const savePixels = async () => {
    setSaving(true)
    setSaved(false)
    const res = await fetch("/api/retargeting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ linkId, ...pixels }),
    })
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  const createABTest = async () => {
    if (!newAbTest.name || !newAbTest.urls) return
    const urls = newAbTest.urls.split("\n").filter((u) => u.trim())
    const res = await fetch("/api/ab-tests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ linkId, name: newAbTest.name, urls }),
    })
    const data = await res.json()
    if (data.data) {
      setAbTests([data.data, ...abTests])
      setNewAbTest({ name: "", urls: "" })
    }
  }

  const runAIOptimization = async () => {
    setSaving(true)
    const res = await fetch("/api/ai-optimize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ linkId }),
    })
    const data = await res.json()
    if (data.data) setAiResult(data.data)
    setSaving(false)
  }

  const activePixelCount = Object.values(pixels).filter((v) => v.trim()).length

  const tabs = [
    { id: "retargeting" as const, labelKey: "tabRetargeting", count: activePixelCount },
    { id: "abtest" as const, labelKey: "tabAbTesting", count: abTests.length },
    { id: "smart" as const, labelKey: "tabSmartRouting", count: smartRoutes.length },
    { id: "ai" as const, labelKey: "tabAiOptimization", count: null },
  ]

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin rounded-full h-8 w-8 text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/links" className="text-dark-100 hover:text-dark-50">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-dark-50">{link?.title || link?.slug || t('title')}</h1>
          <p className="text-sm text-dark-100">relurl.com/{link?.slug}</p>
        </div>
        <a href={`/${link?.slug}`} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm">{t('openLink')}</Button>
        </a>
      </div>

      <div className="flex gap-1 border-b border-dark-100 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 border-b-2 transition-colors whitespace-nowrap text-sm ${
              activeTab === tab.id
                ? "border-primary text-primary font-medium"
                : "border-transparent text-dark-100 hover:text-dark-50"
            }`}
          >
            {t(tab.labelKey)}
            {tab.count !== null && tab.count > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Retargeting Pixels Tab */}
      {activeTab === "retargeting" && (
        <div className="space-y-6">
          <Card className="border-dark-100">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{t('retargetingPixels')}</CardTitle>
                  <CardDescription>
                    {t('retargetingDesc')}
                  </CardDescription>
                </div>
                {activePixelCount > 0 && (
                  <Badge variant="success">{t('nActive', { count: activePixelCount })}</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {pixelFields.map((field) => {
                  const Icon = field.icon
                  return (
                    <div key={field.key}>
                      <label className="flex items-center gap-2 text-sm font-medium mb-1.5">
                        <Icon className={`w-4 h-4 ${field.color}`} />
                        {t(field.labelKey)}
                      </label>
                      <Input
                        value={pixels[field.key]}
                        onChange={(e) => setPixels({ ...pixels, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                      />
                    </div>
                  )
                })}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-1.5">
                    <Code className="w-4 h-4 text-dark-100" />
                    {t('customPixels')}
                  </label>
                  <Textarea
                    value={pixels.customPixels}
                    onChange={(e) => setPixels({ ...pixels, customPixels: e.target.value })}
                    placeholder={t('customPixelsPlaceholder')}
                    rows={2}
                  />
                  <p className="text-xs text-dark-100 mt-1">{t('customPixelsHint')}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button onClick={savePixels} disabled={saving}>
                  {saving ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('saving')}</>
                  ) : saved ? (
                    <><Check className="mr-2 h-4 w-4" /> {t('saved')}</>
                  ) : (
                    <><Save className="mr-2 h-4 w-4" /> {t('savePixels')}</>
                  )}
                </Button>
                {saved && (
                  <span className="text-sm text-emerald-500">{t('pixelsSaved')}</span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-dark-100">
            <CardHeader>
              <CardTitle className="text-base">{t('howRetargetingWorks')}</CardTitle>
            </CardHeader>
              <CardContent className="space-y-3 text-sm text-dark-100">
                <p>{t('retargetingExplanation')}</p>
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-dark-300/50 border border-dark-100">
                    <p className="font-medium text-dark-50 mb-1">{t('step1Title')}</p>
                    <p className="text-xs">{t('step1Desc')}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-dark-300/50 border border-dark-100">
                    <p className="font-medium text-dark-50 mb-1">{t('step2Title')}</p>
                    <p className="text-xs">{t('step2Desc')}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-dark-300/50 border border-dark-100">
                    <p className="font-medium text-dark-50 mb-1">{t('step3Title')}</p>
                    <p className="text-xs">{t('step3Desc')}</p>
                  </div>
                </div>
              </CardContent>
          </Card>
        </div>
      )}

      {/* A/B Testing Tab */}
      {activeTab === "abtest" && (
        <div className="space-y-6">
          <Card className="border-dark-100">
            <CardHeader>
              <CardTitle className="text-lg">{t('createAbTest')}</CardTitle>
              <CardDescription>{t('createAbTestDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">{t('testName')}</label>
                <Input
                  value={newAbTest.name}
                  onChange={(e) => setNewAbTest({ ...newAbTest, name: e.target.value })}
                  placeholder={t('testNamePlaceholder')}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">{t('destinationUrls')}</label>
                <Textarea
                  value={newAbTest.urls}
                  onChange={(e) => setNewAbTest({ ...newAbTest, urls: e.target.value })}
                  placeholder={t('destinationUrlsPlaceholder')}
                  rows={4}
                />
              </div>
              <Button onClick={createABTest} disabled={!newAbTest.name || !newAbTest.urls}>
                <Plus className="mr-2 h-4 w-4" /> {t('createTest')}
              </Button>
            </CardContent>
          </Card>

          {abTests.length > 0 && (
            <Card className="border-dark-100">
              <CardHeader>
                <CardTitle className="text-lg">{t('activeTests')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {abTests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-3 rounded-lg bg-dark-300/50 border border-dark-100">
                    <div>
                      <p className="font-medium text-dark-50">{test.name}</p>
                      <p className="text-sm text-dark-100">
                        {t('testVariants', { count: JSON.parse(test.urls).length, clicks: test.totalClicks })}
                      </p>
                    </div>
                    <Badge variant={test.isActive ? "success" : "secondary"}>
                      {test.isActive ? t('badgeActive') : t('badgeInactive')}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Smart Routing Tab */}
      {activeTab === "smart" && (
        <div className="space-y-6">
          <RoutePreview routes={smartRoutes} />
          <RouteAnalytics routes={smartRoutes} />
          <RouteBuilder
            linkId={linkId}
            routes={smartRoutes}
            onRoutesChange={setSmartRoutes}
          />

          <Card className="border-dark-100">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                {t('aiSuggestRoutes')}
              </CardTitle>
              <CardDescription>{t('aiSuggestDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={async () => {
                  setAiSuggestLoading(true)
                  setAiSuggestError(null)
                  setAiSuggestions([])
                  try {
                    const res = await fetch("/api/ai/smart-redirect-suggest", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ linkId }),
                    })
                    const data = await res.json()
                    if (!res.ok) {
                      setAiSuggestError(data.error || t('aiSuggestError'))
                    } else {
                      setAiSuggestions(data.suggestions || [])
                    }
                  } catch {
                    setAiSuggestError(t('aiSuggestError'))
                  } finally {
                    setAiSuggestLoading(false)
                  }
                }}
                disabled={aiSuggestLoading}
              >
                {aiSuggestLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('aiSuggestLoading')}</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" /> {t('aiSuggestRoutes')}</>
                )}
              </Button>

              {aiSuggestError && (
                <p className="text-sm text-red-500">{aiSuggestError}</p>
              )}

              {!aiSuggestLoading && aiSuggestions.length === 0 && !aiSuggestError && (
                <p className="text-sm text-dark-100">{t('aiSuggestNone')}</p>
              )}

              {aiSuggestions.map((s, idx) => (
                <Card key={idx} className="border-dark-100 bg-dark-300/30">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-dark-50 text-sm">{s.name}</p>
                        <p className="text-xs text-dark-100 mt-1">{s.reason}</p>
                      </div>
                      <Badge variant="outline" className="shrink-0">P{s.priority}</Badge>
                    </div>
                    <div className="text-xs text-dark-100">
                      {s.conditions.countries && (
                        <span className="mr-3">Countries: {s.conditions.countries.join(", ")}</span>
                      )}
                      {s.conditions.devices && (
                        <span className="mr-3">Devices: {s.conditions.devices.join(", ")}</span>
                      )}
                      {s.conditions.timeRanges && (
                        <span>Peak hours active</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={applyingIdx === idx}
                        onClick={async () => {
                          setApplyingIdx(idx)
                          try {
                            await fetch("/api/smart-routes", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                linkId,
                                name: s.name,
                                conditions: s.conditions,
                                destination: s.destination,
                                priority: s.priority,
                              }),
                            })
                            const res = await fetch(`/api/smart-routes?linkId=${linkId}`)
                            const data = await res.json()
                            if (data.data) setSmartRoutes(data.data)
                            setAiSuggestions((prev) => prev.filter((_, i) => i !== idx))
                          } catch {
                            // ignore
                          } finally {
                            setApplyingIdx(null)
                          }
                        }}
                      >
                        {applyingIdx === idx ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Check className="h-3 w-3" />
                        )}
                        <span className="ml-1">{t('applySuggestion')}</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setAiSuggestions((prev) => prev.filter((_, i) => i !== idx))}
                      >
                        {t('dismissSuggestion')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Optimization Tab */}
      {activeTab === "ai" && (
        <div className="space-y-6">
          <Card className="border-dark-100">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                {t('aiOptimization')}
              </CardTitle>
              <CardDescription>{t('aiOptimizationDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={runAIOptimization} disabled={saving}>
                {saving ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('analyzing')}</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" /> {t('runAnalysis')}</>
                )}
              </Button>
            </CardContent>
          </Card>

          {aiResult && (
            <div className="space-y-4">
              {aiResult.hasData ? (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="border-dark-100">
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-dark-100">{t('bestPostingTime')}</p>
                        <p className="text-lg font-bold text-primary">{String(aiResult.bestTime)}</p>
                      </CardContent>
                    </Card>
                    <Card className="border-dark-100">
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-dark-100">{t('estimatedCtr')}</p>
                        <p className="text-lg font-bold text-primary">{String(aiResult.predictedCtr)}%</p>
                      </CardContent>
                    </Card>
                    <Card className="border-dark-100">
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-dark-100">{t('confidence')}</p>
                        <p className="text-lg font-bold text-primary">
                          {typeof aiResult.confidence === "string"
                            ? aiResult.confidence.charAt(0).toUpperCase() + aiResult.confidence.slice(1)
                            : `${aiResult.confidence}%`}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {aiResult.insights && (
                    <Card className="border-dark-100">
                      <CardHeader>
                        <CardTitle className="text-base">{t('clickAnalytics')}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="p-3 rounded-lg bg-dark-300/50 border border-dark-100">
                            <p className="text-xs text-dark-100">{t('totalClicks')}</p>
                            <p className="text-xl font-bold text-dark-50">{aiResult.insights.totalClicks}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-dark-300/50 border border-dark-100">
                            <p className="text-xs text-dark-100">{t('uniqueVisitors')}</p>
                            <p className="text-xl font-bold text-dark-50">{aiResult.insights.uniqueVisitors}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-dark-300/50 border border-dark-100">
                            <p className="text-xs text-dark-100">{t('avgClicksPerDay')}</p>
                            <p className="text-xl font-bold text-dark-50">{aiResult.insights.averageClicksPerDay}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-dark-300/50 border border-dark-100">
                            <p className="text-xs text-dark-100">{t('mobilePercentage')}</p>
                            <p className="text-xl font-bold text-dark-50">{aiResult.insights.mobilePercentage}%</p>
                          </div>
                          <div className="p-3 rounded-lg bg-dark-300/50 border border-dark-100">
                            <p className="text-xs text-dark-100">{t('peakHourUtc')}</p>
                            <p className="text-xl font-bold text-dark-50">{aiResult.insights.peakHour}:00</p>
                          </div>
                          <div className="p-3 rounded-lg bg-dark-300/50 border border-dark-100">
                            <p className="text-xs text-dark-100">{t('bestDay')}</p>
                            <p className="text-xl font-bold text-dark-50">{aiResult.insights.bestDay}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-dark-300/50 border border-dark-100">
                            <p className="text-xs text-dark-100">{t('topReferrer')}</p>
                            <p className="text-xl font-bold text-dark-50 truncate" title={aiResult.insights.topReferrer}>{aiResult.insights.topReferrer}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-dark-300/50 border border-dark-100">
                            <p className="text-xs text-dark-100">{t('estCtr')}</p>
                            <p className="text-xl font-bold text-dark-50">{aiResult.predictedCtr}%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {aiResult.expiryPrediction && <TrafficForecast prediction={aiResult.expiryPrediction} />}

                  {Array.isArray(aiResult.suggestions) && (
                    <Card className="border-dark-100">
                      <CardHeader>
                        <CardTitle className="text-base">{t('suggestions')}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {(aiResult.suggestions as string[]).map((s: string, i: number) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            <span>{s}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <Card className="border-dark-100">
                  <CardHeader>
                    <CardTitle className="text-base">{t('noClickData')}</CardTitle>
                    <CardDescription>{t('noClickDataDesc')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {(aiResult.suggestions as string[]).map((s: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}