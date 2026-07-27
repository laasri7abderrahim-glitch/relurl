"use client"

import { useSearchParams, usePathname } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

function AuthContent() {
  const pathname = usePathname()
  const params = useSearchParams()
  const [fullUrl, setFullUrl] = useState("")

  useEffect(() => {
    setFullUrl(window.location.href)
  }, [])

  const oauthToken = params.get("oauth_token")
  const oauthVerifier = params.get("oauth_verifier")

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-8">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Tumblr Authorization</h1>

        <div className="mb-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-800 break-all">
          <strong>Full URL:</strong> {fullUrl}
        </div>
        <div className="mb-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-600 break-all">
          <strong>Path:</strong> {pathname}<br/>
          <strong>Params:</strong> {Array.from(params.entries()).map(([k,v]) => `${k}=${v}`).join(", ") || "(none)"}
        </div>

        {oauthVerifier ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-green-50 p-4 text-green-800">
              ✅ Authorization successful!
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Your verifier code:</label>
              <input
                readOnly
                value={oauthVerifier}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-center text-lg font-mono text-gray-900"
                onClick={(e) => e.currentTarget.select()}
              />
            </div>
            <p className="text-sm text-gray-500">Copy this code and paste it in the terminal.</p>
          </div>
        ) : oauthToken ? (
          <p className="text-gray-600">Waiting for authorization...</p>
        ) : (
          <div className="rounded-lg bg-yellow-50 p-4 text-yellow-800">
            No authorization data received. This page is used as a callback for Tumblr OAuth.
          </div>
        )}
      </div>
    </div>
  )
}

export default function TumblrAuthPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <AuthContent />
    </Suspense>
  )
}
