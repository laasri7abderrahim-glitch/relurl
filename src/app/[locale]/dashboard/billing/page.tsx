"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
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

const plans: PlanData[] = [
  {
    id: "FREE",
    name: "Free",
    price: "$0",
    interval: "forever",
    icon: <Zap className="h-5 w-5 text-dark-100" />,
    features: [
      { text: "1,000 links", included: true },
      { text: "10,000 clicks/month", included: true },
      { text: "Basic analytics", included: true },
      { text: "1 team member", included: true },
      { text: "Custom domains", included: false },
      { text: "API access", included: false },
      { text: "Priority support", included: false },
    ],
  },
  {
    id: "PRO",
    name: "Pro",
    price: "$29",
    interval: "per month",
    icon: <Zap className="h-5 w-5 text-primary-500" />,
    highlighted: true,
    features: [
      { text: "10,000 links", included: true },
      { text: "100,000 clicks/month", included: true },
      { text: "Advanced analytics", included: true },
      { text: "5 team members", included: true },
      { text: "Custom domains", included: true },
      { text: "API access", included: true },
      { text: "Priority support", included: false },
    ],
  },
  {
    id: "BUSINESS",
    name: "Business",
    price: "$99",
    interval: "per month",
    icon: <Building2 className="h-5 w-5 text-blue-400" />,
    features: [
      { text: "100,000 links", included: true },
      { text: "1,000,000 clicks/month", included: true },
      { text: "Advanced analytics + exports", included: true },
      { text: "Unlimited team members", included: true },
      { text: "Custom domains", included: true },
      { text: "API access", included: true },
      { text: "Priority support", included: true },
    ],
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    price: "Custom",
    interval: "contact us",
    icon: <Infinity className="h-5 w-5 text-purple-400" />,
    features: [
      { text: "Unlimited links", included: true },
      { text: "Unlimited clicks", included: true },
      { text: "Full analytics suite", included: true },
      { text: "Unlimited team members", included: true },
      { text: "Custom domains", included: true },
      { text: "API access + SLA", included: true },
      { text: "Dedicated support", included: true },
    ],
  },
]

const billingHistory = [
  { id: "inv_001", date: new Date("2026-06-01"), amount: 2900, status: "paid" as const, pdfUrl: "#" },
  { id: "inv_002", date: new Date("2026-05-01"), amount: 2900, status: "paid" as const, pdfUrl: "#" },
  { id: "inv_003", date: new Date("2026-04-01"), amount: 2900, status: "paid" as const, pdfUrl: "#" },
  { id: "inv_004", date: new Date("2026-03-01"), amount: 2900, status: "paid" as const, pdfUrl: "#" },
  { id: "inv_005", date: new Date("2026-02-01"), amount: 2900, status: "failed" as const, pdfUrl: "#" },
]

function getStatusBadge(status: string | undefined) {
  switch (status) {
    case "ACTIVE": return <Badge variant="success">Active</Badge>
    case "CANCELED": return <Badge variant="secondary">Canceled</Badge>
    case "PAST_DUE": return <Badge variant="destructive">Past Due</Badge>
    case "EXPIRED": return <Badge variant="secondary">Expired</Badge>
    default: return <Badge variant="secondary">Unknown</Badge>
  }
}

export default function BillingPage() {
  const [data, setData] = useState<BillingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [upgrading, setUpgrading] = useState<string | null>(null)
  const [managing, setManaging] = useState(false)
  const { addToast } = useToast()

  const fetchSubscription = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/billing/subscription")
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Failed to fetch billing data")
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSubscription()
  }, [fetchSubscription])

  const currentPlan: Plan = data?.subscription?.plan ?? "FREE"

  const handleUpgrade = async (planId: Plan) => {
    if (planId === currentPlan) return
    const priceId = priceIds[planId]
    if (!priceId) {
      addToast("Pricing is not configured for this plan", "error")
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
      if (!res.ok) throw new Error(json.error ?? "Failed to create checkout")
      if (json.url) {
        window.location.href = json.url
      }
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Failed to start upgrade", "error")
    } finally {
      setUpgrading(null)
    }
  }

  const handleManageSubscription = async () => {
    setManaging(true)
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Failed to open portal")
      if (json.url) {
        window.location.href = json.url
      }
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Failed to open manage portal", "error")
    } finally {
      setManaging(false)
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
        <p className="text-dark-50 font-medium mb-1">Failed to load billing data</p>
        <p className="text-sm text-dark-100 mb-4">{error}</p>
        <Button variant="outline" onClick={fetchSubscription}>Retry</Button>
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
          <h1 className="text-2xl font-bold text-dark-50">Billing</h1>
          <p className="mt-1 text-sm text-dark-100">Manage your subscription and payment methods</p>
        </div>
        {data?.subscription?.stripeCustomerId && (
          <Button variant="outline" onClick={handleManageSubscription} disabled={managing}>
            {managing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ExternalLink className="mr-2 h-4 w-4" />}
            Manage Subscription
          </Button>
        )}
      </div>

      {currentPlan !== "FREE" && data?.subscription && (
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-dark-100">Current Plan</p>
                <p className="text-lg font-semibold text-dark-50">{currentPlan}</p>
              </div>
              {getStatusBadge(data.subscription.status)}
              {data.subscription.currentPeriodEnd && (
                <div className="text-sm text-dark-100">
                  Renews {formatDate(new Date(data.subscription.currentPeriodEnd), "MMM d, yyyy")}
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
          const isDowngrade = planIndex.indexOf(plan.id) < planIndex.indexOf(currentPlan)

          return (
            <Card
              key={plan.id}
              className={`relative ${plan.highlighted ? "border-primary-500 ring-1 ring-primary-500" : ""} ${isCurrent ? "ring-2 ring-emerald-500" : ""}`}
            >
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="success">Current Plan</Badge>
                </div>
              )}
              <CardHeader>
                <div className="flex items-center justify-between">
                  {plan.icon}
                  {plan.highlighted && !isCurrent && (
                    <Badge variant="secondary">Popular</Badge>
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
                    Current Plan
                  </Button>
                ) : plan.id === "ENTERPRISE" ? (
                  <Link href="/contact">
                    <Button variant="outline" className="w-full">
                      Contact Sales
                    </Button>
                  </Link>
                ) : isUpgrade ? (
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={upgrading === plan.id}
                  >
                    {upgrading === plan.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowUp className="mr-2 h-4 w-4" />
                    )}
                    Upgrade
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={upgrading === plan.id}
                  >
                    {upgrading === plan.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowUp className="mr-2 h-4 w-4" />
                    )}
                    Upgrade
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
                <CardTitle className="text-lg">Payment Method</CardTitle>
                <CardDescription>Manage your payment information</CardDescription>
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
                  <p className="text-sm font-medium text-dark-50">Visa ending in 4242</p>
                  <p className="text-xs text-dark-100">Expires 12/28</p>
                </div>
              </div>
              <Badge variant="success">Default</Badge>
            </div>
            <Button variant="outline" size="sm" onClick={handleManageSubscription} disabled={managing}>
              <CreditCard className="mr-2 h-4 w-4" />
              Update Payment Method
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-dark-100" />
              <div>
                <CardTitle className="text-lg">Usage Limits</CardTitle>
                <CardDescription>
                  {currentPlan} plan &mdash; {limits.links >= 999999 ? "Unlimited" : formatNumber(limits.links)} links, {limits.clicks >= 9999999 ? "Unlimited" : formatNumber(limits.clicks)} clicks
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-dark-50">Links</span>
                <span className="text-dark-100">
                  {formatNumber(linkUsed)} / {limits.links >= 999999 ? "Unlimited" : formatNumber(limits.links)}
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
                <span className="text-dark-50">Clicks</span>
                <span className="text-dark-100">
                  {formatNumber(clickUsed)} / {limits.clicks >= 9999999 ? "Unlimited" : formatNumber(limits.clicks)}
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
              <CardTitle className="text-lg">Billing History</CardTitle>
              <CardDescription>View your past invoices</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Invoice</TableHead>
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
                      {inv.status === "paid" ? "Paid" : "Failed"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <a href={inv.pdfUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        PDF
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
