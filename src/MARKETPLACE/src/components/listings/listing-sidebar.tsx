"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import {
  Phone, MessageCircle, Heart, Flag, Share2, User, BadgeCheck,
  Send, ExternalLink, Copy, Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { MarketplaceListing } from "@/MARKETPLACE/src/types"

interface Props {
  listing: MarketplaceListing
  locale: string
}

export function ListingSidebar({ listing, locale }: Props) {
  const t = useTranslations("marketplace")
  const isArabic = locale === "ar"
  const [copied, setCopied] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [offerAmount, setOfferAmount] = useState("")
  const [offerMessage, setOfferMessage] = useState("")
  const [showOfferForm, setShowOfferForm] = useState(false)

  const shareUrl = typeof window !== "undefined" ? window.location.href : ""
  const shareText = `${listing.title} - ${listing.price ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: listing.currency, maximumFractionDigits: 0 }).format(listing.price) : ""}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`, "_blank")
  }

  const handleShareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, "_blank")
  }

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")
  }

  return (
    <div className="space-y-6 sticky top-24">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
        {listing.price != null && (
          <div className="text-center pb-4 border-b border-gray-100 dark:border-gray-800">
            <p className="text-3xl font-bold text-primary">
              {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: listing.currency,
                maximumFractionDigits: 0,
              }).format(listing.price)}
            </p>
            {listing.isNegotiable && (
              <p className="text-sm text-gray-500 mt-1">
                {isArabic ? "قابل للتفاوض" : "Prix négociable"}
              </p>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            {listing.user?.image ? (
              <img src={listing.user.image} alt="" className="w-12 h-12 rounded-full" />
            ) : (
              <User className="w-6 h-6 text-primary" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                {listing.user?.name || "Anonyme"}
              </p>
              {listing.user?.isVerified && (
                <BadgeCheck className="w-4 h-4 text-blue-500" />
              )}
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              {isArabic ? "عضو منذ" : "Membre depuis"}{" "}
              {new Date(listing.user?.createdAt || listing.createdAt).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {listing.contactPhone && (
            <Button className="w-full gap-2" size="lg" asChild>
              <a href={`tel:${listing.contactPhone}`}>
                <Phone className="w-4 h-4" />
                {listing.contactPhone}
              </a>
            </Button>
          )}

          <Button variant="outline" className="w-full gap-2" size="lg" asChild>
            <a href={`/marketplace/messages?listing=${listing.id}`}>
              <MessageCircle className="w-4 h-4" />
              {isArabic ? "إرسال رسالة" : "Envoyer un message"}
            </a>
          </Button>

          {listing.whatsapp && (
            <a
              href={`https://wa.me/${listing.whatsapp}?text=${encodeURIComponent(`Bonjour, je suis intéressé par votre annonce: ${listing.title}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          )}

          {listing.isNegotiable && (
            <Button
              variant="outline"
              className="w-full gap-2"
              size="lg"
              onClick={() => setShowOfferForm(!showOfferForm)}
            >
              <Send className="w-4 h-4" />
              {isArabic ? "تقديم عرض" : "Proposer un prix"}
            </Button>
          )}
        </div>

        {showOfferForm && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl space-y-3">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
              {isArabic ? "أرسل عرضك" : "Votre offre"}
            </p>
            <input
              type="number"
              value={offerAmount}
              onChange={(e) => setOfferAmount(e.target.value)}
              placeholder={isArabic ? "المبلغ (MAD)" : "Montant (MAD)"}
              className="w-full px-3 py-2 border border-blue-200 dark:border-blue-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              value={offerMessage}
              onChange={(e) => setOfferMessage(e.target.value)}
              placeholder={isArabic ? "رسالة اختيارية..." : "Message optionnel..."}
              rows={2}
              className="w-full px-3 py-2 border border-blue-200 dark:border-blue-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <Button size="sm" className="w-full">
              {isArabic ? "إرسال العرض" : "Envoyer l'offre"}
            </Button>
          </div>
        )}

        <div className="relative">
          <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <Heart className="w-4 h-4" />
              {isArabic ? "حفظ" : "Favori"}
            </button>
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
              {isArabic ? "مشاركة" : "Partager"}
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <Flag className="w-4 h-4" />
              {isArabic ? "إبلاغ" : "Signaler"}
            </button>
          </div>

          {showShareMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg p-2 space-y-1">
              <button
                onClick={handleShareWhatsApp}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </button>
              <button
                onClick={handleShareTelegram}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Telegram
              </button>
              <button
                onClick={handleShareFacebook}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Facebook
              </button>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? (isArabic ? "تم النسخ" : "Copié") : (isArabic ? "نسخ الرابط" : "Copier le lien")}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
          {isArabic ? "معلومات الإعلان" : "Informations sur l'annonce"}
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>{isArabic ? "المعرف" : "ID"}</span>
            <span className="text-gray-900 dark:text-gray-100 font-mono">
              #{listing.id.slice(0, 8)}
            </span>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>{isArabic ? "نوع الإعلان" : "Type"}</span>
            <span className="text-gray-900 dark:text-gray-100">{listing.listingType}</span>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>{isArabic ? "تاريخ النشر" : "Publié le"}</span>
            <span className="text-gray-900 dark:text-gray-100">
              {new Date(listing.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>{isArabic ? "عدد المشاهدات" : "Vues"}</span>
            <span className="text-gray-900 dark:text-gray-100">{listing.viewsCount}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
