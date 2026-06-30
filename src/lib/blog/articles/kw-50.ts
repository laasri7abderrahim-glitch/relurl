import { BlogPost } from "../types"

export const article: BlogPost = {
  slug: "how-to-create-a-custom-short-link",
  title: "How to Create a Custom Short Link: Personalize Your URLs",
  metaDescription: "Learn how to create a custom short link with a personalized slug and branded domain. Step-by-step walkthrough with examples using RELURL custom URL shortener.",
  keywords: ["how to create a custom short link", "custom short link", "personalized url shortener", "custom slug url", "branded short link"],
  landingPage: "/custom-url-shortener",
  category: "Guides",
  date: "June 29, 2026",
  readTime: "7 min read",
  image: "https://picsum.photos/seed/how-to-create-a-custom-short-link/1200/630",
  imageAlt: "How to Create a Custom Short Link: Personalize Your URLs",
  content: [
    { type: "heading", content: "Why Custom Short Links Matter", level: 2 },
    { type: "paragraph", content: "A custom short link does more than save characters. It builds trust, reinforces brand identity, and improves click-through rates. Generic short links like bit.ly/3xK9mP give no clues about the destination. A custom short link like relurl.co/summer-sale-2026 tells the recipient exactly what to expect before they click. This transparency increases confidence and drives higher engagement." },
    { type: "paragraph", content: "Knowing how to create a custom short link is a valuable skill for marketers, content creators, and business owners. This guide covers everything from choosing the right slug to setting up a branded domain, with a complete RELURL walkthrough." },
    { type: "heading", content: "Step 1: Choose Your Platform", level: 2 },
    { type: "paragraph", content: "Not all URL shorteners support custom slugs. TinyURL and is.gd offer limited customization. Bitly allows custom aliases but restricts them on the free plan. RELURL provides unlimited custom slugs on every plan including free, with character and format guidelines clearly documented. Choose a platform that gives you full control over your link identity." },
    { type: "paragraph", content: "If you plan to use a branded domain your own domain for short links choose a platform that supports custom domains. RELURL supports branded domains across all paid plans with straightforward DNS configuration." },
    { type: "heading", content: "Step 2: Craft Your Slug", level: 2 },
    { type: "paragraph", content: "The slug is the customizable part of your short link. In relurl.co/summer-sale, summer-sale is the slug. A great slug is short, descriptive, and easy to type. It should communicate the content or purpose of the destination without being cryptic." },
    { type: "list", items: ["Use keywords relevant to your content. For a blog post about email marketing, use email-tips rather than random characters.", "Keep it under 20 characters when possible. Shorter slugs are easier to type and remember.", "Use hyphens to separate words. Hyphens improve readability. Avoid underscores, spaces, or special characters.", "Avoid ambiguous words that could be misinterpreted. Proofread your slug for unintended meanings.", "Include the year for time-sensitive content. A slug like black-friday-2026 signals freshness and urgency."] },
    { type: "heading", content: "Step 3: Create Your Custom Short Link on RELURL", level: 2 },
    { type: "paragraph", content: "Log into your RELURL account or navigate to relurl.com. Paste your long URL into the shortening field. Before clicking Shorten, locate the custom alias field. It may be labeled Custom Slug, Custom Alias, or Edit Link." },
    { type: "paragraph", content: "Enter your chosen slug. RELURL checks availability in real time. If the slug is taken, the interface suggests alternatives or asks you to try a different one. Once you have an available slug, click Shorten. Your custom short link is ready immediately." },
    { type: "paragraph", content: "If you have a branded domain set up on your account, you can select which domain to use for this link from a dropdown. This lets you create links like yourbrand.com/summer-sale instead of relurl.co/summer-sale." },
    { type: "heading", content: "Step 4: Add UTM Parameters for Tracking", level: 2 },
    { type: "paragraph", content: "Before finalizing your custom short link, consider adding UTM parameters to the destination URL. These tags tell Google Analytics where traffic came from, making your custom short link both branded and measurable." },
    { type: "paragraph", content: "RELURL provides a UTM builder within the link creation interface. Enter your campaign source, medium, name, and optional term and content fields. The tool appends these parameters to your destination URL automatically and they pass through the redirect intact. Your custom short link now serves dual duty as a branding tool and a tracking instrument." },
    { type: "heading", content: "Step 5: Share and Monitor", level: 2 },
    { type: "paragraph", content: "Your custom short link is ready to share. Use it in social media posts, email campaigns, printed materials, or anywhere you need a clean, trustworthy URL. The branded appearance immediately signals professionalism and credibility to your audience." },
    { type: "paragraph", content: "Track performance in your RELURL dashboard. Custom short links with descriptive slugs are easier to identify in analytics reports. Instead of deciphering random character strings, you see slug names that tell you exactly which campaign or content each link represents." },
    { type: "heading", content: "Custom Short Link Examples", level: 2 },
    { type: "list", items: ["Blog post: yourbrand.com/email-marketing-guide instead of bit.ly/3xK9mP", "Product launch: yourbrand.com/new-feature-2026 instead of tinyurl.com/2p8e3f", "Event registration: yourbrand.com/webinar-july instead of is.gd/abc123", "Promotion: yourbrand.com/black-friday instead of cutt.ly/random", "Portfolio: yourbrand.com/design-showcase instead of rebrand.ly/xyz789"] },
    { type: "heading", content: "Branded Domains: The Next Level", level: 2 },
    { type: "paragraph", content: "A branded domain takes custom short links to their full potential. Instead of relurl.co/your-slug, you use yourbrand.com/your-slug. Every short link becomes a brand touchpoint. The visual consistency across all your shared links builds recognition and trust over time." },
    { type: "paragraph", content: "Setting up a branded domain with RELURL requires adding a CNAME record to your DNS configuration. Detailed instructions are provided during setup. Once verified, your custom domain is available for all your short links. You can use multiple branded domains for different brands, campaigns, or departments." },
    { type: "faq", faqs: [
      { q: "Can I change the slug of an existing short link?", a: "Yes. RELURL allows you to edit the slug of any link you own, provided the new slug is available." },
      { q: "Do custom slugs affect SEO?", a: "Short links pass SEO equity through 301 redirects. A descriptive slug does not directly impact search rankings but improves user trust and click-through rates." },
      { q: "How do I know if a custom slug is available?", a: "RELURL checks availability instantly when you type a slug. If it is taken, you will see a notification and suggestions." },
      { q: "Can I use numbers in my custom slug?", a: "Yes. Numbers are allowed. Slugs like summer-sale-2026 work well for time-bound campaigns." }
    ] },
    { type: "cta", content: "Make every link count. Learn how to create a custom short link with RELURL and personalize your URLs today." }
  ]
}
