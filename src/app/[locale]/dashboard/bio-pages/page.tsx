"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Edit3, Eye, Globe, Plus, Loader2 } from "lucide-react"

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
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-50">{t("title")}</h1>
          <p className="text-sm text-dark-100">{t("description")}</p>
        </div>
        <Link href="/dashboard/bio-pages/new">
          <Button size="sm" className="bg-accent hover:bg-accent/90">
            <Plus className="mr-1 h-4 w-4" />
            {t("createPage")}
          </Button>
        </Link>
      </div>

      {pages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Globe className="h-10 w-10 text-dark-100 mb-4" />
            <p className="text-dark-100 mb-4">{t("empty.title")}</p>
            <Link href="/dashboard/bio-pages/new">
              <Button variant="primary">{t("empty.createFirst")}</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pages.map((page) => (
            <Card key={page.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-dark-50">{page.title}</h3>
                  <p className="text-sm text-accent">relurl.com/b/{page.slug}</p>
                  <div className="flex gap-4 mt-2 text-xs text-dark-100">
                    <span>{t("linkCount", { count: page.links.length })}</span>
                    <span>{t("viewCount", { count: page.views })}</span>
                    <Badge variant={page.isPublic ? "success" : "secondary"}>
                      {page.isPublic ? t("public") : t("private")}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/b/${page.slug}`} target="_blank">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-1 h-3 w-3" />
                      {t("actions.view")}
                    </Button>
                  </Link>
                  <Link href={`/dashboard/bio-pages/${page.id}`}>
                    <Button variant="primary" size="sm">
                      <Edit3 className="mr-1 h-3 w-3" />
                      {t("actions.edit")}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}