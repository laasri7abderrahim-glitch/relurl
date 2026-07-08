"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Link } from "@/i18n/navigation"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Link2,
  PlusCircle,
  BarChart3,
  Key,
  Globe,
  Users,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Bell,
  UserCircle,
  Sun,
  Moon,
  Wand2,
  FolderKanban,
  QrCode,
  Search,
  Command,
  Keyboard,
  Plus,
  ExternalLink,
  MousePointerClick,
  Layers,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useTheme } from "@/components/theme-provider"

interface SidebarItem {
  label: string
  icon: React.ReactNode
  href?: string
  sub?: { label: string; href: string }[]
}

const sidebarItems: SidebarItem[] = [
  { label: "Overview", icon: <LayoutDashboard className="h-5 w-5" />, href: "/dashboard" },
  {
    label: "Links",
    icon: <Link2 className="h-5 w-5" />,
    sub: [
      { label: "All Links", href: "/dashboard/links" },
      { label: "New Link", href: "/dashboard/links/new" },
      { label: "Campaigns", href: "/dashboard/campaigns" },
    ],
  },
  { label: "Analytics", icon: <BarChart3 className="h-5 w-5" />, href: "/dashboard/analytics" },
  { label: "QR Codes", icon: <QrCode className="h-5 w-5" />, href: "/dashboard/qrcodes" },
  { label: "UTM Builder", icon: <Wand2 className="h-5 w-5" />, href: "/dashboard/utm-builder" },
  { label: "Batch Shortener", icon: <Layers className="h-5 w-5" />, href: "/dashboard/tools/batch-shortener" },
  { label: "API Keys", icon: <Key className="h-5 w-5" />, href: "/dashboard/api-keys" },
  { label: "Domains", icon: <Globe className="h-5 w-5" />, href: "/dashboard/domains" },
  { label: "Bio Pages", icon: <UserCircle className="h-5 w-5" />, href: "/dashboard/bio-pages" },
  { label: "Team", icon: <Users className="h-5 w-5" />, href: "/dashboard/team" },
  { label: "Notifications", icon: <Bell className="h-5 w-5" />, href: "/dashboard/notifications" },
  { label: "Billing", icon: <CreditCard className="h-5 w-5" />, href: "/dashboard/billing" },
  { label: "Settings", icon: <Settings className="h-5 w-5" />, href: "/dashboard/settings" },
]

interface DashboardLayoutProps {
  children: React.ReactNode
  userName?: string
  userEmail?: string
  userAvatar?: string
}

function DashboardLayout({
  children,
  userName = "User",
  userEmail = "user@example.com",
  userAvatar,
}: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>("Links")
  const [unreadCount, setUnreadCount] = useState(0)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [commandQuery, setCommandQuery] = useState("")
  const [showQuickCreate, setShowQuickCreate] = useState(false)
  const quickCreateRef = useRef<HTMLDivElement>(null)
  const commandRef = useRef<HTMLInputElement>(null)

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications?limit=1")
      if (res.ok) {
        const json = await res.json()
        setUnreadCount(json.data?.unreadCount ?? 0)
      }
    } catch {}
  }, [])

  useEffect(() => {
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [fetchUnreadCount])

  useEffect(() => {
    function handleKeyDown(e: globalThis.KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setShowCommandPalette(true)
      }
      if (e.key === "?" && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault()
        setShowShortcuts(true)
      }
      if (e.key === "Escape") {
        setShowCommandPalette(false)
        setShowShortcuts(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    if (showCommandPalette && commandRef.current) {
      setTimeout(() => commandRef.current?.focus(), 100)
    }
    if (!showCommandPalette) setCommandQuery("")
  }, [showCommandPalette])

  useEffect(() => {
    if (!showQuickCreate) return
    function handleClick(e: MouseEvent) {
      if (quickCreateRef.current && !quickCreateRef.current.contains(e.target as Node)) {
        setShowQuickCreate(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [showQuickCreate])

  const commandItems = [
    { label: "Create Link", icon: <Plus className="h-4 w-4" />, href: "/dashboard/links/new", shortcut: "C" },
    { label: "View Analytics", icon: <BarChart3 className="h-4 w-4" />, href: "/dashboard/analytics", shortcut: "A" },
    { label: "View All Links", icon: <Link2 className="h-4 w-4" />, href: "/dashboard/links", shortcut: "L" },
    { label: "QR Code Generator", icon: <QrCode className="h-4 w-4" />, href: "/dashboard/qrcodes", shortcut: "Q" },
    { label: "UTM Builder", icon: <Wand2 className="h-4 w-4" />, href: "/dashboard/utm-builder", shortcut: "U" },
    { label: "Campaigns", icon: <FolderKanban className="h-4 w-4" />, href: "/dashboard/campaigns", shortcut: "M" },
    { label: "Settings", icon: <Settings className="h-4 w-4" />, href: "/dashboard/settings", shortcut: "S" },
    { label: "Billing", icon: <CreditCard className="h-4 w-4" />, href: "/dashboard/billing", shortcut: "B" },
    { label: "API Keys", icon: <Key className="h-4 w-4" />, href: "/dashboard/api-keys" },
    { label: "Custom Domains", icon: <Globe className="h-4 w-4" />, href: "/dashboard/domains" },
    { label: "Team", icon: <Users className="h-4 w-4" />, href: "/dashboard/team" },
    { label: "Bio Pages", icon: <UserCircle className="h-4 w-4" />, href: "/dashboard/bio-pages" },
  ]

  const filteredCommands = commandQuery
    ? commandItems.filter((item) => item.label.toLowerCase().includes(commandQuery.toLowerCase()))
    : commandItems

  const isActive = (href?: string) => {
    if (!href) return false
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  const toggleSubmenu = (label: string) => {
    setExpandedSection(expandedSection === label ? null : label)
  }

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex min-h-screen bg-dark-700">
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full flex-col border-r border-dark-100 bg-dark-500 transition-all duration-300 md:static",
          sidebarOpen ? "w-64" : "w-16",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className={cn("flex h-16 items-center border-b border-dark-100 px-4", sidebarOpen ? "justify-between" : "justify-center")}>
          {sidebarOpen ? (
            <>
              <Link href="/dashboard" className="flex items-center gap-2">
                <svg width="28" height="28" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#6366f1"/>
                      <stop offset="100%" stop-color="#a855f7"/>
                    </linearGradient>
                  </defs>
                  <rect width="100" height="100" rx="20" fill="url(#logoGrad)"/>
                  <g fill="white">
                    <rect x="28" y="18" width="12" height="64" rx="4"/>
                    <rect x="40" y="18" width="28" height="12" rx="4"/>
                    <path d="M68 28 C68 48 58 52 40 52 L40 28 Z"/>
                    <path d="M54 46 L68 82 L58 82 L46 46 Z"/>
                  </g>
                </svg>
                <span className="text-lg font-bold tracking-tight">
                  <span className="text-primary-500">REL</span>
                  <span className="text-dark-50">URL</span>
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="hidden md:flex text-dark-100 hover:text-dark-50"
                aria-label="Collapse sidebar"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="text-dark-100 hover:text-dark-50"
              aria-label="Expand sidebar"
            >
              <svg width="24" height="24" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="logoGradSmall" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#6366f1"/>
                    <stop offset="100%" stop-color="#a855f7"/>
                  </linearGradient>
                </defs>
                <rect width="100" height="100" rx="20" fill="url(#logoGradSmall)"/>
                <g fill="white">
                  <rect x="28" y="18" width="12" height="64" rx="4"/>
                  <rect x="40" y="18" width="28" height="12" rx="4"/>
                  <path d="M68 28 C68 48 58 52 40 52 L40 28 Z"/>
                  <path d="M54 46 L68 82 L58 82 L46 46 Z"/>
                </g>
              </svg>
            </button>
          )}
        </div>

        {/* Mobile close */}
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(false)}
          className="absolute right-2 top-4 text-dark-100 hover:text-dark-50 md:hidden"
          aria-label="Close mobile sidebar"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {sidebarItems.map((item) => {
            const active = isActive(item.href) || (item.sub && item.sub.some((s) => pathname === s.href))
            const expanded = expandedSection === item.label

            return (
              <div key={item.label}>
                {item.sub ? (
                  <>
                    <button
                      type="button"
                      onClick={() => toggleSubmenu(item.label)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-dark-300 text-dark-50"
                          : "text-dark-100 hover:bg-dark-300 hover:text-dark-50",
                        !sidebarOpen && "justify-center"
                      )}
                      title={!sidebarOpen ? item.label : undefined}
                    >
                      {item.icon}
                      {sidebarOpen && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          {expanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </>
                      )}
                    </button>
                    {sidebarOpen && expanded && (
                      <div className="ml-3 mt-1 space-y-1 border-l border-dark-100 pl-3">
                        {item.sub.map((sub) => {
                          const subActive = pathname === sub.href
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setMobileSidebarOpen(false)}
                              className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                subActive
                                  ? "bg-dark-300 text-dark-50"
                                  : "text-dark-100 hover:bg-dark-300 hover:text-dark-50"
                              )}
                            >
                              <span className="h-1 w-1 rounded-full bg-current" />
                              {sub.label}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href!}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-dark-300 text-dark-50"
                        : "text-dark-100 hover:bg-dark-300 hover:text-dark-50",
                      !sidebarOpen && "justify-center"
                    )}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    {item.icon}
                    {sidebarOpen && <span>{item.label}</span>}
                  </Link>
                )}
              </div>
            )
          })}
        </nav>

        {/* User area */}
        {sidebarOpen && (
          <div className="border-t border-dark-100 p-3">
            <div className="flex items-center gap-3 rounded-lg px-3 py-2">
              <Avatar
                src={userAvatar}
                fallback={initials}
                size="sm"
              />
              <div className="flex-1 truncate">
                <p className="text-sm font-medium text-dark-50 truncate">{userName}</p>
                <p className="text-xs text-dark-100 truncate">{userEmail}</p>
              </div>
              <button
                type="button"
                className="rounded-lg p-1 text-dark-100 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top bar (mobile) */}
        <div className="flex h-16 items-center border-b border-dark-100 bg-dark-500 px-4 md:hidden">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="text-dark-100 hover:text-dark-50"
            aria-label="Open mobile menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="ml-4 flex items-center gap-2 text-lg font-bold tracking-tight text-dark-50">
            <span className="text-primary-500">REL</span>
            <span>URL</span>
          </div>
          <div className="ml-auto">
            <Link
              href="/dashboard/notifications"
              className="relative rounded-lg p-2 text-dark-100 hover:text-dark-50 hover:bg-dark-300 transition-colors"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Top bar (desktop) */}
        <div className="hidden md:flex h-16 items-center justify-end border-b border-dark-100 bg-dark-500 px-8 gap-2">
          {/* Command palette trigger */}
          <button
            type="button"
            onClick={() => setShowCommandPalette(true)}
            className="flex items-center gap-2 rounded-lg border border-dark-100 bg-dark-700 px-3 py-1.5 text-sm text-dark-100 hover:text-dark-50 hover:border-dark-50 transition-colors mr-auto max-w-xs"
          >
            <Search className="h-4 w-4" />
            <span className="hidden lg:inline">Quick navigation...</span>
            <span className="hidden xl:inline ml-4 text-[10px] border border-dark-100 rounded px-1 py-0.5">⌘K</span>
          </button>
          {/* Quick create dropdown */}
          <div ref={quickCreateRef} className="relative">
            <button
              type="button"
              onClick={() => setShowQuickCreate((prev) => !prev)}
              className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden lg:inline">Quick Create</span>
            </button>
            {showQuickCreate && (
            <div className="absolute right-0 top-full mt-1 z-50 min-w-[200px] rounded-lg border border-dark-100 bg-dark-500 p-1 shadow-xl animate-in fade-in zoom-in-95 duration-150">
              <button
                type="button"
                onClick={() => { setShowQuickCreate(false); router.push("/dashboard/links/new") }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-dark-50 hover:bg-dark-300 transition-colors"
              >
                <Plus className="h-4 w-4 text-accent" />
                New Short Link
              </button>
              <button
                type="button"
                onClick={() => { setShowQuickCreate(false); router.push("/dashboard/qrcodes") }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-dark-50 hover:bg-dark-300 transition-colors"
              >
                <QrCode className="h-4 w-4 text-accent" />
                New QR Code
              </button>
              <button
                type="button"
                onClick={() => { setShowQuickCreate(false); router.push("/dashboard/campaigns") }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-dark-50 hover:bg-dark-300 transition-colors"
              >
                <FolderKanban className="h-4 w-4 text-accent" />
                New Campaign
              </button>
              <button
                type="button"
                onClick={() => { setShowQuickCreate(false); router.push("/dashboard/bio-pages/new") }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-dark-50 hover:bg-dark-300 transition-colors"
              >
                <UserCircle className="h-4 w-4 text-accent" />
                New Bio Page
              </button>
            </div>
            )}
          </div>
          {/* Keyboard shortcuts hint */}
          <button
            type="button"
            onClick={() => setShowShortcuts(true)}
            className="rounded-lg p-2 text-dark-100 hover:text-dark-50 hover:bg-dark-300 transition-colors"
            title="Keyboard shortcuts (?)"
          >
            <Keyboard className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="rounded-lg p-2 text-dark-100 hover:text-dark-50 hover:bg-dark-300 transition-colors"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <Link
            href="/dashboard/notifications"
            className="relative rounded-lg p-2 text-dark-100 hover:text-dark-50 hover:bg-dark-300 transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>
        </div>

        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>

      {/* Keyboard Shortcuts Dialog */}
      <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5 text-accent" />
              Keyboard Shortcuts
            </DialogTitle>
            <DialogDescription>Use these shortcuts to navigate faster</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              { keys: "⌘K / Ctrl+K", action: "Command palette" },
              { keys: "?", action: "Show this menu" },
              { keys: "Esc", action: "Close modals / menus" },
              { keys: "/", action: "Focus search on links page" },
            ].map((s) => (
              <div key={s.keys} className="flex items-center justify-between rounded-lg bg-dark-700/50 px-3 py-2.5 border border-dark-100">
                <span className="text-sm text-dark-50">{s.action}</span>
                <kbd className="rounded border border-dark-100 bg-dark-500 px-2 py-0.5 text-[11px] font-mono text-dark-100">
                  {s.keys}
                </kbd>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Command Palette Dialog */}
      <Dialog open={showCommandPalette} onOpenChange={setShowCommandPalette}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Command className="h-5 w-5 text-accent" />
              Command Palette
            </DialogTitle>
            <DialogDescription>Type to search pages and actions</DialogDescription>
          </DialogHeader>
          <div className="pt-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-100" />
              <input
                ref={commandRef}
                type="text"
                value={commandQuery}
                onChange={(e) => setCommandQuery(e.target.value)}
                placeholder="Search pages..."
                className="w-full rounded-lg border border-dark-100 bg-dark-700 py-2.5 pl-10 pr-4 text-sm text-dark-50 placeholder:text-dark-100 focus:border-accent focus:outline-none"
              />
            </div>
            <div className="mt-3 max-h-64 overflow-y-auto space-y-0.5">
              {filteredCommands.length === 0 ? (
                <p className="py-4 text-center text-sm text-dark-100">No results found</p>
              ) : (
                filteredCommands.map((item) => (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => {
                      setShowCommandPalette(false)
                      router.push(item.href)
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-dark-50 hover:bg-dark-300 transition-colors"
                  >
                    <span className="text-accent">{item.icon}</span>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.shortcut && (
                      <kbd className="rounded border border-dark-100 bg-dark-700 px-1.5 py-0.5 text-[10px] font-mono text-dark-100">
                        {item.shortcut}
                      </kbd>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { DashboardLayout }
