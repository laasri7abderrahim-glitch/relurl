"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import {
  BarChart3, TrendingUp, Users, Eye, Heart, MessageCircle,
  Calendar, ArrowUpRight, ArrowDownRight, Clock,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface Props {
  locale: string
}

const weeklyViews = [
  { day: "Lun", views: 45 },
  { day: "Mar", views: 62 },
  { day: "Mer", views: 38 },
  { day: "Jeu", views: 87 },
  { day: "Ven", views: 120 },
  { day: "Sam", views: 156 },
  { day: "Dim", views: 98 },
]

const monthlyData = [
  { month: "Jan", vues: 320, favoris: 28, messages: 12 },
  { month: "Fév", vues: 450, favoris: 35, messages: 18 },
  { month: "Mar", vues: 380, favoris: 42, messages: 15 },
  { month: "Avr", vues: 520, favoris: 51, messages: 22 },
  { month: "Mai", vues: 680, favoris: 63, messages: 28 },
  { month: "Juin", vues: 890, favoris: 78, messages: 34 },
]

const listingPerformance = [
  { name: "Appartement Maarif", views: 2847, favorites: 134, contacts: 45 },
  { name: "Villa Californie", views: 5621, favorites: 289, contacts: 89 },
  { name: "Mercedes GLC", views: 3412, favorites: 178, contacts: 56 },
  { name: "iPhone 15 Pro", views: 4567, favorites: 312, contacts: 123 },
]

export function StatsClient({ locale }: Props) {
  const t = useTranslations("marketplace")
  const isArabic = locale === "ar"
  const [period, setPeriod] = useState<"week" | "month" | "year">("month")

  const stats = [
    {
      icon: Eye,
      label: isArabic ? "المشاهدات" : "Vues totales",
      value: "12,847",
      change: "+18%",
      up: true,
    },
    {
      icon: Heart,
      label: isArabic ? "المفضلة" : "Favoris reçus",
      value: "432",
      change: "+12%",
      up: true,
    },
    {
      icon: MessageCircle,
      label: isArabic ? "الرسائل" : "Messages reçus",
      value: "89",
      change: "+25%",
      up: true,
    },
    {
      icon: Users,
      label: isArabic ? "الزوار الفريدون" : "Visiteurs uniques",
      value: "3,241",
      change: "-3%",
      up: false,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {isArabic ? "الإحصائيات" : "Statistiques"}
        </h1>
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {(["week", "month", "year"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                period === p
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {p === "week" ? (isArabic ? "أسبوع" : "Semaine") : p === "month" ? (isArabic ? "شهر" : "Mois") : (isArabic ? "سنة" : "Année")}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value, change, up }) => (
          <div key={label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${up ? "text-green-600" : "text-red-500"}`}>
                {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {change}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {isArabic ? "المشاهدات هذا الأسبوع" : "Vues cette semaine"}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyViews}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ fill: "#6366f1", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {isArabic ? "المشاهدات الشهرية" : "Évolution mensuelle"}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                }}
              />
              <Bar dataKey="vues" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="favoris" fill="#ec4899" radius={[4, 4, 0, 0]} />
              <Bar dataKey="messages" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {isArabic ? "أداء الإعلانات" : "Performance des annonces"}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                <th className="pb-3 font-medium">{isArabic ? "الإعلان" : "Annonce"}</th>
                <th className="pb-3 font-medium text-center">{isArabic ? "المشاهدات" : "Vues"}</th>
                <th className="pb-3 font-medium text-center">{isArabic ? "المفضلة" : "Favoris"}</th>
                <th className="pb-3 font-medium text-center">{isArabic ? "الجهات" : "Contacts"}</th>
                <th className="pb-3 font-medium text-center">{isArabic ? "معدل التحويل" : "Taux conversion"}</th>
              </tr>
            </thead>
            <tbody>
              {listingPerformance.map((listing) => (
                <tr key={listing.name} className="border-b border-gray-50 dark:border-gray-800/50 last:border-0">
                  <td className="py-3 font-medium text-gray-900 dark:text-gray-100">{listing.name}</td>
                  <td className="py-3 text-center text-gray-600 dark:text-gray-400">{listing.views.toLocaleString()}</td>
                  <td className="py-3 text-center text-gray-600 dark:text-gray-400">{listing.favorites}</td>
                  <td className="py-3 text-center text-gray-600 dark:text-gray-400">{listing.contacts}</td>
                  <td className="py-3 text-center">
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                      {((listing.contacts / listing.views) * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {isArabic ? "النشاط الأخير" : "Activité récente"}
        </h3>
        <div className="space-y-4">
          {[
            { time: "14:32", text: isArabic ? "شخص شاهد إعلان الشقة في Maarif" : "Quelqu'un a consulté votre annonce Appartement Maarif", icon: Eye },
            { time: "13:15", text: isArabic ? "أضف شخص فيلا كاليفورنيا إلى المفضلة" : "Quelqu'un a ajouté Villa Californie en favori", icon: Heart },
            { time: "11:45", text: isArabic ? "رسالة جديدة حول Mercedes GLC" : "Nouveau message concernant Mercedes GLC", icon: MessageCircle },
            { time: "09:20", text: isArabic ? "3 مشاهدات جديدة لـ iPhone 15 Pro" : "3 nouvelles vues sur iPhone 15 Pro", icon: Eye },
          ].map((activity, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                <activity.icon className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-300">{activity.text}</p>
                <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}