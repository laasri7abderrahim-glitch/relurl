"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/toast"
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
} from "lucide-react"

type Theme = "system" | "light" | "dark"

const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: "system", label: "System", icon: <Monitor className="h-4 w-4" /> },
  { value: "light", label: "Light", icon: <Sun className="h-4 w-4" /> },
  { value: "dark", label: "Dark", icon: <Moon className="h-4 w-4" /> },
]

export default function SettingsPage() {
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
      .catch(() => addToast("Failed to load profile", "error"))
      .finally(() => setLoading(false))
  }, [addToast])

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
        addToast("Profile updated successfully", "success")
      } else {
        addToast(json.error || "Failed to update profile", "error")
      }
    } catch {
      addToast("Failed to update profile", "error")
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      addToast("Please fill in all password fields", "error")
      return
    }
    if (newPassword !== confirmPassword) {
      addToast("Passwords do not match", "error")
      return
    }
    if (newPassword.length < 8) {
      addToast("Password must be at least 8 characters", "error")
      return
    }
    addToast("Password change coming soon", "success")
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== "DELETE") return
    addToast("Contact support to delete account", "success")
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
        <h1 className="text-2xl font-bold text-dark-50">Settings</h1>
        <p className="mt-1 text-sm text-dark-100">Manage your account settings</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-dark-100" />
            <div>
              <CardTitle className="text-lg">Profile</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar src={image} size="xl" fallback={name} />
            <label className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-dark-700 transition-all duration-200 border border-dark-100 bg-transparent text-dark-50 hover:bg-dark-100 h-9 px-3 cursor-pointer">
              Change Avatar
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
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} disabled />
            </div>
          </div>
          <Button variant="primary" onClick={handleSaveProfile} disabled={saving}>
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-dark-100" />
            <div>
              <CardTitle className="text-lg">Password</CardTitle>
              <CardDescription>Change your account password</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
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
            Change Password
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Palette className="h-5 w-5 text-dark-100" />
            <div>
              <CardTitle className="text-lg">Theme</CardTitle>
              <CardDescription>Choose your preferred appearance</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {themes.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTheme(t.value)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg border p-4 transition-all ${
                  theme === t.value
                    ? "border-primary-500 bg-primary-500/10 text-primary-500"
                    : "border-dark-100 text-dark-100 hover:border-dark-50 hover:text-dark-50"
                }`}
              >
                {t.icon}
                <span className="text-sm font-medium">{t.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-600/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Skull className="h-5 w-5 text-red-400" />
            <div>
              <CardTitle className="text-lg text-red-400">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions that will permanently delete your data
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-dark-100">
            Once you delete your account, there is no going back. All your links, analytics data,
            and API keys will be permanently removed.
          </p>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Account
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={(o) => { if (!o) { setShowDeleteDialog(false); setDeleteConfirmText("") } }}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-6 w-6" />
              <DialogTitle>Delete Account</DialogTitle>
            </div>
            <DialogDescription>
              This action is permanent and cannot be undone. All your data will be deleted.
              Type <strong>DELETE</strong> to confirm.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input
              placeholder='Type "DELETE" to confirm'
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setShowDeleteDialog(false); setDeleteConfirmText("") }}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={deleteConfirmText !== "DELETE"}
                onClick={handleDeleteAccount}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete My Account
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
