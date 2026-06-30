"use client"

import { useState, useEffect, useCallback } from "react"
import { Link } from "@/i18n/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/toast"
import { formatDate, formatNumber } from "@/lib/utils"
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
} from "lucide-react"
import { useTranslations } from "next-intl"

type Plan = "FREE" | "PRO" | "BUSINESS" | "ENTERPRISE"

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
  stripeCustomerId: string | null
  canceledAt: string | null
}

interface BillingData {
  subscription: SubscriptionData | null
  linkCount: number
  clickCount: number
}

const priceIds: Record<string, string> = {
  FREE: process.env.NEXT_PUBLIC_STRIPE_PRICE_FREE ?? "",
  PRO: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO ?? "",
  BUSINESS: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS ?? "",
}

const planLimits: Record<string, { links: number; clicks: number }> = {
  FREE: { links: 50, clicks: 1000 },
  PRO: { links: 1000, clicks: 10000 },
  BUSINESS: { links: 10000, clicks: 100000 },
  ENTERPRISE: { links: 999999, clicks: 9999999 },
}

const billingHistory = [
  { id: "inv_001", date: new Date("2026-06-01"), amount: 2900, status: "paid" as const, pdfUrl: "#" },
  { id: "inv_002", date: new Date("2026-05-01"), amount: 2900, status: "paid" as const, pdfUrl: "#" },
  { id: "inv_003", date: new Date("2026-04-01"), amount: 2900, status: "paid" as const, pdfUrl: "#" },
  { id: "inv_004", date: new Date("2026-03-01"), amount: 2900, status: "paid" as const, pdfUrl: "#" },
  { id: "inv_005", date: new Date("2026-02-01"), amount: 2900, status: "failed" as const, pdfUrl: "#" },
]

export default function BillingPage() {
  const t = useTranslations("dashboard.billing")
  const [data, setData] = useState<BillingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [upgrading, setUpgrading] = useState<string | null>(null)
  const [managing, setManaging] = useState(false)
  const { addToast } = useToast()

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

  const handleUpgrade = async (planId: Plan) => {
    if (planId === currentPlan) return
    const priceId = priceIds[planId]
    if (!priceId) {
      addToast(t("toast.pricingNotConfigured"), "error")
      return
    }
    setUpgrading(planId)
    try {
      const res = await fetch("/api/billing/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId, priceId }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? t("toast.upgradeFailed"))
      if (json.url) {
        window.location.href = json.url
      }
    } catch (err) {
      addToast(err instanceof Error ? err.message : t("toast.upgradeFailed"), "error")
    } finally {
      setUpgrading(null)
    }
  }

  const handleManageSubscription = async () => {
    setManaging(true)
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" })
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-50">{t("title")}</h1>
          <p className="mt-1 text-sm text-dark-100">{t("description")}</p>
        </div>
        {data?.subscription?.stripeCustomerId && (
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
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-4">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id
          const isUpgrade = planIndex.indexOf(plan.id) > planIndex.indexOf(currentPlan)

          return (
            <Card
              key={plan.id}
              className={`relative ${plan.highlighted ? "border-primary-500 ring-1 ring-primary-500" : ""} ${isCurrent ? "ring-2 ring-emerald-500" : ""}`}
            >
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="success">{t("currentPlanBadge")}</Badge>
                </div>
              )}
              <CardHeader>
                <div className="flex items-center justify-between">
                  {plan.icon}
                  {plan.highlighted && !isCurrent && (
                    <Badge variant="secondary">{t("popularBadge")}</Badge>
                  )}
                </div>
                <CardTitle className="mt-3">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-dark-50">{plan.price}</span>
                  <span className="text-sm text-dark-100">/{plan.interval}</span>
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
                ) : plan.id === "ENTERPRISE" ? (
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
                    disabled={upgrading === plan.id}
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
                  <CreditCard className="h-5 w-5 text-dark-100" />
                </div>
                <div>
                  <p className="text-sm font-medium text-dark-50">{t("paymentMethod.cardInfo")}</p>
                  <p className="text-xs text-dark-100">{t("paymentMethod.cardExpiry")}</p>
                </div>
              </div>
              <Badge variant="success">{t("paymentMethod.defaultBadge")}</Badge>
            </div>
            <Button variant="outline" size="sm" onClick={handleManageSubscription} disabled={managing}>
              <CreditCard className="mr-2 h-4 w-4" />
              {t("paymentMethod.update")}
            </Button>
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
              <div className="h-2 w-full overflow-hidden rounded-full bg-dark-300">
                <div
                  className={`h-full rounded-full transition-all ${linkPct > 80 ? "bg-orange-400" : "bg-primary-500"}`}
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
              <div className="h-2 w-full overflow-hidden rounded-full bg-dark-300">
                <div
                  className={`h-full rounded-full transition-all ${clickPct > 80 ? "bg-orange-400" : "bg-blue-400"}`}
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
              {billingHistory.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="text-dark-50 text-nowrap">
                    {formatDate(inv.date, "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-dark-50 font-medium">
                    ${(inv.amount / 100).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={inv.status === "paid" ? "success" : "destructive"}>
                      {inv.status === "paid" ? t("billingHistory.paid") : t("billingHistory.failed")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <a href={inv.pdfUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        {t("billingHistory.pdf")}
                      </Button>
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}