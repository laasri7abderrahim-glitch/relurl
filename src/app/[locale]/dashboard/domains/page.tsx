"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/toast"
import { formatDate } from "@/lib/utils"
import {
  Globe,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
  ShieldCheck,
  ShieldOff,
} from "lucide-react"

interface Domain {
  id: string
  domain: string
  isVerified: boolean
  verificationMethod: string | null
  createdAt: Date
  linkCount: number
}

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newDomain, setNewDomain] = useState("")
  const [creating, setCreating] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<Domain | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [verifyingId, setVerifyingId] = useState<string | null>(null)
  const { addToast } = useToast()

  const fetchDomains = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/domains")
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Failed to fetch domains")
      setDomains(json.data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDomains()
  }, [fetchDomains])

  const handleAdd = async () => {
    const trimmed = newDomain.trim().toLowerCase()
    if (!trimmed) {
      addToast("Please enter a domain", "error")
      return
    }
    setCreating(true)
    try {
      const res = await fetch("/api/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: trimmed }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Failed to add domain")
      setDomains((prev) => [json.data, ...prev])
      setShowAddDialog(false)
      setNewDomain("")
      addToast("Domain added successfully", "success")
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Failed to add domain", "error")
    } finally {
      setCreating(false)
    }
  }

  const handleVerify = async (domain: Domain) => {
    setVerifyingId(domain.id)
    try {
      const res = await fetch(`/api/domains/${domain.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: true }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Failed to verify domain")
      setDomains((prev) =>
        prev.map((d) => (d.id === domain.id ? { ...d, isVerified: true } : d))
      )
      addToast(`Domain "${domain.domain}" verified`, "success")
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Failed to verify domain", "error")
    } finally {
      setVerifyingId(null)
    }
  }

  const handleDelete = async (domain: Domain) => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/domains/${domain.id}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Failed to delete domain")
      setDomains((prev) => prev.filter((d) => d.id !== domain.id))
      addToast(`Domain "${domain.domain}" deleted`, "success")
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Failed to delete domain", "error")
    } finally {
      setDeleting(false)
      setDeleteConfirm(null)
    }
  }

  const handleCloseDialog = () => {
    setShowAddDialog(false)
    setNewDomain("")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-dark-100" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertCircle className="h-8 w-8 text-red-400 mb-3" />
        <p className="text-dark-50 font-medium mb-1">Failed to load domains</p>
        <p className="text-sm text-dark-100 mb-4">{error}</p>
        <Button variant="outline" onClick={fetchDomains}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-50">Custom Domains</h1>
          <p className="mt-1 text-sm text-dark-100">
            Manage custom domains for your short links
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Domain
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          {domains.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-dark-300 p-4 mb-4">
                <Globe className="h-8 w-8 text-dark-100" />
              </div>
              <h3 className="text-lg font-medium text-dark-50 mb-1">No custom domains</h3>
              <p className="text-sm text-dark-100 mb-6 max-w-sm">
                Add a custom domain to use your own branded URLs for short links.
              </p>
              <Button variant="primary" onClick={() => setShowAddDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Domain
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Links</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {domains.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium text-dark-50">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-dark-100" />
                        {d.domain}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={d.isVerified ? "success" : "secondary"}>
                        {d.isVerified ? (
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3" />
                            Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <ShieldOff className="h-3 w-3" />
                            Unverified
                          </span>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-dark-100">{d.linkCount}</TableCell>
                    <TableCell className="text-dark-100 text-nowrap">
                      {formatDate(d.createdAt, "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {!d.isVerified && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVerify(d)}
                            disabled={verifyingId === d.id}
                            className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10"
                          >
                            {verifyingId === d.id ? (
                              <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Check className="mr-1 h-3.5 w-3.5" />
                            )}
                            Verify
                          </Button>
                        )}
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm(d)}
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
          )}
        </CardContent>
      </Card>

      <Dialog open={showAddDialog} onOpenChange={(o) => { if (!o) handleCloseDialog() }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Custom Domain</DialogTitle>
            <DialogDescription>
              Enter your domain name. You&apos;ll need to configure DNS settings to verify ownership.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Input
                placeholder="e.g. go.yourbrand.com"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAdd() }}
              />
            </div>
            <Button variant="primary" className="w-full" onClick={handleAdd} disabled={creating}>
              {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Add Domain
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirm} onOpenChange={(o) => { if (!o) setDeleteConfirm(null) }}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="h-5 w-5" />
              <DialogTitle>Delete Domain</DialogTitle>
            </div>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleteConfirm?.domain}</strong>?
              {deleteConfirm && deleteConfirm.linkCount > 0 && (
                <span className="mt-2 block text-red-400">
                  This domain has {deleteConfirm.linkCount} active link(s). Remove or reassign them first.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              disabled={deleting}
            >
              {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Delete Domain
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
