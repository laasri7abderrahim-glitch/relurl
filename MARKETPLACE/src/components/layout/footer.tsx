"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"

interface Props {
  locale: string
}

export function MarketplaceFooter({ locale }: Props) {
  const t = useTranslations("marketplace")
  const isArabic = locale === "ar"

  const sections = [
    {
      title: t("footer.categories"),
      links: [
        { href: "/marketplace/categories/immobilier", label: t("categories.immobilier") },
        { href: "/marketplace/categories/automobile", label: t("categories.automobile") },
        { href: "/marketplace/categories/high-tech", label: t("categories.highTech") },
        { href: "/marketplace/categories/emploi", label: t("categories.emploi") },
        { href: "/marketplace/categories/services", label: t("categories.services") },
        { href: "/marketplace/categories/maison", label: t("categories.maison") },
      ],
    },
    {
      title: t("footer.forSellers"),
      links: [
        { href: "/marketplace/create", label: t("footer.createAd") },
        { href: "/marketplace/dashboard", label: t("footer.myDashboard") },
        { href: "/marketplace/dashboard/my-listings", label: t("footer.myListings") },
        { href: "/marketplace/dashboard/messages", label: t("footer.messages") },
        { href: "/marketplace/dashboard/settings", label: t("footer.settings") },
      ],
    },
    {
      title: t("footer.help"),
      links: [
        { href: "/marketplace/help", label: t("footer.faq") },
        { href: "/marketplace/help/safety", label: t("footer.safety") },
        { href: "/marketplace/help/terms", label: t("footer.terms") },
        { href: "/marketplace/help/privacy", label: t("footer.privacy") },
        { href: "/marketplace/contact", label: t("footer.contact") },
      ],
    },
    {
      title: t("footer.about"),
      links: [
        { href: "/marketplace/about", label: t("footer.aboutUs") },
        { href: "/marketplace/blog", label: t("footer.blog") },
        { href: "/marketplace/cities", label: t("footer.cities") },
        { href: "/marketplace/professionals", label: t("footer.professionals") },
        { href: "/marketplace/pricing", label: t("footer.pricing") },
      ],
    },
  ]

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">MarocMarket</span>
            </div>

            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                0520-000-000
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                contact@marocmarket.ma
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Casablanca, Maroc
              </span>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} MarocMarket. {t("footer.rights")}
          </div>
        </div>
      </div>
    </footer>
  )
}
