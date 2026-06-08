"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F6F5F]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bio Pages</h1>
          <p className="text-gray-500">Create link-in-bio pages for your social media</p>
        </div>
        <Link
          href="/dashboard/bio-pages/new"
          className="px-4 py-2 bg-[#1F6F5F] text-white rounded-lg hover:bg-[#2FA084] transition-colors"
        >
          Create Page
        </Link>
      </div>

      {pages.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border">
          <p className="text-gray-500 mb-4">No bio pages yet</p>
          <Link
            href="/dashboard/bio-pages/new"
            className="px-4 py-2 bg-[#1F6F5F] text-white rounded-lg hover:bg-[#2FA084]"
          >
            Create Your First Page
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
                  <span>{page.links.length} links</span>
                  <span>{page.views} views</span>
                  <span>{page.isPublic ? "Public" : "Private"}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/b/${page.slug}`}
                  target="_blank"
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                >
                  View
                </Link>
                <Link
                  href={`/dashboard/bio-pages/${page.id}`}
                  className="px-3 py-1 text-sm bg-[#1F6F5F] text-white rounded hover:bg-[#2FA084]"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
