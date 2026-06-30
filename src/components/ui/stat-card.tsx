"use client"

import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent } from "./card"

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  trend?: { value: number; positive: boolean }
  className?: string
}

function StatCard({ label, value, icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-dark-100">{label}</p>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500/10 text-primary-500">
            {icon}
          </div>
        </div>
        <p className="mt-3 text-2xl font-bold text-dark-50">{value}</p>
        {trend && (
          <div className="mt-2 flex items-center gap-1">
            {trend.positive ? (
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400" />
            )}
            <span
              className={cn(
                "text-sm font-medium",
                trend.positive ? "text-emerald-400" : "text-red-400"
              )}
            >
              {trend.value}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { StatCard }
