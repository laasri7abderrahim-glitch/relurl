"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar } from "@/components/ui/avatar"
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
} from "lucide-react"
import { useTranslations } from "next-intl"

type Theme = "system" | "light" | "dark"

export default function SettingsPage() {
  const t = useTranslations("dashboard.settings.profile")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [image, setImage] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [theme, setTheme] = useState<Theme>("dark")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { addToast } = useToast()

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "system", label: t("themeSystem"), icon: <Monitor className="h-4 w-4" /> },
    { value: "light", label: t("themeLight"), icon: <Sun className="h-4 w-4" /> },
    { value: "dark", label: t("themeDark"), icon: <Moon className="h-4 w-4" /> },
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

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== "DELETE") return
    addToast(t("toast.deleteContactSupport"), "success")
    setShowDeleteDialog(false)
    setDeleteConfirmText("")
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-3xl">
        <div className="animate-pulse space-y-2">
          <div className="h-8 w-32 rounded bg-dark-100/20" />
          <div className="h-4 w-64 rounded bg-dark-100/20" />
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="animate-pulse space-y-4 p-6">
              <div className="h-5 w-40 rounded bg-dark-100/20" />
              <div className="h-4 w-56 rounded bg-dark-100/20" />
              <div className="h-10 w-full rounded bg-dark-100/20" />
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
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => setImage(ev.target?.result as string);
                  reader.readAsDataURL(file);
                }
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
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {saving ? t("saving") : t("saveChanges")}
          </Button>
        </CardContent>
      </Card>

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
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="newPassword">{t("newPassword")}</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <Button variant="primary" onClick={handleChangePassword}>
            <Lock className="mr-2 h-4 w-4" />
            {t("changePassword")}
          </Button>
        </CardContent>
      </Card>

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
          <p className="mb-4 text-sm text-dark-100">
            {t("emailReportsText")}
          </p>
          <Link href="/dashboard/settings/reports">
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              {t("configureReports")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="border-red-600/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Skull className="h-5 w-5 text-red-400" />
            <div>
              <CardTitle className="text-lg text-red-400">{t("dangerZone")}</CardTitle>
              <CardDescription>
                {t("dangerZoneDesc")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-dark-100">
            {t("dangerZoneText")}
          </p>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t("deleteAccount")}
          </Button>
        </CardContent>
      </Card>

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
              <Button
                variant="destructive"
                disabled={deleteConfirmText !== "DELETE"}
                onClick={handleDeleteAccount}
              >
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