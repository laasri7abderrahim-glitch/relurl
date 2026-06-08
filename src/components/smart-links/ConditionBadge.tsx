"use client"

import { Globe, Smartphone, Languages, Clock, Users } from "lucide-react"

interface ConditionBadgeProps {
  type: "country" | "device" | "language" | "time" | "group"
  values: string[]
}

const config = {
  country: { icon: Globe, label: "Country", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  device: { icon: Smartphone, label: "Device", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  language: { icon: Languages, label: "Language", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  time: { icon: Clock, label: "Time", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  group: { icon: Users, label: "Group", color: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
}

export function ConditionBadge({ type, values }: ConditionBadgeProps) {
  if (!values.length) return null
  const c = config[type]
  const Icon = c.icon

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${c.color}`}>
      <Icon className="w-3 h-3" />
      {c.label}: {values.join(", ")}
    </span>
  )
}
