"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useTranslations } from "next-intl"
import { useToast } from "@/components/ui/toast"
import { sanitizeInput } from "@/lib/utils"
import { UtmBuilder } from "@/components/dashboard/utm-builder"
import {
  Link2,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Lock,
  ArrowLeft,
  FileUp,
  Globe,
  Smartphone,
  Languages,
  CalendarClock,
  WandSparkles,
} from "lucide-react"
import { Link } from "@/i18n/navigation"

export default function NewLinkPage() {
  const t = useTranslations('dashboard.links.new')
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single")
  const [destinationUrl, setDestinationUrl] = useState("")
  const [domain, setDomain] = useState("relurl.com")
  const [customAlias, setCustomAlias] = useState("")
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState("")
  const [passwordProtect, setPasswordProtect] = useState(false)
  const [password, setPassword] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [utmSource, setUtmSource] = useState("")
  const [utmMedium, setUtmMedium] = useState("")
  const [utmCampaign, setUtmCampaign] = useState("")
  const [utmTerm, setUtmTerm] = useState("")
  const [utmContent, setUtmContent] = useState("")
  const [expirationDate, setExpirationDate] = useState("")
  const [shortUrl, setShortUrl] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")
  const [bulkUrls, setBulkUrls] = useState("")
  const [bulkResults, setBulkResults] = useState<{
    created: number
    errors: Array<{ index: number; url: string; error: string }>
  } | null>(null)
  const [geoEnabled, setGeoEnabled] = useState(false)
  const [geoCountries, setGeoCountries] = useState<string[]>([])
  const [deviceEnabled, setDeviceEnabled] = useState(false)
  const [devices, setDevices] = useState<string[]>([])
  const [langEnabled, setLangEnabled] = useState(false)
  const [languages, setLanguages] = useState<string[]>([])
  const [scheduledAt, setScheduledAt] = useState("")
  const [isFetchingPreview, setIsFetchingPreview] = useState(false)
  const [previewData, setPreviewData] = useState<{
    title: string | null
    description: string | null
    image: string | null
    favicon: string | null
  } | null>(null)
  const [showUtmBuilder, setShowUtmBuilder] = useState(false)
  const { addToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!destinationUrl) {
      addToast(t('toastUrlRequired'), "error")
      return
    }

    setIsCreating(true)
    setError("")
    setShortUrl("")

    const body: Record<string, unknown> = {
      url: destinationUrl,
      domain,
      title: title ? sanitizeInput(title) : undefined,
      tags: tags
        ? tags.split(",").map((t) => t.trim()).filter(Boolean)
        : undefined,
      password: passwordProtect ? password : undefined,
      slug: customAlias ? sanitizeInput(customAlias) : undefined,
      utmSource: utmSource || undefined,
      utmMedium: utmMedium || undefined,
      utmCampaign: utmCampaign || undefined,
      utmTerm: utmTerm || undefined,
      utmContent: utmContent || undefined,
      expiresAt: expirationDate ? new Date(expirationDate).toISOString() : undefined,
      languageTargeting: langEnabled
        ? JSON.stringify({ enabled: true, languages })
        : undefined,
      scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
    }
    if (geoEnabled) {
      body.geoTargeting = JSON.stringify({ enabled: true, countries: geoCountries })
    }
    if (deviceEnabled) {
      body.deviceTargeting = JSON.stringify({ enabled: true, devices })
    }

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (json.data && !json.error) {
        const link = json.data
        setShortUrl(`https://${link.domain}/${link.slug}`)
        addToast(t('toastCreated'), "success")
      } else if (json.upgradeRequired) {
        setError(json.error)
        addToast(json.error, "error")
      } else {
        setError(json.error || t('toastCreateFailed'))
        addToast(json.error || t('toastCreateFailed'), "error")
      }
    } catch {
      setError(t('toastUnexpectedError'))
      addToast(t('toastUnexpectedError'), "error")
    } finally {
      setIsCreating(false)
    }
  }

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bulkUrls.trim()) {
      addToast(t('toastEnterUrl'), "error")
      return
    }

    setIsCreating(true)
    setError("")
    setBulkResults(null)

    const urls = bulkUrls
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean)
      .map((url) => ({ url }))

    if (urls.length === 0) {
      addToast(t('toastNoValidUrls'), "error")
      setIsCreating(false)
      return
    }

    if (urls.length > 50) {
      addToast(t('toastMaxLinks'), "error")
      setIsCreating(false)
      return
    }

    try {
      const res = await fetch("/api/links/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ links: urls }),
      })
      const json = await res.json()
      if (json.data && !json.error) {
        setBulkResults({
          created: json.data.created.length,
          errors: json.data.errors,
        })
        addToast(
          t('toastBulkCreated', { created: json.data.created.length, total: json.data.total }),
          json.data.errors.length > 0 ? "warning" : "success"
        )
        setBulkUrls("")
      } else {
        setError(json.error || t('toastCreateFailed'))
        addToast(json.error || t('toastCreateFailed'), "error")
      }
    } catch {
      setError(t('toastUnexpectedError'))
      addToast(t('toastUnexpectedError'), "error")
    } finally {
      setIsCreating(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    addToast(t('toastCopied'), "success")
    setTimeout(() => setCopied(false), 2000)
  }

  const fetchPreview = async (targetUrl: string) => {
    if (!targetUrl) return
    setIsFetchingPreview(true)
    setPreviewData(null)
    try {
      const res = await fetch("/api/ai/fetch-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      })
      if (!res.ok) return
      const data = await res.json()
      if (data.title) {
        setTitle(data.title)
      }
      setPreviewData(data)
    } catch {
      // silently fail
    } finally {
      setIsFetchingPreview(false)
    }
  }

  const handleUtmApply = (params: { utmSource: string; utmMedium: string; utmCampaign: string; utmContent: string; utmTerm: string }) => {
    setUtmSource(params.utmSource)
    setUtmMedium(params.utmMedium)
    setUtmCampaign(params.utmCampaign)
    setUtmContent(params.utmContent)
    setUtmTerm(params.utmTerm)
    setShowUtmBuilder(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/links">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-dark-50">{t('title')}</h1>
          <p className="mt-1 text-sm text-dark-100">{t('subtitle')}</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-dark-100 pb-2">
        <button
          onClick={() => setActiveTab("single")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === "single"
              ? "bg-primary-500 text-white"
              : "text-dark-100 hover:text-dark-50 hover:bg-dark-200"
          }`}
        >
          <span className="flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            {t('tabSingle')}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("bulk")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === "bulk"
              ? "bg-primary-500 text-white"
              : "text-dark-100 hover:text-dark-50 hover:bg-dark-200"
          }`}
        >
          <span className="flex items-center gap-2">
            <FileUp className="h-4 w-4" />
            {t('tabBulk')}
          </span>
        </button>
      </div>

      {activeTab === "single" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('linkDetails')}</CardTitle>
                <CardDescription>{t('linkDetailsDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="destination">{t('destinationUrl')}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="destination"
                      placeholder={t('destinationUrlPlaceholder')}
                      value={destinationUrl}
                      onChange={(e) => setDestinationUrl(e.target.value)}
                      onBlur={(e) => {
                        const val = e.target.value.trim()
                        if (val && (val.startsWith("http://") || val.startsWith("https://"))) {
                          fetchPreview(val)
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => fetchPreview(destinationUrl)}
                      disabled={isFetchingPreview || !destinationUrl}
                    >
                      {isFetchingPreview ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-dark-100 border-t-transparent" />
                      ) : (
                        t('fetchPreview')
                      )}
                    </Button>
                  </div>
                  {isFetchingPreview && (
                    <p className="text-xs text-dark-100">{t('fetchingPreview')}</p>
                  )}
                  {previewData && previewData.title && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-300/50 border border-dark-100">
                      <img
                        src={previewData.favicon || "/globe.svg"}
                        className="w-6 h-6 rounded"
                        alt=""
                        onError={(e) => { (e.target as HTMLImageElement).src = "/globe.svg" }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-dark-50 truncate">{previewData.title}</p>
                        <p className="text-xs text-dark-100 truncate">{new URL(destinationUrl).hostname}</p>
                      </div>
                      {previewData.image && (
                        <img
                          src={previewData.image}
                          className="w-10 h-10 rounded object-cover"
                          alt=""
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                        />
                      )}
                    </div>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="domain">{t('domain')}</Label>
                    <Select
                      id="domain"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                    >
                      <option value="relurl.com">relurl.com</option>
                      <option value="link.relurl.com">link.relurl.com</option>
                      <option value="go.relurl.com">go.relurl.com</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alias">{t('customAlias')}</Label>
                    <Input
                      id="alias"
                      placeholder={t('customAliasPlaceholder')}
                      value={customAlias}
                      onChange={(e) => setCustomAlias(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">{t('titleField')}</Label>
                  <Input
                    id="title"
                    placeholder={t('titlePlaceholder')}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">{t('tags')}</Label>
                  <Input
                    id="tags"
                    placeholder={t('tagsPlaceholder')}
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="passwordProtect"
                      checked={passwordProtect}
                      onChange={(e) => setPasswordProtect(e.target.checked)}
                      className="h-4 w-4 rounded border-dark-100 bg-dark-500 text-primary-500 focus:ring-primary-500"
                    />
                    <Label htmlFor="passwordProtect" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-dark-100" />
                        <span>{t('passwordProtect')}</span>
                      </div>
                    </Label>
                  </div>
                  {passwordProtect && (
                    <Input
                      type="password"
                      placeholder={t('passwordPlaceholder')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex w-full items-center justify-between p-6"
              >
                <div className="text-left">
                  <CardTitle className="text-lg">{t('advancedOptions')}</CardTitle>
                  <CardDescription>{t('advancedOptionsDesc')}</CardDescription>
                </div>
                {showAdvanced ? (
                  <ChevronUp className="h-5 w-5 text-dark-100" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-dark-100" />
                )}
              </button>
              {showAdvanced && (
                <CardContent className="space-y-4 border-t border-dark-100 pt-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-dark-50">{t('utmParameters')}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowUtmBuilder(true)}
                      disabled={!destinationUrl}
                    >
                      <WandSparkles className="mr-1.5 h-4 w-4" />
                      {t('utmAutoFill')}
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="utmSource">{t('utmSource')}</Label>
                      <Input
                        id="utmSource"
                        placeholder={t('utmSourcePlaceholder')}
                        value={utmSource}
                        onChange={(e) => setUtmSource(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="utmMedium">{t('utmMedium')}</Label>
                      <Input
                        id="utmMedium"
                        placeholder={t('utmMediumPlaceholder')}
                        value={utmMedium}
                        onChange={(e) => setUtmMedium(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="utmCampaign">{t('utmCampaign')}</Label>
                      <Input
                        id="utmCampaign"
                        placeholder={t('utmCampaignPlaceholder')}
                        value={utmCampaign}
                        onChange={(e) => setUtmCampaign(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="utmTerm">{t('utmTerm')}</Label>
                      <Input
                        id="utmTerm"
                        placeholder={t('utmTermPlaceholder')}
                        value={utmTerm}
                        onChange={(e) => setUtmTerm(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="utmContent">{t('utmContent')}</Label>
                      <Input
                        id="utmContent"
                        placeholder={t('utmContentPlaceholder')}
                        value={utmContent}
                        onChange={(e) => setUtmContent(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Label htmlFor="expiration">{t('expirationDate')}</Label>
                    <Input
                      id="expiration"
                      type="date"
                      value={expirationDate}
                      onChange={(e) => setExpirationDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-4 pt-2 border-t border-dark-100 mt-4">
                    <p className="text-sm font-medium text-dark-50">{t('targeting')}</p>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="geoEnabled"
                          checked={geoEnabled}
                          onChange={(e) => setGeoEnabled(e.target.checked)}
                          className="h-4 w-4 rounded border-dark-100 bg-dark-500 text-primary-500 focus:ring-primary-500"
                        />
                        <Label htmlFor="geoEnabled" className="cursor-pointer flex items-center gap-2">
                          <Globe className="h-4 w-4 text-dark-100" />
                          {t('geoTargeting')}
                        </Label>
                      </div>
                      {geoEnabled && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pl-7">
                          {["US","UK","CA","DE","FR","ES","JP","AU","BR","IN","NL","IT","MX","SE","CH"].map((c) => (
                            <label key={c} className="flex items-center gap-2 text-sm text-dark-100 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={geoCountries.includes(c)}
                                onChange={(e) =>
                                  setGeoCountries((prev) =>
                                    e.target.checked ? [...prev, c] : prev.filter((x) => x !== c)
                                  )
                                }
                                className="h-3 w-3 rounded border-dark-100 bg-dark-500 text-primary-500"
                              />
                              {c}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="deviceEnabled"
                          checked={deviceEnabled}
                          onChange={(e) => setDeviceEnabled(e.target.checked)}
                          className="h-4 w-4 rounded border-dark-100 bg-dark-500 text-primary-500 focus:ring-primary-500"
                        />
                        <Label htmlFor="deviceEnabled" className="cursor-pointer flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-dark-100" />
                          {t('deviceTargeting')}
                        </Label>
                      </div>
                      {deviceEnabled && (
                        <div className="flex gap-4 pl-7">
                          {["desktop","mobile","tablet"].map((d) => (
                            <label key={d} className="flex items-center gap-2 text-sm text-dark-100 cursor-pointer capitalize">
                              <input
                                type="checkbox"
                                checked={devices.includes(d)}
                                onChange={(e) =>
                                  setDevices((prev) =>
                                    e.target.checked ? [...prev, d] : prev.filter((x) => x !== d)
                                  )
                                }
                                className="h-3 w-3 rounded border-dark-100 bg-dark-500 text-primary-500"
                              />
                              {d}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="langEnabled"
                          checked={langEnabled}
                          onChange={(e) => setLangEnabled(e.target.checked)}
                          className="h-4 w-4 rounded border-dark-100 bg-dark-500 text-primary-500 focus:ring-primary-500"
                        />
                        <Label htmlFor="langEnabled" className="cursor-pointer flex items-center gap-2">
                          <Languages className="h-4 w-4 text-dark-100" />
                          {t('languageTargeting')}
                        </Label>
                      </div>
                      {langEnabled && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pl-7">
                          {["en","fr","de","es","ja","pt","nl","it","zh","ko","ar","ru","pl","sv","da"].map((l) => (
                            <label key={l} className="flex items-center gap-2 text-sm text-dark-100 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={languages.includes(l)}
                                onChange={(e) =>
                                  setLanguages((prev) =>
                                    e.target.checked ? [...prev, l] : prev.filter((x) => x !== l)
                                  )
                                }
                                className="h-3 w-3 rounded border-dark-100 bg-dark-500 text-primary-500"
                              />
                              {l}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 pt-2">
                      <Label htmlFor="scheduledAt" className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-dark-100" />
                        {t('scheduleActivation')}
                      </Label>
                      <Input
                        id="scheduledAt"
                        type="datetime-local"
                        value={scheduledAt}
                        onChange={(e) => setScheduledAt(e.target.value)}
                      />
                      <p className="text-xs text-dark-100">{t('scheduleActivationHint')}</p>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleSubmit}
              disabled={isCreating || !destinationUrl}
            >
              {isCreating ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {t('creating')}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Link2 className="h-5 w-5" />
                  {t('shorten')}
                </span>
              )}
            </Button>

            {error && (
              <div className="text-sm text-center space-y-2">
                <p className="text-red-400">{error}</p>
                {error.includes("Upgrade") && (
                  <Link href="/pricing" className="text-accent hover:underline font-medium">
                    {t('upgradeLink')}
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {shortUrl && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('yourShortLink')}</CardTitle>
                  <CardDescription>{t('yourShortLinkDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border border-primary-500/30 bg-primary-500/5 p-4">
                    <p className="text-sm font-medium text-dark-50 break-all">{shortUrl}</p>
                  </div>
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        {t('copied')}
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        {t('copyUrl')}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('tips')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-dark-100">
                <p>{t('tip1')}</p>
                <p>{t('tip2')}</p>
                <p>{t('tip3')}</p>
                <p>{t('tip4')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "bulk" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('bulkTitle')}</CardTitle>
                <CardDescription>
                  {t('bulkDesc')}
                  <code className="ml-1 text-xs bg-dark-300 px-1 rounded">url|slug</code>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBulkSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bulkUrls">{t('bulkUrls')}</Label>
                    <Textarea
                      id="bulkUrls"
                      rows={12}
                      placeholder={t('bulkPlaceholder')}
                      value={bulkUrls}
                      onChange={(e) => setBulkUrls(e.target.value)}
                      className="font-mono text-sm"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={isCreating || !bulkUrls.trim()}
                  >
                    {isCreating ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        {t('bulkCreating')}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <FileUp className="h-5 w-5" />
                        {t('createAll')}
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}
          </div>

          <div className="space-y-6">
            {bulkResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('results')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
                    <p className="text-sm font-medium text-green-400">
                      {t('resultsCreated', { count: bulkResults.created })}
                    </p>
                  </div>
                  {bulkResults.errors.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-red-400">
                        {t('resultsFailed', { count: bulkResults.errors.length })}
                      </p>
                      {bulkResults.errors.map((err) => (
                        <div
                          key={err.index}
                          className="rounded-lg border border-red-500/30 bg-red-500/5 p-3"
                        >
                          <p className="text-xs text-dark-100 break-all">{err.url}</p>
                          <p className="text-xs text-red-400">{err.error}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('tips')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-dark-100">
                <p>{t('bulkTip1')}</p>
                <p>{t('bulkTip2')}</p>
                <p>{t('bulkTip3')}</p>
                <p>{t('bulkTip4')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {showUtmBuilder && (
        <UtmBuilder
          baseUrl={destinationUrl}
          onApply={handleUtmApply}
          onClose={() => setShowUtmBuilder(false)}
        />
      )}
    </div>
  )
}