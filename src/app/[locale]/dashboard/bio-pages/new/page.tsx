"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

export default function NewBioPagePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const t = useTranslations("dashboard.bioPages.new")

  const [slug, setSlug] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [avatar, setAvatar] = useState("")
  const [links, setLinks] = useState<{ title: string; url: string; icon: string; color: string }[]>([
    { title: "", url: "", icon: "", color: "bg-white text-[#1F6F5F]" },
  ])

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login")
  }, [status, router])

  const addLink = () => {
    setLinks([...links, { title: "", url: "", icon: "", color: "bg-white text-[#1F6F5F]" }])
  }

  const removeLink = (i: number) => {
    setLinks(links.filter((_, idx) => idx !== i))
  }

  const updateLink = (i: number, field: string, value: string) => {
    const updated = [...links]
    ;(updated[i] as any)[field] = value
    setLinks(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const res = await fetch("/api/bio-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          title,
          description: description || undefined,
          avatar: avatar || undefined,
          links: links.filter((l) => l.title && l.url),
        }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        router.push("/dashboard/bio-pages")
      }
    } catch {
      setError(t("error"))
    } finally {
      setSaving(false)
    }
  }

  if (status === "loading") return null

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl border p-6">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">{t("form.slug")}</label>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">relurl.com/b/</span>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F6F5F] focus:border-transparent"
              placeholder={t("form.slugPlaceholder")}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t("form.title")}</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F6F5F] focus:border-transparent"
            placeholder={t("form.titlePlaceholder")}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t("form.description")}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F6F5F] focus:border-transparent"
            placeholder={t("form.descriptionPlaceholder")}
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t("form.avatarUrl")}</label>
          <input
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F6F5F] focus:border-transparent"
            placeholder={t("form.avatarUrlPlaceholder")}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium">{t("form.links")}</label>
            <button
              type="button"
              onClick={addLink}
              className="text-sm text-[#1F6F5F] hover:underline"
            >
              {t("form.addLink")}
            </button>
          </div>
          <div className="space-y-3">
            {links.map((link, i) => (
              <div key={i} className="flex gap-2 items-start">
                <input
                  value={link.icon}
                  onChange={(e) => updateLink(i, "icon", e.target.value)}
                  className="w-12 px-2 py-2 border rounded-lg text-center"
                  placeholder={t("form.linkIconPlaceholder")}
                />
                <input
                  value={link.title}
                  onChange={(e) => updateLink(i, "title", e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg"
                  placeholder={t("form.linkTitlePlaceholder")}
                />
                <input
                  value={link.url}
                  onChange={(e) => updateLink(i, "url", e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg"
                  placeholder={t("form.linkUrlPlaceholder")}
                />
                {links.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLink(i)}
                    className="px-2 py-2 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-[#1F6F5F] text-white rounded-lg hover:bg-[#2FA084] disabled:opacity-50"
          >
            {saving ? t("submitting") : t("submit")}
          </button>
          <Link
            href="/dashboard/bio-pages"
            className="px-6 py-2 border rounded-lg hover:bg-gray-50"
          >
            {t("cancel")}
          </Link>
        </div>
      </form>
    </div>
  )
}