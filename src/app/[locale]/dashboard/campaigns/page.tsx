"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { SectionHeader } from "@/components/ui/section-header"
import { SkeletonCard } from "@/components/ui/loading"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { formatNumber } from "@/lib/utils"
import { Plus, FolderKanban, Palette, BarChart3, ExternalLink, Trash2, MoreHorizontal, Edit } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

interface Campaign {
  id: string
  name: string
  description: string | null
  color: string
  linkCount: number
  totalClicks: number
  createdAt: string
}

export default function CampaignsPage() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Create dialog
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newColor, setNewColor] = useState("#4f46e5")
  const [creating, setCreating] = useState(false)

  const fetchCampaigns = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/campaigns")
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to load campaigns")
      setCampaigns(json.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCampaigns() }, [])

  const handleCreate = async () => {
    if (!newName.trim()) return
    setCreating(true)
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, description: newDescription, color: newColor }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to create")
      setShowCreate(false)
      setNewName("")
      setNewDescription("")
      fetchCampaigns()
    } catch (err) {
      // ignore
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/campaigns/${id}`, { method: "DELETE" })
      fetchCampaigns()
    } catch { /* ignore */ }
  }

  const colorOptions = ["#4f46e5", "#0d9488", "#ea580c", "#7c3aed", "#dc2626", "#2563eb", "#059669", "#d97706"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader title="Campaigns" description="Organize your links into campaigns" />
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Campaign
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <ErrorState title="Failed to load campaigns" message={error} onRetry={fetchCampaigns} />
      ) : campaigns.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="h-6 w-6" />}
          title="No campaigns yet"
          description="Group your links into campaigns to track performance by initiative."
          action={{ label: "Create Campaign", onClick: () => setShowCreate(true) }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => (
            <Link key={c.id} href={`/dashboard/campaigns/${c.id}`}>
              <Card className="border-dark-100 hover:border-dark-50 transition-colors cursor-pointer group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: c.color }} />
                      <div>
                        <h3 className="font-semibold text-dark-50">{c.name}</h3>
                        {c.description && (
                          <p className="text-xs text-dark-100 mt-0.5 line-clamp-1">{c.description}</p>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100" onClick={(e) => e.preventDefault()}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.preventDefault(); handleDelete(c.id) }}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-dark-100">
                    <span className="flex items-center gap-1">
                      <BarChart3 className="w-3.5 h-3.5" />
                      {formatNumber(c.totalClicks)} clicks
                    </span>
                    <span className="flex items-center gap-1">
                      <ExternalLink className="w-3.5 h-3.5" />
                      {c.linkCount} links
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Campaign</DialogTitle>
            <DialogDescription>Group related links under a campaign name.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Name</label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Summer Sale 2026" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Description (optional)</label>
              <Textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="Campaign description" rows={2} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Color</label>
              <div className="flex gap-2">
                {colorOptions.map((clr) => (
                  <button
                    key={clr}
                    type="button"
                    onClick={() => setNewColor(clr)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${newColor === clr ? "border-dark-50 scale-110" : "border-transparent"}`}
                    style={{ backgroundColor: clr }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!newName.trim() || creating}>
              {creating ? "Creating..." : "Create Campaign"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
