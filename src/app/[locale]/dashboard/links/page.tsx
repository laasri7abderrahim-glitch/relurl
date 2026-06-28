"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { QRCode } from "@/components/ui/qr-code"
import { useToast } from "@/components/ui/toast"
import { formatDate, formatNumber, truncate } from "@/lib/utils"
import {
  Search,
  Plus,
  Copy,
  Edit3,
  Trash2,
  QrCode,
  ExternalLink,
  Link2,
  ChevronLeft,
  ChevronRight,
  Check,
  Settings,
} from "lucide-react"

interface LinkItem {
  id: string
  url: string
  slug: string
  domain: string
  title: string | null
  clicks: number
  isActive: boolean
  createdAt: Date
}

interface LinksResponse {
  links: LinkItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

const ITEMS_PER_PAGE = 10

export default function LinksPage() {
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [links, setLinks] = useState<LinkItem[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [qrLink, setQrLink] = useState<LinkItem | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<LinkItem | null>(null)
  const { addToast } = useToast()
  const linksRef = useRef<LinkItem[]>([])
  linksRef.current = links

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    const fetchLinks = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({ page: String(page), limit: String(ITEMS_PER_PAGE) })
        if (debouncedSearch) params.set("search", debouncedSearch)
        if (statusFilter !== "all") params.set("status", statusFilter)
        if (dateFilter !== "all") params.set("date", dateFilter)

        const res = await fetch(`/api/links?${params}`, { signal: controller.signal })
        if (!res.ok) throw new Error("Failed to fetch links")
        const data: LinksResponse = await res.json()
        if (cancelled) return
        setLinks(data.links.map((l) => ({ ...l, createdAt: new Date(l.createdAt) })))
        setTotal(data.total)
        setTotalPages(data.totalPages)
      } catch (err) {
        if (cancelled || (err instanceof DOMException && err.name === "AbortError")) return
        addToast("Failed to load links", "error")
        setLinks([])
        setTotal(0)
        setTotalPages(0)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchLinks()
    return () => { cancelled = true; controller.abort() }
  }, [page, debouncedSearch, statusFilter, dateFilter, addToast])

  const handleCopy = useCallback((slug: string) => {
    navigator.clipboard.writeText(`https://relurl.com/${slug}`)
    addToast("Copied to clipboard", "success")
  }, [addToast])

  const handleToggleActive = useCallback(async (link: LinkItem) => {
    const newActive = !link.isActive
    try {
      const res = await fetch(`/api/links/${link.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newActive }),
      })
      if (!res.ok) throw new Error("Failed to update link")
      setLinks((prev) => prev.map((l) => (l.id === link.id ? { ...l, isActive: newActive } : l)))
      addToast(`Link ${newActive ? "activated" : "deactivated"}`, "success")
    } catch {
      addToast("Failed to update link", "error")
    }
  }, [addToast])

  const handleDelete = useCallback(async () => {
    if (!deleteConfirm) return
    const linkId = deleteConfirm.id
    const prevLinks = linksRef.current
    const wasLastOnPage = prevLinks.length === 1 && page > 1
    setDeleteConfirm(null)

    if (wasLastOnPage) setPage((p) => p - 1)

    try {
      const res = await fetch(`/api/links/${linkId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete link")
      addToast("Link deleted", "success")
    } catch {
      addToast("Failed to delete link", "error")
    }
  }, [deleteConfirm, page, addToast])

  const renderSkeleton = () => (
    <div className="animate-pulse">
      <div className="flex items-center gap-4 border-b border-dark-300 p-4">
        <div className="h-4 w-32 rounded bg-dark-300" />
        <div className="h-4 flex-1 rounded bg-dark-300" />
        <div className="h-4 w-16 rounded bg-dark-300" />
        <div className="h-4 w-24 rounded bg-dark-300" />
        <div className="h-6 w-16 rounded bg-dark-300" />
        <div className="h-4 w-24 rounded bg-dark-300" />
      </div>
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-dark-300 p-4">
          <div className="h-4 w-32 rounded bg-dark-300" />
          <div className="h-4 flex-1 rounded bg-dark-300" />
          <div className="h-4 w-16 rounded bg-dark-300" />
          <div className="h-4 w-24 rounded bg-dark-300" />
          <div className="h-6 w-16 rounded bg-dark-300" />
          <div className="flex gap-2">
            <div className="h-8 w-8 rounded bg-dark-300" />
            <div className="h-8 w-8 rounded bg-dark-300" />
            <div className="h-8 w-8 rounded bg-dark-300" />
            <div className="h-8 w-8 rounded bg-dark-300" />
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-50">All Links</h1>
          <p className="mt-1 text-sm text-dark-100">
            Manage your shortened links
          </p>
        </div>
        <Link href="/dashboard/links/new">
          <Button variant="primary">
            <Plus className="mr-2 h-4 w-4" />
            Create New Link
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-100" />
              <Input
                placeholder="Search links..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="pl-9"
              />
            </div>
            <div className="flex gap-3">
              <Select
                value={dateFilter}
                onChange={(e) => { setDateFilter(e.target.value); setPage(1) }}
                className="w-36"
              >
                <option value="all">All Time</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </Select>
              <Select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
                className="w-36"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            renderSkeleton()
          ) : links.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-dark-300 p-4 mb-4">
                <Link2 className="h-8 w-8 text-dark-100" />
              </div>
              <h3 className="text-lg font-medium text-dark-50 mb-1">No links found</h3>
              <p className="text-sm text-dark-100 mb-6 max-w-sm">
                {search || statusFilter !== "all" || dateFilter !== "all"
                  ? "Try adjusting your search or filters."
                  : "Create your first shortened link to get started."}
              </p>
              {!search && statusFilter === "all" && dateFilter === "all" && (
                <Link href="/dashboard/links/new">
                  <Button variant="primary">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Link
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Short URL</TableHead>
                    <TableHead>Original URL</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {links.map((link) => (
                    <TableRow key={link.id}>
                      <TableCell>
                        <div className="min-w-0 max-w-[160px]">
                          <p className="truncate font-medium text-dark-50">
                            {link.domain}/{link.slug}
                          </p>
                          {link.title && (
                            <p className="truncate text-xs text-dark-100">{link.title}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="truncate max-w-[240px] text-dark-100" title={link.url}>
                          {truncate(link.url, 40)}
                        </p>
                      </TableCell>
                      <TableCell className="text-dark-50">{formatNumber(link.clicks)}</TableCell>
                      <TableCell className="text-dark-100 text-nowrap">{formatDate(link.createdAt, "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <button type="button" onClick={() => handleToggleActive(link)}>
                          <Badge variant={link.isActive ? "success" : "destructive"}>
                            {link.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/dashboard/links/${link.id}`}
                            className="rounded-lg p-2 text-dark-100 hover:text-[#1F6F5F] hover:bg-dark-300 transition-colors"
                            title="Manage (Pixels, A/B, Routing, AI)"
                          >
                            <Settings className="h-4 w-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleCopy(link.slug)}
                            className="rounded-lg p-2 text-dark-100 hover:text-dark-50 hover:bg-dark-300 transition-colors"
                            title="Copy"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <Link
                            href={`/dashboard/links/${link.id}/edit`}
                            className="rounded-lg p-2 text-dark-100 hover:text-dark-50 hover:bg-dark-300 transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setQrLink(link)}
                            className="rounded-lg p-2 text-dark-100 hover:text-dark-50 hover:bg-dark-300 transition-colors"
                            title="QR Code"
                          >
                            <QrCode className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirm(link)}
                            className="rounded-lg p-2 text-dark-100 hover:text-red-400 hover:bg-dark-300 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-dark-100">
                    Page {page} of {totalPages} ({total} total)
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="rounded-lg p-2 text-dark-100 hover:text-dark-50 hover:bg-dark-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPage(p)}
                        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                          p === page
                            ? "bg-dark-100 text-dark-50"
                            : "text-dark-100 hover:text-dark-50 hover:bg-dark-300"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="rounded-lg p-2 text-dark-100 hover:text-dark-50 hover:bg-dark-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!qrLink} onOpenChange={(open) => { if (!open) setQrLink(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code</DialogTitle>
            <DialogDescription>
              Scan to open https://{qrLink?.domain}/{qrLink?.slug}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            {qrLink && (
              <QRCode
                value={`https://${qrLink.domain}/${qrLink.slug}`}
                size={200}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirm} onOpenChange={(open) => { if (!open) setDeleteConfirm(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Link</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this link? This action cannot be undone.
              All click data will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
