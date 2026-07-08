"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Link } from "@/i18n/navigation"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, PieChart as PieChartComponent, BarChart as BarChartComponent } from "@/components/ui/chart"
import { StatCard } from "@/components/ui/stat-card"
import { SectionHeader } from "@/components/ui/section-header"
import { SkeletonStats, SkeletonCard, SkeletonChart, SkeletonTable, LoadingSpinner } from "@/components/ui/loading"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { UpgradePrompt, PlanBadge, UsageBar } from "@/components/upgrade-prompt"
import { formatDate, formatNumber } from "@/lib/utils"
import { AIChat } from "@/components/dashboard/ai-chat"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { WeeklyInsights } from "@/components/dashboard/weekly-insights"
import {
  Link2,
  MousePointerClick,
  Activity,
  CalendarDays,
  Plus,
  BarChart3,
  ExternalLink,
  Crown,
  AlertCircle,
  Globe,
  Smartphone,
  Monitor,
  TrendingUp,
  Zap,
  Download,
  Share2,
  QrCode,
  ArrowUpRight,
} from "lucide-react"
interface ClickByDay {
  date: string
  clicks: number
}

interface AnalyticsData {
  clicks: number
  uniqueVisitors: number
  totalLinks: number
  clicksByDay: ClickByDay[]
  referrers: { source: string; count: number }[]
  countries: { country: string; count: number }[]
  browsers: { browser: string; count: number }[]
  devices: { device: string; count: number }[]
  os: { os: string; count: number }[]
  topLink: { url: string; slug: string; clicks: number } | null
}

interface LinkItem {
  id: string
  url: string
  slug: string
  clicks: number
  createdAt: string
  isActive: boolean
}

interface LinkResponse {
  links: LinkItem[]
  total: number
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

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [linksData, setLinksData] = useState<LinkResponse | null>(null)
  const [activeLinksCount, setActiveLinksCount] = useState<number>(0)
  const [planData, setPlanData] = useState<PlanData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  const fetchAllData = useCallback(() => {
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

        setAnalytics(analyticsJson)
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
  }, [])

  useEffect(() => {
    if (status === "authenticated") {
      fetchAllData()
    }
  }, [status, fetchAllData])

  useEffect(() => {
    if (!session?.user?.id) return

    const eventSource = new EventSource(`/api/analytics/live?userId=${session.user.id}`)

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "click") {
        fetchAllData()
      }
    }

    eventSource.onerror = () => {
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [session?.user?.id])

  function getClicksToday(): number {
    if (!analytics?.clicksByDay?.length) return 0
    const today = new Date().toISOString().slice(0, 10)
    const todayEntry = analytics.clicksByDay.find((d) => d.date === today)
    return todayEntry?.clicks ?? 0
  }

  const chartData =
    analytics?.clicksByDay?.map((d) => ({
      date: formatDate(d.date, "MMM d"),
      clicks: d.clicks,
    })) ?? []

  const displayName = session?.user?.name?.split(" ")[0] ?? "User"

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <SectionHeader title="Dashboard" description="An overview of your link performance" />
        <ErrorState
          title="Failed to load dashboard data"
          message={error}
          onRetry={fetchAllData}
        />
      </div>
    )
  }

  if (!loading && !analytics && !linksData) {
    return (
      <div className="space-y-8 animate-fade-in">
        <SectionHeader title="Dashboard" description="An overview of your link performance" />
        <EmptyState
          icon={<AlertCircle className="h-6 w-6" />}
          title="No data available"
          description="Create your first link to see your dashboard come to life."
                  action={{ label: "Create Link", onClick: () => router.push("/dashboard/links/new") }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="animate-fade-in-up">
          <h1 className="text-2xl font-bold text-dark-50">
            Welcome back, {displayName}
          </h1>
          <p className="mt-1 text-sm text-dark-100">
            Here&apos;s what&apos;s happening with your links today.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 animate-fade-in-up">
          {planData && (
            <PlanBadge plan={planData.plan} />
          )}
          <Link href="/dashboard/links/new">
            <Button size="sm" className="bg-accent hover:bg-accent/90">
              <Plus className="mr-1 h-4 w-4" />
              Create Link
            </Button>
          </Link>
          <Link href="/dashboard/analytics">
            <Button variant="outline" size="sm">
              <BarChart3 className="mr-1 h-4 w-4" />
              Analytics
            </Button>
          </Link>
          <Link href="/dashboard/links">
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-1 h-4 w-4" />
              Links
            </Button>
          </Link>
          {planData?.plan === "FREE" && (
            <Link href="/pricing">
              <Button size="sm" variant="primary">
                <Crown className="mr-1 h-4 w-4" />
                Upgrade
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Plan Usage Section */}
      {planData && planData.plan === "FREE" && (
        <div className="rounded-xl border border-[#2FA084]/30 bg-dark-500 p-4 shadow-lg animate-fade-in-up">
          <div className="flex items-center gap-2 mb-3">
            <Crown className="h-4 w-4 text-accent" />
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
        </div>
      )}

      {/* KPI Cards */}
      {loading ? (
        <SkeletonStats />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in-up">
          <StatCard
            icon={<Link2 className="h-5 w-5" />}
            label="Total Links"
            value={formatNumber(linksData?.total ?? 0)}
            trend={{ value: 0, positive: true }}
          />
          <StatCard
            icon={<MousePointerClick className="h-5 w-5" />}
            label="Total Clicks"
            value={formatNumber(analytics?.clicks ?? 0)}
            trend={{ value: 0, positive: true }}
          />
          <StatCard
            icon={<Activity className="h-5 w-5" />}
            label="Active Links"
            value={formatNumber(activeLinksCount)}
            trend={{ value: 0, positive: true }}
          />
          <StatCard
            icon={<CalendarDays className="h-5 w-5" />}
            label="Clicks Today"
            value={formatNumber(getClicksToday())}
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in-up">
        <Link href="/dashboard/links/new" className="group flex items-center gap-3 rounded-xl border border-dark-100 bg-dark-500 p-4 hover:border-accent/50 hover:bg-dark-400 transition-all shadow-lg">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-accent/20">
            <Plus className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-dark-50">Create Link</p>
            <p className="text-xs text-dark-100">Shorten a URL</p>
          </div>
          <ArrowUpRight className="ml-auto h-4 w-4 text-dark-100 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
        <Link href="/dashboard/qrcodes" className="group flex items-center gap-3 rounded-xl border border-dark-100 bg-dark-500 p-4 hover:border-accent/50 hover:bg-dark-400 transition-all shadow-lg">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20">
            <QrCode className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-dark-50">QR Code</p>
            <p className="text-xs text-dark-100">Generate instantly</p>
          </div>
          <ArrowUpRight className="ml-auto h-4 w-4 text-dark-100 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
        <Link href="/dashboard/analytics" className="group flex items-center gap-3 rounded-xl border border-dark-100 bg-dark-500 p-4 hover:border-accent/50 hover:bg-dark-400 transition-all shadow-lg">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500 group-hover:bg-purple-500/20">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-dark-50">Analytics</p>
            <p className="text-xs text-dark-100">View reports</p>
          </div>
          <ArrowUpRight className="ml-auto h-4 w-4 text-dark-100 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
        <Link href="/dashboard/utm-builder" className="group flex items-center gap-3 rounded-xl border border-dark-100 bg-dark-500 p-4 hover:border-accent/50 hover:bg-dark-400 transition-all shadow-lg">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500 group-hover:bg-orange-500/20">
            <Share2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-dark-50">UTM Builder</p>
            <p className="text-xs text-dark-100">Tag your links</p>
          </div>
          <ArrowUpRight className="ml-auto h-4 w-4 text-dark-100 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Click Activity Chart */}
        {loading ? (
          <SkeletonChart />
        ) : (
          <div className="lg:col-span-2 rounded-xl border border-dark-100 bg-dark-500 p-6 shadow-lg animate-fade-in-up">
            <SectionHeader
              title="Click Activity"
              description="Last 7 days"
            />
            <div className="mt-4">
              {chartData.length > 0 ? (
                <LineChart data={chartData} xKey="date" yKey="clicks" />
              ) : (
                <div className="flex h-[300px] items-center justify-center text-sm text-dark-100">
                  No click data available
                </div>
              )}
            </div>
          </div>
        )}

        {/* Activity Feed */}
        <div className="lg:row-span-2 space-y-4">
          <ActivityFeed />
          <WeeklyInsights />
        </div>

        {/* Recent Links */}
        {loading ? (
          <div className="lg:col-span-2 rounded-xl border border-dark-100 bg-dark-500 p-6 shadow-lg">
            <SkeletonCard />
          </div>
        ) : (
          <div className="lg:col-span-2 rounded-xl border border-dark-100 bg-dark-500 p-6 shadow-lg animate-fade-in-up">
            <SectionHeader
              title="Recent Links"
              description="Your last 5 links"
              action={
                <Link href="/dashboard/links">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              }
            />
            <div className="mt-4">
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
                    {linksData.links.map((link: LinkItem) => (
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
                <EmptyState
                  title="No links yet"
                  description="Create your first link to get started."
          action={{ label: "Create Link", onClick: () => router.push("/dashboard/links/new") }}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Analytics Charts Row */}
      {!loading && analytics && (
        <div className="grid gap-6 lg:grid-cols-2 animate-fade-in-up">
          {/* Top Referrers */}
          <div className="rounded-xl border border-dark-100 bg-dark-500 p-6 shadow-lg">
            <SectionHeader title="Traffic Sources" description="Top referrers" />
            <div className="mt-4">
              {analytics.referrers && analytics.referrers.length > 0 ? (
                <PieChartComponent
                  data={analytics.referrers.slice(0, 6).map((r) => ({ name: r.source === "direct" ? "Direct" : r.source, value: r.count }))}
                  showLegend
                  innerRadius={50}
                />
              ) : (
                <div className="flex h-[300px] items-center justify-center text-sm text-dark-100">No referrer data yet</div>
              )}
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="rounded-xl border border-dark-100 bg-dark-500 p-6 shadow-lg">
            <SectionHeader title="Devices" description="By device type" />
            <div className="mt-4">
              {analytics.devices && analytics.devices.length > 0 ? (
                <BarChartComponent
                  data={analytics.devices.map((d) => ({ name: d.device === "desktop" ? "Desktop" : d.device === "mobile" ? "Mobile" : d.device === "tablet" ? "Tablet" : d.device, value: d.count }))}
                  xKey="name"
                  yKey="value"
                  color="#14b8a6"
                />
              ) : (
                <div className="flex h-[300px] items-center justify-center text-sm text-dark-100">No device data yet</div>
              )}
            </div>
          </div>

          {/* Top Countries */}
          <div className="rounded-xl border border-dark-100 bg-dark-500 p-6 shadow-lg">
            <SectionHeader title="Top Countries" description="By click location" />
            <div className="mt-4">
              {analytics.countries && analytics.countries.length > 0 ? (
                <div className="space-y-3">
                  {analytics.countries.slice(0, 8).map((c, i) => (
                    <div key={c.country} className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-dark-300 text-xs font-medium text-dark-50">{i + 1}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-dark-50">{c.country}</span>
                          <span className="text-xs text-dark-100">{formatNumber(c.count)} clicks</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-dark-300 overflow-hidden">
                          <div className="h-full rounded-full bg-accent" style={{ width: `${(c.count / Math.max(...analytics.countries.map((x) => x.count))) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-[300px] items-center justify-center text-sm text-dark-100">No country data yet</div>
              )}
            </div>
          </div>

          {/* Top Browsers */}
          <div className="rounded-xl border border-dark-100 bg-dark-500 p-6 shadow-lg">
            <SectionHeader title="Browsers" description="By browser type" />
            <div className="mt-4">
              {analytics.browsers && analytics.browsers.length > 0 ? (
                <BarChartComponent
                  data={analytics.browsers.map((b) => ({ name: b.browser, value: b.count }))}
                  xKey="name"
                  yKey="value"
                  color="#8b5cf6"
                />
              ) : (
                <div className="flex h-[300px] items-center justify-center text-sm text-dark-100">No browser data yet</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Top Performing Links */}
      {!loading && linksData?.links && linksData.links.length > 0 && (
        <div className="rounded-xl border border-dark-100 bg-dark-500 p-6 shadow-lg animate-fade-in-up">
          <SectionHeader
            title="Top Performing Links"
            description="Sorted by clicks"
            action={
              <Link href="/dashboard/links">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            }
          />
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Short URL</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...linksData.links]
                  .sort((a: LinkItem, b: LinkItem) => b.clicks - a.clicks)
                  .slice(0, 5)
                  .map((link: LinkItem, i: number) => (
                    <TableRow key={link.id}>
                      <TableCell>
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-dark-300 text-xs font-bold text-dark-50">
                          {i + 1}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-dark-50">{link.slug}</p>
                          <p className="truncate text-xs text-dark-100">{link.url}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-dark-50 font-medium">{formatNumber(link.clicks)}</TableCell>
                      <TableCell>
                        <Badge variant={link.isActive ? "success" : "destructive"}>
                          {link.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-dark-100">{formatDate(link.createdAt, "MMM d")}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <AIChat />
    </div>
  )
}