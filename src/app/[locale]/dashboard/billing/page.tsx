"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Link } from "@/i18n/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/toast"
import { cn, formatDate, formatNumber } from "@/lib/utils"
import {
  CreditCard,
  Check,
  X,
  ArrowUp,
  FileText,
  Download,
  AlertCircle,
  Zap,
  Building2,
  Infinity,
  Loader2,
  ExternalLink,
  Database,
} from "lucide-react"
import { useTranslations } from "next-intl"

type Plan = "FREE" | "PRO" | "BUSINESS" | "ENTERPRISE"
type Interval = "monthly" | "annual"

interface PlanFeature {
  text: string
  included: boolean
}

interface PlanData {
  id: Plan
  name: string
  price: string
  interval: string
  icon: React.ReactNode
  features: PlanFeature[]
  highlighted?: boolean
}

interface SubscriptionData {
  id: string
  plan: Plan
  status: string
  currentPeriodEnd: string | null
  currentPeriodStart: string | null
  canceledAt: string | null
  gateway: string | null
  paddleCustomerId: string | null
}

interface BillingData {
  subscription: SubscriptionData | null
  linkCount: number
  clickCount: number
}

function getPaddlePriceId(plan: Plan, interval: Interval): string {
  if (plan === "PRO") {
    return interval === "annual"
      ? (process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_ANNUAL ?? "")
      : (process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO ?? "")
  }
  if (plan === "BUSINESS") {
    return interval === "annual"
      ? (process.env.NEXT_PUBLIC_PADDLE_PRICE_BUSINESS_ANNUAL ?? "")
      : (process.env.NEXT_PUBLIC_PADDLE_PRICE_BUSINESS ?? "")
  }
  if (plan === "ENTERPRISE") {
    return interval === "annual"
      ? (process.env.NEXT_PUBLIC_PADDLE_PRICE_ENTERPRISE_ANNUAL ?? "")
      : (process.env.NEXT_PUBLIC_PADDLE_PRICE_ENTERPRISE ?? "")
  }
  return ""
}

const planLimits: Record<string, { links: number; clicks: number }> = {
  FREE: { links: 50, clicks: 1000 },
  PRO: { links: 1000, clicks: 10000 },
  BUSINESS: { links: 10000, clicks: 100000 },
  ENTERPRISE: { links: 999999, clicks: 9999999 },
}

interface Invoice {
  id: string
  date: Date
  amount: number
  status: "paid" | "failed" | "pending"
  pdfUrl: string
}

export default function BillingPage() {
  const t = useTranslations("dashboard.billing")
  const [data, setData] = useState<BillingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [upgrading, setUpgrading] = useState<string | null>(null)
  const [managing, setManaging] = useState(false)
  const gateway = "paddle"
  const [interval, setInterval] = useState<Interval>("monthly")
  const [paddle, setPaddle] = useState<Awaited<ReturnType<typeof import("@paddle/paddle-js").initializePaddle>> | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [invoicesLoading, setInvoicesLoading] = useState(true)
  const { addToast } = useToast()
  const searchParams = useSearchParams()
  const planRef = useRef<HTMLDivElement>(null)

  const freeFeatures: string[] = t.raw("planFeatures.free")
  const proFeatures: string[] = t.raw("planFeatures.pro")
  const businessFeatures: string[] = t.raw("planFeatures.business")
  const enterpriseFeatures: string[] = t.raw("planFeatures.enterprise")

  const plans: PlanData[] = [
    {
      id: "FREE",
      name: t("planNames.free"),
      price: "$0",
      interval: t("priceIntervals.forever"),
      icon: <Zap className="h-5 w-5 text-dark-100" />,
      features: freeFeatures.map((text, i) => ({ text, included: i < 4 })),
    },
    {
      id: "PRO",
      name: t("planNames.pro"),
      price: "$29",
      interval: t("priceIntervals.perMonth"),
      icon: <Zap className="h-5 w-5 text-primary-500" />,
      highlighted: true,
      features: proFeatures.map((text, i) => ({ text, included: i < 6 })),
    },
    {
      id: "BUSINESS",
      name: t("planNames.business"),
      price: "$99",
      interval: t("priceIntervals.perMonth"),
      icon: <Building2 className="h-5 w-5 text-blue-400" />,
      features: businessFeatures.map((text) => ({ text, included: true })),
    },
    {
      id: "ENTERPRISE",
      name: t("planNames.enterprise"),
      price: t("custom"),
      interval: t("priceIntervals.contactUs"),
      icon: <Infinity className="h-5 w-5 text-purple-400" />,
      features: enterpriseFeatures.map((text) => ({ text, included: true })),
    },
  ]

  useEffect(() => {
    async function initPaddle() {
      const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
      if (!clientToken) return
      try {
        const { initializePaddle } = await import("@paddle/paddle-js")
        const instance = await initializePaddle({
          token: clientToken,
          environment: (process.env.NEXT_PUBLIC_PADDLE_ENV as "sandbox" | "production") ?? "sandbox",
        })
        setPaddle(instance)
      } catch {
        // Paddle SDK failed to load - Paddle checkout won't be available
      }
    }
    initPaddle()
  }, [])

  useEffect(() => {
    const plan = searchParams.get("plan")
    if (plan && planRef.current) {
      setTimeout(() => {
        planRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 500)
    }
  }, [searchParams])

  const fetchSubscription = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/billing/subscription")
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? t("toast.fetchFailed"))
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("toast.genericError"))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    fetchSubscription()
  }, [fetchSubscription])

  const currentPlan: Plan = data?.subscription?.plan ?? "FREE"

  const fetchInvoices = useCallback(async () => {
    try {
      const res = await fetch("/api/billing/invoices")
      const json = await res.json()
      if (res.ok && json.invoices) {
        setInvoices(json.invoices.map((inv: { id: string; amount: number; currency: string; status: string; pdfUrl: string | null; paidAt: string | null; createdAt: string }) => ({
          ...inv,
          date: new Date(inv.paidAt ?? inv.createdAt),
          status: inv.status.toLowerCase() as "paid" | "failed" | "pending",
        })))
      }
    } catch {
      // silently fail
    } finally {
      setInvoicesLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  const handleUpgrade = async (planId: Plan) => {
    const priceId = getPaddlePriceId(planId, interval)
    if (!priceId || !paddle) {
      addToast(t("toast.pricingNotConfigured"), "error")
      return
    }
    let userId = ""
    try {
      const sessionRes = await fetch("/api/auth/session")
      const session = await sessionRes.json()
      userId = session?.user?.id ?? ""
    } catch {}
    setUpgrading(planId)
    try {
      await paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customData: { userId, plan: planId },
        settings: { displayMode: "overlay", theme: "dark" },
      })
      fetchSubscription()
    } catch (err) {
      addToast(err instanceof Error ? err.message : t("toast.upgradeFailed"), "error")
    } finally {
      setUpgrading(null)
    }
  }

  const handleManageSubscription = async () => {
    setManaging(true)
    try {
      const res = await fetch("/api/billing/paddle-portal", { method: "POST" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? t("toast.portalFailed"))
      if (json.url) {
        window.location.href = json.url
      }
    } catch (err) {
      addToast(err instanceof Error ? err.message : t("toast.portalFailed"), "error")
    } finally {
      setManaging(false)
    }
  }

  function getStatusBadge(status: string | undefined) {
    switch (status) {
      case "ACTIVE": return <Badge variant="success">{t("status.active")}</Badge>
      case "CANCELED": return <Badge variant="secondary">{t("status.canceled")}</Badge>
      case "PAST_DUE": return <Badge variant="destructive">{t("status.pastDue")}</Badge>
      case "EXPIRED": return <Badge variant="secondary">{t("status.expired")}</Badge>
      default: return <Badge variant="secondary">{t("status.unknown")}</Badge>
    }
  }

  const planIndex = ["FREE", "PRO", "BUSINESS", "ENTERPRISE"]

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
        <Button variant="outline" onClick={fetchSubscription}>{t("error.retry")}</Button>
      </div>
    )
  }

  const limits = planLimits[currentPlan] ?? planLimits.FREE
  const linkUsed = data?.linkCount ?? 0
  const clickUsed = data?.clickCount ?? 0
  const linkPct = Math.min((linkUsed / limits.links) * 100, 100)
  const clickPct = Math.min((clickUsed / limits.clicks) * 100, 100)

  const hasActiveSubscription = data?.subscription?.paddleCustomerId != null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-50">{t("title")}</h1>
          <p className="mt-1 text-sm text-dark-100">{t("description")}</p>
        </div>
        {hasActiveSubscription && (
          <Button variant="outline" onClick={handleManageSubscription} disabled={managing}>
            {managing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ExternalLink className="mr-2 h-4 w-4" />}
            {t("manageSubscription")}
          </Button>
        )}
      </div>

      {currentPlan !== "FREE" && data?.subscription && (
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-dark-100">{t("currentPlan")}</p>
                <p className="text-lg font-semibold text-dark-50">{t("planNames." + currentPlan.toLowerCase())}</p>
              </div>
              {getStatusBadge(data.subscription.status)}
              {data.subscription.currentPeriodEnd && (
                <div className="text-sm text-dark-100">
                  {t("renews", { date: formatDate(new Date(data.subscription.currentPeriodEnd), "MMM d, yyyy") })}
                </div>
              )}
              <Badge variant="secondary">PADDLE</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-3 rounded-xl border border-dark-100/30 bg-dark-600/50 p-3">
        <span className="text-sm text-dark-200">{t("billingInterval")}</span>
        <div className="relative flex rounded-lg bg-dark-700 p-0.5">
          <div className={cn(
            "absolute top-0.5 h-[calc(100%-4px)] w-[calc(50%-2px)] rounded-md bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20 transition-all duration-300",
            interval === "annual" ? "translate-x-full" : "translate-x-0"
          )} />
          <button
            type="button"
            onClick={() => setInterval("monthly")}
            className="relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors z-10"
          >
            <span className={interval === "monthly" ? "text-white" : "text-dark-200 hover:text-dark-50"}>
              {t("monthly")}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setInterval("annual")}
            className="relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors z-10"
          >
            <span className={interval === "annual" ? "text-white" : "text-dark-200 hover:text-dark-50"}>
              {t("annual")}
            </span>
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id
          const isUpgrade = planIndex.indexOf(plan.id) > planIndex.indexOf(currentPlan)
          const isTarget = searchParams.get("plan") === plan.id

          return (
            <Card
              key={plan.id}
              ref={isTarget ? planRef : undefined}
              className={cn(
                "relative scroll-mt-24 flex flex-col transition-all duration-300 hover:translate-y-[-2px]",
                plan.highlighted
                  ? "border-primary-500/60 shadow-lg shadow-primary/10"
                  : "border-dark-100/30 hover:border-dark-100/60",
                isCurrent && "ring-2 ring-emerald-500/60 shadow-lg shadow-emerald-500/10",
                isTarget && "ring-2 ring-yellow-400/60 animate-pulse"
              )}
            >
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <Badge variant="success" className="shadow-lg shadow-emerald-500/20">{t("currentPlanBadge")}</Badge>
                </div>
              )}
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={cn(
                    "rounded-lg p-2",
                    plan.id === "PRO" ? "bg-primary/10" :
                    plan.id === "BUSINESS" ? "bg-blue-500/10" :
                    plan.id === "ENTERPRISE" ? "bg-purple-500/10" :
                    "bg-dark-300"
                  )}>
                    {plan.icon}
                  </div>
                  {plan.highlighted && !isCurrent && (
                    <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">{t("popularBadge")}</Badge>
                  )}
                </div>
                <CardTitle className="mt-3 text-dark-50">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-dark-50">{plan.price}</span>
                  <span className="text-sm text-dark-200">/{plan.interval}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2.5">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      {feat.included ? (
                        <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-dark-100 shrink-0" />
                      )}
                      <span className={feat.included ? "text-dark-50" : "text-dark-100"}>
                        {feat.text}
                      </span>
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <Button variant="outline" className="w-full" disabled>
                    {t("currentPlanButton")}
                  </Button>
                ) : plan.id === "FREE" ? null : plan.id === "ENTERPRISE" ? (
                  <Link href="/contact">
                    <Button variant="outline" className="w-full">
                      {t("contactSales")}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant={isUpgrade ? "primary" : "outline"}
                    className="w-full"
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={upgrading === plan.id || !paddle}
                  >
                    {upgrading === plan.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowUp className="mr-2 h-4 w-4" />
                    )}
                    {t("upgrade")}
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-dark-100" />
              <div>
                <CardTitle className="text-lg">{t("paymentMethod.title")}</CardTitle>
                <CardDescription>{t("paymentMethod.description")}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-dark-100 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-dark-300 p-2">
                  <Database className="h-5 w-5 text-dark-100" />
                </div>
                <div>
                  <p className="text-sm font-medium text-dark-50 capitalize">Paddle</p>
                  <p className="text-xs text-dark-100">
                    {t("paymentMethod.paddleInfo")}
                  </p>
                </div>
              </div>
              <Badge variant="success">{t("paymentMethod.defaultBadge")}</Badge>
            </div>
            {hasActiveSubscription && (
              <Button variant="outline" size="sm" onClick={handleManageSubscription} disabled={managing}>
                <CreditCard className="mr-2 h-4 w-4" />
                {t("paymentMethod.update")}
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-dark-100" />
              <div>
                <CardTitle className="text-lg">{t("usageLimits.title")}</CardTitle>
                <CardDescription>
                  {t("usageLimits.description", {
                    plan: t("planNames." + currentPlan.toLowerCase()),
                    links: limits.links >= 999999 ? t("unlimited") : formatNumber(limits.links),
                    clicks: limits.clicks >= 9999999 ? t("unlimited") : formatNumber(limits.clicks),
                  })}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-dark-50">{t("usageLimits.links")}</span>
                <span className="text-dark-100">
                  {formatNumber(linkUsed)} / {limits.links >= 999999 ? t("unlimited") : formatNumber(limits.links)}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-dark-700">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700 ease-out",
                    linkPct > 80 ? "bg-gradient-to-r from-orange-400 to-red-500" : "bg-gradient-to-r from-primary to-accent"
                  )}
                  style={{ width: `${linkPct}%` }}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-dark-50">{t("usageLimits.clicks")}</span>
                <span className="text-dark-100">
                  {formatNumber(clickUsed)} / {limits.clicks >= 9999999 ? t("unlimited") : formatNumber(limits.clicks)}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-dark-700">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700 ease-out",
                    clickPct > 80 ? "bg-gradient-to-r from-orange-400 to-red-500" : "bg-gradient-to-r from-blue-400 to-purple-500"
                  )}
                  style={{ width: `${clickPct}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-dark-100" />
            <div>
              <CardTitle className="text-lg">{t("billingHistory.title")}</CardTitle>
              <CardDescription>{t("billingHistory.description")}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {invoicesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-dark-100" />
            </div>
          ) : invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="h-8 w-8 text-dark-100 mb-3" />
              <p className="text-sm text-dark-100">{t("billingHistory.empty") || "No invoices yet"}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("billingHistory.date")}</TableHead>
                    <TableHead>{t("billingHistory.amount")}</TableHead>
                    <TableHead>{t("billingHistory.status")}</TableHead>
                    <TableHead className="text-right">{t("billingHistory.invoice")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="text-dark-50 text-nowrap">
                        {formatDate(inv.date, "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-dark-50 font-medium">
                        ${(inv.amount / 100).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={inv.status === "paid" ? "success" : inv.status === "failed" ? "destructive" : "secondary"}>
                          {inv.status === "paid" ? t("billingHistory.paid") : inv.status === "failed" ? t("billingHistory.failed") : inv.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {inv.pdfUrl ? (
                          <a href={inv.pdfUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm">
                              <Download className="mr-2 h-4 w-4" />
                              {t("billingHistory.pdf")}
                            </Button>
                          </a>
                        ) : (
                          <span className="text-xs text-dark-100">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
