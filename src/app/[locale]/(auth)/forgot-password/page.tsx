"use client"

import { useState } from "react"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  const t = useTranslations("auth.forgotPassword")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const json = await res.json()
        setError(json.error || t("error.generic"))
        setLoading(false)
        return
      }

      setSent(true)
    } catch {
      setError(t("error.genericRetry"))
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">{t("checkEmail")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-500/10">
              <svg
                className="h-6 w-6 text-primary-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <p className="text-sm text-dark-100">
              {t.rich("checkEmailMessage", { email, bold: (chunks) => <span className="font-medium text-dark-50">{chunks}</span> })}
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSent(false)
                setEmail("")
              }}
            >
              {t("sendAnotherButton")}
            </Button>
            <p className="text-sm text-dark-100">
              <Link href="/login" className="text-primary-500 hover:text-primary-400">
                {t("backToSignIn")}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
          <p className="text-sm text-dark-100">{t("subtitle")}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("emailLabel")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? t("sendingButton") : t("sendButton")}
            </Button>
          </form>
          <p className="text-center text-sm text-dark-100">
            <Link href="/login" className="text-primary-500 hover:text-primary-400">
              {t("backToSignIn")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}