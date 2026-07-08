"use client"

import BatchShortener from "@/components/dashboard/batch-shortener"

export default function BatchShortenerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark-50">Batch Shortener</h1>
        <p className="text-sm text-dark-100">Create multiple short links at once — paste up to 50 URLs</p>
      </div>
      <BatchShortener />
    </div>
  )
}
