"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/toast"
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
} from "lucide-react"
import Link from "next/link"

export default function NewLinkPage() {
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
  const { addToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!destinationUrl) {
      addToast("Destination URL is required", "error")
      return
    }

    setIsCreating(true)
    setError("")
    setShortUrl("")

    const body: Record<string, unknown> = {
      url: destinationUrl,
      domain,
      title: title || undefined,
      tags: tags
        ? tags.split(",").map((t) => t.trim()).filter(Boolean)
        : undefined,
      password: passwordProtect ? password : undefined,
      slug: customAlias || undefined,
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
        addToast("Link created successfully", "success")
      } else if (json.upgradeRequired) {
        setError(json.error)
        addToast(json.error, "error")
      } else {
        setError(json.error || "Failed to create link")
        addToast(json.error || "Failed to create link", "error")
      }
    } catch {
      setError("An unexpected error occurred")
      addToast("An unexpected error occurred", "error")
    } finally {
      setIsCreating(false)
    }
  }

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bulkUrls.trim()) {
      addToast("Enter at least one URL", "error")
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
      addToast("No valid URLs found", "error")
      setIsCreating(false)
      return
    }

    if (urls.length > 50) {
      addToast("Maximum 50 links per request", "error")
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
          `${json.data.created.length} of ${json.data.total} links created`,
          json.data.errors.length > 0 ? "warning" : "success"
        )
        setBulkUrls("")
      } else {
        setError(json.error || "Failed to create links")
        addToast(json.error || "Failed to create links", "error")
      }
    } catch {
      setError("An unexpected error occurred")
      addToast("An unexpected error occurred", "error")
    } finally {
      setIsCreating(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    addToast("Copied to clipboard", "success")
    setTimeout(() => setCopied(false), 2000)
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
          <h1 className="text-2xl font-bold text-dark-50">Create New Link</h1>
          <p className="mt-1 text-sm text-dark-100">Shorten a URL and customize it</p>
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
            Single Link
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
            Bulk Create
          </span>
        </button>
      </div>

      {activeTab === "single" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Link Details</CardTitle>
                <CardDescription>Enter the URL you want to shorten</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination URL *</Label>
                  <Input
                    id="destination"
                    placeholder="https://example.com/very-long-url"
                    value={destinationUrl}
                    onChange={(e) => setDestinationUrl(e.target.value)}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="domain">Domain</Label>
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
                    <Label htmlFor="alias">Custom Alias (optional)</Label>
                    <Input
                      id="alias"
                      placeholder="my-custom-slug"
                      value={customAlias}
                      onChange={(e) => setCustomAlias(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title (optional)</Label>
                  <Input
                    id="title"
                    placeholder="My Campaign Link"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (optional, comma separated)</Label>
                  <Input
                    id="tags"
                    placeholder="marketing, social, campaign"
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
                        <span>Password protect this link</span>
                      </div>
                    </Label>
                  </div>
                  {passwordProtect && (
                    <Input
                      type="password"
                      placeholder="Enter password"
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
                  <CardTitle className="text-lg">Advanced Options</CardTitle>
                  <CardDescription>UTM parameters, expiration, and more</CardDescription>
                </div>
                {showAdvanced ? (
                  <ChevronUp className="h-5 w-5 text-dark-100" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-dark-100" />
                )}
              </button>
              {showAdvanced && (
                <CardContent className="space-y-4 border-t border-dark-100 pt-6">
                  <p className="text-sm font-medium text-dark-50">UTM Parameters</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="utmSource">UTM Source</Label>
                      <Input
                        id="utmSource"
                        placeholder="google"
                        value={utmSource}
                        onChange={(e) => setUtmSource(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="utmMedium">UTM Medium</Label>
                      <Input
                        id="utmMedium"
                        placeholder="cpc"
                        value={utmMedium}
                        onChange={(e) => setUtmMedium(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="utmCampaign">UTM Campaign</Label>
                      <Input
                        id="utmCampaign"
                        placeholder="summer_sale"
                        value={utmCampaign}
                        onChange={(e) => setUtmCampaign(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="utmTerm">UTM Term</Label>
                      <Input
                        id="utmTerm"
                        placeholder="running+shoes"
                        value={utmTerm}
                        onChange={(e) => setUtmTerm(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="utmContent">UTM Content</Label>
                      <Input
                        id="utmContent"
                        placeholder="hero_banner"
                        value={utmContent}
                        onChange={(e) => setUtmContent(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Label htmlFor="expiration">Expiration Date (optional)</Label>
                    <Input
                      id="expiration"
                      type="date"
                      value={expirationDate}
                      onChange={(e) => setExpirationDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-4 pt-2 border-t border-dark-100 mt-4">
                    <p className="text-sm font-medium text-dark-50">Targeting</p>

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
                          Geo Targeting
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
                          Device Targeting
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
                          Language Targeting
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
                        Schedule Activation
                      </Label>
                      <Input
                        id="scheduledAt"
                        type="datetime-local"
                        value={scheduledAt}
                        onChange={(e) => setScheduledAt(e.target.value)}
                      />
                      <p className="text-xs text-dark-100">Link will be activated at this date/time</p>
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
                  Creating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Link2 className="h-5 w-5" />
                  Shorten
                </span>
              )}
            </Button>

            {error && (
              <div className="text-sm text-center space-y-2">
                <p className="text-red-400">{error}</p>
                {error.includes("Upgrade") && (
                  <Link href="/pricing" className="text-[#2FA084] hover:underline font-medium">
                    View Plans & Upgrade →
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {shortUrl && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Short Link</CardTitle>
                  <CardDescription>Share this link anywhere</CardDescription>
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
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy URL
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-dark-100">
                <p>Use custom aliases to make your links memorable.</p>
                <p>Add UTM parameters to track campaign performance in analytics.</p>
                <p>Password-protect links for private content.</p>
                <p>Set an expiration date for time-sensitive campaigns.</p>
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
                <CardTitle>Bulk Create Links</CardTitle>
                <CardDescription>
                  Paste one URL per line (max 50 links). Optional slugs can be added as:
                  <code className="ml-1 text-xs bg-dark-300 px-1 rounded">url|slug</code>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBulkSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bulkUrls">URLs (one per line)</Label>
                    <Textarea
                      id="bulkUrls"
                      rows={12}
                      placeholder={"https://example.com/page1\nhttps://example.com/page2|custom-slug\nhttps://example.com/page3"}
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
                        Creating...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <FileUp className="h-5 w-5" />
                        Create All Links
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
                  <CardTitle className="text-lg">Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
                    <p className="text-sm font-medium text-green-400">
                      {bulkResults.created} links created successfully
                    </p>
                  </div>
                  {bulkResults.errors.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-red-400">
                        {bulkResults.errors.length} failed:
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
                <CardTitle className="text-lg">Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-dark-100">
                <p>Paste one URL per line.</p>
                <p>Add a custom slug by using the format: url|slug</p>
                <p>Maximum 50 links per batch.</p>
                <p>Duplicate slugs within a batch will be skipped.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
