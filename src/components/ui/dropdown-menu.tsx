"use client"

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  type ReactNode,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react"
import { cn } from "@/lib/utils"

interface DropdownMenuContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const DropdownMenuContext = createContext<DropdownMenuContextType | undefined>(undefined)

function useDropdownMenu() {
  const context = useContext(DropdownMenuContext)
  if (!context) throw new Error("DropdownMenu components must be used within a DropdownMenu")
  return context
}

function DropdownMenu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      {children}
    </DropdownMenuContext.Provider>
  )
}

function DropdownMenuTrigger({ children, asChild }: { children: ReactNode; asChild?: boolean }) {
  const { open, setOpen } = useDropdownMenu()
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={asChild ? undefined : ""}
    >
      {children}
    </button>
  )
}

interface DropdownMenuContentProps extends HTMLAttributes<HTMLDivElement> {
  align?: "start" | "end"
}

function DropdownMenuContent({ className, align = "start", children, ...props }: DropdownMenuContentProps) {
  const { open, setOpen } = useDropdownMenu()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    function handleEscape(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [open, setOpen])

  if (!open) return null

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-lg border border-dark-100 bg-dark-500 p-1 shadow-xl",
        "animate-in fade-in zoom-in-95 duration-150",
        align === "end" ? "right-0" : "left-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface DropdownMenuItemProps extends HTMLAttributes<HTMLDivElement> {
  inset?: boolean
  disabled?: boolean
}

function DropdownMenuItem({ className, inset, disabled, ...props }: DropdownMenuItemProps) {
  const { setOpen } = useDropdownMenu()
  return (
    <div
      role="menuitem"
      data-disabled={disabled || undefined}
      onClick={(e) => {
        if (disabled) return
        setOpen(false)
      }}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm text-dark-50 outline-none transition-colors",
        "hover:bg-dark-300 focus-visible:bg-dark-300",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn("-mx-1 my-1 h-px bg-dark-100", className)} />
}

function DropdownMenuLabel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-2 py-1.5 text-xs font-medium text-dark-100", className)}
      {...props}
    />
  )
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel }
