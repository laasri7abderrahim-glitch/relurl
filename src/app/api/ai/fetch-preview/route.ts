import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { url } = await req.json()
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    let parsedUrl: URL
    try {
      parsedUrl = new URL(url)
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    let response: Response
    try {
      response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; RELURL/1.0; +https://relurl.com)",
          Accept: "text/html",
        },
        redirect: "follow",
      })
    } finally {
      clearTimeout(timeoutId)
    }

    const html = await response.text()

    const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)?.[1]
    const ogDescription = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)?.[1]
    const ogImage = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1]

    const twitterTitle = html.match(/<meta[^>]+name=["']twitter:title["'][^>]+content=["']([^"']+)["']/i)?.[1]
    const twitterDescription = html.match(/<meta[^>]+name=["']twitter:description["'][^>]+content=["']([^"']+)["']/i)?.[1]
    const twitterImage = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)?.[1]

    const htmlTitle = html.match(/<title>([^<]*)<\/title>/i)?.[1]

    let favicon = html.match(/<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+href=["']([^"']+)["']/i)?.[1]
    if (!favicon) {
      favicon = html.match(/<link[^>]+rel=["']apple-touch-icon["'][^>]+href=["']([^"']+)["']/i)?.[1]
    }
    if (favicon && !favicon.startsWith("http")) {
      try {
        favicon = new URL(favicon, parsedUrl.origin).href
      } catch {
        favicon = `${parsedUrl.origin}/favicon.ico`
      }
    } else if (!favicon) {
      favicon = `${parsedUrl.origin}/favicon.ico`
    }

    return NextResponse.json({
      title: ogTitle || twitterTitle || htmlTitle || null,
      description: ogDescription || twitterDescription || null,
      image: ogImage || twitterImage || null,
      favicon,
    })
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json({
        title: null, description: null, image: null, favicon: null,
      })
    }
    return NextResponse.json({
      title: null, description: null, image: null, favicon: null,
    })
  }
}
