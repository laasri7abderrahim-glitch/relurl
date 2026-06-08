import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const linkId = searchParams.get("linkId")
    if (!linkId) {
      return NextResponse.json({ error: "linkId required" }, { status: 400 })
    }

    const routes = await prisma.smartRoute.findMany({
      where: { link: { id: linkId, userId: session.user.id } },
      orderBy: [{ routeGroup: "asc" }, { priority: "desc" }],
      select: {
        id: true,
        name: true,
        destination: true,
        hitCount: true,
        lastHitAt: true,
        isActive: true,
        routeGroup: true,
        priority: true,
      },
    })

    const totalHits = routes.reduce((sum, r) => sum + r.hitCount, 0)
    const topRoute = routes.reduce(
      (best, r) => (r.hitCount > (best?.hitCount ?? 0) ? r : best),
      routes[0] ?? null
    )

    return NextResponse.json({
      routes,
      summary: {
        totalRoutes: routes.length,
        activeRoutes: routes.filter((r) => r.isActive).length,
        totalHits,
        topRoute: topRoute ? { id: topRoute.id, name: topRoute.name, hits: topRoute.hitCount } : null,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
