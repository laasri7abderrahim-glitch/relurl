"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { WandSparkles, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/toast"

interface UtmBuilderProps {
  baseUrl: string
  onApply: (params: { utmSource: string; utmMedium: string; utmCampaign: string; utmContent: string; utmTerm: string }) => void
  onClose: () => void
}

export function UtmBuilder({ baseUrl, onApply, onClose }: UtmBuilderProps) {
  const t = useTranslations('dashboard.links.new')
  const [utmSource, setUtmSource] = useState("")
  const [utmMedium, setUtmMedium] = useState("")
  const [utmCampaign, setUtmCampaign] = useState("")
  const [utmContent, setUtmContent] = useState("")
  const [utmTerm, setUtmTerm] = useState("")
  const [suggesting, setSuggesting] = useState(false)
  const [copied, setCopied] = useState(false)
  const { addToast } = useToast()

  const generatedUrl = buildUrl(baseUrl, { utmSource, utmMedium, utmCampaign, utmContent, utmTerm })

  const handleSuggest = async () => {
    if (!baseUrl) return
    setSuggesting(true)
    try {
      const res = await fetch("/api/utm/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: baseUrl }),
      })
      const json = await res.json()
      if (json.data?.suggestedParams) {
        setUtmSource(json.data.suggestedParams.utm_source || "")
        setUtmMedium(json.data.suggestedParams.utm_medium || "")
        setUtmCampaign(json.data.suggestedParams.utm_campaign || "")
        setUtmContent(json.data.suggestedParams.utm_content || "")
        setUtmTerm(json.data.suggestedParams.utm_term || "")
      } else {
        addToast(t('utmSuggestError'), "error")
      }
    } catch {
      addToast(t('utmSuggestError'), "error")
    } finally {
      setSuggesting(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedUrl)
    setCopied(true)
    addToast(t('toastCopied'), "success")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleApply = () => {
    onApply({ utmSource, utmMedium, utmCampaign, utmContent, utmTerm })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-50 w-full max-w-lg rounded-xl border border-dark-100 bg-dark-500 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-dark-50">{t('utmBuilder')}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm text-dark-100 hover:text-dark-50 transition-colors"
          >
            <span className="sr-only">Close</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mb-4"
          onClick={handleSuggest}
          disabled={suggesting || !baseUrl}
        >
          <WandSparkles className="mr-2 h-4 w-4" />
          {suggesting ? t('utmSuggestLoading') : t('utmAutoFill')}
        </Button>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="utm-source">{t('utmSource')}</Label>
            <Input
              id="utm-source"
              placeholder="e.g. facebook, google"
              value={utmSource}
              onChange={(e) => setUtmSource(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="utm-medium">{t('utmMedium')}</Label>
            <Input
              id="utm-medium"
              placeholder="e.g. social, cpc, email"
              value={utmMedium}
              onChange={(e) => setUtmMedium(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="utm-campaign">{t('utmCampaign')}</Label>
            <Input
              id="utm-campaign"
              placeholder="e.g. spring_sale"
              value={utmCampaign}
              onChange={(e) => setUtmCampaign(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="utm-content">{t('utmContent')}</Label>
            <Input
              id="utm-content"
              placeholder="e.g. hero_banner"
              value={utmContent}
              onChange={(e) => setUtmContent(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="utm-term">{t('utmTerm')}</Label>
            <Input
              id="utm-term"
              placeholder="e.g. keywords"
              value={utmTerm}
              onChange={(e) => setUtmTerm(e.target.value)}
            />
          </div>
        </div>

        {generatedUrl && (
          <div className="mt-4 p-3 rounded-lg bg-dark-300/50 border border-dark-100">
            <p className="text-xs text-dark-100 mb-1">{t('utmPreview')}</p>
            <p className="text-sm text-dark-50 break-all">{generatedUrl}</p>
          </div>
        )}

        <div className="mt-4 flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            {t('utmClose')}
          </Button>
          <Button variant="secondary" size="sm" onClick={handleCopy} disabled={!generatedUrl}>
            {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
            {copied ? t('copied') : t('copyUrl')}
          </Button>
          <Button variant="primary" size="sm" className="ml-auto" onClick={handleApply}>
            {t('utmApply')}
          </Button>
        </div>
      </div>
    </div>
  )
}

function buildUrl(baseUrl: string, params: { utmSource: string; utmMedium: string; utmCampaign: string; utmContent: string; utmTerm: string }): string {
  try {
    const url = new URL(baseUrl)
    if (params.utmSource) url.searchParams.set("utm_source", params.utmSource)
    if (params.utmMedium) url.searchParams.set("utm_medium", params.utmMedium)
    if (params.utmCampaign) url.searchParams.set("utm_campaign", params.utmCampaign)
    if (params.utmContent) url.searchParams.set("utm_content", params.utmContent)
    if (params.utmTerm) url.searchParams.set("utm_term", params.utmTerm)
    return url.toString()
  } catch {
    return baseUrl
  }
}
