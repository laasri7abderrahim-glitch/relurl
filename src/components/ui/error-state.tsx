"use client"

import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"
import { Button } from "./button"

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again later.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dark-100 bg-dark-500 px-6 py-12 shadow-lg",
        className
      )}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-600/10 text-red-400">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-dark-50">{title}</h3>
      {message && (
        <p className="mt-1 max-w-sm text-center text-sm text-dark-100">
          {message}
        </p>
      )}
      {onRetry && (
        <Button
          variant="primary"
          size="sm"
          className="mt-4"
          onClick={onRetry}
        >
          Try again
        </Button>
      )}
    </div>
  )
}

export { ErrorState }
