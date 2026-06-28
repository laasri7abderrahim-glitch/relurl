"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-dark-700 p-4">
      <div className="text-center">
        <div className="mb-8">
          <span className="text-4xl font-bold text-primary-500">RELURL</span>
        </div>
        <h1 className="mb-4 text-2xl font-bold text-dark-50">
          Something went wrong
        </h1>
        <p className="mb-8 text-dark-100">
          {error.message || "An unexpected error occurred."}
        </p>
        <Button variant="primary" onClick={reset}>
          Try Again
        </Button>
      </div>
    </div>
  )
}
