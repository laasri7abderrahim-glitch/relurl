"use client"

import { useEffect, useState, useCallback } from "react"
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
      addToast("Failed to load users", "error")
    } finally {
      setLoading(false)
    }
  }, [page, search, addToast])

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

      addToast("User updated successfully", "success")
      fetchUsers()
    } catch {
      addToast("Failed to update user", "error")
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return

    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" })

      if (!res.ok) throw new Error("Delete failed")

      addToast("User deleted successfully", "success")
      fetchUsers()
    } catch {
      addToast("Failed to delete user", "error")
    }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark-50">Users</h1>
        <p className="mt-1 text-sm text-dark-100">Manage all registered users</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg">All Users ({formatNumber(total)})</CardTitle>
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-100" />
              <Input
                placeholder="Search by name or email..."
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
            <p className="text-sm text-dark-100">No users found.</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Links</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
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
                          {user.isActive ? "Active" : "Banned"}
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
                              title="Ban user"
                            >
                              <Ban className="h-4 w-4 text-red-400" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAction(user.id, "unban")}
                              title="Unban user"
                            >
                              <ShieldOff className="h-4 w-4 text-emerald-400" />
                            </Button>
                          )}
                          {user.role === "ADMIN" ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAction(user.id, "role", "USER")}
                              title="Remove admin"
                            >
                              <Shield className="h-4 w-4 text-orange-400" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAction(user.id, "role", "ADMIN")}
                              title="Make admin"
                            >
                              <Shield className="h-4 w-4 text-dark-100" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(user.id)}
                            title="Delete user"
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
