"use client"

import { useState, useEffect } from "react"
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

      addToast("Settings saved successfully", "success")
    } catch {
      addToast("Failed to save settings", "error")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="text-2xl font-bold text-dark-50">System Settings</div>
          <p className="mt-1 text-sm text-dark-100">Loading...</p>
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
        <h1 className="text-2xl font-bold text-dark-50">System Settings</h1>
        <p className="mt-1 text-sm text-dark-100">Configure global platform settings</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-dark-300 p-2">
              <Shield className="h-5 w-5 text-primary-500" />
            </div>
            <div>
              <CardTitle className="text-lg">General</CardTitle>
              <CardDescription>Basic platform information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              value={settings.siteName}
              onChange={(e) => setSettings((s) => ({ ...s, siteName: e.target.value }))}
              placeholder="RELURL"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteDescription">Site Description</Label>
            <Input
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) => setSettings((s) => ({ ...s, siteDescription: e.target.value }))}
              placeholder="URL shortening platform"
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
              <CardTitle className="text-lg">Defaults</CardTitle>
              <CardDescription>Default configuration for new users</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="defaultPlan">Default Plan</Label>
            <Select
              id="defaultPlan"
              value={settings.defaultPlan}
              onChange={(e) => setSettings((s) => ({ ...s, defaultPlan: e.target.value }))}
            >
              <option value="FREE">Free</option>
              <option value="PRO">Pro</option>
              <option value="BUSINESS">Business</option>
              <option value="ENTERPRISE">Enterprise</option>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-dark-50">Allow Registration</p>
              <p className="text-xs text-dark-100">Allow new users to sign up</p>
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
              <CardTitle className="text-lg">Maintenance</CardTitle>
              <CardDescription>Control platform availability</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-dark-50">Maintenance Mode</p>
              <p className="text-xs text-dark-100">
                When enabled, only admins can access the platform
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
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  )
}
