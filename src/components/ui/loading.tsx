"use client"

import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-md bg-[length:200%_100%] bg-gradient-to-r from-dark-600 via-dark-400 to-dark-600",
        className
      )}
      {...props}
    />
  )
}

function SkeletonCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-dark-100 bg-dark-500 p-6 shadow-lg",
        className
      )}
      {...props}
    >
      <Skeleton className="mb-4 h-4 w-1/3" />
      <Skeleton className="mb-3 h-8 w-1/2" />
      <Skeleton className="mb-2 h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  )
}

function SkeletonTable({ rows = 5, className, ...props }: { rows?: number } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <div className="flex gap-4 pb-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  )
}

function SkeletonChart({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-dark-100 bg-dark-500 p-6 shadow-lg",
        className
      )}
      {...props}
    >
      <Skeleton className="mb-6 h-4 w-1/4" />
      <div className="flex h-40 items-end gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1"
            style={{ height: `${Math.random() * 60 + 20}%` }}
          />
        ))}
      </div>
    </div>
  )
}

function SkeletonStats({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
      {...props}
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-dark-100 bg-dark-500 p-6 shadow-lg"
        >
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
          <Skeleton className="mb-2 h-8 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  )
}

function PageSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-6", className)} {...props}>
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="mb-2 h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
      <SkeletonStats />
      <SkeletonChart />
      <SkeletonTable />
    </div>
  )
}

function LoadingSpinner({
  label,
  className,
  ...props
}: { label?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-12",
        className
      )}
      {...props}
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      {label && <p className="text-sm text-dark-100">{label}</p>}
    </div>
  )
}

export {
  Skeleton,
  SkeletonCard,
  SkeletonTable,
  SkeletonChart,
  SkeletonStats,
  PageSkeleton,
  LoadingSpinner,
}
