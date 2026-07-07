import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Password Protected Links - Secure URL Shortener",
    description: "Create password protected short links with RELURL. Add an extra layer of security to your URLs with customizable passwords and access controls.",
    path: "/password-protected-links",
    keywords: ["password protected links", "secure url shortener", "protected short links", "link password protection"],
    locale,
  })
}

export default function PasswordProtectedLinksPage() {
  const href = "/password-protected-links"
  const relatedArticles = getPostsByLandingPage("/custom-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Password Protected Links"
      subtitle="Secure Your Short Links"
      description="Add password protection to your shortened URLs for an extra layer of security. Share sensitive content with confidence by requiring a password before access."
      placeholder="https://example.com/confidential-document"
      generateLabel="Create Protected Link"
      features={[
        "Password Protection",
        "Custom Access Control",
        "Easy Password Setup",
        "Secure Redirect",
        "Link Expiration",
        "Access Analytics",
      ]}
      howItWorks={[
        { step: "Enter Your URL", desc: "Paste the link you want to secure with password protection." },
        { step: "Set a Password", desc: "Choose a password that recipients must enter to access the link." },
        { step: "Share Securely", desc: "Share the short link and password separately with your intended audience." },
      ]}
      useCases={[
        "Share confidential documents with clients",
        "Protect premium content behind a password",
        "Secure internal company links",
        "Control access to private resources",
        "Share sensitive information safely",
        "Create gated content for specific audiences",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "How does password protection work?", a: "When someone clicks your password protected short link, they are prompted to enter the password before being redirected to the destination URL. The password is set by you and can be changed anytime." },
        { q: "Can I change the password after creating the link?", a: "Yes, you can update or remove the password protection on any of your short links from your RELURL dashboard at any time." },
        { q: "Is password protection secure?", a: "Password protected links add a basic layer of security suitable for controlling access to content. For highly sensitive data, we recommend using dedicated encryption and secure sharing methods alongside password protection." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
