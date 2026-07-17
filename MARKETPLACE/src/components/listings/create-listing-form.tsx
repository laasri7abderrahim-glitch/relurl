"use client"

import { useState, useRef } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { ImagePlus, X, Loader2, AlertTriangle, ShieldCheck } from "lucide-react"
import { useImageUpload } from "@/MARKETPLACE/src/hooks/use-image-upload"
import { useFraudCheck } from "@/MARKETPLACE/src/hooks/use-fraud-check"
import { LocationPicker } from "@/MARKETPLACE/src/components/forms/location-picker"

interface Props {
  locale: string
}

interface UploadedImage {
  url: string
  publicId: string
}

export function CreateListingForm({ locale }: Props) {
  const t = useTranslations("marketplace")
  const router = useRouter()
  const isArabic = locale === "ar"
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [listingType, setListingType] = useState("VENTE")
  const [category, setCategory] = useState("")
  const [city, setCity] = useState("")
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [isNegotiable, setIsNegotiable] = useState(false)
  const [isUrgent, setIsUrgent] = useState(false)
  const [contactPhone, setContactPhone] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [fraudWarning, setFraudWarning] = useState<string | null>(null)

  const { upload, remove, isUploading } = useImageUpload({ folder: "listings" })
  const { check, result: fraudResult, isChecking: isCheckingFraud } = useFraudCheck()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      const results = await upload(Array.from(files))
      setUploadedImages((prev) => [
        ...prev,
        ...results.map((r) => ({ url: r.url, publicId: r.publicId })),
      ])
    } catch {
    }
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleRemoveImage = async (index: number) => {
    const img = uploadedImages[index]
    await remove(img.publicId)
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleLocationChange = (lat: number, lng: number, selectedCity?: string) => {
    setLatitude(lat)
    setLongitude(lng)
    if (selectedCity) setCity(selectedCity)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFraudWarning(null)

    const fraudCheck = await check({
      title,
      description,
      price: price ? parseFloat(price) : null,
      city,
      contactPhone,
      userId: "current-user-id",
      images: uploadedImages.map((img) => ({ url: img.url })),
    })

    if (fraudCheck?.shouldBlock) {
      setFraudWarning(
        isArabic
          ? "تم حظر هذا الإعلان بسبب محتوى مشبوه. يرجى مراجعة الإعلان."
          : "Cette annonce a été bloquée en raison de contenu suspect. Veuillez la réviser."
      )
      setIsSubmitting(false)
      return
    }

    if (fraudCheck?.shouldReview) {
      setFraudWarning(
        isArabic
          ? "سيتم مراجعة إعلانك قبل النشر."
          : "Votre annonce sera examinée avant publication."
      )
    }

    const listingData = {
      title,
      description,
      price: price ? parseFloat(price) : null,
      listingType,
      category,
      city,
      latitude,
      longitude,
      isNegotiable,
      isUrgent,
      contactPhone,
      whatsapp,
      images: uploadedImages,
    }

    console.log("Submitting listing:", listingData)

    await new Promise((r) => setTimeout(r, 1500))
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {fraudWarning && (
        <div className={`flex items-start gap-3 p-4 rounded-xl ${
          fraudResult?.shouldBlock
            ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
            : "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300"
        }`}>
          {fraudResult?.shouldBlock ? (
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-medium">{fraudWarning}</p>
            {fraudResult?.signals && fraudResult.signals.length > 0 && (
              <ul className="mt-2 text-sm list-disc list-inside">
                {fraudResult.signals.map((s) => (
                  <li key={s.code}>{isArabic ? s.messageAr : s.message}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {isArabic ? "صور الإعلان" : "Photos de l'annonce"}
          </label>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            {uploadedImages.map((img, i) => (
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
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="aspect-square bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors"
            >
              {isUploading ? (
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              ) : (
                <ImagePlus className="w-8 h-8 text-gray-400" />
              )}
              <span className="text-xs text-gray-500">
                {isUploading ? "..." : (isArabic ? "إضافة صورة" : "Ajouter photo")}
              </span>
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
          <p className="text-xs text-gray-500 mt-2">
            {isArabic ? "حد أقصى 20 صورة، 10 ميجا لكل صورة" : "Max 20 images, 10 Mo par image"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {isArabic ? "عنوان الإعلان" : "Titre de l'annonce"} *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder={isArabic ? "مثال: شقة للبيع في الدار البيضاء" : "Ex: Appartement à vendre à Casablanca"}
              dir={isArabic ? "rtl" : "ltr"}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {isArabic ? "الفئة" : "Catégorie"} *
            </label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
              dir={isArabic ? "rtl" : "ltr"}
            >
              <option value="">{isArabic ? "اختر فئة" : "Choisir une catégorie"}</option>
              <option value="immobilier">{isArabic ? "عقارات" : "Immobilier"}</option>
              <option value="automobile">{isArabic ? "سيارات" : "Automobile"}</option>
              <option value="high-tech">{isArabic ? "إلكترونيات" : "High-Tech"}</option>
              <option value="mode">{isArabic ? "أزياء" : "Mode"}</option>
              <option value="maison">{isArabic ? "منزل" : "Maison"}</option>
              <option value="loisirs">{isArabic ? "ترفيه" : "Loisirs"}</option>
              <option value="sport">{isArabic ? "رياضة" : "Sport"}</option>
              <option value="beaute">{isArabic ? "جمال" : "Beauté"}</option>
              <option value="services">{isArabic ? "خدمات" : "Services"}</option>
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
            placeholder={isArabic ? "صف الإعلان بالتفصيل..." : "Décrivez votre annonce en détail..."}
            dir={isArabic ? "rtl" : "ltr"}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {isArabic ? "السعر (درهم)" : "Prix (MAD)"}
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {isArabic ? "نوع الإعلان" : "Type d'annonce"}
            </label>
            <select
              value={listingType}
              onChange={(e) => setListingType(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
              dir={isArabic ? "rtl" : "ltr"}
            >
              <option value="VENTE">{isArabic ? "بيع" : "Vente"}</option>
              <option value="LOCATION">{isArabic ? "إيجار" : "Location"}</option>
              <option value="SERVICE">{isArabic ? "خدمة" : "Service"}</option>
              <option value="EMPLOI">{isArabic ? "وظيفة" : "Emploi"}</option>
              <option value="ECHANGE">{isArabic ? "مبادلة" : "Échange"}</option>
              <option value="DON">{isArabic ? "تبرع" : "Don"}</option>
            </select>
          </div>

          <LocationPicker
            latitude={latitude}
            longitude={longitude}
            city={city}
            onChange={handleLocationChange}
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
              {isArabic ? "السعر قابل للتفاوض" : "Prix négociable"}
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
              {isArabic ? "إعلان عاجل" : "Annonce urgente"}
            </span>
          </label>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
          {isArabic ? "معلومات الاتصال" : "Informations de contact"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {isArabic ? "رقم الهاتف" : "Téléphone"}
            </label>
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
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
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="+212 6XX-XXX-XXX"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          {isArabic ? "إلغاء" : "Annuler"}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || isCheckingFraud}
          className="gap-2"
        >
          {(isSubmitting || isCheckingFraud) && <Loader2 className="w-4 h-4 animate-spin" />}
          {isCheckingFraud
            ? (isArabic ? "جاري الفحص..." : "Vérification...")
            : isSubmitting
              ? (isArabic ? "جاري النشر..." : "Publication...")
              : (isArabic ? "نشر الإعلان" : "Publier l'annonce")}
        </Button>
      </div>
    </form>
  )
}