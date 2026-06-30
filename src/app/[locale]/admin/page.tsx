"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate, formatNumber } from "@/lib/utils"
import { Users, Link2, MousePointerClick, CreditCard } from "lucide-react"

interface Stats {
  users: { total: number; active: number }
  links: { total: number; active: number }
  clicks: { total: number; unique: number; last24h: number }
  apiKeys: { total: number }
  clicksByDay: { date: string; clicks: number }[]
}

interface RecentUser {
  id: string
  name: string | null
  email: string
  role: string
  isActive: boolean
  createdAt: string
}

interface RecentPayment {
  id: string
  amount: number
  currency: string
  status: string
  createdAt: string
  user: { name: string | null; email: string } | null
}

export default function AdminDashboardPage() {
  const t = useTranslations("admin.dashboard")
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
  const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, usersRes, paymentsRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/users?limit=5"),
          fetch("/api/admin/payments?limit=5"),
        ])

        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData.data)
        }
        if (usersRes.ok) {
          const usersData = await usersRes.json()
          setRecentUsers(usersData.data.users)
        }
        if (paymentsRes.ok) {
          const paymentsData = await paymentsRes.json()
          setRecentPayments(paymentsData.data.payments)
        }
      } catch {
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const statusVariant = (status: string) => {
    switch (status) {
      case "SUCCEEDED":
        return "success" as const
      case "FAILED":
      case "CANCELED":
        return "destructive" as const
      default:
        return "secondary" as const
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-dark-50">{t("title")}</h1>
        <p className="mt-1 text-sm text-dark-100">{t("subtitle")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-dark-300 p-3">
                <Users className="h-5 w-5 text-primary-500" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-dark-100">{t("stats.totalUsers")}</p>
              {loading ? (
                <Skeleton className="mt-1 h-8 w-20" />
              ) : (
                <p className="text-2xl font-bold text-dark-50">{formatNumber(stats?.users.total ?? 0)}</p>
              )}
              <p className="text-xs text-dark-100 mt-1">
                {t("stats.active", { count: formatNumber(stats?.users.active ?? 0) })}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-dark-300 p-3">
                <Link2 className="h-5 w-5 text-blue-400" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-dark-100">{t("stats.totalLinks")}</p>
              {loading ? (
                <Skeleton className="mt-1 h-8 w-20" />
              ) : (
                <p className="text-2xl font-bold text-dark-50">{formatNumber(stats?.links.total ?? 0)}</p>
              )}
              <p className="text-xs text-dark-100 mt-1">
                {t("stats.activeLinks", { count: formatNumber(stats?.links.active ?? 0) })}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-dark-300 p-3">
                <MousePointerClick className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-dark-100">{t("stats.totalClicks")}</p>
              {loading ? (
                <Skeleton className="mt-1 h-8 w-20" />
              ) : (
                <p className="text-2xl font-bold text-dark-50">{formatNumber(stats?.clicks.total ?? 0)}</p>
              )}
              <p className="text-xs text-dark-100 mt-1">
                {t("stats.last24h", { count: formatNumber(stats?.clicks.last24h ?? 0) })}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-dark-300 p-3">
                <CreditCard className="h-5 w-5 text-purple-400" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-dark-100">{t("stats.apiKeys")}</p>
              {loading ? (
                <Skeleton className="mt-1 h-8 w-20" />
              ) : (
                <p className="text-2xl font-bold text-dark-50">{formatNumber(stats?.apiKeys.total ?? 0)}</p>
              )}
              <p className="text-xs text-dark-100 mt-1">{t("stats.activeKeys")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("recentRegistrations")}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentUsers.length === 0 ? (
              <p className="text-sm text-dark-100">{t("noUsers")}</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("userTableName")}</TableHead>
                    <TableHead>{t("userTableEmail")}</TableHead>
                    <TableHead>{t("userTableRole")}</TableHead>
                    <TableHead>{t("userTableJoined")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="text-dark-50">{user.name ?? "—"}</TableCell>
                      <TableCell className="text-dark-100">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-dark-100 text-nowrap">
                        {formatDate(user.createdAt, "MMM d, yyyy")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("recentPayments")}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentPayments.length === 0 ? (
              <p className="text-sm text-dark-100">{t("noPayments")}</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("paymentTableUser")}</TableHead>
                    <TableHead>{t("paymentTableAmount")}</TableHead>
                    <TableHead>{t("paymentTableStatus")}</TableHead>
                    <TableHead>{t("paymentTableDate")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="text-dark-50">
                        {payment.user?.name ?? payment.user?.email ?? "—"}
                      </TableCell>
                      <TableCell className="text-dark-50 font-medium">
                        ${(payment.amount / 100).toFixed(2)} {payment.currency.toUpperCase()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(payment.status)}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-dark-100 text-nowrap">
                        {formatDate(payment.createdAt, "MMM d, yyyy")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}