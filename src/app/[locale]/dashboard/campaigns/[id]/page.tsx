"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { SectionHeader } from "@/components/ui/section-header"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { LoadingSpinner } from "@/components/ui/loading"
import { formatDate, formatNumber } from "@/lib/utils"
import { ArrowLeft, Link2, MousePointerClick, Plus, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Campaign {
  id: string
  name: string
  description: string | null
  color: string
  links: LinkItem[]
}

interface LinkItem {
  id: string
  url: string
  slug: string
  domain: string
  title: string | null
  tags: string | null
  clicks: number
  isActive: boolean
  createdAt: string
  _count: { linkClicks: number }
}

interface UnassignedLink {
  id: string
  slug: string
  url: string
  title: string | null
  createdAt: string
}

export default function CampaignDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Add links dialog
  const [showAddLinks, setShowAddLinks] = useState(false)
  const [unassignedLinks, setUnassignedLinks] = useState<UnassignedLink[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [adding, setAdding] = useState(false)

  const fetchCampaign = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/campaigns/${id}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to load campaign")
      setCampaign(json.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCampaign() }, [id])

  const fetchUnassignedLinks = async () => {
    try {
      const res = await fetch("/api/links?limit=100")
      const json = await res.json()
      if (json.data?.links) {
        const campaignLinkIds = new Set(campaign?.links.map((l) => l.id) || [])
        setUnassignedLinks(json.data.links.filter((l: UnassignedLink) => !campaignLinkIds.has(l.id)))
      }
    } catch { /* ignore */ }
  }

  const handleAddLinks = async () => {
    if (selectedIds.size === 0) return
    setAdding(true)
    try {
      await fetch(`/api/campaigns/${id}/links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkIds: Array.from(selectedIds) }),
      })
      setShowAddLinks(false)
      setSelectedIds(new Set())
      fetchCampaign()
    } catch { /* ignore */ } finally {
      setAdding(false)
    }
  }

  const handleRemoveLink = async (linkId: string) => {
    try {
      await fetch(`/api/campaigns/${id}/links`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkIds: [linkId] }),
      })
      fetchCampaign()
    } catch { /* ignore */ }
  }

  const openAddDialog = () => {
    fetchUnassignedLinks()
    setSelectedIds(new Set())
    setShowAddLinks(true)
  }

  const toggleSelect = (linkId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(linkId)) next.delete(linkId)
      else next.add(linkId)
      return next
    })
  }

  const filteredUnassigned = unassignedLinks.filter(
    (l) =>
      l.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><LoadingSpinner /></div>
  }

  if (error) {
    return <ErrorState title="Failed to load campaign" message={error} onRetry={fetchCampaign} />
  }

  if (!campaign) {
    return <EmptyState title="Campaign not found" description="This campaign doesn't exist or was deleted." />
  }

  const totalClicks = campaign.links.reduce((sum, l) => sum + l.clicks, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/campaigns">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: campaign.color }} />
            <h1 className="text-2xl font-bold text-dark-50">{campaign.name}</h1>
          </div>
          {campaign.description && (
            <p className="text-sm text-dark-100 mt-1">{campaign.description}</p>
          )}
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add Links
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-dark-100">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-dark-100">Total Links</p>
            <p className="text-2xl font-bold text-dark-50">{campaign.links.length}</p>
          </CardContent>
        </Card>
        <Card className="border-dark-100">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-dark-100">Total Clicks</p>
            <p className="text-2xl font-bold text-dark-50">{formatNumber(totalClicks)}</p>
          </CardContent>
        </Card>
        <Card className="border-dark-100">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-dark-100">Avg. Clicks/Link</p>
            <p className="text-2xl font-bold text-dark-50">
              {campaign.links.length > 0 ? Math.round(totalClicks / campaign.links.length) : 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {campaign.links.length === 0 ? (
        <EmptyState
          icon={<Link2 className="h-6 w-6" />}
          title="No links in this campaign"
          description="Add links to start tracking campaign performance."
          action={{ label: "Add Links", onClick: openAddDialog }}
        />
      ) : (
        <Card className="border-dark-100">
          <CardHeader>
            <CardTitle className="text-lg">Links ({campaign.links.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Short URL</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaign.links.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell>
                      <Link href={`/dashboard/links/${link.id}`} className="font-medium text-primary hover:underline">
                        {link.slug}
                      </Link>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-dark-100">{link.url}</TableCell>
                    <TableCell className="text-dark-100">{link.title || "—"}</TableCell>
                    <TableCell className="text-dark-50 font-medium">{formatNumber(link.clicks)}</TableCell>
                    <TableCell className="text-dark-100">{formatDate(link.createdAt, "MMM d")}</TableCell>
                    <TableCell>
                      <Badge variant={link.isActive ? "success" : "destructive"}>
                        {link.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveLink(link.id)}>
                        <X className="h-4 w-4 text-dark-100" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={showAddLinks} onOpenChange={setShowAddLinks}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Links to {campaign.name}</DialogTitle>
            <DialogDescription>Select links to add to this campaign.</DialogDescription>
          </DialogHeader>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-100" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search links..."
              className="pl-9"
            />
          </div>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {filteredUnassigned.length === 0 ? (
              <p className="text-sm text-dark-100 text-center py-4">
                {searchQuery ? "No matching links" : "All your links are already in this campaign"}
              </p>
            ) : (
              filteredUnassigned.map((l) => (
                <label
                  key={l.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-dark-300/50 cursor-pointer border border-transparent hover:border-dark-100 transition-colors"
                >
                  <Checkbox checked={selectedIds.has(l.id)} onCheckedChange={() => toggleSelect(l.id)} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-dark-50 truncate">{l.slug}</p>
                    <p className="text-xs text-dark-100 truncate">{l.title || l.url}</p>
                  </div>
                </label>
              ))
            )}
          </div>
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowAddLinks(false)}>Cancel</Button>
            <Button onClick={handleAddLinks} disabled={selectedIds.size === 0 || adding}>
              {adding ? "Adding..." : `Add ${selectedIds.size} link${selectedIds.size !== 1 ? "s" : ""}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
