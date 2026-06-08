"use client"

import Link from "next/link"

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Integrations", href: "/integrations" },
      { label: "API", href: "/api" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "URL Shortener",
    links: [
      { label: "Custom URL Shortener", href: "/custom-url-shortener" },
      { label: "Branded Link Shortener", href: "/branded-link-shortener" },
      { label: "Bulk URL Shortener", href: "/bulk-url-shortener" },
      { label: "Free URL Shortener", href: "/free-url-shortener" },
      { label: "All URL Tools", href: "/custom-url-shortener" },
    ],
  },
  {
    title: "QR Codes",
    links: [
      { label: "QR Code Generator", href: "/qr-code-generator" },
      { label: "Dynamic QR Codes", href: "/dynamic-qr-code-generator" },
      { label: "WiFi QR Code", href: "/qr-code-for-wifi" },
      { label: "vCard QR Code", href: "/qr-code-for-vcard" },
      { label: "All QR Codes", href: "/qr-code-generator" },
    ],
  },
  {
    title: "Social Links",
    links: [
      { label: "Instagram Link Generator", href: "/instagram-link-generator" },
      { label: "WhatsApp Link Generator", href: "/whatsapp-link-generator" },
      { label: "TikTok Bio Link", href: "/tiktok-bio-link-generator" },
      { label: "YouTube Link Generator", href: "/youtube-link-generator" },
      { label: "All Social Tools", href: "/instagram-link-generator" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "GDPR", href: "/gdpr" },
      { label: "DMCA", href: "/dmca" },
    ],
  },
]

function Footer() {
  return (
    <footer className="border-t border-dark-100 bg-dark-700">
      <div className="container py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-4 text-sm font-semibold text-dark-50">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-dark-100 transition-colors hover:text-dark-50"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-dark-100 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-dark-50">
              <span className="text-primary-500">REL</span>
              <span>URL</span>
            </Link>
            <p className="text-xs text-dark-100">
              &copy; {new Date().getFullYear()} RELURL. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
