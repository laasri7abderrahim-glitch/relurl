"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Save, Shield } from "lucide-react"

interface SystemSettings {
  siteName: string
  siteDescription: string
  allowRegistration: boolean
  defaultPlan: string
  maxLinksPerUser: Record<string, number>
  maintenanceMode: boolean
}

export default function AdminSettingsPage() {
  const t = useTranslations("admin.settings")
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: "RELURL",
    siteDescription: "URL Shortener",
    allowRegistration: true,
    defaultPlan: "FREE",
    maxLinksPerUser: { FREE: 50, PRO: 1000, BUSINESS: 10000, ENTERPRISE: -1 },
    maintenanceMode: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/admin/settings")
        if (res.ok) {
          const data = await res.json()
          if (data.data) setSettings(data.data)
        }
      } catch {
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (!res.ok) throw new Error("Failed to save settings")

      addToast(t("toast.saved"), "success")
    } catch {
      addToast(t("toast.saveFailed"), "error")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="text-2xl font-bold text-dark-50">{t("title")}</div>
          <p className="mt-1 text-sm text-dark-100">{t("loading")}</p>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-dark-50">{t("title")}</h1>
        <p className="mt-1 text-sm text-dark-100">{t("subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-dark-300 p-2">
              <Shield className="h-5 w-5 text-primary-500" />
            </div>
            <div>
              <CardTitle className="text-lg">{t("sectionGeneral")}</CardTitle>
              <CardDescription>{t("sectionGeneralDesc")}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="siteName">{t("siteNameLabel")}</Label>
            <Input
              id="siteName"
              value={settings.siteName}
              onChange={(e) => setSettings((s) => ({ ...s, siteName: e.target.value }))}
              placeholder="RELURL"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteDescription">{t("siteDescriptionLabel")}</Label>
            <Input
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) => setSettings((s) => ({ ...s, siteDescription: e.target.value }))}
              placeholder={t("siteDescriptionPlaceholder")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-dark-300 p-2">
              <Shield className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-lg">{t("sectionDefaults")}</CardTitle>
              <CardDescription>{t("sectionDefaultsDesc")}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="defaultPlan">{t("defaultPlanLabel")}</Label>
            <Select
              id="defaultPlan"
              value={settings.defaultPlan}
              onChange={(e) => setSettings((s) => ({ ...s, defaultPlan: e.target.value }))}
            >
              <option value="FREE">{t("planFree")}</option>
              <option value="PRO">{t("planPro")}</option>
              <option value="BUSINESS">{t("planBusiness")}</option>
              <option value="ENTERPRISE">{t("planEnterprise")}</option>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-dark-50">{t("allowRegistration")}</p>
              <p className="text-xs text-dark-100">{t("allowRegistrationDesc")}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.allowRegistration}
              onClick={() => setSettings((s) => ({ ...s, allowRegistration: !s.allowRegistration }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.allowRegistration ? "bg-primary-500" : "bg-dark-100"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.allowRegistration ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-dark-300 p-2">
              <Shield className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <CardTitle className="text-lg">{t("sectionMaintenance")}</CardTitle>
              <CardDescription>{t("sectionMaintenanceDesc")}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-dark-50">{t("maintenanceModeLabel")}</p>
              <p className="text-xs text-dark-100">
                {t("maintenanceModeDesc")}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.maintenanceMode}
              onClick={() => setSettings((s) => ({ ...s, maintenanceMode: !s.maintenanceMode }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.maintenanceMode ? "bg-primary-500" : "bg-dark-100"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.maintenanceMode ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-end">
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? t("savingButton") : t("saveButton")}
        </Button>
      </div>
    </div>
  )
}