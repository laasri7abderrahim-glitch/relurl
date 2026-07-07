"use client"

import { cn } from "@/lib/utils"

interface CheckboxProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  className?: string
}

export function Checkbox({ checked, onCheckedChange, className }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "h-4 w-4 shrink-0 rounded border transition-colors flex items-center justify-center",
        checked
          ? "border-primary bg-primary text-primary-foreground"
          : "border-dark-100 bg-dark-500",
        className
      )}
    >
      {checked && (
        <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
          <path d="M3 6l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}
