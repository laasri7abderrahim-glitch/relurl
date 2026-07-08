"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { QRCode, SIZE_OPTIONS } from "@/components/ui/qr-code"
import { QRCodeSettings } from "@/components/ui/qr-code-settings"
import { useToast } from "@/components/ui/toast"
import { StatCard } from "@/components/ui/stat-card"
import { SectionHeader } from "@/components/ui/section-header"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { SkeletonTable } from "@/components/ui/loading"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { formatDate, formatNumber, truncate } from "@/lib/utils"
import {
  Search,
  Plus,
  Copy,
  Trash2,
  QrCode,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Link2,
  MousePointerClick,
  CheckCheck,
  BarChart3,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  Files,
  Columns,
  Tags,
  Eye,
  EyeOff,
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
  tags?: string[]
  healthStatus?: string | null
  healthCheckedAt?: string | null
  healthStatusCode?: number | null
}

interface HealthResult {
  linkId: string
  status: "healthy" | "unhealthy"
  statusCode: number | null
  redirectCount: number
  error?: string
}

interface BatchHealthResponse {
  results: HealthResult[]
  stats: {
    total: number
    healthy: number
    unhealthy: number
    lastChecked: string
  }
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
  const router = useRouter()
  const t = useTranslations('dashboard.links.list')
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [links, setLinks] = useState<LinkItem[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [qrLink, setQrLink] = useState<LinkItem | null>(null)
  const [qrFgColor, setQrFgColor] = useState("#0b1120")
  const [qrBgColor, setQrBgColor] = useState("#ffffff")
  const [qrSize, setQrSize] = useState(200)
  const [qrFormat, setQrFormat] = useState<"png" | "svg">("png")
  const [deleteConfirm, setDeleteConfirm] = useState<LinkItem | null>(null)
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [clicksToday, setClicksToday] = useState(0)
  const [checkingHealth, setCheckingHealth] = useState(false)
  const [healthLinks, setHealthLinks] = useState<string[]>([])
  const [cloningId, setCloningId] = useState<string | null>(null)
  const [healthMap, setHealthMap] = useState<Record<string, HealthResult>>({})
  const { addToast } = useToast()
  const linksRef = useRef<LinkItem[]>([])
  linksRef.current = links

  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const [sortField, setSortField] = useState("createdAt")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [tagsFilter, setTagsFilter] = useState("all")
  const [visibleColumns, setVisibleColumns] = useState({
    select: true,
    shortUrl: true,
    originalUrl: true,
    clicks: true,
    date: true,
    status: true,
    health: true,
    actions: true,
  })

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDir("desc")
    }
    setPage(1)
  }

  const columnLabels: Record<string, string> = {
    shortUrl: "Short URL",
    originalUrl: "Original URL",
    clicks: "Clicks",
    date: "Date",
    status: "Status",
    health: "Health",
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 text-dark-100" />
    return sortDir === "asc" ? <ArrowUp className="h-3 w-3 text-accent" /> : <ArrowDown className="h-3 w-3 text-accent" />
  }

  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current) }
  }, [search])

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    const fetchLinks = async () => {
      setLoading(true)
      setError(false)
      try {
        let data: LinksResponse
        if (debouncedSearch) {
          const params = new URLSearchParams({ q: debouncedSearch, page: String(page), limit: String(ITEMS_PER_PAGE) })
          const res = await fetch(`/api/links/search?${params}`, { signal: controller.signal })
          if (!res.ok) throw new Error("Failed to fetch links")
          const json = await res.json()
          if (cancelled) return
          data = { ...json.data, limit: ITEMS_PER_PAGE, totalPages: Math.ceil(json.data.total / ITEMS_PER_PAGE) }
        } else {
          const params = new URLSearchParams({ page: String(page), limit: String(ITEMS_PER_PAGE) })
          if (statusFilter !== "all") params.set("status", statusFilter)
          if (dateFilter !== "all") params.set("date", dateFilter)
          params.set("sort", sortField)
          params.set("dir", sortDir)
          if (tagsFilter !== "all") params.set("tags", tagsFilter)
          const res = await fetch(`/api/links?${params}`, { signal: controller.signal })
          if (!res.ok) throw new Error("Failed to fetch links")
          const json = await res.json()
          if (cancelled) return
          data = json.data
        }
        setLinks(data.links.map((l) => ({ ...l, createdAt: new Date(l.createdAt) })))
        setTotal(data.total)
        setTotalPages(data.totalPages)
      } catch (err) {
        if (cancelled || (err instanceof DOMException && err.name === "AbortError")) return
        setError(true)
        setLinks([])
        setTotal(0)
        setTotalPages(0)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchLinks()
    return () => { cancelled = true; controller.abort() }
  }, [page, debouncedSearch, statusFilter, dateFilter, sortField, sortDir, tagsFilter, addToast])

  useEffect(() => {
    setSelectedIds(new Set())
  }, [page, debouncedSearch, statusFilter, dateFilter, sortField, sortDir, tagsFilter])

  useEffect(() => {
    const controller = new AbortController()
    fetch("/api/analytics/clicks-today", { signal: controller.signal })
      .then((res) => res.ok ? res.json() : { clicks: 0 })
      .then((data) => setClicksToday(data.clicks ?? 0))
      .catch(() => {})
    return () => controller.abort()
  }, [])

  const activeLinks = links.filter((l) => l.isActive)

  const handleCopy = useCallback((slug: string) => {
    navigator.clipboard.writeText(`https://relurl.com/${slug}`)
    addToast(t('toastCopied'), "success")
  }, [addToast, t])

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
      addToast(newActive ? t('toastActivated') : t('toastDeactivated'), "success")
    } catch {
      addToast(t('toastUpdateFailed'), "error")
    }
  }, [addToast, t])

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
      setLinks((prev) => prev.filter((l) => l.id !== linkId))
      setSelectedIds((prev) => { const next = new Set(prev); next.delete(linkId); return next })
      addToast(t('toastDeleted'), "success")
    } catch {
      addToast(t('toastDeleteFailed'), "error")
    }
  }, [deleteConfirm, page, addToast, t])

  const handleClone = useCallback(async (link: LinkItem) => {
    setCloningId(link.id)
    try {
      const res = await fetch(`/api/links/${link.id}/clone`, { method: "POST" })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error || "Failed to clone link")
      }
      const json = await res.json()
      const newLink = { ...json.data, createdAt: new Date(json.data.createdAt) }
      setLinks((prev) => [newLink, ...prev])
      addToast(t('cloneSuccess'), "success")
    } catch (err) {
      addToast(err instanceof Error ? err.message : t('cloneError'), "error")
    } finally {
      setCloningId(null)
    }
  }, [addToast, t])

  const bulkAction = useCallback(async (action: "activate" | "deactivate" | "delete") => {
    const ids = Array.from(selectedIds)
    if (ids.length === 0) return
    if (action === "delete") {
      setBulkDeleteConfirm(true)
      return
    }
    const prevLinks = linksRef.current
    const wasLastPage = prevLinks.length === ids.length && page > 1

    try {
      const res = await fetch("/api/links/bulk-operations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, action }),
      })
      if (!res.ok) throw new Error("Failed")
      const json = await res.json()
      setLinks((prev) => prev.map((l) => ids.includes(l.id) ? { ...l, isActive: action === "activate" } : l))
      addToast(t('bulkSuccess', { count: json.data.count }), "success")
      setSelectedIds(new Set())
      if (wasLastPage) setPage((p) => p - 1)
    } catch {
      addToast(t('bulkError'), "error")
    }
  }, [selectedIds, page, addToast, t])

  const handleBulkDelete = useCallback(async () => {
    const ids = Array.from(selectedIds)
    if (ids.length === 0) return
    setBulkDeleteConfirm(false)
    const prevLinks = linksRef.current
    const wasLastPage = prevLinks.length === ids.length && page > 1

    try {
      const res = await fetch("/api/links/bulk-operations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, action: "delete" }),
      })
      if (!res.ok) throw new Error("Failed")
      const json = await res.json()
      setLinks((prev) => prev.filter((l) => !ids.includes(l.id)))
      addToast(t('bulkSuccess', { count: json.data.count }), "success")
      setSelectedIds(new Set())
      if (wasLastPage) setPage((p) => p - 1)
    } catch {
      addToast(t('bulkError'), "error")
    }
  }, [selectedIds, page, addToast, t])

  const handleCheckAll = useCallback(async () => {
    setCheckingHealth(true)
    try {
      const res = await fetch("/api/links/health-check/batch")
      if (!res.ok) throw new Error("Health check failed")
      const json = await res.json()
      const { results, stats } = json.data as BatchHealthResponse
      const map: Record<string, HealthResult> = {}
      results.forEach((r) => { map[r.linkId] = r })
      setHealthMap((prev) => ({ ...prev, ...map }))
      addToast(t("healthResults", { healthy: stats.healthy, total: stats.total }), stats.unhealthy > 0 ? "warning" : "success")
    } catch {
      addToast(t("healthError"), "error")
    } finally {
      setCheckingHealth(false)
    }
  }, [addToast, t])

  const handleExportSelected = useCallback(() => {
    const selected = links.filter((l) => selectedIds.has(l.id))
    if (selected.length === 0) return
    const headers = ["URL", "Short URL", "Title", "Clicks", "Status", "Created At"]
    const rows = selected.map((l) => [
      l.url,
      `https://${l.domain}/${l.slug}`,
      l.title ?? "",
      String(l.clicks),
      l.isActive ? "Active" : "Inactive",
      formatDate(l.createdAt, "yyyy-MM-dd"),
    ])
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `links-export-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
    addToast(t('toastExportStarted'), "success")
  }, [links, selectedIds, addToast, t])

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === links.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(links.map((l) => l.id)))
    }
  }, [links, selectedIds])

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const renderHealthBadge = (status?: string | null) => {
    switch (status) {
      case "healthy":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-500">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            {t('healthOk')}
          </span>
        )
      case "unhealthy":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-red-500">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            {t('healthDown')}
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-dark-100">
            <span className="h-2 w-2 rounded-full bg-dark-100" />
            {t('healthUnknown')}
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title={t('title')}
        description={t('description')}
        action={
          <Link href="/dashboard/links/new">
            <Button variant="primary">
              <Plus className="mr-2 h-4 w-4" />
              {t('createNew')}
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label={t('totalLinks')}
          value={total}
          icon={<Link2 className="h-5 w-5" />}
        />
        <StatCard
          label={t('activeLinks')}
          value={activeLinks.length}
          icon={<CheckCheck className="h-5 w-5" />}
        />
        <StatCard
          label={t('clicksToday')}
          value={formatNumber(clicksToday)}
          icon={<MousePointerClick className="h-5 w-5" />}
        />
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-100" />
              <Input
                placeholder={t('searchPlaceholder')}
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
                <option value="all">{t('filterAllTime')}</option>
                <option value="7d">{t('filterLast7Days')}</option>
                <option value="30d">{t('filterLast30Days')}</option>
                <option value="90d">{t('filterLast90Days')}</option>
              </Select>
              <Select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
                className="w-36"
              >
                <option value="all">{t('filterAllStatus')}</option>
                <option value="active">{t('filterActive')}</option>
                <option value="inactive">{t('filterInactive')}</option>
              </Select>
              <Select
                value={tagsFilter}
                onChange={(e) => { setTagsFilter(e.target.value); setPage(1) }}
                className="w-36"
              >
                <option value="all">All Tags</option>
                <option value="marketing">Marketing</option>
                <option value="social">Social</option>
                <option value="campaign">Campaign</option>
                <option value="product">Product</option>
                <option value="blog">Blog</option>
              </Select>
              <Button variant="outline" size="sm" onClick={handleCheckAll} disabled={checkingHealth}>
                <CheckCheck className="mr-1.5 h-4 w-4" />
                {checkingHealth ? t('checkingHealth') : t('checkHealth')}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Columns className="mr-1.5 h-4 w-4" />
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[160px]">
                  {Object.entries(columnLabels).map(([key, label]) => (
                    <DropdownMenuItem key={key} onClick={() => setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key as keyof typeof visibleColumns] }))}>
                      {visibleColumns[key as keyof typeof visibleColumns] ? <Eye className="mr-2 h-4 w-4 text-accent" /> : <EyeOff className="mr-2 h-4 w-4 text-dark-100" />}
                      {label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="mr-1.5 h-4 w-4" />
                    {t('exportCsv')}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[160px]">
                  <DropdownMenuItem onClick={() => window.open('/api/export/links')}>
                    {t('exportLinks')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.open('/api/export/clicks')}>
                    {t('exportClicks')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {loading ? (
            <SkeletonTable rows={5} />
          ) : error ? (
            <ErrorState
              title={t('loadingErrorTitle')}
              message={t('loadingErrorMessage')}
              onRetry={() => {
                setPage(1)
                setError(false)
                setLoading(true)
              }}
            />
          ) : links.length === 0 ? (
            <EmptyState
              icon={<Link2 className="h-6 w-6" />}
              title={search || statusFilter !== "all" || dateFilter !== "all" ? t('emptySearch') : t('emptyNoLinks')}
              description={
                search || statusFilter !== "all" || dateFilter !== "all"
                  ? t('emptySearchDesc')
                  : t('emptyNoLinksDesc')
              }
              action={
                !search && statusFilter === "all" && dateFilter === "all"
                  ? { label: t('emptyCreateFirst'), onClick: () => router.push("/dashboard/links/new") }
                  : undefined
              }
            />
          ) : (
            <>
              {selectedIds.size > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-500 border border-dark-100 shadow-xl animate-in slide-in-from-bottom-4 duration-200">
                  <span className="text-sm text-dark-50">{t('nSelected', { count: selectedIds.size })}</span>
                  <div className="w-px h-5 bg-dark-100" />
                  <Button size="sm" onClick={() => bulkAction("activate")}>{t('bulkActivate')}</Button>
                  <Button size="sm" variant="outline" onClick={() => bulkAction("deactivate")}>{t('bulkDeactivate')}</Button>
                  <Button size="sm" variant="destructive" onClick={() => setBulkDeleteConfirm(true)}>{t('bulkDelete')}</Button>
                </div>
              )}

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {visibleColumns.select && (
                        <TableHead className="w-10">
                          <input
                            type="checkbox"
                            checked={links.length > 0 && selectedIds.size === links.length}
                            onChange={toggleSelectAll}
                            className="h-4 w-4 rounded border-dark-100 bg-dark-500 text-primary-500 focus:ring-primary-500"
                          />
                        </TableHead>
                      )}
                      {visibleColumns.shortUrl && (
                        <TableHead>
                          <button type="button" onClick={() => toggleSort("slug")} className="inline-flex items-center gap-1 hover:text-dark-50 transition-colors">
                            {t('tableShortUrl')} <SortIcon field="slug" />
                          </button>
                        </TableHead>
                      )}
                      {visibleColumns.originalUrl && (
                        <TableHead>
                          <button type="button" onClick={() => toggleSort("url")} className="inline-flex items-center gap-1 hover:text-dark-50 transition-colors">
                            {t('tableOriginalUrl')} <SortIcon field="url" />
                          </button>
                        </TableHead>
                      )}
                      {visibleColumns.clicks && (
                        <TableHead>
                          <button type="button" onClick={() => toggleSort("clicks")} className="inline-flex items-center gap-1 hover:text-dark-50 transition-colors">
                            {t('tableClicks')} <SortIcon field="clicks" />
                          </button>
                        </TableHead>
                      )}
                      {visibleColumns.date && (
                        <TableHead className="hidden sm:table-cell">
                          <button type="button" onClick={() => toggleSort("createdAt")} className="inline-flex items-center gap-1 hover:text-dark-50 transition-colors">
                            {t('tableDate')} <SortIcon field="createdAt" />
                          </button>
                        </TableHead>
                      )}
                      {visibleColumns.status && (
                        <TableHead>
                          <button type="button" onClick={() => toggleSort("isActive")} className="inline-flex items-center gap-1 hover:text-dark-50 transition-colors">
                            {t('tableStatus')} <SortIcon field="isActive" />
                          </button>
                        </TableHead>
                      )}
                      {visibleColumns.health && (
                        <TableHead className="hidden sm:table-cell">Health</TableHead>
                      )}
                      {visibleColumns.actions && (
                        <TableHead className="text-right">{t('tableActions')}</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {links.map((link) => (
                      <TableRow key={link.id} className={selectedIds.has(link.id) ? "bg-primary-500/5" : undefined}>
                        {visibleColumns.select && (
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedIds.has(link.id)}
                            onChange={() => toggleSelect(link.id)}
                            className="h-4 w-4 rounded border-dark-100 bg-dark-500 text-primary-500 focus:ring-primary-500"
                          />
                        </TableCell>
                        )}
                        {visibleColumns.shortUrl && (
                        <TableCell>
                          <div className="min-w-0 max-w-[160px]">
                            <p className="truncate font-medium text-dark-50">
                              {link.domain}/{link.slug}
                            </p>
                            {link.title && (
                              <p className="truncate text-xs text-dark-100">{link.title}</p>
                            )}
                            {link.tags && link.tags.length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {link.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        )}
                        {visibleColumns.originalUrl && (
                        <TableCell>
                          <p className="truncate max-w-[180px] text-dark-100 lg:max-w-[240px]" title={link.url}>
                            {truncate(link.url, 36)}
                          </p>
                        </TableCell>
                        )}
                        {visibleColumns.clicks && (
                        <TableCell className="text-dark-50">{formatNumber(link.clicks)}</TableCell>
                        )}
                        {visibleColumns.date && (
                        <TableCell className="hidden text-nowrap text-dark-100 sm:table-cell">
                          {formatDate(link.createdAt, "MMM d, yyyy")}
                        </TableCell>
                        )}
                        {visibleColumns.status && (
                        <TableCell>
                          <button type="button" onClick={() => handleToggleActive(link)}>
                            <Badge variant={link.isActive ? "success" : "destructive"}>
                              {link.isActive ? t('badgeActive') : t('badgeInactive')}
                            </Badge>
                          </button>
                        </TableCell>
                        )}
                        {visibleColumns.health && (
                        <TableCell className="hidden sm:table-cell">
                          {renderHealthBadge(healthMap[link.id]?.status ?? link.healthStatus)}
                        </TableCell>
                        )}
                        {visibleColumns.actions && (
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => setQrLink(link)}
                              className="rounded-lg p-2 text-dark-100 hover:text-dark-50 hover:bg-dark-300 transition-colors"
                              title={t('qrCodeTitle')}
                            >
                              <QrCode className="h-4 w-4" />
                            </button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button
                                  type="button"
                                  className="rounded-lg p-2 text-dark-100 hover:text-dark-50 hover:bg-dark-300 transition-colors"
                                  title={t('moreActions')}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="min-w-[180px]">
                                <DropdownMenuItem onClick={() => handleCopy(link.slug)}>
                                  <Copy className="mr-2 h-4 w-4" />
                                  {t('copyShortUrl')}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/analytics?linkId=${link.id}`)}>
                                  <BarChart3 className="mr-2 h-4 w-4" />
                                  {t('viewAnalytics')}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/links/${link.id}/edit`)}>
                                  <MousePointerClick className="mr-2 h-4 w-4" />
                                  {t('edit')}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleClone(link)} disabled={cloningId === link.id}>
                                  <Files className="mr-2 h-4 w-4" />
                                  {cloningId === link.id ? t('cloning') : t('cloneLink')}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleToggleActive(link)}>
                                  <Badge
                                    variant={link.isActive ? "destructive" : "success"}
                                    className="mr-2 h-4 w-4 rounded-sm p-0 flex items-center justify-center"
                                  >
                                    <span className="text-[8px] font-bold">
                                      {link.isActive ? t('badgeOff') : t('badgeOn')}
                                    </span>
                                  </Badge>
                                  {link.isActive ? t('deactivate') : t('activate')}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setDeleteConfirm(link)}>
                                  <Trash2 className="mr-2 h-4 w-4 text-red-400" />
                                  <span className="text-red-400">{t('delete')}</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex flex-col items-center justify-between gap-3 pt-4 sm:flex-row">
                  <p className="text-sm text-dark-100">
                    {t('paginationPage', { current: page, total: totalPages, count: total })}
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

      <Dialog open={!!qrLink} onOpenChange={(open) => {
        if (!open) {
          setQrLink(null)
          setQrFgColor("#0b1120")
          setQrBgColor("#ffffff")
          setQrSize(200)
          setQrFormat("png")
        }
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('qrDialogTitle')}</DialogTitle>
            <DialogDescription>
              {t('qrDialogDesc', { url: `https://${qrLink?.domain}/${qrLink?.slug}` })}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex items-center justify-center">
              {qrLink && (
                <QRCode
                  value={`https://${qrLink.domain}/${qrLink.slug}`}
                  size={qrSize}
                  fgColor={qrFgColor}
                  bgColor={qrBgColor}
                  format={qrFormat}
                />
              )}
            </div>
            <div className="border-t border-dark-100 pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
              {qrLink && (
                <QRCodeSettings
                  fgColor={qrFgColor}
                  bgColor={qrBgColor}
                  size={qrSize}
                  onFgColorChange={setQrFgColor}
                  onBgColorChange={setQrBgColor}
                  onSizeChange={setQrSize}
                  onPresetSelect={(preset) => {
                    setQrFgColor(preset.fg)
                    setQrBgColor(preset.bg)
                  }}
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirm} onOpenChange={(open) => { if (!open) setDeleteConfirm(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('deleteDialogTitle')}</DialogTitle>
            <DialogDescription>
              {t('deleteDialogDesc')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              {t('cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              {t('delete')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={bulkDeleteConfirm} onOpenChange={(open) => { if (!open) setBulkDeleteConfirm(false) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('bulkDeleteTitle')}</DialogTitle>
            <DialogDescription>
              {t('bulkDeleteDesc', { count: selectedIds.size })}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setBulkDeleteConfirm(false)}>
              {t('cancel')}
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              {t('bulkDeleteButton', { count: selectedIds.size })}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}