import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
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
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const link = await prisma.shortLink.findUnique({ where: { slug } })

  if (
    !link ||
    !link.isActive ||
    (link.expiresAt && link.expiresAt < new Date())
  ) {
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

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const link = await prisma.shortLink.findUnique({ where: { slug } })

  if (
    !link ||
    !link.isActive ||
    (link.expiresAt && link.expiresAt < new Date())
  ) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-dark-700 p-4">
        <div className="text-center">
          <div className="mb-8">
            <span className="text-4xl font-bold text-primary-500">RELURL</span>
          </div>
          <h1 className="mb-4 text-2xl font-bold text-dark-50">
            Link not found
          </h1>
          <p className="mb-8 text-dark-100">
            The link you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary-500 px-6 text-sm font-medium text-white hover:bg-primary-600"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    )
  }

  recordClick(link.id)
  redirect(link.url)
}
