import { getTranslations } from "next-intl/server"
import { DashboardSidebar } from "@/MARKETPLACE/src/components/dashboard/sidebar"
import type { Metadata } from "next"

interface Props {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isArabic = locale === "ar"
  return {
    title: isArabic ? "لوحة التحكم - MarocMarket" : "Tableau de bord - MarocMarket",
    robots: { index: false, follow: false },
  }
}

export default async function DashboardLayout({ children, params }: Props) {
  const { locale } = await params
  const isArabic = locale === "ar"

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <DashboardSidebar locale={locale} />
        </aside>
        <main className="md:col-span-3">{children}</main>
      </div>
    </div>
  )
}
