import { BlogPost } from "../types"

export const article: BlogPost = {
  slug: "branded-link-shortener-custom-domain",
  title: "Branded Link Shortener Custom Domain Setup: Complete Configuration Guide",
  metaDescription: "Step-by-step branded link shortener custom domain setup guide. Configure your domain, set up DNS, verify SSL, and start creating branded short links in minutes.",
  keywords: ["branded link shortener custom domain", "setup branded short domain", "configure short link domain"],
  landingPage: "/branded-link-shortener",
  category: "Technical",
  date: "June 29, 2026",
  readTime: "7 min read",
  image: "https://picsum.photos/seed/branded-link-shortener-custom-domain/1200/630",
  imageAlt: "Branded Link Shortener Custom Domain Setup: Complete Configuration Guide",
  content: [
    { type: "paragraph", content: "Setting up a branded link shortener custom domain is the most impactful technical change you can make to your link infrastructure. The process is straightforward and takes under thirty minutes. This guide walks through every step from domain selection to verification." },
    { type: "heading", content: "Step 1: Choose Your Short Domain", level: 2 },
    { type: "paragraph", content: "Your branded short domain should be short, memorable, and brand-aligned. Popular patterns include yourbrand.link, yourbrand.co, go.yourbrand.com, or yourbrand.me. The ideal domain is under twelve characters including the TLD." },
    { type: "paragraph", content: "Check domain availability using any domain registrar. If your first choice is unavailable, try alternative TLDs. .link, .co, and .me are excellent choices for short URLs because they remain available for most brand names." },
    { type: "heading", content: "Step 2: Register Your Domain", level: 2 },
    { type: "paragraph", content: "Register your chosen domain with any domain registrar. Namecheap, Cloudflare, Google Domains, and GoDaddy all work. The cost is typically $10-15 per year. Set auto-renewal to prevent accidental expiration." },
    { type: "paragraph", content: "A branded link shortener custom domain is a long-term asset. Register it for multiple years if possible to avoid the risk of forgetting renewal." },
    { type: "heading", content: "Step 3: Configure DNS Records", level: 2 },
    { type: "paragraph", content: "The DNS configuration depends on whether you are using a subdomain or an apex domain. For a subdomain like link.yourbrand.com, create a CNAME record pointing link to the shorteners server address. For an apex domain like yourbrand.link, create an ALIAS or A record." },
    { type: "paragraph", content: "RELURL provides specific DNS instructions during the setup process. The instructions include the exact values to enter in your registrars DNS management panel." },
    { type: "heading", content: "Step 4: Verify Domain Ownership", level: 2 },
    { type: "paragraph", content: "After configuring DNS, verify domain ownership. RELURL automatically detects the DNS configuration and confirms when the domain is ready. Verification typically takes minutes but can take up to 24 hours depending on DNS propagation." },
    { type: "paragraph", content: "Do not proceed to creating short links until the verification is complete. Links created before verification may use the wrong domain configuration." },
    { type: "heading", content: "Step 5: SSL Certificate Provisioning", level: 2 },
    { type: "paragraph", content: "HTTPS is required for modern links. A branded link shortener custom domain must have a valid SSL certificate. RELURL automatically provisions SSL certificates via Lets Encrypt for all custom domains." },
    { type: "paragraph", content: "SSL certificates renew automatically before expiration. No manual intervention is needed. If you ever see SSL errors on your branded short links, check that your DNS records still point correctly." },
    { type: "heading", content: "Step 6: Start Creating Branded Links", level: 2 },
    { type: "paragraph", content: "Once your domain is verified and SSL is active, start creating branded short links. Select your custom domain from the domain dropdown when creating a link. All future links for that domain will use your brand." },
    { type: "paragraph", content: "Replace existing generic short links with branded versions over time. Old generic links continue working, but new links should all use your branded domain." },
    { type: "heading", content: "Troubleshooting Common Setup Issues", level: 2 },
    { type: "list", items: ["Domain not verifying: Check that DNS records are entered correctly. Common mistakes include typos and incorrect record types.", "SSL not provisioning: SSL certificates require DNS to be fully propagated. Wait up to 24 hours and retry.", "Links not resolving: Check that the CNAME or A record is pointing to the correct target. Verify with a DNS lookup tool.", "Domain expired: Set auto-renewal on your domain registration. An expired domain breaks all branded short links.", "Wrong domain showing: Clear your browser cache. Your browser may be showing a cached version of the DNS response."] },
    { type: "faq", faqs: [
      { q: "How long does DNS propagation take?", a: "Most DNS changes propagate within minutes. Some networks may take up to 24 hours. RELURLs verification tool confirms when the domain is ready." },
      { q: "Can I use a domain I already own for short links?", a: "Yes. Use any domain you own as a branded short domain. Create a subdomain like go.yourdomain.com to avoid conflicts with your main website." },
      { q: "What if I want to switch shortener providers later?", a: "Update your DNS records to point to the new provider. Your branded domain stays the same, and existing links continue working." }
    ] },
    { type: "cta", content: "Set up your branded domain today. Use RELURL branded link shortener custom domain setup." }
  ]
}
