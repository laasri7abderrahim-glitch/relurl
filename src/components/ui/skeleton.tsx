"use client"

import { type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-dark-100",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
