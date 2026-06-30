import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"
import { getPostsByLandingPage } from "@/lib/blog/posts"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Crypto Link Shortener - Blockchain & Token Links",
    description: "Shorten wallet, DeFi, and crypto project links. Track investor interest and share blockchain content with RELURL's crypto link shortener.",
    path: "/crypto-link-shortener",
    keywords: ["crypto link shortener", "blockchain link generator", "defi link shortener"],
    locale,
  })
}

export default function CryptoLinkShortenerPage() {
  const href = "/crypto-link-shortener"
  const relatedArticles = getPostsByLandingPage("/crypto-link-shortener").slice(0, 3)
  return (
    <URLLandingPage
      title="Crypto Link Shortener"
      subtitle="Simplify Crypto Sharing"
      description="Shorten wallet addresses, DeFi links, and crypto project URLs. Track investor interest and share blockchain content securely."
      placeholder="https://app.uniswap.org/swap?token=0x..."
      inputLabel="Enter your crypto URL"
      generateLabel="Shorten URL"
      features={[
        "Wallet Address Shortening",
        "DeFi Protocol Links",
        "NFT Collection URLs",
        "Airdrop Claim Links",
        "ICO & IDO Links",
        "Analytics Dashboard",
      ]}
      howItWorks={[
        { step: "Paste Crypto URL", desc: "Enter your wallet, DeFi, or project page link." },
        { step: "Generate Short Link", desc: "Create a clean URL easy for your community to share." },
        { step: "Share & Track", desc: "Post on Twitter, Telegram, and Discord to grow adoption." },
      ]}
      useCases={[
        "Token launch promotions",
        "NFT mint page sharing",
        "DeFi protocol onboarding",
        "Airdrop campaign links",
        "Community growth campaigns",
        "Crypto event marketing",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}

      relatedArticles={relatedArticles}
    />
  )
}