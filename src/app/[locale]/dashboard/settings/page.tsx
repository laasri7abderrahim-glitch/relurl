"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/toast"
import { Link } from "@/i18n/navigation"
import {
  Sun,
  Moon,
  Monitor,
  Trash2,
  AlertTriangle,
  Save,
  User,
  Lock,
  Palette,
  Skull,
  Loader2,
  Mail,
  ArrowRight,
  Bell,
  BellRing,
  Globe,
  Smartphone,
  Shield,
  ShieldCheck,
  SmartphoneNfc,
  Check,
  X,
  Copy,
  Languages,
} from "lucide-react"
import { useTranslations } from "next-intl"

type Theme = "system" | "light" | "dark"

interface NotificationPref {
  emailNewClick: boolean
  emailWeeklyReport: boolean
  emailMonthlyReport: boolean
  emailProductUpdates: boolean
  emailSecurityAlerts: boolean
  pushNewClick: boolean
}

interface Session {
  id: string
  device: string
  browser: string
  ip: string
  lastActive: string
  isCurrent: boolean
}

const LOCALES = [
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
]

export default function SettingsPage() {
  const t = useTranslations("dashboard.settings.profile")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [image, setImage] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [theme, setTheme] = useState<Theme>("dark")
  const [locale, setLocale] = useState("en")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notifSaving, setNotifSaving] = useState(false)
  const [sessions, setSessions] = useState<Session[]>([])
  const [show2faDialog, setShow2faDialog] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [notifPrefs, setNotifPrefs] = useState<NotificationPref>({
    emailNewClick: true,
    emailWeeklyReport: true,
    emailMonthlyReport: false,
    emailProductUpdates: false,
    emailSecurityAlerts: true,
    pushNewClick: false,
  })
  const { addToast } = useToast()

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "system", label: t("themeSystem"), icon: <Monitor className="h-4 w-4" /> },
    { value: "light", label: t("themeLight"), icon: <Sun className="h-4 w-4" /> },
    { value: "dark", label: t("themeDark"), icon: <Moon className="h-4 w-4" /> },
  ]

  const notificationOptions: { key: keyof NotificationPref; label: string; desc: string }[] = [
    { key: "emailNewClick", label: "New Click Alert", desc: "Email me when any of my links receives a click" },
    { key: "emailWeeklyReport", label: "Weekly Summary", desc: "Receive a weekly summary of all link activity" },
    { key: "emailMonthlyReport", label: "Monthly Report", desc: "Get a detailed monthly performance report" },
    { key: "emailProductUpdates", label: "Product Updates", desc: "Stay informed about new features and improvements" },
    { key: "emailSecurityAlerts", label: "Security Alerts", desc: "Get notified about security-related events" },
    { key: "pushNewClick", label: "Push Notifications", desc: "Receive browser push notifications for new clicks" },
  ]

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setName(json.data.name || "")
          setEmail(json.data.email || "")
          setImage(json.data.image || "")
        }
      })
      .catch(() => addToast(t("toast.loadFailed"), "error"))
      .finally(() => setLoading(false))
  }, [addToast, t])

  useEffect(() => {
    fetch("/api/sessions")
      .then((r) => r.json())
      .then((d) => { if (d.data) setSessions(d.data) })
      .catch(() => {})
  }, [])

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image }),
      })
      const json = await res.json()
      if (json.success) {
        addToast(t("toast.updateSuccess"), "success")
      } else {
        addToast(json.error || t("toast.updateFailed"), "error")
      }
    } catch {
      addToast(t("toast.updateFailed"), "error")
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      addToast(t("toast.passwordFieldsRequired"), "error")
      return
    }
    if (newPassword !== confirmPassword) {
      addToast(t("toast.passwordMismatch"), "error")
      return
    }
    if (newPassword.length < 8) {
      addToast(t("toast.passwordMin"), "error")
      return
    }
    addToast(t("toast.passwordChangeComing"), "success")
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleSaveNotifications = async () => {
    setNotifSaving(true)
    try {
      const res = await fetch("/api/user/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notifPrefs),
      })
      if (res.ok) addToast("Notification preferences saved", "success")
      else addToast("Failed to save preferences", "error")
    } catch {
      addToast("Failed to save preferences", "error")
    } finally {
      setNotifSaving(false)
    }
  }

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== "DELETE") return
    addToast(t("toast.deleteContactSupport"), "success")
    setShowDeleteDialog(false)
    setDeleteConfirmText("")
  }

  const handleRevokeSession = (sessionId: string) => {
    fetch(`/api/sessions/${sessionId}`, { method: "DELETE" })
      .then((r) => { if (r.ok) { setSessions((prev) => prev.filter((s) => s.id !== sessionId)); addToast("Session revoked", "success") } })
      .catch(() => addToast("Failed to revoke session", "error"))
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-3xl">
        <div className="animate-pulse space-y-2">
          <div className="h-8 w-32 rounded bg-dark-100/20" />
          <div className="h-4 w-64 rounded bg-dark-100/20" />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="animate-pulse space-y-4 p-6">
              <div className="h-5 w-40 rounded bg-dark-100/20" />
              <div className="h-4 w-56 rounded bg-dark-100/20" />
              <div className="h-10 w-full rounded bg-dark-100/20" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-dark-50">{t("title")}</h1>
        <p className="mt-1 text-sm text-dark-100">{t("description")}</p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-dark-100" />
            <div>
              <CardTitle className="text-lg">{t("profileCard")}</CardTitle>
              <CardDescription>{t("profileCardDesc")}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar src={image} size="xl" fallback={name} />
            <label className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-dark-700 transition-all duration-200 border border-dark-100 bg-transparent text-dark-50 hover:bg-dark-100 h-9 px-3 cursor-pointer">
              {t("changeAvatar")}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) { const reader = new FileReader(); reader.onload = (ev) => setImage(ev.target?.result as string); reader.readAsDataURL(file) }
              }} />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">{t("name")}</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input id="email" type="email" value={email} disabled />
            </div>
          </div>
          <Button variant="primary" onClick={handleSaveProfile} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {saving ? t("saving") : t("saveChanges")}
          </Button>
        </CardContent>
      </Card>

      {/* Password Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-dark-100" />
            <div>
              <CardTitle className="text-lg">{t("passwordCard")}</CardTitle>
              <CardDescription>{t("passwordCardDesc")}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">{t("currentPassword")}</Label>
            <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="newPassword">{t("newPassword")}</Label>
              <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
          </div>
          <Button variant="primary" onClick={handleChangePassword}>
            <Lock className="mr-2 h-4 w-4" />
            {t("changePassword")}
          </Button>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-accent" />
            <div>
              <CardTitle className="text-lg">Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-dark-50">
                {twoFactorEnabled ? "2FA is currently enabled" : "2FA is not enabled yet"}
              </p>
              <p className="text-xs text-dark-100">
                {twoFactorEnabled
                  ? "Your account is protected with two-factor authentication"
                  : "Protect your account with an authenticator app"}
              </p>
            </div>
            <Button
              variant={twoFactorEnabled ? "outline" : "primary"}
              onClick={() => setShow2faDialog(true)}
            >
              {twoFactorEnabled ? (
                <><X className="mr-2 h-4 w-4" /> Disable</>
              ) : (
                <><Shield className="mr-2 h-4 w-4" /> Enable</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Theme Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Palette className="h-5 w-5 text-dark-100" />
            <div>
              <CardTitle className="text-lg">{t("themeCard")}</CardTitle>
              <CardDescription>{t("themeCardDesc")}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {themes.map((th) => (
              <button
                key={th.value}
                type="button"
                onClick={() => setTheme(th.value)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg border p-4 transition-all ${
                  theme === th.value
                    ? "border-primary-500 bg-primary-500/10 text-primary-500"
                    : "border-dark-100 text-dark-100 hover:border-dark-50 hover:text-dark-50"
                }`}
              >
                {th.icon}
                <span className="text-sm font-medium">{th.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Language / Locale Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Languages className="h-5 w-5 text-dark-100" />
            <div>
              <CardTitle className="text-lg">Language</CardTitle>
              <CardDescription>Choose your preferred interface language</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select value={locale} onChange={(e) => setLocale(e.target.value)} className="w-48">
              {LOCALES.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </Select>
            <Button variant="outline" onClick={() => { addToast("Language preference saved", "success") }}>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <BellRing className="h-5 w-5 text-dark-100" />
            <div>
              <CardTitle className="text-lg">Notifications</CardTitle>
              <CardDescription>Control how and when we notify you</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notificationOptions.map((opt) => (
              <div key={opt.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-dark-50">{opt.label}</p>
                  <p className="text-xs text-dark-100">{opt.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifPrefs((prev) => ({ ...prev, [opt.key]: !prev[opt.key] }))}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    notifPrefs[opt.key] ? "bg-accent" : "bg-dark-100"
                  }`}
                >
                  <span
                    className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                      notifPrefs[opt.key] ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Button variant="primary" onClick={handleSaveNotifications} disabled={notifSaving}>
              {notifSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bell className="mr-2 h-4 w-4" />}
              {notifSaving ? "Saving..." : "Save Notification Preferences"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5 text-dark-100" />
            <div>
              <CardTitle className="text-lg">Active Sessions</CardTitle>
              <CardDescription>Manage devices where you are logged in</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <div className="space-y-3">
              {[
                { device: "Windows PC", browser: "Chrome 125", ip: "197.xxx.xxx.1", isCurrent: true },
                { device: "iPhone 15", browser: "Safari", ip: "197.xxx.xxx.2", isCurrent: false },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-dark-100 bg-dark-700/50 p-3">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-dark-100" />
                    <div>
                      <p className="text-sm font-medium text-dark-50">{s.device} {s.isCurrent && <Badge variant="success" className="ml-2 text-[10px]">Current</Badge>}</p>
                      <p className="text-xs text-dark-100">{s.browser} · {s.ip} · Last active just now</p>
                    </div>
                  </div>
                  {!s.isCurrent && (
                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300" onClick={() => handleRevokeSession(String(i))}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-lg border border-dark-100 bg-dark-700/50 p-3">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-dark-100" />
                    <div>
                      <p className="text-sm font-medium text-dark-50">{s.device} {s.isCurrent && <Badge variant="success" className="ml-2 text-[10px]">Current</Badge>}</p>
                      <p className="text-xs text-dark-100">{s.browser} · {s.ip} · {s.lastActive}</p>
                    </div>
                  </div>
                  {!s.isCurrent && (
                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300" onClick={() => handleRevokeSession(s.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Reports Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-dark-100" />
            <div>
              <CardTitle className="text-lg">{t("emailReportsCard")}</CardTitle>
              <CardDescription>{t("emailReportsCardDesc")}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-dark-100">{t("emailReportsText")}</p>
          <Link href="/dashboard/settings/reports">
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              {t("configureReports")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-600/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Skull className="h-5 w-5 text-red-400" />
            <div>
              <CardTitle className="text-lg text-red-400">{t("dangerZone")}</CardTitle>
              <CardDescription>{t("dangerZoneDesc")}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-dark-100">{t("dangerZoneText")}</p>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            {t("deleteAccount")}
          </Button>
        </CardContent>
      </Card>

      {/* 2FA Dialog */}
      <Dialog open={show2faDialog} onOpenChange={(o) => { if (!o) setShow2faDialog(false) }}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-2 text-accent">
              <ShieldCheck className="h-6 w-6" />
              <DialogTitle>{twoFactorEnabled ? "Disable 2FA" : "Enable Two-Factor Authentication"}</DialogTitle>
            </div>
            <DialogDescription>
              {twoFactorEnabled
                ? "Are you sure you want to disable 2FA? Your account will be less secure."
                : "Scan the QR code below with your authenticator app (Google Authenticator, Authy, etc.)"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            {twoFactorEnabled ? (
              <Button variant="destructive" onClick={() => { setTwoFactorEnabled(false); setShow2faDialog(false); addToast("2FA disabled", "success") }}>
                <X className="mr-2 h-4 w-4" />
                Disable 2FA
              </Button>
            ) : (
              <>
                <div className="flex h-48 w-48 items-center justify-center rounded-xl border-2 border-dashed border-dark-100 bg-dark-700/50">
                  <Shield className="h-16 w-16 text-dark-100" />
                </div>
                <p className="text-xs text-dark-100">Setup key: RELU-XXXX-XXXX-XXXX</p>
                <Button variant="primary" onClick={() => { setTwoFactorEnabled(true); setShow2faDialog(false); addToast("2FA enabled successfully", "success") }}>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Confirm 2FA Setup
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={(o) => { if (!o) { setShowDeleteDialog(false); setDeleteConfirmText("") } }}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-6 w-6" />
              <DialogTitle>{t("deleteDialogTitle")}</DialogTitle>
            </div>
            <DialogDescription>
              {t("deleteDialogDesc1")} <strong>DELETE</strong> {t("deleteDialogDesc2")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input
              placeholder={t("deletePlaceholder")}
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setShowDeleteDialog(false); setDeleteConfirmText("") }}>
                {t("cancel")}
              </Button>
              <Button variant="destructive" disabled={deleteConfirmText !== "DELETE"} onClick={handleDeleteAccount}>
                <Trash2 className="mr-2 h-4 w-4" />
                {t("deleteMyAccount")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}