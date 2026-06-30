"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/toast"
import { formatDate } from "@/lib/utils"
import {
  Key,
  Plus,
  Copy,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { useTranslations } from "next-intl"

interface ApiKey {
  id: string
  name: string
  isActive: boolean
  lastUsedAt: Date | null
  createdAt: Date
}

interface CreatedKey extends ApiKey {
  key: string
}

function keyDisplay(id: string): string {
  return `rel_sk_${id.slice(0, 8)}...${id.slice(-4)}`
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [generatedKey, setGeneratedKey] = useState<CreatedKey | null>(null)
  const [creating, setCreating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<ApiKey | null>(null)
  const [revoking, setRevoking] = useState(false)
  const { addToast } = useToast()
  const t = useTranslations("dashboard.apiKeys")

  const fetchKeys = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/api-keys")
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? t("fetchError"))
      setKeys(json.data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : t("genericError"))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    fetchKeys()
  }, [fetchKeys])

  const handleCreate = async () => {
    if (!newKeyName.trim()) {
      addToast(t("toast.enterName"), "error")
      return
    }
    setCreating(true)
    try {
      const res = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName.trim() }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? t("toast.failedCreate"))
      setGeneratedKey(json.data)
      setKeys((prev) => [json.data, ...prev])
      addToast(t("toast.created"), "success")
    } catch (err) {
      addToast(err instanceof Error ? err.message : t("toast.failedCreate"), "error")
    } finally {
      setCreating(false)
    }
  }

  const handleCopyKey = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    addToast(t("toast.copied"), "success")
    setTimeout(() => setCopied(false), 3000)
  }

  const handleCloseDialog = () => {
    setShowCreateDialog(false)
    setNewKeyName("")
    setGeneratedKey(null)
    setCopied(false)
  }

  const handleRevoke = async (key: ApiKey) => {
    setRevoking(true)
    try {
      const res = await fetch(`/api/api-keys?id=${key.id}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? t("toast.failedRevoke"))
      setKeys((prev) => prev.map((k) => (k.id === key.id ? { ...k, isActive: false } : k)))
      addToast(t("toast.revoked", { name: key.name }), "success")
    } catch (err) {
      addToast(err instanceof Error ? err.message : t("toast.failedRevoke"), "error")
    } finally {
      setRevoking(false)
      setDeleteConfirm(null)
    }
  }

  const handleCopyFromTable = async (id: string) => {
    try {
      await navigator.clipboard.writeText(keyDisplay(id))
      addToast(t("toast.copied"), "success")
    } catch {
      addToast(t("toast.failedCopy"), "error")
    }
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
        <Button variant="outline" onClick={fetchKeys}>{t("error.retry")}</Button>
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
        <Button variant="primary" onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("createKey")}
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          {keys.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-dark-300 p-4 mb-4">
                <Key className="h-8 w-8 text-dark-100" />
              </div>
              <h3 className="text-lg font-medium text-dark-50 mb-1">{t("empty.title")}</h3>
              <p className="text-sm text-dark-100 mb-6 max-w-sm">{t("empty.description")}</p>
              <Button variant="primary" onClick={() => setShowCreateDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t("createKey")}
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("table.name")}</TableHead>
                  <TableHead>{t("table.key")}</TableHead>
                  <TableHead>{t("table.created")}</TableHead>
                  <TableHead>{t("table.lastUsed")}</TableHead>
                  <TableHead>{t("table.status")}</TableHead>
                  <TableHead className="text-right">{t("table.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell className="font-medium text-dark-50">{apiKey.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="rounded bg-dark-300 px-2 py-0.5 text-xs font-mono text-dark-100">
                          {keyDisplay(apiKey.id)}
                        </code>
                        <button
                          type="button"
                          onClick={() => handleCopyFromTable(apiKey.id)}
                          className="rounded-lg p-1 text-dark-100 hover:text-dark-50 hover:bg-dark-300 transition-colors"
                          title={t("actions.copy")}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className="text-dark-100 text-nowrap">
                      {formatDate(apiKey.createdAt, "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-dark-100 text-nowrap">
                      {apiKey.lastUsedAt ? formatDate(apiKey.lastUsedAt, "MMM d, yyyy") : t("never")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={apiKey.isActive ? "success" : "destructive"}>
                        {apiKey.isActive ? t("status.active") : t("status.revoked")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {apiKey.isActive && (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirm(apiKey)}
                            className="rounded-lg p-2 text-dark-100 hover:text-red-400 hover:bg-dark-300 transition-colors"
                            title={t("actions.revoke")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showCreateDialog} onOpenChange={(o) => { if (!o) handleCloseDialog() }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("createDialog.title")}</DialogTitle>
            <DialogDescription>{t("createDialog.description")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {!generatedKey ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="keyName">{t("createDialog.keyName")}</Label>
                  <Input
                    id="keyName"
                    placeholder={t("createDialog.placeholder")}
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                </div>
                <Button variant="primary" className="w-full" onClick={handleCreate} disabled={creating}>
                  {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {t("createDialog.generate")}
                </Button>
              </>
            ) : (
              <>
                <div className="rounded-lg border border-emerald-600/30 bg-emerald-600/10 p-4">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-emerald-400">{t("createDialog.keyCreated")}</p>
                      <p className="text-xs text-dark-100 mt-1">{t("createDialog.copyWarning")}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded-lg bg-dark-300 px-3 py-2 text-xs font-mono text-dark-50 break-all">
                    {generatedKey.key}
                  </code>
                  <Button
                    variant={copied ? "primary" : "outline"}
                    size="icon"
                    onClick={() => handleCopyKey(generatedKey.key)}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <Button variant="outline" className="w-full" onClick={handleCloseDialog}>
                  {t("createDialog.done")}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirm} onOpenChange={(o) => { if (!o) setDeleteConfirm(null) }}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="h-5 w-5" />
              <DialogTitle>{t("revokeDialog.title")}</DialogTitle>
            </div>
            <DialogDescription>
              {t("revokeDialog.confirm", { name: deleteConfirm?.name ?? "" })}
              {t("revokeDialog.warning")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              {t("revokeDialog.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleRevoke(deleteConfirm)}
              disabled={revoking}
            >
              {revoking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              {t("revokeDialog.confirmButton")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}