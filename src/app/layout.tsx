import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/layout/auth-provider";
import { ToastProvider } from "@/components/ui/toast";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "RELURL - URL Shortener, Branded Short Links & Analytics",
    template: "%s | RELURL",
  },
  description:
    "The original URL shortener that shortens your unwieldly links into more manageable and useable URLs. Trusted since 2002.",
  keywords: ["url shortener", "short links", "branded links", "link management", "analytics"],
  openGraph: {
    title: "RELURL - URL Shortener, Branded Short Links & Analytics",
    description:
      "The original URL shortener that shortens your unwieldly links into more manageable and useable URLs.",
    url: "https://relurl.com",
    siteName: "RELURL",
    images: [{ url: "https://relurl.com/og-image.png", width: 1200, height: 630, alt: "RELURL" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RELURL - URL Shortener, Branded Short Links & Analytics",
    description:
      "The original URL shortener that shortens your unwieldly links into more manageable and useable URLs.",
    images: ["https://relurl.com/og-image.png"],
  },
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "RELURL",
            url: "https://relurl.com",
            logo: "https://relurl.com/logo.png",
            description: "RELURL is a free URL shortener service with analytics, QR codes, and branded short links.",
          })}}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "RELURL",
            url: "https://relurl.com",
            description: "Free URL shortener with analytics, QR codes, and branded links",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://relurl.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          })}}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
