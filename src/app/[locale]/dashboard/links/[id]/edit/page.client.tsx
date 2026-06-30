"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Link } from "@/i18n/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useTranslations } from "next-intl"
import { useToast } from "@/components/ui/toast"
import {
  ArrowLeft, Save, Trash2, Loader2, AlertCircle,
  ChevronDown, ChevronUp, Lock, Globe, Smartphone, Languages,
  CalendarClock,
} from "lucide-react"

interface LinkData {
  id: string
  url: string
  slug: string
  domain: string
  title: string | null
  tags: string | null
  password: string | null
  isActive: boolean
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
  utmTerm: string | null
  utmContent: string | null
  expiresAt: string | null
  geoTargeting: string | null
  deviceTargeting: string | null
  languageTargeting: string | null
  scheduledAt: string | null
}

export default function EditLinkPage() {
  const router = useRouter()
  const params = useParams()
  const linkId = params.id as string
  const { addToast } = useToast()
  const t = useTranslations('dashboard.links.edit')

  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

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
  const [geoEnabled, setGeoEnabled] = useState(false)
  const [geoCountries, setGeoCountries] = useState<string[]>([])
  const [deviceEnabled, setDeviceEnabled] = useState(false)
  const [devices, setDevices] = useState<string[]>([])
  const [langEnabled, setLangEnabled] = useState(false)
  const [languages, setLanguages] = useState<string[]>([])
  const [scheduledAt, setScheduledAt] = useState("")
  const [originalSlug, setOriginalSlug] = useState("")

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const res = await fetch(`/api/links/${linkId}`)
        const json = await res.json()
        if (!res.ok || !json.data) {
          throw new Error(json.error ?? "Failed to load link")
        }
        const link: LinkData = json.data
        setDestinationUrl(link.url)
        setDomain(link.domain)
        setCustomAlias(link.slug)
        setOriginalSlug(link.slug)
        setTitle(link.title ?? "")
        setTags(link.tags ?? "")
        setPasswordProtect(!!link.password)
        setPassword(link.password ?? "")
        setUtmSource(link.utmSource ?? "")
        setUtmMedium(link.utmMedium ?? "")
        setUtmCampaign(link.utmCampaign ?? "")
        setUtmTerm(link.utmTerm ?? "")
        setUtmContent(link.utmContent ?? "")
        if (link.expiresAt) {
          setExpirationDate(new Date(link.expiresAt).toISOString().split("T")[0])
        }
        if (link.scheduledAt) {
          setScheduledAt(new Date(link.scheduledAt).toISOString().slice(0, 16))
        }
        if (link.geoTargeting) {
          try {
            const geo = JSON.parse(link.geoTargeting)
            if (geo.enabled) {
              setGeoEnabled(true)
              setGeoCountries(geo.countries ?? [])
            }
          } catch { /* ignore */ }
        }
        if (link.deviceTargeting) {
          try {
            const dev = JSON.parse(link.deviceTargeting)
            if (dev.enabled) {
              setDeviceEnabled(true)
              setDevices(dev.devices ?? [])
            }
          } catch { /* ignore */ }
        }
        if (link.languageTargeting) {
          try {
            const lang = JSON.parse(link.languageTargeting)
            if (lang.enabled) {
              setLangEnabled(true)
              setLanguages(lang.languages ?? [])
            }
          } catch { /* ignore */ }
        }
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : "Failed to load link")
      } finally {
        setLoading(false)
      }
    }
    fetchLink()
  }, [linkId])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!destinationUrl) {
      addToast(t('toastUrlRequired'), "error")
      return
    }

    setSaving(true)

    const body: Record<string, unknown> = {
      url: destinationUrl,
      domain,
      title: title || null,
      tags: tags
        ? tags.split(",").map((t) => t.trim()).filter(Boolean)
        : undefined,
      password: passwordProtect ? password : null,
      slug: customAlias !== originalSlug ? customAlias : undefined,
      utmSource: utmSource || null,
      utmMedium: utmMedium || null,
      utmCampaign: utmCampaign || null,
      utmTerm: utmTerm || null,
      utmContent: utmContent || null,
      expiresAt: expirationDate ? new Date(expirationDate).toISOString() : null,
      languageTargeting: langEnabled
        ? JSON.stringify({ enabled: true, languages })
        : null,
      scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
    }
    if (geoEnabled) {
      body.geoTargeting = JSON.stringify({ enabled: true, countries: geoCountries })
    } else {
      body.geoTargeting = null
    }
    if (deviceEnabled) {
      body.deviceTargeting = JSON.stringify({ enabled: true, devices })
    } else {
      body.deviceTargeting = null
    }

    try {
      const res = await fetch(`/api/links/${linkId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error ?? "Failed to save link")
      }
      addToast(t('toastSaved'), "success")
    } catch (err) {
      addToast(err instanceof Error ? err.message : t('toastSaveFailed'), "error")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/links/${linkId}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? t('toastDeleteFailed'))
      addToast(t('toastDeleted'), "success")
      router.push("/dashboard/links")
    } catch (err) {
      addToast(t('toastDeleteFailed'), "error")
    } finally {
      setDeleting(false)
      setDeleteOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-dark-300 animate-pulse" />
          <div className="space-y-2">
            <div className="h-6 w-48 rounded bg-dark-300 animate-pulse" />
            <div className="h-4 w-32 rounded bg-dark-300 animate-pulse" />
          </div>
        </div>
        <Card>
          <CardContent className="p-6 space-y-4">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 rounded bg-dark-300 animate-pulse" />
                <div className="h-10 w-full rounded bg-dark-300 animate-pulse" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertCircle className="h-8 w-8 text-red-400 mb-3" />
        <p className="text-dark-50 font-medium mb-1">{t('errorTitle')}</p>
        <p className="text-sm text-dark-100 mb-4">{fetchError}</p>
        <Button variant="outline" onClick={() => { setLoading(true); setFetchError(null); router.refresh() }}>
          {t('retry')}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/links">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-dark-50">{t('title')}</h1>
          <p className="mt-1 text-sm text-dark-100">
            {t('subtitle', { domain, slug: customAlias })}
          </p>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {t('delete')}
        </Button>
      </div>

      <form onSubmit={handleSave}>
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
                  <Input
                    id="destination"
                    placeholder={t('destinationUrlPlaceholder')}
                    value={destinationUrl}
                    onChange={(e) => setDestinationUrl(e.target.value)}
                  />
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
                    <Label htmlFor="alias">{t('customSlug')}</Label>
                    <Input
                      id="alias"
                      placeholder={t('customSlugPlaceholder')}
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
                      placeholder={password ? t('passwordKeepPlaceholder') : t('passwordPlaceholder')}
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
                  <p className="text-sm font-medium text-dark-50">{t('utmParameters')}</p>
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
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={saving || !destinationUrl}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('saving')}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-5 w-5" />
                  {t('saveChanges')}
                </span>
              )}
            </Button>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('tips')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-dark-100">
                <p>{t('tip1')}</p>
                <p>{t('tip2')}</p>
                <p>{t('tip3')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="h-5 w-5" />
              <DialogTitle>{t('deleteDialogTitle')}</DialogTitle>
            </div>
            <DialogDescription>
              {t('deleteDialogDesc', { slug: `${domain}/${customAlias}` })}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              {t('cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              {t('deleteLink')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
