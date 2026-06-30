import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const TIMEOUT_MS = 5000
const BATCH_SIZE = 50

interface CheckResult {
  linkId: string
  status: "healthy" | "unhealthy"
  statusCode: number | null
  redirectCount: number
  error?: string
}

interface BatchStats {
  total: number
  healthy: number
  unhealthy: number
  lastChecked: string
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

async function checkSingleLink(linkId: string, url: string): Promise<CheckResult> {
  const { healthy, statusCode, redirectCount, error } = await checkUrl(url)
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

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 })
    }

    const links = await prisma.shortLink.findMany({
      where: { userId: session.user.id },
      select: { id: true, url: true },
      take: BATCH_SIZE,
    })

    if (links.length === 0) {
      return NextResponse.json({
        data: { results: [], stats: { total: 0, healthy: 0, unhealthy: 0, lastChecked: new Date().toISOString() } },
        error: null,
      })
    }

    const results = await Promise.all(links.map((link) => checkSingleLink(link.id, link.url)))

    const healthy = results.filter((r) => r.status === "healthy").length
    const stats: BatchStats = {
      total: results.length,
      healthy,
      unhealthy: results.length - healthy,
      lastChecked: new Date().toISOString(),
    }

    return NextResponse.json({ data: { results, stats }, error: null })
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
