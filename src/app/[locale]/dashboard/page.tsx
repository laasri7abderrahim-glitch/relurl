"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate, formatNumber } from "@/lib/utils"
import { UpgradePrompt, PlanBadge, UsageBar } from "@/components/upgrade-prompt"
import {
  Link2,
  MousePointerClick,
  Activity,
  CalendarDays,
  ArrowUpRight,
  Crown,
} from "lucide-react"

interface ClickOverTime {
  date: string
  clicks: number
  uniqueClicks: number
}

interface Link {
  id: string
  url: string
  slug: string
  clicks: number
  createdAt: string
  isActive: boolean
}

interface PlanData {
  plan: string
  limits: {
    maxLinks: number
    maxClicks: number
  }
  usage: {
    links: { current: number; max: number }
    clicks: { current: number; max: number }
    totalLinks: number
    totalClicksThisMonth: number
  }
}

function StatCard({ icon, label, value, trend }: { icon: React.ReactNode; label: string; value: string; trend?: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="rounded-lg bg-dark-300 p-3">{icon}</div>
          {trend && (
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
              <ArrowUpRight className="h-3 w-3" />
              {trend}
            </span>
          )}
        </div>
        <div className="mt-4">
          <p className="text-sm text-dark-100">{label}</p>
          <p className="text-2xl font-bold text-dark-50">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [analytics, setAnalytics] = useState<{
    totalClicks: number
    clicksOverTime: ClickOverTime[]
  } | null>(null)
  const [linksData, setLinksData] = useState<{ links: Link[]; total: number } | null>(null)
  const [activeLinksCount, setActiveLinksCount] = useState(0)
  const [planData, setPlanData] = useState<PlanData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  function fetchAllData() {
    setLoading(true)
    setError(null)

    Promise.all([
      fetch("/api/analytics?period=7d"),
      fetch("/api/links?limit=5"),
      fetch("/api/links?limit=1&isActive=true"),
      fetch("/api/user/plan"),
    ])
      .then(async ([analyticsRes, linksRes, activeLinksRes, planRes]) => {
        if (!analyticsRes.ok || !linksRes.ok || !activeLinksRes.ok) {
          throw new Error("Failed to fetch dashboard data")
        }
        const [analyticsJson, linksJson, activeLinksJson] = await Promise.all([
          analyticsRes.json(),
          linksRes.json(),
          activeLinksRes.json(),
        ])
        if (analyticsJson.error) throw new Error(analyticsJson.error)
        if (linksJson.error) throw new Error(linksJson.error)
        if (activeLinksJson.error) throw new Error(activeLinksJson.error)
        setAnalytics(analyticsJson.data)
        setLinksData(linksJson.data)
        setActiveLinksCount(activeLinksJson.data.total)
        if (planRes.ok) {
          const planJson = await planRes.json()
          setPlanData(planJson)
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "An error occurred")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (status === "authenticated") {
      fetchAllData()
    }
  }, [status])

  function getClicksToday(): number {
    if (!analytics?.clicksOverTime?.length) return 0
    const today = new Date().toISOString().slice(0, 10)
    const todayEntry = analytics.clicksOverTime.find((d) => d.date === today)
    return todayEntry?.clicks ?? 0
  }

  const chartData =
    analytics?.clicksOverTime?.map((d) => ({
      date: formatDate(d.date, "MMM d"),
      clicks: d.clicks,
    })) ?? []

  const displayName =
    session?.user?.name?.split(" ")[0] ?? "User"

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F6F5F]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-dark-50">Dashboard</h1>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <p className="mb-2 text-red-400">Failed to load dashboard data</p>
            <p className="mb-4 text-sm text-dark-100">{error}</p>
            <Button onClick={fetchAllData} variant="outline">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-50">
            Welcome back, {displayName}
          </h1>
          <p className="mt-1 text-sm text-dark-100">
            Here&apos;s what&apos;s happening with your links today.
          </p>
        </div>
        {planData && (
          <div className="flex items-center gap-2">
            <PlanBadge plan={planData.plan} />
            {planData.plan === "FREE" && (
              <Link href="/pricing">
                <Button size="sm" className="bg-[#1F6F5F] hover:bg-[#2FA084]">
                  <Crown className="mr-1 h-3 w-3" />
                  Upgrade
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>

      {planData && planData.plan === "FREE" && (
        <Card className="border-[#2FA084]/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="h-4 w-4 text-[#2FA084]" />
              <span className="font-medium text-dark-50">Plan Usage</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <UsageBar
                label="Links"
                current={planData.usage.links.current}
                max={planData.usage.links.max}
              />
              <UsageBar
                label="Clicks (this month)"
                current={planData.usage.clicks.current}
                max={planData.usage.clicks.max}
              />
            </div>
            {(planData.usage.links.current >= planData.usage.links.max * 0.8 ||
              planData.usage.clicks.current >= planData.usage.clicks.max * 0.8) && (
              <div className="mt-3">
                <UpgradePrompt
                  plan={planData.plan}
                  feature={planData.usage.links.current >= planData.usage.links.max * 0.8 ? "links" : "clicks"}
                  current={planData.usage.links.current >= planData.usage.links.max * 0.8
                    ? planData.usage.links.current
                    : planData.usage.clicks.current}
                  max={planData.usage.links.current >= planData.usage.links.max * 0.8
                    ? planData.usage.links.max
                    : planData.usage.clicks.max}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="mt-4 space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <StatCard
              icon={<Link2 className="h-5 w-5 text-primary-500" />}
              label="Total Links"
              value={formatNumber(linksData?.total ?? 0)}
            />
            <StatCard
              icon={<MousePointerClick className="h-5 w-5 text-blue-400" />}
              label="Total Clicks"
              value={formatNumber(analytics?.totalClicks ?? 0)}
            />
            <StatCard
              icon={<Activity className="h-5 w-5 text-emerald-400" />}
              label="Active Links"
              value={formatNumber(activeLinksCount)}
            />
            <StatCard
              icon={<CalendarDays className="h-5 w-5 text-purple-400" />}
              label="Clicks Today"
              value={formatNumber(getClicksToday())}
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {loading ? (
          <>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="mt-1 h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <Skeleton className="h-6 w-28" />
                  <Skeleton className="mt-1 h-4 w-24" />
                </div>
                <Skeleton className="h-9 w-20" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Click Activity</CardTitle>
                <p className="text-sm text-dark-100">Last 7 days</p>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
                  <LineChart data={chartData} xKey="date" yKey="clicks" />
                ) : (
                  <div className="flex h-[300px] items-center justify-center text-sm text-dark-100">
                    No click data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Recent Links</CardTitle>
                  <p className="text-sm text-dark-100">Your last 5 links</p>
                </div>
                <Link href="/dashboard/links">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </CardHeader>
              <CardContent>
                {linksData?.links?.length ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Short URL</TableHead>
                        <TableHead>Clicks</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {linksData.links.map((link: Link) => (
                        <TableRow key={link.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Link2 className="h-4 w-4 shrink-0 text-dark-100" />
                              <div className="min-w-0">
                                <p className="truncate font-medium text-dark-50">
                                  {link.slug}
                                </p>
                                <p className="truncate text-xs text-dark-100">
                                  {link.url}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-dark-50">{formatNumber(link.clicks)}</TableCell>
                          <TableCell className="text-dark-100">{formatDate(link.createdAt, "MMM d")}</TableCell>
                          <TableCell>
                            <Badge variant={link.isActive ? "success" : "destructive"}>
                              {link.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="py-8 text-center text-sm text-dark-100">
                    No links yet. Create your first link to get started.
                  </p>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
