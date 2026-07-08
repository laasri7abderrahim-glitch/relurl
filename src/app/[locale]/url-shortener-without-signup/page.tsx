import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "URL Shortener Without Signup",
    description: "Shorten any URL without signup or registration using RELURL. Fast, private link shortening with no account required. Create short links in seconds.",
    path: "/url-shortener-without-signup",
    keywords: ["url shortener without signup", "shorten link without account", "no registration url shortener", "anonymous url shortener"],
    locale,
  })
}

export default function Page() {
  const href = "/url-shortener-without-signup"
  const relatedArticles = getPostsByLandingPage("/free-url-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="URL Shortener Without Signup"
      subtitle="Shorten Instantly"
      description="Shorten any URL without signup or registration using RELURL. Fast, private link shortening with no account required. Create short links in seconds."
      placeholder="Enter your long URL here..."
      generateLabel="Shorten Instantly"
      features={["URL Compression", "Free Forever", "No Expiration", "Click Analytics", "QR Code Generation", "Password Protection"]}
      howItWorks={[
        { step: "Enter Your URL", desc: "Type or paste any long URL into the input box. No email or password needed." },
        { step: "Click Shorten", desc: "Hit the button and we'll instantly compress your URL into a clean short link." },
        { step: "Use It Anywhere", desc: "Copy your new short link and share it on social media, in messages, or on your website." },
      ]}
      useCases={["Create instant short links for social media sharing", "Shorten URLs anonymously without leaving a trace", "Generate links quickly for chat and messaging apps", "Test different URL shorteners without commitment", "Create temporary links for fast-paced project collaboration"]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
      faqs={[
        { q: "Is there any catch to using RELURL without signing up?", a: "No catch. You get full URL shortening functionality without any registration. Upgrade only if you need advanced analytics." },
        { q: "Can I create multiple short links without an account?", a: "Yes, you can shorten as many URLs as you want without signing up. No limits on the free tier." },
        { q: "What features do I get if I sign up later?", a: "Signing up unlocks custom aliases, detailed analytics, link management dashboard, and QR code downloads." },
      ]}
      relatedArticles={relatedArticles}
    />
  )
}
