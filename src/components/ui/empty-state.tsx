"use client"

import { cn } from "@/lib/utils"
import { Inbox } from "lucide-react"
import { Button } from "./button"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
  className?: string
}

function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dark-100 bg-dark-500 px-6 py-12 shadow-lg",
        className
      )}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-dark-400 text-dark-100">
        {icon ?? <Inbox className="h-6 w-6" />}
      </div>
      <h3 className="text-lg font-semibold text-dark-50">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-center text-sm text-dark-100">
          {description}
        </p>
      )}
      {action && (
        <Button
          variant="primary"
          size="sm"
          className="mt-4"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}

export { EmptyState }
