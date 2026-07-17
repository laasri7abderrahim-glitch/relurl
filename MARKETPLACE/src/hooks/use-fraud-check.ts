"use client"

import { useState, useCallback } from "react"

interface FraudCheckResult {
  score: number
  signals: {
    type: "HIGH" | "MEDIUM" | "LOW"
    code: string
    message: string
    messageAr: string
  }[]
  shouldBlock: boolean
  shouldReview: boolean
  report: string
}

export function useFraudCheck() {
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<FraudCheckResult | null>(null)

  const check = useCallback(async (listingData: {
    title: string
    description: string
    price?: number | null
    city: string
    contactPhone?: string
    userId: string
    images?: { url: string }[]
  }) => {
    setIsChecking(true)
    try {
      const response = await fetch("/api/marketplace/fraud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listingData),
      })
      const data = await response.json()
      if (data.success) {
        setResult(data.data)
        return data.data
      }
      return null
    } catch {
      return null
    } finally {
      setIsChecking(false)
    }
  }, [])

  const reset = useCallback(() => setResult(null), [])

  return { check, result, isChecking, reset }
}