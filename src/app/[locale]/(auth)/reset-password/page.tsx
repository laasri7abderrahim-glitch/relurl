"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function ResetPasswordForm() {
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
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
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
        setError(json.error || "Something went wrong")
        setLoading(false)
        return
      }

      setDone(true)
    } catch {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <CardContent className="space-y-4 text-center">
        <p className="text-sm text-red-400">Invalid or missing reset token.</p>
        <Link href="/forgot-password">
          <Button variant="outline" className="w-full">Request a new reset link</Button>
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
        <p className="text-sm text-dark-100">Your password has been reset successfully.</p>
        <Link href="/login">
          <Button variant="primary" className="w-full">Sign in with new password</Button>
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
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>
        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
      <p className="text-center text-sm text-dark-100">
        <Link href="/login" className="text-primary-500 hover:text-primary-400">
          Back to sign in
        </Link>
      </p>
    </CardContent>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Reset your password</CardTitle>
          <p className="text-sm text-dark-100">Enter your new password below</p>
        </CardHeader>
        <Suspense fallback={<CardContent><p className="text-sm text-dark-100">Loading...</p></CardContent>}>
          <ResetPasswordForm />
        </Suspense>
      </Card>
    </div>
  )
}
