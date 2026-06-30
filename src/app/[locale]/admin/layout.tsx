"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { Link } from "@/i18n/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Link2,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  FileText,
} from "lucide-react"

const sidebarItems = [
  { label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, href: "/admin" },
  { label: "Users", icon: <Users className="h-5 w-5" />, href: "/admin/users" },
  { label: "Links", icon: <Link2 className="h-5 w-5" />, href: "/admin/links" },
  { label: "Payments", icon: <CreditCard className="h-5 w-5" />, href: "/admin/payments" },
  { label: "Audit Log", icon: <FileText className="h-5 w-5" />, href: "/admin/audit-log" },
  { label: "Settings", icon: <Settings className="h-5 w-5" />, href: "/admin/settings" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login")
    } else if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.replace("/dashboard")
    }
  }, [status, session, router])

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-700">
        <div className="space-y-4 text-center">
          <Skeleton className="mx-auto h-12 w-12 rounded-full" />
          <Skeleton className="mx-auto h-4 w-48" />
        </div>
      </div>
    )
  }

  if (status === "unauthenticated" || session?.user?.role !== "ADMIN") {
    return null
  }

  return (
    <div className="flex min-h-screen bg-dark-700">
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full flex-col border-r border-dark-100 bg-dark-500 transition-all duration-300",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className={cn("flex h-16 items-center border-b border-dark-100", sidebarOpen ? "justify-between px-4" : "justify-center px-2")}>
          {sidebarOpen ? (
            <>
              <Link href="/admin" className="flex items-center gap-2 text-lg font-bold tracking-tight text-dark-50">
                <span className="text-primary-500">REL</span>
                <span>Admin</span>
              </Link>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="text-dark-100 hover:text-dark-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="text-dark-100 hover:text-dark-50"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-dark-300 text-dark-50"
                    : "text-dark-100 hover:bg-dark-300 hover:text-dark-50",
                  !sidebarOpen && "justify-center"
                )}
                title={!sidebarOpen ? item.label : undefined}
              >
                {item.icon}
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-dark-100 p-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-dark-100 hover:bg-dark-300 hover:text-dark-50 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            {sidebarOpen && <span>Back to App</span>}
          </Link>
        </div>
      </aside>

      <div className={cn("flex-1 transition-all duration-300", sidebarOpen ? "ml-64" : "ml-16")}>
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
