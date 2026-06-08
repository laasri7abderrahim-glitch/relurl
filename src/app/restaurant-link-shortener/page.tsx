import type { Metadata } from "next"
import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Restaurant Link Shortener - Menu & Reservation Links",
  description: "Shorten menu, reservation, and delivery links for your restaurant. Drive more orders and bookings with clean, trackable URLs.",
  path: "/restaurant-link-shortener",
  keywords: ["restaurant link shortener", "menu link generator", "restaurant marketing"],
})

export default function RestaurantLinkShortenerPage() {
  const href = "/restaurant-link-shortener"
  return (
    <URLLandingPage
      title="Restaurant Link Shortener"
      subtitle="Fill More Tables"
      description="Shorten menu, reservation, and delivery links. Drive more orders and bookings with clean, trackable URLs that customers remember."
      placeholder="https://restaurant.com/menu/lunch-specials"
      inputLabel="Enter your restaurant URL"
      generateLabel="Shorten URL"
      features={[
        "Menu Link Tracking",
        "Reservation Analytics",
        "Delivery Platform Links",
        "QR Code for Tables",
        "Seasonal Menu Updates",
        "Local SEO Friendly",
      ]}
      howItWorks={[
        { step: "Paste Restaurant URL", desc: "Enter your menu, reservation, or delivery page link." },
        { step: "Create Short Link", desc: "Generate a clean URL easy for customers to type." },
        { step: "Promote & Fill Tables", desc: "Share on social media, print on menus, and track orders." },
      ]}
      useCases={[
        "Online menu sharing",
        "Reservation page links",
        "Delivery platform promotion",
        "Special event announcements",
        "Loyalty program signups",
        "Catering inquiry links",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
    />
  )
}
