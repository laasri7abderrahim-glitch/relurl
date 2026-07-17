import { getTranslations } from "next-intl/server"

interface Props {
  params: Promise<{ locale: string }>
}

export default async function SettingsPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "marketplace" })
  const isArabic = locale === "ar"

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {isArabic ? "الإعدادات" : "Paramètres"}
      </h1>

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {isArabic ? "المعلومات الشخصية" : "Informations personnelles"}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {isArabic ? "الاسم" : "Nom"}
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                dir={isArabic ? "rtl" : "ltr"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {isArabic ? "البريد الإلكتروني" : "Email"}
              </label>
              <input
                type="email"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                dir={isArabic ? "rtl" : "ltr"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {isArabic ? "رقم الهاتف" : "Téléphone"}
              </label>
              <input
                type="tel"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                dir={isArabic ? "rtl" : "ltr"}
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {isArabic ? "الإشعارات" : "Notifications"}
          </h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {isArabic ? "إشعارات البريد الإلكتروني" : "Notifications email"}
              </span>
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary focus:ring-primary" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {isArabic ? "رسائل جديدة" : "Nouveaux messages"}
              </span>
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary focus:ring-primary" />
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
