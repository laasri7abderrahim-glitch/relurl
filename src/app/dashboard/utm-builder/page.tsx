"use client"

import { UTMBuilder } from "@/components/utm-builder"

export default function UTMBuilderPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark-50">UTM Builder</h1>
        <p className="text-sm text-dark-100">Create campaign tracking URLs with UTM parameters</p>
      </div>
      <UTMBuilder />
    </div>
  )
}
