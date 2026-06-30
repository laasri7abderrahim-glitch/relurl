import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const TIMEOUT_MS = 5000

interface CheckResult {
  linkId: string
  status: "healthy" | "unhealthy"
  statusCode: number | null
  redirectCount: number
  error?: string
}

async function checkUrl(url: string): Promise<{ healthy: boolean; statusCode: number | null; redirectCount: number; error?: string }> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    let redirectCount = 0
    let currentUrl = url
    let finalStatus: number | null = null

    for (let i = 0; i < 10; i++) {
      const response = await fetch(currentUrl, {
        method: "HEAD",
        signal: controller.signal,
        redirect: "manual",
      })

      finalStatus = response.status

      if (response.status >= 300 && response.status < 400) {
        redirectCount++
        const location = response.headers.get("location")
        if (!location) break
        currentUrl = new URL(location, currentUrl).toString()
      } else {
        break
      }
    }

    const healthy = finalStatus !== null && finalStatus >= 200 && finalStatus < 400
    return { healthy, statusCode: finalStatus, redirectCount }
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error"
    return { healthy: false, statusCode: null, redirectCount: 0, error }
  } finally {
    clearTimeout(timer)
  }
}

async function checkSingleLink(linkId: string): Promise<CheckResult> {
  const link = await prisma.shortLink.findUnique({ where: { id: linkId } })
  if (!link) {
    return { linkId, status: "unhealthy", statusCode: null, redirectCount: 0, error: "Link not found" }
  }

  const { healthy, statusCode, redirectCount, error } = await checkUrl(link.url)

  const healthStatus = healthy ? "healthy" : "unhealthy"

  await prisma.shortLink.update({
    where: { id: linkId },
    data: {
      healthStatus,
      healthStatusCode: statusCode,
      healthCheckedAt: new Date(),
    },
  })

  return { linkId, status: healthStatus, statusCode, redirectCount, error }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const ids: string[] = body.ids ?? (body.linkId ? [body.linkId] : [])

    if (ids.length === 0) {
      return NextResponse.json({ data: null, error: "No link IDs provided" }, { status: 400 })
    }

    const results = await Promise.all(ids.map((id: string) => checkSingleLink(id)))

    return NextResponse.json({ data: { results }, error: null })
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
