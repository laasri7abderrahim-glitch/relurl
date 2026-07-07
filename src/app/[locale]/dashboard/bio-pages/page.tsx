"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

interface BioPage {
  id: string
  slug: string
  title: string
  description: string | null
  views: number
  isPublic: boolean
  createdAt: string
  links: { id: string }[]
}

export default function BioPagesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [pages, setPages] = useState<BioPage[]>([])
  const [loading, setLoading] = useState(true)
  const t = useTranslations("dashboard.bioPages")

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login")
    if (status === "authenticated") {
      fetch("/api/bio-pages")
        .then((r) => r.json())
        .then((d) => {
          setPages(d.data || [])
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [status, router])

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-gray-500">{t("description")}</p>
        </div>
        <Link
          href="/dashboard/bio-pages/new"
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
        >
          {t("createPage")}
        </Link>
      </div>

      {pages.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border">
          <p className="text-gray-500 mb-4">{t("empty.title")}</p>
          <Link
            href="/dashboard/bio-pages/new"
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90"
          >
            {t("empty.createFirst")}
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {pages.map((page) => (
            <div key={page.id} className="bg-white rounded-xl border p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{page.title}</h3>
                <p className="text-sm text-gray-500">relurl.com/b/{page.slug}</p>
                <div className="flex gap-4 mt-2 text-xs text-gray-400">
                  <span>{t("linkCount", { count: page.links.length })}</span>
                  <span>{t("viewCount", { count: page.views })}</span>
                  <span>{page.isPublic ? t("public") : t("private")}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/b/${page.slug}`}
                  target="_blank"
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                >
                  {t("actions.view")}
                </Link>
                <Link
                  href={`/dashboard/bio-pages/${page.id}`}
                  className="px-3 py-1 text-sm bg-[#1F6F5F] text-white rounded hover:bg-[#2FA084]"
                >
                  {t("actions.edit")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}