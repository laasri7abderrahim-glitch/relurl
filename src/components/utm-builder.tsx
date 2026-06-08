"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Wand2, Trash2, Link2, Clock } from "lucide-react"

interface UTMParams {
  url: string
  source: string
  medium: string
  campaign: string
  content: string
  term: string
}

interface UTMPreset {
  name: string
  icon: string
  source: string
  medium: string
  campaign: string
  content: string
  term: string
}

const presets: UTMPreset[] = [
  { name: "Facebook Ad", icon: "fb", source: "facebook", medium: "cpc", campaign: "spring_sale", content: "", term: "" },
  { name: "Google Ads", icon: "ga", source: "google", medium: "cpc", campaign: "brand_search", content: "", term: "" },
  { name: "Instagram Bio", icon: "ig", source: "instagram", medium: "social", campaign: "bio_link", content: "", term: "" },
  { name: "Twitter Post", icon: "tw", source: "twitter", medium: "social", campaign: "tweet_promo", content: "", term: "" },
  { name: "Email Newsletter", icon: "em", source: "newsletter", medium: "email", campaign: "monthly_dispatch", content: "", term: "" },
  { name: "LinkedIn Post", icon: "li", source: "linkedin", medium: "social", campaign: "thought_leadership", content: "", term: "" },
  { name: "YouTube Description", icon: "yt", source: "youtube", medium: "video", campaign: "tutorial_series", content: "", term: "" },
  { name: "SMS Campaign", icon: "sm", source: "sms", medium: "sms", campaign: "flash_sale", content: "", term: "" },
  { name: "QR Code", icon: "qr", source: "qrcode", medium: "offline", campaign: "poster_launch", content: "", term: "" },
  { name: "Podcast Mention", icon: "pc", source: "podcast", medium: "audio", campaign: "episode_42", content: "", term: "" },
  { name: "Blog Post", icon: "bg", source: "blog", medium: "referral", campaign: "how_to_guide", content: "", term: "" },
  { name: "Banner Ad", icon: "ba", source: "banner", medium: "display", campaign: "homepage_promo", content: "leaderboard", term: "" },
]

interface UTMBuilderProps {
  onSave?: (params: UTMParams, generatedUrl: string) => void
}

export function UTMBuilder({ onSave }: UTMBuilderProps) {
  const [url, setUrl] = useState("")
  const [source, setSource] = useState("")
  const [medium, setMedium] = useState("")
  const [campaign, setCampaign] = useState("")
  const [content, setContent] = useState("")
  const [term, setTerm] = useState("")
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<{ url: string; timestamp: Date }[]>([])

  const buildURL = () => {
    if (!url) return ""
    try {
      const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`)
      if (source) urlObj.searchParams.set("utm_source", source)
      if (medium) urlObj.searchParams.set("utm_medium", medium)
      if (campaign) urlObj.searchParams.set("utm_campaign", campaign)
      if (content) urlObj.searchParams.set("utm_content", content)
      if (term) urlObj.searchParams.set("utm_term", term)
      return urlObj.toString()
    } catch {
      return ""
    }
  }

  const generatedUrl = buildURL()

  const copyUrl = () => {
    if (!generatedUrl) return
    navigator.clipboard.writeText(generatedUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const applyPreset = (preset: UTMPreset) => {
    setSource(preset.source)
    setMedium(preset.medium)
    setCampaign(preset.campaign)
    setContent(preset.content)
    setTerm(preset.term)
  }

  const clearAll = () => {
    setSource("")
    setMedium("")
    setCampaign("")
    setContent("")
    setTerm("")
  }

  const addToHistory = () => {
    if (!generatedUrl) return
    setHistory((prev) => [{ url: generatedUrl, timestamp: new Date() }, ...prev].slice(0, 20))
  }

  const downloadCSV = () => {
    if (history.length === 0) return
    const rows = [["URL", "Timestamp"], ...history.map((h) => [h.url, h.timestamp.toISOString()])]
    const csv = rows.map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = "utm-urls.csv"
    a.click()
  }

  const paramCount = [source, medium, campaign, content, term].filter(Boolean).length

  return (
    <div className="space-y-6">
      {/* Preset Quick-Apply */}
      <Card className="border-dark-100">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-primary" />
            Quick Presets
          </CardTitle>
          <CardDescription>Click a preset to auto-fill UTM parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-dark-100 bg-dark-300/50 text-dark-50 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Builder Form */}
      <Card className="border-dark-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">UTM Builder</CardTitle>
              <CardDescription>Add campaign tracking parameters to any URL</CardDescription>
            </div>
            {paramCount > 0 && (
              <Badge variant="success">{paramCount} params</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Destination URL *</label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/landing-page"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
               utm_source <span className="text-red-500">*</span>
              </label>
              <Input
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. facebook, google, newsletter"
              />
              <p className="text-xs text-dark-100 mt-1">Where the traffic comes from</p>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                utm_medium <span className="text-red-500">*</span>
              </label>
              <Input
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                placeholder="e.g. cpc, social, email, banner"
              />
              <p className="text-xs text-dark-100 mt-1">Marketing medium</p>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                utm_campaign <span className="text-red-500">*</span>
              </label>
              <Input
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                placeholder="e.g. spring_sale, product_launch"
              />
              <p className="text-xs text-dark-100 mt-1">Campaign name or ID</p>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">utm_content</label>
              <Input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="e.g. header_banner, sidebar_ad"
              />
              <p className="text-xs text-dark-100 mt-1">Differentiate similar content</p>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">utm_term</label>
              <Input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="e.g. running_shoes, best_price"
              />
              <p className="text-xs text-dark-100 mt-1">Paid search keyword</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={clearAll}>
              <Trash2 className="w-3 h-3 mr-1" /> Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated URL */}
      {generatedUrl && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-dark-100 mb-1">Generated URL</div>
                <div className="text-sm font-mono text-primary break-all">{generatedUrl}</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" onClick={copyUrl}>
                  {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    addToHistory()
                    onSave?.({ url, source, medium, campaign, content, term }, generatedUrl)
                  }}
                >
                  Save
                </Button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {source && <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">utm_source={source}</span>}
              {medium && <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">utm_medium={medium}</span>}
              {campaign && <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">utm_campaign={campaign}</span>}
              {content && <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">utm_content={content}</span>}
              {term && <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">utm_term={term}</span>}
            </div>
          </CardContent>
        </Card>
      )}

      {/* History */}
      {history.length > 0 && (
        <Card className="border-dark-100">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-dark-100" />
                <CardTitle className="text-base">Generated URLs ({history.length})</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={downloadCSV}>
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {history.map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-dark-300/50 border border-dark-100">
                  <Link2 className="w-3 h-3 text-dark-100 shrink-0" />
                  <span className="text-xs font-mono text-dark-50 truncate flex-1">{item.url}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={() => {
                      navigator.clipboard.writeText(item.url)
                    }}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
