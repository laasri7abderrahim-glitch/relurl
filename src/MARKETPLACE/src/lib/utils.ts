import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | null | undefined, currency = "MAD"): string {
  if (price == null) return "Prix non spécifié"
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDate(date: string | Date, locale = "fr"): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString(locale === "ar" ? "ar-MA" : "fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function formatRelativeDate(date: string | Date, locale = "fr"): string {
  const d = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (locale === "ar") {
    if (seconds < 60) return "الآن"
    if (minutes < 60) return `منذ ${minutes} دقيقة`
    if (hours < 24) return `منذ ${hours} ساعة`
    if (days < 7) return `منذ ${days} يوم`
    return formatDate(d, "ar")
  }

  if (seconds < 60) return "À l'instant"
  if (minutes < 60) return `Il y a ${minutes} min`
  if (hours < 24) return `Il y a ${hours} h`
  if (days < 7) return `Il y a ${days} j`
  return formatDate(d, "fr")
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function truncate(text: string, length = 100): string {
  if (text.length <= length) return text
  return text.slice(0, length).trimEnd() + "..."
}

export function generateListingSlug(title: string, id: string): string {
  const slug = slugify(title)
  const shortId = id.slice(0, 8)
  return `${slug}-${shortId}`
}

export function getListingTypeLabel(
  type: string,
  locale: "fr" | "ar"
): string {
  const labels: Record<string, { fr: string; ar: string }> = {
    VENTE: { fr: "Vente", ar: "بيع" },
    LOCATION: { fr: "Location", ar: "إيجار" },
    SERVICE: { fr: "Service", ar: "خدمة" },
    EMPLOI: { fr: "Emploi", ar: "وظيفة" },
    ECHANGE: { fr: "Échange", ar: "مبادلة" },
    DON: { fr: "Don", ar: "تبرع" },
    RECHERCHE: { fr: "Recherche", ar: "بحث" },
    URGENT: { fr: "Urgent", ar: "عاجل" },
    PROFESSIONNEL: { fr: "Professionnel", ar: "مهني" },
    PARTICULIER: { fr: "Particulier", ar: "فردي" },
  }
  return labels[type]?.[locale] ?? type
}

export function getStatusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "ACTIVE":
      return "default"
    case "PENDING":
      return "secondary"
    case "SOLD":
    case "RENTED":
      return "outline"
    case "REJECTED":
    case "DELETED":
      return "destructive"
    default:
      return "secondary"
  }
}
