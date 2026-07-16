"use client"

import { useLocale } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import { useTransition } from "react"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

const locales = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "fr", label: "FR" },
] as const

export function LocaleSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function switchLocale(next: string) {
    startTransition(() => {
      router.replace(pathname, { locale: next })
    })
  }

  return (
    <div className="flex items-center gap-1">
      <Globe className="w-4 h-4 text-dark-100" />
      {locales.map((l) => (
        <Button
          key={l.code}
          variant="ghost"
          size="sm"
          disabled={isPending}
          onClick={() => switchLocale(l.code)}
          className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
            locale === l.code
              ? "text-primary bg-primary/10"
              : "text-dark-100 hover:text-dark-50"
          }`}
        >
          {l.label}
        </Button>
      ))}
    </div>
  )
}
