"use client"

import { TrendingUp, TrendingDown, Minimize2, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ExpiryPrediction {
  trend: string
  healthScore: number
  healthStatus: string
  estimatedDaysRemaining: number | null
  weeklyChange: number
  recommendation: string
}

function RingGauge({ score }: { score: number }) {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score > 70 ? "#22c55e" : score >= 40 ? "#eab308" : "#ef4444"

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="100" height="100" className="-rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="oklch(0.268 0.007 34.298 / 0.3)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={radius} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-2xl font-bold text-dark-50">{score}</span>
    </div>
  )
}

function TrendIcon({ trend }: { trend: string }) {
  switch (trend) {
    case "growing":
      return <TrendingUp className="w-5 h-5 text-emerald-500" />
    case "declining":
      return <TrendingDown className="w-5 h-5 text-red-500" />
    case "stable":
      return <Minimize2 className="w-5 h-5 text-yellow-500" />
    default:
      return <Minimize2 className="w-5 h-5 text-dark-100" />
  }
}

function TrendLabel({ trend }: { trend: string }) {
  const labels: Record<string, string> = {
    growing: "Growing",
    declining: "Declining",
    stable: "Stable",
    insufficient_data: "Insufficient Data",
  }
  return <span>{labels[trend] || trend}</span>
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    healthy: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    declining: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    at_risk: "bg-red-500/10 text-red-500 border-red-500/20",
  }
  const labels: Record<string, string> = {
    healthy: "Healthy",
    declining: "Declining",
    at_risk: "At Risk",
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colors[status] || ""}`}>
      {status === "at_risk" && <AlertTriangle className="w-3 h-3 mr-1" />}
      {labels[status] || status}
    </span>
  )
}

export default function TrafficForecast({ prediction }: { prediction: ExpiryPrediction }) {
  const changeColor = prediction.weeklyChange > 0 ? "text-emerald-500" : prediction.weeklyChange < 0 ? "text-red-500" : "text-dark-100"
  const changeIcon = prediction.weeklyChange > 0 ? "↑" : prediction.weeklyChange < 0 ? "↓" : "→"

  return (
    <Card className="border-dark-100">
      <CardHeader>
        <CardTitle className="text-base">Traffic Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-dark-500 border border-dark-100">
            <RingGauge score={prediction.healthScore} />
            <p className="text-xs text-dark-100 mt-2">Health Score</p>
            <StatusBadge status={prediction.healthStatus} />
          </div>

          <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-dark-500 border border-dark-100">
            <TrendIcon trend={prediction.trend} />
            <p className="text-lg font-bold text-dark-50 mt-2">
              <TrendLabel trend={prediction.trend} />
            </p>
            <p className="text-xs text-dark-100">Trend</p>
          </div>

          <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-dark-500 border border-dark-100">
            <p className="text-lg font-bold text-dark-50">
              {prediction.estimatedDaysRemaining !== null ? `${prediction.estimatedDaysRemaining}` : "N/A"}
            </p>
            <p className="text-xs text-dark-100">Days remaining</p>
          </div>

          <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-dark-500 border border-dark-100">
            <p className={`text-lg font-bold ${changeColor}`}>
              {changeIcon} {Math.abs(prediction.weeklyChange)}%
            </p>
            <p className="text-xs text-dark-100">Weekly change</p>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-dark-500 border border-dark-100">
          <p className="text-xs text-dark-100 mb-1">Recommendation</p>
          <p className="text-sm text-dark-50">{prediction.recommendation}</p>
        </div>
      </CardContent>
    </Card>
  )
}
