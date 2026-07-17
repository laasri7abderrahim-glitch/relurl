import type { LucideIcon } from "lucide-react"

interface Props {
  icon: LucideIcon
  label: string
  value: string
  trend: string
}

export function StatCard({ icon: Icon, label, value, trend }: Props) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
      <p className="text-xs text-gray-400 mt-1">{trend}</p>
    </div>
  )
}
