"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/toast"
import { formatDate, formatNumber, truncate } from "@/lib/utils"
import { Search, ChevronLeft, ChevronRight, Trash2, ToggleLeft, ToggleRight } from "lucide-react"

interface LinkData {
  id: string
  slug: string
  url: string
  domain: string
  title: string | null
  isActive: boolean
  createdAt: string
  clickCount: number
  user: { id: string; name: string | null; email: string } | null
}

export default function AdminLinksPage() {
  const [links, setLinks] = useState<LinkData[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const limit = 20
  const { addToast } = useToast()

  const fetchLinks = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) })
      if (search) params.set("search", search)

      const res = await fetch(`/api/admin/links?${params}`)
      if (!res.ok) throw new Error("Failed to fetch links")

      const data = await res.json()
      setLinks(data.data.links)
      setTotal(data.data.total)
    } catch {
      addToast("Failed to load links", "error")
    } finally {
      setLoading(false)
    }
  }, [page, search, addToast])

  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])

  const handleToggleStatus = async (linkId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/links/${linkId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (!res.ok) throw new Error("Toggle failed")

      addToast("Link updated", "success")
      fetchLinks()
    } catch {
      addToast("Failed to update link", "error")
    }
  }

  const handleDelete = async (linkId: string) => {
    if (!confirm("Delete this link permanently?")) return

    try {
      const res = await fetch(`/api/admin/links/${linkId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Delete failed")

      addToast("Link deleted", "success")
      fetchLinks()
    } catch {
      addToast("Failed to delete link", "error")
    }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark-50">Links</h1>
        <p className="mt-1 text-sm text-dark-100">Manage all shortened links on the platform</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg">All Links ({formatNumber(total)})</CardTitle>
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-100" />
              <Input
                placeholder="Search by URL or slug..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : links.length === 0 ? (
            <p className="text-sm text-dark-100">No links found.</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Slug</TableHead>
                    <TableHead>Destination URL</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {links.map((link) => (
                    <TableRow key={link.id}>
                      <TableCell className="font-medium text-dark-50">{link.slug}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-dark-100" title={link.url}>
                        {truncate(link.url, 40)}
                      </TableCell>
                      <TableCell className="text-dark-100">
                        {link.user?.name ?? link.user?.email ?? "—"}
                      </TableCell>
                      <TableCell className="text-dark-50">{formatNumber(link.clickCount)}</TableCell>
                      <TableCell className="text-dark-100 text-nowrap">
                        {formatDate(link.createdAt, "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge variant={link.isActive ? "success" : "destructive"}>
                          {link.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(link.id, link.isActive)}
                            title={link.isActive ? "Deactivate" : "Activate"}
                          >
                            {link.isActive ? (
                              <ToggleRight className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 text-dark-100" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(link.id)}
                            title="Delete link"
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-dark-100">
                    Page {page} of {totalPages} ({formatNumber(total)} total)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
