"use client"

import { Link } from "@/i18n/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowUpRight, X } from "lucide-react"
import { useState } from "react"

interface UpgradePromptProps {
  plan: string
  feature: string
  current: number
  max: number
  onDismiss?: () => void
}

export function UpgradePrompt({ plan, feature, current, max, onDismiss }: UpgradePromptProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const percentage = max > 0 ? Math.round((current / max) * 100) : 0
  const isWarning = percentage >= 80
  const isLimit = percentage >= 100

  return (
    <Card className={`border-2 ${isLimit ? "border-red-500/50 bg-red-500/5" : isWarning ? "border-yellow-500/50 bg-yellow-500/5" : "border-accent/50 bg-accent/5"}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`rounded-lg p-2 ${isLimit ? "bg-red-500/10" : isWarning ? "bg-yellow-500/10" : "bg-accent/10"}`}>
            <AlertTriangle className={`h-5 w-5 ${isLimit ? "text-red-500" : isWarning ? "text-yellow-500" : "text-accent"}`} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-dark-50">
              {isLimit ? "Limit Reached" : isWarning ? "Approaching Limit" : "Usage Update"}
            </h3>
            <p className="text-sm text-dark-200 mt-1">
              {isLimit
                ? `You've used all ${max.toLocaleString()} ${feature} on your ${plan} plan.`
                : `You've used ${current.toLocaleString()} of ${max.toLocaleString()} ${feature} (${percentage}%).`}
            </p>
            {(isLimit || isWarning) && (
              <div className="mt-3 flex items-center gap-2">
                <Link href="/pricing">
                  <Button size="sm" className="bg-accent hover:bg-accent/90">
                    Upgrade Plan
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
                <Link href="/dashboard/billing">
                  <Button size="sm" variant="outline">
                    View Billing
                  </Button>
                </Link>
              </div>
            )}
          </div>
          {onDismiss && (
            <button
              onClick={() => { setDismissed(true); onDismiss() }}
              className="text-dark-200 hover:text-dark-50"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface PlanBadgeProps {
  plan: string
}

export function PlanBadge({ plan }: PlanBadgeProps) {
  const colors: Record<string, string> = {
    FREE: "bg-dark-300 text-dark-100",
    PRO: "bg-accent text-white",
    BUSINESS: "bg-blue-500 text-white",
    ENTERPRISE: "bg-purple-500 text-white",
  }

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[plan] || colors.FREE}`}>
      {plan}
    </span>
  )
}

interface UsageBarProps {
  label: string
  current: number
  max: number
}

export function UsageBar({ label, current, max }: UsageBarProps) {
  const percentage = max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0
  const isUnlimited = max === -1

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-dark-200">{label}</span>
        <span className="text-dark-50 font-medium">
          {isUnlimited ? "Unlimited" : `${current.toLocaleString()} / ${max.toLocaleString()}`}
        </span>
      </div>
      {!isUnlimited && (
        <div className="h-2 bg-dark-300 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              percentage >= 100 ? "bg-red-500" : percentage >= 80 ? "bg-yellow-500" : "bg-accent"
            }`}
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>
      )}
    </div>
  )
}
