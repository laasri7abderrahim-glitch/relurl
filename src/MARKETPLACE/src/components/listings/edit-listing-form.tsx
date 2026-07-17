"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { ImagePlus, X, Loader2, Trash2 } from "lucide-react"
import { useImageUpload } from "@/MARKETPLACE/src/hooks/use-image-upload"
import { LocationPicker } from "@/MARKETPLACE/src/components/forms/location-picker"

interface Props {
  locale: string
  listing?: {
    id: string
    title: string
    description: string
    price: number | null
    listingType: string
    city: string
    latitude: number | null
    longitude: number | null
    isNegotiable: boolean
    isUrgent: boolean
    contactPhone: string | null
    whatsapp: string | null
    images: { url: string; publicId: string }[]
    status: string
  }
}

export function EditListingForm({ locale, listing }: Props) {
  const t = useTranslations("marketplace")
  const router = useRouter()
  const isArabic = locale === "ar"
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [title, setTitle] = useState(listing?.title || "")
  const [description, setDescription] = useState(listing?.description || "")
  const [price, setPrice] = useState(listing?.price?.toString() || "")
  const [listingType, setListingType] = useState(listing?.listingType || "VENTE")
  const [city, setCity] = useState(listing?.city || "")
  const [latitude, setLatitude] = useState<number | null>(listing?.latitude || null)
  const [longitude, setLongitude] = useState<number | null>(listing?.longitude || null)
  const [isNegotiable, setIsNegotiable] = useState(listing?.isNegotiable || false)
  const [isUrgent, setIsUrgent] = useState(listing?.isUrgent || false)
  const [contactPhone, setContactPhone] = useState(listing?.contactPhone || "")
  const [whatsapp, setWhatsapp] = useState(listing?.whatsapp || "")
  const [images, setImages] = useState(listing?.images || [])
  const [status, setStatus] = useState(listing?.status || "ACTIVE")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const { upload, remove, isUploading } = useImageUpload({ folder: "listings" })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    try {
      const results = await upload(Array.from(files))
      setImages((prev) => [
        ...prev,
        ...results.map((r) => ({ url: r.url, publicId: r.publicId })),
      ])
    } catch {}
  }

  const handleRemoveImage = async (index: number) => {
    const img = images[index]
    if (img.publicId) await remove(img.publicId)
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 1000))
    setIsSubmitting(false)
  }

  const handleDelete = async () => {
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 1000))
    router.push("/marketplace/dashboard/my-listings")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {isArabic ? "تعديل الإعلان" : "Modifier l'annonce"}
        </h1>
        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm border border-gray-200 dark:border-gray-700"
          >
            <option value="ACTIVE">{isArabic ? "نشط" : "Actif"}</option>
            <option value="INACTIVE">{isArabic ? "غير نشط" : "Inactif"}</option>
            <option value="SOLD">{isArabic ? "تم البيع" : "Vendu"}</option>
          </select>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
          <p className="text-red-700 dark:text-red-300 text-sm mb-3">
            {isArabic ? "هل أنت متأكد من حذف هذا الإعلان؟" : "Êtes-vous sûr de vouloir supprimer cette annonce ?"}
          </p>
          <div className="flex gap-2">
            <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isSubmitting}>
              {isArabic ? "نعم، حذف" : "Oui, supprimer"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
              {isArabic ? "إلغاء" : "Annuler"}
            </Button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {isArabic ? "الصور" : "Photos"}
            </label>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label className="aspect-square bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors cursor-pointer">
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                {isUploading ? (
                  <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                ) : (
                  <ImagePlus className="w-8 h-8 text-gray-400" />
                )}
                <span className="text-xs text-gray-500">{isArabic ? "إضافة" : "Ajouter"}</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {isArabic ? "العنوان" : "Titre"} *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                dir={isArabic ? "rtl" : "ltr"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {isArabic ? "النوع" : "Type"}
              </label>
              <select
                value={listingType}
                onChange={(e) => setListingType(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
              >
                <option value="VENTE">{isArabic ? "بيع" : "Vente"}</option>
                <option value="LOCATION">{isArabic ? "إيجار" : "Location"}</option>
                <option value="SERVICE">{isArabic ? "خدمة" : "Service"}</option>
                <option value="EMPLOI">{isArabic ? "وظيفة" : "Emploi"}</option>
                <option value="ECHANGE">{isArabic ? "مبادلة" : "Échange"}</option>
                <option value="DON">{isArabic ? "تبرع" : "Don"}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {isArabic ? "الوصف" : "Description"} *
            </label>
            <textarea
              required
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              dir={isArabic ? "rtl" : "ltr"}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {isArabic ? "السعر (MAD)" : "Prix (MAD)"}
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
              />
            </div>

            <LocationPicker
              latitude={latitude}
              longitude={longitude}
              city={city}
              onChange={(lat, lng, c) => {
                setLatitude(lat)
                setLongitude(lng)
                if (c) setCity(c)
              }}
              locale={locale}
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isNegotiable}
                onChange={(e) => setIsNegotiable(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {isArabic ? "قابل للتفاوض" : "Négociable"}
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {isArabic ? "عاجل" : "Urgent"}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {isArabic ? "الهاتف" : "Téléphone"}
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                placeholder="+212 6XX-XXX-XXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                WhatsApp
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                placeholder="+212 6XX-XXX-XXX"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            {isArabic ? "إلغاء" : "Annuler"}
          </Button>
          <Button type="submit" disabled={isSubmitting} className="gap-2">
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isArabic ? "حفظ التغييرات" : "Enregistrer"}
          </Button>
        </div>
      </form>
    </div>
  )
}