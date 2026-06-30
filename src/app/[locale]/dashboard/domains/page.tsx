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
import { useTranslations } from "next-intl"

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
  const [verifyInstructions, setVerifyInstructions] = useState<{ id: string; domain: string } | null>(null)
  const { addToast } = useToast()
  const t = useTranslations("dashboard.domains")

  const fetchDomains = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/domains")
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? t("fetchError"))
      setDomains(json.data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : t("genericError"))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    fetchDomains()
  }, [fetchDomains])

  const handleAdd = async () => {
    const trimmed = newDomain.trim().toLowerCase()
    if (!trimmed) {
      addToast(t("toast.enterDomain"), "error")
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
      if (!res.ok) throw new Error(json.error ?? t("toast.failedAdd"))
      setDomains((prev) => [json.data, ...prev])
      setShowAddDialog(false)
      setNewDomain("")
      addToast(t("toast.added"), "success")
    } catch (err) {
      addToast(err instanceof Error ? err.message : t("toast.failedAdd"), "error")
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
        body: JSON.stringify({ action: "verify" }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? t("toast.failedVerify"))
      setDomains((prev) =>
        prev.map((d) => (d.id === domain.id ? { ...d, isVerified: true } : d))
      )
      addToast(t("toast.verified", { domain: domain.domain }), "success")
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("toast.failedVerify")
      addToast(msg, "error")
    } finally {
      setVerifyingId(null)
    }
  }

  const handleShowInstructions = (domain: Domain) => {
    setVerifyInstructions({ id: domain.id, domain: domain.domain })
  }

  const handleDelete = async (domain: Domain) => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/domains/${domain.id}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? t("toast.failedDelete"))
      setDomains((prev) => prev.filter((d) => d.id !== domain.id))
      addToast(t("toast.deleted", { domain: domain.domain }), "success")
    } catch (err) {
      addToast(err instanceof Error ? err.message : t("toast.failedDelete"), "error")
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
        <p className="text-dark-50 font-medium mb-1">{t("error.title")}</p>
        <p className="text-sm text-dark-100 mb-4">{error}</p>
        <Button variant="outline" onClick={fetchDomains}>{t("error.retry")}</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-50">{t("title")}</h1>
          <p className="mt-1 text-sm text-dark-100">{t("description")}</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("addDomain")}
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          {domains.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-dark-300 p-4 mb-4">
                <Globe className="h-8 w-8 text-dark-100" />
              </div>
              <h3 className="text-lg font-medium text-dark-50 mb-1">{t("empty.title")}</h3>
              <p className="text-sm text-dark-100 mb-6 max-w-sm">{t("empty.description")}</p>
              <Button variant="primary" onClick={() => setShowAddDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t("addDomain")}
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("table.domain")}</TableHead>
                  <TableHead>{t("table.status")}</TableHead>
                  <TableHead>{t("table.links")}</TableHead>
                  <TableHead>{t("table.created")}</TableHead>
                  <TableHead className="text-right">{t("table.actions")}</TableHead>
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
                            {t("status.verified")}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <ShieldOff className="h-3 w-3" />
                            {t("status.unverified")}
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
                          <>
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
                              {verifyingId === d.id ? t("actions.verifying") : t("actions.verify")}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleShowInstructions(d)}
                              className="text-dark-100 hover:text-dark-50"
                            >
                              {t("actions.howToVerify")}
                            </Button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm(d)}
                          className="rounded-lg p-2 text-dark-100 hover:text-red-400 hover:bg-dark-300 transition-colors"
                          title={t("actions.delete")}
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
            <DialogTitle>{t("addDialog.title")}</DialogTitle>
            <DialogDescription>{t("addDialog.description")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Input
                placeholder={t("addDialog.placeholder")}
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAdd() }}
              />
            </div>
            <Button variant="primary" className="w-full" onClick={handleAdd} disabled={creating}>
              {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {t("addDialog.create")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!verifyInstructions} onOpenChange={(o) => { if (!o) setVerifyInstructions(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("verifyInstructions.title")}</DialogTitle>
            <DialogDescription>{t("verifyInstructions.description")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="rounded-lg border border-dark-100 bg-dark-300/50 p-4">
              <p className="text-sm font-medium text-dark-50 mb-2">{t("verifyInstructions.txtRecord")}</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-dark-100">{t("verifyInstructions.type")}</span>
                  <span className="text-dark-50 font-mono">{t("verifyInstructions.typeValue")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-100">{t("verifyInstructions.nameHost")}</span>
                  <span className="text-dark-50 font-mono">{t("verifyInstructions.nameHostValue")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-100">{t("verifyInstructions.value")}</span>
                  <span className="text-dark-50 font-mono break-all">
                    relurl-verification={verifyInstructions?.id}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm text-dark-100">
              <p><strong>{t("verifyInstructions.steps")}</strong></p>
              <ol className="list-decimal list-inside space-y-1">
                <li>{t("verifyInstructions.step1")}</li>
                <li>{t("verifyInstructions.step2", { domain: verifyInstructions?.domain ?? "" })}</li>
                <li>{t("verifyInstructions.step3")}</li>
                <li>{t("verifyInstructions.step4")}</li>
              </ol>
            </div>
            <div className="flex justify-end">
              <Button variant="primary" onClick={() => setVerifyInstructions(null)}>
                {t("verifyInstructions.gotIt")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirm} onOpenChange={(o) => { if (!o) setDeleteConfirm(null) }}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="h-5 w-5" />
              <DialogTitle>{t("deleteConfirm.title")}</DialogTitle>
            </div>
            <DialogDescription>
              {t("deleteConfirm.confirm", { domain: deleteConfirm?.domain ?? "" })}
              {deleteConfirm && deleteConfirm.linkCount > 0 && (
                <span className="mt-2 block text-red-400">
                  {t("deleteConfirm.warning", { count: deleteConfirm.linkCount })}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              {t("deleteConfirm.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              disabled={deleting}
            >
              {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              {t("deleteConfirm.confirmButton")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}