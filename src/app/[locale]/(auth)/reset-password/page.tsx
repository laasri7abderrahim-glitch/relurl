"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function ResetPasswordForm() {
  const t = useTranslations("auth.resetPassword")
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError(t("error.passwordMismatch"))
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError(t("error.passwordMin"))
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      if (!res.ok) {
        const json = await res.json()
        setError(json.error || t("error.generic"))
        setLoading(false)
        return
      }

      setDone(true)
    } catch {
      setError(t("error.genericRetry"))
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <CardContent className="space-y-4 text-center">
        <p className="text-sm text-red-400">{t("invalidToken")}</p>
        <Link href="/forgot-password">
          <Button variant="outline" className="w-full">{t("requestNewLink")}</Button>
        </Link>
      </CardContent>
    )
  }

  if (done) {
    return (
      <CardContent className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-500/10">
          <svg
            className="h-6 w-6 text-primary-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="text-sm text-dark-100">{t("successMessage")}</p>
        <Link href="/login">
          <Button variant="primary" className="w-full">{t("signInButton")}</Button>
        </Link>
      </CardContent>
    )
  }

  return (
    <CardContent className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">{t("newPasswordLabel")}</Label>
          <Input
            id="password"
            type="password"
            placeholder={t("passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t("confirmPasswordLabel")}</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder={t("passwordPlaceholder")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>
        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? t("resettingButton") : t("resetButton")}
        </Button>
      </form>
      <p className="text-center text-sm text-dark-100">
        <Link href="/login" className="text-primary-500 hover:text-primary-400">
          {t("backToSignIn")}
        </Link>
      </p>
    </CardContent>
  )
}

export default function ResetPasswordPage() {
  const t = useTranslations("auth.resetPassword")
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
          <p className="text-sm text-dark-100">{t("subtitle")}</p>
        </CardHeader>
        <Suspense fallback={<CardContent><p className="text-sm text-dark-100">{t("loading")}</p></CardContent>}>
          <ResetPasswordForm />
        </Suspense>
      </Card>
    </div>
  )
}