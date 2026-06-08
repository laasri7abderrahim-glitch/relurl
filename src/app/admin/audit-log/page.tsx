"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface AuditLogEntry {
  id: string
  userId: string | null
  teamId: string | null
  action: string
  entity: string
  entityId: string
  changes: unknown
  ip: string | null
  userAgent: string | null
  createdAt: string
  user: { id: string; name: string | null; email: string } | null
}

interface AuditLogsResponse {
  logs: AuditLogEntry[]
  total: number
  page: number
  limit: number
}

export default function AdminAuditLogPage() {
  const [data, setData] = useState<AuditLogsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [actionFilter, setActionFilter] = useState("")
  const [entityFilter, setEntityFilter] = useState("")

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      })
      if (actionFilter) params.set("action", actionFilter)
      if (entityFilter) params.set("entity", entityFilter)

      const res = await fetch(`/api/audit-logs?${params.toString()}`)
      if (res.ok) {
        const json = await res.json()
        setData(json.data)
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }, [page, actionFilter, entityFilter])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const totalPages = data ? Math.ceil(data.total / 20) : 0

  const actionVariant = (action: string) => {
    switch (action) {
      case "CREATE":
        return "success" as const
      case "DELETE":
        return "destructive" as const
      case "UPDATE":
        return "secondary" as const
      default:
        return "outline" as const
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-dark-50">Audit Log</h1>
        <p className="mt-1 text-sm text-dark-100">Track all system activities</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg">Activity Logs</CardTitle>
            <div className="flex flex-wrap gap-3">
              <select
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value)
                  setPage(1)
                }}
                className="h-10 rounded-lg border border-dark-100 bg-dark-500 px-3 py-2 text-sm text-dark-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <option value="">All Actions</option>
                <option value="CREATE">CREATE</option>
                <option value="UPDATE">UPDATE</option>
                <option value="DELETE">DELETE</option>
              </select>
              <select
                value={entityFilter}
                onChange={(e) => {
                  setEntityFilter(e.target.value)
                  setPage(1)
                }}
                className="h-10 rounded-lg border border-dark-100 bg-dark-500 px-3 py-2 text-sm text-dark-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <option value="">All Entities</option>
                <option value="ShortLink">ShortLink</option>
                <option value="User">User</option>
                <option value="Subscription">Subscription</option>
              </select>
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
          ) : !data || data.logs.length === 0 ? (
            <p className="text-sm text-dark-100">No audit logs found.</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Entity ID</TableHead>
                    <TableHead>IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-dark-100 text-nowrap">
                        {formatDate(log.createdAt, "MMM d, yyyy HH:mm")}
                      </TableCell>
                      <TableCell className="text-dark-50">
                        {log.user?.name ?? log.user?.email ?? "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={actionVariant(log.action)}>
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-dark-50">{log.entity}</TableCell>
                      <TableCell className="font-mono text-xs text-dark-100">
                        {log.entityId.slice(0, 8)}…
                      </TableCell>
                      <TableCell className="text-dark-100">{log.ip ?? "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-dark-100">
                    Page {data.page} of {totalPages} ({data.total} total)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage(page - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
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
