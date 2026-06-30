"use client"

import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25",
        primary: "bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%] hover:bg-[length:100%] text-white shadow-lg shadow-primary/30 hover:shadow-accent/30 transition-all duration-500",
        destructive: "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-600/25 hover:shadow-red-500/40",
        outline: "border-2 border-primary/40 bg-transparent text-foreground hover:bg-primary/10 hover:border-primary",
        secondary: "bg-gradient-to-r from-secondary via-secondary to-muted text-secondary-foreground hover:brightness-95 shadow-sm",
        ghost: "text-foreground hover:bg-primary/10 hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/25 hover:shadow-emerald-500/40",
        warning: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 hover:shadow-orange-500/40",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-8 text-base",
        xl: "h-12 rounded-lg px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
