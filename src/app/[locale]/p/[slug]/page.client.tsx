"use client"

import { useState, type FormEvent } from "react"
import { useParams } from "next/navigation"
import { Lock } from "lucide-react"

export default function PasswordPage() {
  const { slug } = useParams<{ slug: string }>()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!password.trim()) return

    setLoading(true)
    setError("")

    try {
      const res = await fetch(`/api/verify-password/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (data.success && data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || "Invalid password")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-dark-700 p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="mb-8 text-center">
          <span className="text-3xl font-bold text-primary-500">RELURL</span>
        </div>

        <div className="rounded-xl border border-dark-100 bg-dark-500 p-8 shadow-lg">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-500/10">
              <Lock className="h-6 w-6 text-primary-500" />
            </div>
            <h1 className="text-xl font-semibold text-dark-50">
              This link is password protected
            </h1>
            <p className="mt-2 text-sm text-dark-100">
              Enter the password to access this link
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (error) setError("")
                }}
                placeholder="Enter password"
                autoFocus
                className="flex h-10 w-full rounded-lg border bg-dark-700 px-3 py-2 text-sm text-dark-50 placeholder:text-dark-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-700 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 animate-fade-in">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password.trim()}
              className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-700 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Unlock"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
