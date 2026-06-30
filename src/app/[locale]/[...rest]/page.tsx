import { redirect, permanentRedirect, notFound } from "next/navigation"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

async function recordClick(linkId: string) {
  try {
    const h = await headers()
    const ip =
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      h.get("x-real-ip") ??
      h.get("cf-connecting-ip") ??
      null
    const userAgent = h.get("user-agent")
    const referer = h.get("referer") ?? h.get("referrer") ?? null

    await prisma.linkClick.create({
      data: {
        linkId,
        ip,
        userAgent,
        referer,
        timestamp: new Date(),
      },
    })

    await prisma.shortLink.update({
      where: { id: linkId },
      data: { lastClickedAt: new Date() },
    })
  } catch {
    // Fail silently
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ rest: string[] }>
}): Promise<Metadata> {
  const { rest } = await params
  const slug = rest[0] === "b" && rest.length > 1 ? rest[1] : rest[0]
  const link = await prisma.shortLink.findUnique({ where: { slug } })

  if (!link || !link.isActive || (link.expiresAt && link.expiresAt < new Date())) {
    return {
      title: "Link Not Found - RELURL",
      robots: { index: false, follow: false },
    }
  }

  return {
    title: link.title ?? "Redirecting... - RELURL",
    robots: { index: false, follow: true },
  }
}

export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ rest: string[] }>
}) {
  const { rest } = await params
  const slug = rest[0] === "b" && rest.length > 1 ? rest[1] : rest[0]

  const link = await prisma.shortLink.findUnique({ where: { slug } })

  if (!link || !link.isActive || (link.expiresAt && link.expiresAt < new Date())) {
    notFound()
  }

  if (link.password) {
    redirect(`./p/${slug}`)
  }

  recordClick(link.id)
  permanentRedirect(link.url)
}
