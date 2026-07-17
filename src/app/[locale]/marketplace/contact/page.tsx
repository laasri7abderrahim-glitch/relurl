import { getTranslations } from "next-intl/server"
import { Mail, Phone, MapPin, Clock } from "lucide-react"
import { ContactForm } from "@/MARKETPLACE/src/components/forms/contact-form"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isArabic = locale === "ar"
  return {
    title: isArabic ? "اتصل بنا - MarocMarket" : "Contact - MarocMarket",
  }
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  const isArabic = locale === "ar"

  const contactInfo = [
    { icon: Phone, label: isArabic ? "الهاتف" : "Téléphone", value: "+212 520-000-000" },
    { icon: Mail, label: "Email", value: "contact@marocmarket.ma" },
    { icon: MapPin, label: isArabic ? "العنوان" : "Adresse", value: "Casablanca, Maroc" },
    { icon: Clock, label: isArabic ? "ساعات العمل" : "Horaires", value: isArabic ? "9:00 - 18:00" : "9h - 18h" },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        {isArabic ? "اتصل بنا" : "Contactez-nous"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {contactInfo.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {isArabic ? "أرسل لنا رسالة" : "Envoyez-nous un message"}
        </h2>
        <ContactForm locale={locale} />
      </div>
    </div>
  )
}
