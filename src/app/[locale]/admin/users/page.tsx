"use client"

import { useEffect, useState, useCallback } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/toast"
import { formatDate, formatNumber } from "@/lib/utils"
import { Search, ChevronLeft, ChevronRight, Shield, ShieldOff, Ban, Trash2 } from "lucide-react"

interface UserData {
  id: string
  name: string | null
  email: string
  role: string
  isActive: boolean
  createdAt: string
  linkCount: number
}

export default function AdminUsersPage() {
  const t = useTranslations("admin.users")
  const [users, setUsers] = useState<UserData[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const limit = 20
  const { addToast } = useToast()

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) })
      if (search) params.set("search", search)

      const res = await fetch(`/api/admin/users?${params}`)
      if (!res.ok) throw new Error("Failed to fetch users")

      const data = await res.json()
      setUsers(data.data.users)
      setTotal(data.data.total)
    } catch {
      addToast(t("toast.loadFailed"), "error")
    } finally {
      setLoading(false)
    }
  }, [page, search, addToast, t])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleAction = async (userId: string, action: string, value?: unknown) => {
    try {
      const body: Record<string, unknown> = {}
      if (action === "ban") body.isActive = false
      else if (action === "unban") body.isActive = true
      else if (action === "role") body.role = value

      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error("Action failed")

      addToast(t("toast.updated"), "success")
      fetchUsers()
    } catch {
      addToast(t("toast.updateFailed"), "error")
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm(t("deleteConfirm"))) return

    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" })

      if (!res.ok) throw new Error("Delete failed")

      addToast(t("toast.deleted"), "success")
      fetchUsers()
    } catch {
      addToast(t("toast.deleteFailed"), "error")
    }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark-50">{t("title")}</h1>
        <p className="mt-1 text-sm text-dark-100">{t("subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg">{t("allUsers", { total: formatNumber(total) })}</CardTitle>
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-100" />
              <Input
                placeholder={t("searchPlaceholder")}
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
          ) : users.length === 0 ? (
            <p className="text-sm text-dark-100">{t("noUsers")}</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("name")}</TableHead>
                    <TableHead>{t("email")}</TableHead>
                    <TableHead>{t("role")}</TableHead>
                    <TableHead>{t("links")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
                    <TableHead>{t("joined")}</TableHead>
                    <TableHead className="text-right">{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium text-dark-50">{user.name ?? "—"}</TableCell>
                      <TableCell className="text-dark-100">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-dark-50">{formatNumber(user.linkCount)}</TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? "success" : "destructive"}>
                          {user.isActive ? t("active") : t("banned")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-dark-100 text-nowrap">
                        {formatDate(user.createdAt, "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {user.isActive ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAction(user.id, "ban")}
                              title={t("banUser")}
                            >
                              <Ban className="h-4 w-4 text-red-400" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAction(user.id, "unban")}
                              title={t("unbanUser")}
                            >
                              <ShieldOff className="h-4 w-4 text-emerald-400" />
                            </Button>
                          )}
                          {user.role === "ADMIN" ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAction(user.id, "role", "USER")}
                              title={t("removeAdmin")}
                            >
                              <Shield className="h-4 w-4 text-orange-400" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAction(user.id, "role", "ADMIN")}
                              title={t("makeAdmin")}
                            >
                              <Shield className="h-4 w-4 text-dark-100" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(user.id)}
                            title={t("deleteUser")}
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
                    {t("pagination", { page: String(page), totalPages: String(totalPages), total: formatNumber(total) })}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      {t("previous")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      {t("next")}
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