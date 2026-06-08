"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RouteBuilder } from "@/components/smart-links/RouteBuilder"
import { RoutePreview } from "@/components/smart-links/RoutePreview"
import { RouteAnalytics } from "@/components/smart-links/RouteAnalytics"
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
  { key: "facebookPixel", label: "Facebook Pixel ID", placeholder: "1234567890", icon: Facebook, color: "text-blue-500" },
  { key: "googlePixel", label: "Google Analytics ID", placeholder: "G-XXXXXXXXXX", icon: Globe, color: "text-emerald-500" },
  { key: "tiktokPixel", label: "TikTok Pixel ID", placeholder: "Cxxxxxxxxxxxxxxxxx", icon: Zap, color: "text-dark-50" },
  { key: "linkedinPixel", label: "LinkedIn Pixel ID", placeholder: "1234567", icon: Linkedin, color: "text-blue-400" },
  { key: "twitterPixel", label: "Twitter Pixel ID", placeholder: "o8xyz", icon: Twitter, color: "text-sky-500" },
] as const

export default function LinkDetailPage() {
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

  const [aiResult, setAiResult] = useState<Record<string, unknown> | null>(null)

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
    { id: "retargeting" as const, label: "Retargeting Pixels", count: activePixelCount },
    { id: "abtest" as const, label: "A/B Testing", count: abTests.length },
    { id: "smart" as const, label: "Smart Routing", count: smartRoutes.length },
    { id: "ai" as const, label: "AI Optimization", count: null },
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
          <h1 className="text-2xl font-bold text-dark-50">{link?.title || link?.slug || "Link Details"}</h1>
          <p className="text-sm text-dark-100">relurl.com/{link?.slug}</p>
        </div>
        <a href={`/${link?.slug}`} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm">Open Link</Button>
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
            {tab.label}
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
                  <CardTitle className="text-lg">Retargeting Pixels</CardTitle>
                  <CardDescription>
                    Add tracking pixels to fire when someone visits your short link
                  </CardDescription>
                </div>
                {activePixelCount > 0 && (
                  <Badge variant="success">{activePixelCount} active</Badge>
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
                        {field.label}
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
                    Custom Pixels
                  </label>
                  <Textarea
                    value={pixels.customPixels}
                    onChange={(e) => setPixels({ ...pixels, customPixels: e.target.value })}
                    placeholder='["https://example.com/pixel.js"]'
                    rows={2}
                  />
                  <p className="text-xs text-dark-100 mt-1">JSON array of script URLs or inline script tags</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button onClick={savePixels} disabled={saving}>
                  {saving ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                  ) : saved ? (
                    <><Check className="mr-2 h-4 w-4" /> Saved!</>
                  ) : (
                    <><Save className="mr-2 h-4 w-4" /> Save Pixels</>
                  )}
                </Button>
                {saved && (
                  <span className="text-sm text-emerald-500">Pixels saved successfully</span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-dark-100">
            <CardHeader>
              <CardTitle className="text-base">How Retargeting Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-dark-100">
              <p>When someone clicks your short link, they&apos;ll briefly see an interstitial page that loads your tracking pixels before redirecting to the destination.</p>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-dark-300/50 border border-dark-100">
                  <p className="font-medium text-dark-50 mb-1">1. Add Pixels</p>
                  <p className="text-xs">Enter your pixel IDs for each platform above.</p>
                </div>
                <div className="p-3 rounded-lg bg-dark-300/50 border border-dark-100">
                  <p className="font-medium text-dark-50 mb-1">2. Visitor Clicks</p>
                  <p className="text-xs">Pixel scripts fire during the redirect.</p>
                </div>
                <div className="p-3 rounded-lg bg-dark-300/50 border border-dark-100">
                  <p className="font-medium text-dark-50 mb-1">3. Retarget</p>
                  <p className="text-xs">Visitor is added to your retargeting audience.</p>
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
              <CardTitle className="text-lg">Create A/B Test</CardTitle>
              <CardDescription>Split traffic between multiple destination URLs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Test Name</label>
                <Input
                  value={newAbTest.name}
                  onChange={(e) => setNewAbTest({ ...newAbTest, name: e.target.value })}
                  placeholder="e.g. Homepage vs Landing Page"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Destination URLs (one per line)</label>
                <Textarea
                  value={newAbTest.urls}
                  onChange={(e) => setNewAbTest({ ...newAbTest, urls: e.target.value })}
                  placeholder={"https://example.com/variant-a\nhttps://example.com/variant-b"}
                  rows={4}
                />
              </div>
              <Button onClick={createABTest} disabled={!newAbTest.name || !newAbTest.urls}>
                <Plus className="mr-2 h-4 w-4" /> Create Test
              </Button>
            </CardContent>
          </Card>

          {abTests.length > 0 && (
            <Card className="border-dark-100">
              <CardHeader>
                <CardTitle className="text-lg">Active Tests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {abTests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-3 rounded-lg bg-dark-300/50 border border-dark-100">
                    <div>
                      <p className="font-medium text-dark-50">{test.name}</p>
                      <p className="text-sm text-dark-100">
                        {JSON.parse(test.urls).length} variants · {test.totalClicks} clicks
                      </p>
                    </div>
                    <Badge variant={test.isActive ? "success" : "secondary"}>
                      {test.isActive ? "Active" : "Inactive"}
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
        </div>
      )}

      {/* AI Optimization Tab */}
      {activeTab === "ai" && (
        <div className="space-y-6">
          <Card className="border-dark-100">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                AI Link Optimization
              </CardTitle>
              <CardDescription>Get AI-powered suggestions to optimize your link performance</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={runAIOptimization} disabled={saving}>
                {saving ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" /> Run AI Analysis</>
                )}
              </Button>
            </CardContent>
          </Card>

          {aiResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card className="border-dark-100">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-dark-100">Best Posting Time</p>
                    <p className="text-lg font-bold text-primary">{String(aiResult.bestTime)}</p>
                  </CardContent>
                </Card>
                <Card className="border-dark-100">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-dark-100">Predicted CTR</p>
                    <p className="text-lg font-bold text-primary">{String(aiResult.predictedCtr)}%</p>
                  </CardContent>
                </Card>
                <Card className="border-dark-100">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-dark-100">Confidence</p>
                    <p className="text-lg font-bold text-primary">{String(aiResult.confidence)}%</p>
                  </CardContent>
                </Card>
              </div>

              {Array.isArray(aiResult.suggestions) && (
                <Card className="border-dark-100">
                  <CardHeader>
                    <CardTitle className="text-base">Suggestions</CardTitle>
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
