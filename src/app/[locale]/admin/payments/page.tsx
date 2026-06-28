"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate, formatNumber } from "@/lib/utils"
import { CreditCard, DollarSign, TrendingUp, Users, ChevronLeft, ChevronRight } from "lucide-react"

interface PaymentData {
  id: string
  amount: number
  currency: string
  status: string
  createdAt: string
  user: { id: string; name: string | null; email: string } | null
  subscription: { plan: string } | null
}

interface PaymentStats {
  totalRevenue: number
  totalPayments: number
  pendingPayments: number
  failedPayments: number
  revenueByMonth: { month: string; revenue: number }[]
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentData[]>([])
  const [stats, setStats] = useState<PaymentStats | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const limit = 20

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) })
      const [paymentsRes, statsRes] = await Promise.all([
        fetch(`/api/admin/payments?${params}`),
        fetch("/api/admin/payments/stats"),
      ])

      if (paymentsRes.ok) {
        const data = await paymentsRes.json()
        setPayments(data.data.payments)
        setTotal(data.data.total)
      }
      if (statsRes.ok) {
        const data = await statsRes.json()
        setStats(data.data)
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchData()
  }, [fetchData])

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

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-dark-50">Payments</h1>
        <p className="mt-1 text-sm text-dark-100">Manage subscriptions and payment history</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="rounded-lg bg-dark-300 p-3 w-fit">
              <DollarSign className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="mt-4">
              <p className="text-sm text-dark-100">Total Revenue</p>
              {loading ? (
                <Skeleton className="mt-1 h-8 w-24" />
              ) : (
                <p className="text-2xl font-bold text-dark-50">
                  ${((stats?.totalRevenue ?? 0) / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="rounded-lg bg-dark-300 p-3 w-fit">
              <TrendingUp className="h-5 w-5 text-primary-500" />
            </div>
            <div className="mt-4">
              <p className="text-sm text-dark-100">Total Payments</p>
              {loading ? (
                <Skeleton className="mt-1 h-8 w-16" />
              ) : (
                <p className="text-2xl font-bold text-dark-50">{formatNumber(stats?.totalPayments ?? 0)}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="rounded-lg bg-dark-300 p-3 w-fit">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <div className="mt-4">
              <p className="text-sm text-dark-100">Pending Payments</p>
              {loading ? (
                <Skeleton className="mt-1 h-8 w-16" />
              ) : (
                <p className="text-2xl font-bold text-dark-50">{formatNumber(stats?.pendingPayments ?? 0)}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="rounded-lg bg-dark-300 p-3 w-fit">
              <CreditCard className="h-5 w-5 text-purple-400" />
            </div>
            <div className="mt-4">
              <p className="text-sm text-dark-100">Failed Payments</p>
              {loading ? (
                <Skeleton className="mt-1 h-8 w-16" />
              ) : (
                <p className="text-2xl font-bold text-dark-50">{formatNumber(stats?.failedPayments ?? 0)}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Payments</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : payments.length === 0 ? (
            <p className="text-sm text-dark-100">No payments recorded yet.</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="text-dark-50">
                        {payment.user?.name ?? payment.user?.email ?? "Deleted user"}
                      </TableCell>
                      <TableCell className="text-dark-50 font-medium">
                        ${(payment.amount / 100).toFixed(2)} {payment.currency.toUpperCase()}
                      </TableCell>
                      <TableCell className="text-dark-100">
                        {payment.subscription?.plan ?? "—"}
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
