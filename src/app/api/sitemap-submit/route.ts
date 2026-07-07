import { NextResponse } from "next/server"
import { readFileSync } from "fs"
import { GoogleAuth } from "google-auth-library"

let client: any = null

function getKeyData(): Record<string, unknown> {
  const keyEnv = process.env.GOOGLE_INDEXING_KEY
  if (keyEnv) {
    try {
      return JSON.parse(Buffer.from(keyEnv, "base64").toString("utf-8"))
    } catch {
      try { return JSON.parse(keyEnv) } catch { throw new Error("GOOGLE_INDEXING_KEY invalid") }
    }
  }
  const keyPath = process.env.GOOGLE_INDEXING_KEY_PATH
  if (keyPath) return JSON.parse(readFileSync(keyPath, "utf-8"))
  throw new Error("Set GOOGLE_INDEXING_KEY or GOOGLE_INDEXING_KEY_PATH")
}

async function getAuthClient() {
  if (client) return client
  const keyData = getKeyData()
  const auth = new GoogleAuth({
    credentials: keyData,
    scopes: ["https://www.googleapis.com/auth/webmasters"],
  })
  client = await auth.getClient()
  return client
}

function isAuthorized(req: Request): boolean {
  if (req.headers.get("x-vercel-cron") === "1") return true
  const authHeader = req.headers.get("authorization")
  if (authHeader === `Bearer ${process.env.CRON_SECRET}`) return true
  return false
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const siteUrl = "https://relurl.com/"
  const sitemapUrl = "https://relurl.com/sitemap.xml"

  try {
    const c = await getAuthClient()
    const encodedSite = encodeURIComponent(siteUrl)
    const encodedSitemap = encodeURIComponent(sitemapUrl)

    await c.request({
      url: `https://searchconsole.googleapis.com/v1/sites/${encodedSite}/sitemaps/${encodedSitemap}`,
      method: "PUT",
    })

    return NextResponse.json({ ok: true, siteUrl, sitemapUrl, message: "Sitemap submitted to Google Search Console" })
  } catch (err: any) {
    const status = err.response?.status || 500
    const body = err.response?.data || err.message
    return NextResponse.json({ ok: false, error: body }, { status })
  }
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const siteUrl = "https://relurl.com/"
  const sitemapUrl = "https://relurl.com/sitemap.xml"

  try {
    const c = await getAuthClient()
    const encodedSite = encodeURIComponent(siteUrl)
    const encodedSitemap = encodeURIComponent(sitemapUrl)

    await c.request({
      url: `https://searchconsole.googleapis.com/v1/sites/${encodedSite}/sitemaps/${encodedSitemap}`,
      method: "PUT",
    })

    return NextResponse.json({ ok: true, siteUrl, sitemapUrl, message: "Sitemap submitted to Google Search Console" })
  } catch (err: any) {
    const status = err.response?.status || 500
    const body = err.response?.data || err.message
    return NextResponse.json({ ok: false, error: body, details: JSON.stringify(err.response?.data || {}) }, { status })
  }
}
