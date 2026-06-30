import { NextResponse } from "next/server"
import { readFileSync } from "fs"
import { GoogleAuth } from "google-auth-library"
import { getAllSlugs } from "@/lib/blog/posts"

let client: any = null

function getKeyData(): Record<string, unknown> {
  const keyEnv = process.env.GOOGLE_INDEXING_KEY
  if (keyEnv) {
    try {
      return JSON.parse(Buffer.from(keyEnv, "base64").toString("utf-8"))
    } catch {
      try {
        return JSON.parse(keyEnv)
      } catch {
        throw new Error("GOOGLE_INDEXING_KEY is not valid base64-encoded JSON or raw JSON")
      }
    }
  }

  const keyPath = process.env.GOOGLE_INDEXING_KEY_PATH
  if (keyPath) {
    return JSON.parse(readFileSync(keyPath, "utf-8"))
  }

  throw new Error("Set GOOGLE_INDEXING_KEY (base64 JSON) or GOOGLE_INDEXING_KEY_PATH (file path)")
}

async function getIndexingClient() {
  if (client) return client
  const keyData = getKeyData()
  const auth = new GoogleAuth({
    credentials: keyData,
    scopes: ["https://www.googleapis.com/auth/indexing"],
  })
  client = await auth.getClient()
  return client
}

async function submitUrl(url: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const c = await getIndexingClient()
    await c.request({
      url: "https://indexing.googleapis.com/v3/urlNotifications:publish",
      method: "POST",
      data: { url, type: "URL_UPDATED" },
    })
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: { url?: string; urls?: string[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const urlsToSubmit = body.urls || (body.url ? [body.url] : [])

  if (urlsToSubmit.length === 0) {
    return NextResponse.json({ error: "Provide 'url' or 'urls' field" }, { status: 400 })
  }

  if (urlsToSubmit.length > 200) {
    return NextResponse.json({ error: "Max 200 URLs per request (Google daily quota)" }, { status: 400 })
  }

  const results = []
  for (const url of urlsToSubmit) {
    const result = await submitUrl(url)
    results.push({ url, ...result })
  }

  const ok = results.filter((r) => r.ok).length
  const fail = results.filter((r) => !r.ok).length

  return NextResponse.json({ submitted: urlsToSubmit.length, ok, fail, results })
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://relurl.com"
  const locales = ["en", "fr"]
  const slugs = getAllSlugs()

  const staticPaths = [
    "", "/features", "/pricing", "/integrations", "/changelog",
    "/blog", "/contact", "/privacy", "/terms", "/cookies", "/gdpr", "/dmca", "/wordpress",
    "/custom-url-shortener", "/branded-link-shortener", "/bulk-url-shortener",
    "/affiliate-link-shortener", "/free-url-shortener", "/qr-code-generator",
    "/dynamic-qr-code-generator", "/free-qr-code-generator",
  ]

  const urls: string[] = []
  for (const locale of locales) {
    for (const path of staticPaths) {
      urls.push(`${baseUrl}/${locale}${path}`)
    }
    for (const slug of slugs) {
      urls.push(`${baseUrl}/${locale}/blog/${slug}`)
    }
  }

  const results = []
  const maxSubmit = Math.min(urls.length, 200)
  for (let i = 0; i < maxSubmit; i++) {
    const result = await submitUrl(urls[i])
    results.push({ url: urls[i], ...result })
  }

  const ok = results.filter((r) => r.ok).length
  const fail = results.filter((r) => !r.ok).length

  return NextResponse.json({
    totalAvailable: urls.length,
    submitted: maxSubmit,
    ok,
    fail,
    note: "Google daily quota is 200 URLs. Run this endpoint daily to index all pages.",
  })
}
