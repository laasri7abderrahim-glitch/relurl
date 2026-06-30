import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/layout/auth-provider"
import { ToastProvider } from "@/components/ui/toast"
import { ThemeProvider } from "@/components/theme-provider"
import { cookies } from "next/headers"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
  adjustFontFallback: true,
})

export const metadata: Metadata = {
  title: {
    default: "RELURL - URL Shortener, Branded Short Links & Analytics",
    template: "%s | RELURL",
  },
  description: "Free URL shortener with analytics, QR codes, and branded short links.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  metadataBase: new URL("https://relurl.com"),
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", sizes: "32x32", type: "image/svg+xml" },
    ],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en"

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="0SZFU0NTSFhndtO-Mc5Zd8j4S0WyTHsxwXK_XjO6JuI" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${inter.className}`} suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
