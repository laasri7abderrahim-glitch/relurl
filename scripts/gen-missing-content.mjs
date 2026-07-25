import fs from "fs"
import path from "path"

const DIR = path.join(import.meta.dirname, "..", "messages")
const en = JSON.parse(fs.readFileSync(path.join(DIR, "en.json"), "utf8"))

// Generate rich content for pages that are missing it
// Uses page title to create appropriate content
function genContent(slug, page) {
  const t = page.title || slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
  const niche = t.toLowerCase()

  const longDescription = `${t} is a professional-grade tool from RELURL designed specifically for ${niche.includes("for") ? niche : "creating and managing short URLs for " + niche}. With ${t}, you get reliable link management, real-time click analytics, and customizable short links that build brand trust. Unlike generic URL shorteners, ${t} offers features tailored to your specific needs — whether that's bulk link creation, custom slugs, branded domains, or QR code integration. Start optimizing your link strategy today with a tool built for performance.`

  const benefits = [
    {
      title: `Optimized for ${t}`,
      description: `${t} provides link management features specifically designed for your use case, ensuring you get the most relevant tools and analytics for your workflow.`
    },
    {
      title: "Real-Time Analytics",
      description: "Track every click with detailed analytics including geographic location, device type, referrer source, and time-based trends. Make data-driven decisions about your link strategy."
    },
    {
      title: "Custom Branded Links",
      description: "Use your own domain name for all shortened URLs. Branded links increase click-through rates by up to 39% and build trust with your audience every time they see your brand in the link."
    },
    {
      title: "Seamless Integration",
      description: `${t} integrates with your existing workflow through our powerful API, browser extension, and bulk link management tools. Shorten, organize, and track hundreds of links in minutes.`
    }
  ]

  const whyChoose = `${t} stands out because it combines enterprise-grade link management with a simple, intuitive interface. Unlike free URL shorteners that limit your features, ${t} gives you unlimited links, custom slugs, detailed analytics, and QR code generation — all from one platform. Our infrastructure ensures 99.9% uptime and sub-millisecond redirect speed, so your links always work when your audience clicks them.`

  const comparisonPoints = [
    `Unlike generic URL shorteners, ${t} offers dedicated features for your specific use case`,
    `${t} provides detailed analytics that free alternatives hide behind paywalls`,
    `${t} supports custom branded domains, giving you professional short links that build brand recognition`,
    `${t} includes QR code generation for every short link, bridging digital and offline marketing`
  ]

  const tips = [
    {
      title: `Use descriptive slugs`,
      description: `When creating links with ${t}, always use descriptive custom slugs instead of random strings. A slug like "yourbrand.link/summer-sale" tells users exactly what to expect and improves click-through rates.`
    },
    {
      title: `Track performance regularly`,
      description: `Check your ${t} analytics dashboard weekly to identify which links drive the most traffic. Use this data to refine your content strategy and focus on what works best for your audience.`
    },
    {
      title: `Combine with QR codes`,
      description: `Every short link created with ${t} comes with a free QR code. Print these on business cards, flyers, product packaging, or in-store displays to bridge your offline and online marketing efforts.`
    }
  ]

  return { longDescription, benefits, whyChoose, comparisonPoints, tips }
}

// Apply to all missing pages
let count = 0
for (const slug of Object.keys(en.pages)) {
  const p = en.pages[slug]
  if (p.longDescription && p.benefits && p.whyChoose && p.comparisonPoints && p.tips) continue
  const rich = genContent(slug, p)
  p.longDescription = rich.longDescription
  p.benefits = rich.benefits
  p.whyChoose = rich.whyChoose
  p.comparisonPoints = rich.comparisonPoints
  p.tips = rich.tips
  count++
}

fs.writeFileSync(path.join(DIR, "en.json"), JSON.stringify(en, null, 2) + "\n", "utf8")
console.log(`Generated rich content for ${count} pages in en.json`)
