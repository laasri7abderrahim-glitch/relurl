"use client"

import { forwardRef, type LabelHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => {
    return (
      <label
        className={cn(
          "text-sm font-medium text-dark-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Label.displayName = "Label"

export { Label }
