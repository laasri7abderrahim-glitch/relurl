import { BlogPost } from "../types"

export const article: BlogPost = {
  slug: "custom-url-shortener-with-custom-domain",
  title: "Custom URL Shortener with Custom Domain: Own Every Part of Your Link",
  metaDescription: "Set up a custom URL shortener with custom domain. Full guide to choosing, configuring, and using your own domain for branded short links that build trust.",
  keywords: ["custom url shortener with custom domain", "branded short domain", "own short link domain"],
  landingPage: "/custom-url-shortener",
  category: "Technical",
  date: "June 29, 2026",
  readTime: "7 min read",
  image: "https://picsum.photos/seed/custom-url-shortener-with-custom-domain/1200/630",
  imageAlt: "Custom URL Shortener with Custom Domain: Own Every Part of Your Link",
  content: [
    { type: "paragraph", content: "Using a custom domain for your short links is the difference between renting and owning. When you use a shared shortener domain, your links depend on someone elses infrastructure and reputation. A custom URL shortener with custom domain gives you full ownership of your link infrastructure." },
    { type: "heading", content: "Choosing the Right Short Domain", level: 2 },
    { type: "paragraph", content: "Your short domain should be short, memorable, and brand-aligned. Common choices include yourbrand.link, yourbrand.co, go.yourbrand.com, or yourbrand.me. The ideal domain is under twelve characters including the TLD." },
    { type: "paragraph", content: "A custom URL shortener with custom domain works with any domain you own. The domain does not need to be registered with a specific registrar. RELURL supports domains from GoDaddy, Namecheap, Google Domains, Cloudflare, and any other registrar." },
    { type: "heading", content: "DNS Configuration Step by Step", level: 2 },
    { type: "paragraph", content: "Configuring a custom domain for a URL shortener requires a DNS change. You add a CNAME record pointing your short domain to the shorteners server. For apex domains like yourbrand.co without the www prefix, you may need an ALIAS or A record instead." },
    { type: "paragraph", content: "RELURL provides specific DNS configuration instructions for each registrar during setup. The process typically takes effect within minutes once you save the DNS record. A verification step confirms the domain is correctly configured before you start creating links." },
    { type: "heading", content: "Multiple Domains for Different Purposes", level: 2 },
    { type: "paragraph", content: "A custom URL shortener with custom domain supports multiple domains. Use different domains for different contexts. A marketing domain like yourbrand.link for public campaigns. An internal domain like go.yourbrand.internal for employee-facing links." },
    { type: "paragraph", content: "Multiple domains also help with brand protection. Register common misspellings of your short domain and redirect them to the main domain. This prevents typo-squatting and ensures users who mistype your short link still reach your content." },
    { type: "heading", content: "SSL Certificates for Custom Domains", level: 2 },
    { type: "paragraph", content: "HTTPS is non-negotiable for modern links. A custom URL shortener with custom domain must provide SSL certificates for your domain. RELURL automatically provisions and renews SSL certificates for every custom domain via Lets Encrypt." },
    { type: "paragraph", content: "Automatic SSL means your branded short links always serve over HTTPS. There is no certificate management required on your end. The certificates renew before expiration without any action from you." },
    { type: "heading", content: "Domain Portability and Vendor Independence", level: 2 },
    { type: "paragraph", content: "The greatest advantage of a custom URL shortener with custom domain is portability. If you ever want to switch shortener providers, you update your DNS to point to the new provider. All your existing short links continue working because the domain is the same." },
    { type: "paragraph", content: "This vendor independence is why businesses should invest in custom short domains early. The cost is minimal, and the freedom from vendor lock-in is invaluable. Your links are your property, not a feature of your shortener subscription." },
    { type: "heading", content: "Common Domain Configuration Mistakes", level: 2 },
    { type: "paragraph", content: "The most common mistake is configuring the wrong DNS record type. A CNAME record is required for subdomains like link.yourbrand.com. An ALIAS or A record is required for apex domains like yourbrand.link. Using the wrong type results in the domain not resolving." },
    { type: "paragraph", content: "Another common issue is forgetting to renew the domain registration. Set auto-renewal on your short domain. An expired domain means all your short links break simultaneously." },
    { type: "faq", faqs: [
      { q: "How long does it take for a custom domain to work?", a: "DNS changes typically propagate within minutes to a few hours. RELURLs verification tool confirms when the domain is ready." },
      { q: "Can I use a subdomain like link.mycompany.com?", a: "Yes. Subdomains work well and are easier to configure than apex domains. Use link.mycompany.com as your short domain." },
      { q: "What if my domain registrar does not support CNAME records?", a: "All major registrars support CNAME records. If yours does not, transfer your domain to a registrar that does." }
    ] },
    { type: "cta", content: "Own your link infrastructure. Set up a custom URL shortener with custom domain." }
  ]
}
