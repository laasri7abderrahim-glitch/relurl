import { BlogPost } from "../types"

export const article: BlogPost = {
  slug: "how-to-create-a-branded-link-custom-domain",
  title: "How to Create a Branded Link: Build Trust with Every Click",
  metaDescription: "Learn how to create a branded link using your own domain. Step-by-step guide for DNS setup, SSL configuration, and best practices for maximum trust and click-through rates.",
  keywords: ["how to create a branded link", "branded short link", "custom domain url shortener", "branded link setup", "dns configuration short links"],
  landingPage: "/custom-url-shortener",
  category: "Guides",
  date: "June 29, 2026",
  readTime: "8 min read",
  image: "https://picsum.photos/seed/how-to-create-a-branded-link-custom-domain/1200/630",
  imageAlt: "How to Create a Branded Link: Build Trust with Every Click",
  content: [
    { type: "paragraph", content: "A branded link uses your own domain name instead of a generic short URL. Instead of bit.ly/3xK9mP or relurl.co/abc123, you share yourbrand.com/summer-sale. Every click reinforces your brand identity rather than someone elses. Research consistently shows that branded links receive 30-40 percent higher click-through rates than generic short links because audiences trust a recognizable domain. Knowing how to create a branded link is essential for any business serious about link sharing." },
    { type: "heading", content: "What Makes a Link Branded?", level: 2 },
    { type: "paragraph", content: "A branded link consists of three parts: a custom domain you own, a short slug that identifies the specific link, and the redirect infrastructure that sends visitors to the destination URL. The domain is the key differentiator. Instead of displaying a third-party shortener domain in your links, you use your own. This could be a subdomain like go.yourcompany.com or a root domain like yourbrand.com." },
    { type: "paragraph", content: "The slug follows the domain and can be customized for each link. Combined, yourbrand.com/webinar vs bit.ly/random creates an immediate trust advantage. The visitor knows they are clicking a link associated with your brand before they arrive at the destination." },
    { type: "heading", content: "Step 1: Choose Your Branded Domain", level: 2 },
    { type: "paragraph", content: "The first step in learning how to create a branded link is choosing which domain to use. You have several options. A root domain like yourbrand.com is the most recognizable but may conflict with your main website. A subdomain like go.yourbrand.com or links.yourbrand.com is the most common approach because it keeps your short links separate from your main site while maintaining brand association." },
    { type: "paragraph", content: "You can also use a completely separate domain registered specifically for short links. Some businesses register shorter versions of their brand name for this purpose, like yourbrand.co or brnd.ly. Choose a domain that is short, easy to type, and clearly associated with your brand. Avoid hyphens, numbers that could be confused with letters, and unusual TLDs." },
    { type: "heading", content: "Step 2: Configure DNS for Your Short Link Domain", level: 2 },
    { type: "paragraph", content: "Once you have selected a domain, you need to configure DNS to point it to RELURLs redirect infrastructure. Log into your domain registrar or DNS hosting provider and add a CNAME record. The exact values depend on whether you are using a subdomain or a root domain." },
    { type: "paragraph", content: "For a subdomain like go.yourbrand.com, create a CNAME record with your subdomain as the name and the target provided by RELURL, such as redirect.relurl.com. For a root domain like yourbrand.com, the process varies by provider. Some support CNAME flattening or ALIAS records. Others require adding the IP addresses from RELURLs setup guide as A records." },
    { type: "paragraph", content: "DNS changes can take anywhere from a few minutes to 48 hours to propagate globally. RELURL verifies your domain configuration automatically once the DNS changes are detected. You do not need to wait for full propagation to initiate verification, but links will not work until the DNS resolves correctly." },
    { type: "heading", content: "Step 3: Verify Domain Ownership", level: 2 },
    { type: "paragraph", content: "RELURL requires domain verification to ensure you control the domain you are adding. After configuring DNS, add the domain in your RELURL dashboard under Branded Domains. Enter your domain name and click Add Domain. RELURL checks the DNS records and confirms ownership." },
    { type: "paragraph", content: "If verification fails, double-check your DNS configuration. Common issues include typos in the CNAME target, missing dots at the end of the target value, and incorrect record types. Most DNS providers also offer a preview or test tool to confirm the record is configured correctly." },
    { type: "heading", content: "Step 4: Enable SSL for Secure Redirects", level: 2 },
    { type: "paragraph", content: "Every branded link must serve over HTTPS. Browsers mark non-HTTPS links as Not Secure, which destroys the trust advantage of using a branded domain. RELURL automatically provisions SSL certificates for verified domains using Lets Encrypt. The certificate is issued and renewed automatically as long as the domain remains verified and the DNS configuration is correct." },
    { type: "paragraph", content: "SSL provisioning typically completes within a few minutes of domain verification. Once active, all short links using your branded domain redirect over HTTPS with a valid certificate. Your visitors see the padlock icon in their browser, reinforcing trust throughout the click experience." },
    { type: "heading", content: "Step 5: Start Creating Branded Links", level: 2 },
    { type: "paragraph", content: "With your domain verified and SSL active, you can now create branded links. In the RELURL link creation interface, select your branded domain from the domain dropdown. Enter your slug and destination URL. The short link preview updates to show yourbrand.com/your-slug." },
    { type: "paragraph", content: "All the usual RELURL features work with branded links: custom slugs, UTM parameters, password protection, expiration dates, and analytics. The only difference is the domain in the short URL. Your branded links appear alongside your generic RELURL links in your dashboard, all trackable and manageable from the same interface." },
    { type: "heading", content: "Best Practices for Branded Links", level: 2 },
    { type: "list", items: ["Keep slugs short and descriptive. A branded link like yourbrand.com/sale is more effective than yourbrand.com/spring-2026-sale-promotion.", "Use branded links consistently. Once your domain is set up, use it for all public-facing short links to build cumulative brand recognition.", "Monitor your branded domains in analytics. Compare click-through rates between branded and generic short links to quantify the trust advantage.", "Protect your domain reputation. Only shorten URLs that align with your brand values. A compromised branded link damages your primary domains reputation.", "Set up multiple branded domains for different brands, products, or campaigns if your organization manages multiple identities."] },
    { type: "faq", faqs: [
      { q: "How long does DNS propagation take for a branded domain?", a: "Most DNS changes propagate within 1-2 hours, though it can take up to 48 hours in rare cases. RELURLs auto-verification detects the change as soon as it resolves globally." },
      { q: "Can I use a branded domain on the free plan?", a: "Branded domains are available on Paid plans. The free plan includes shortening on the relurl.co domain." },
      { q: "What if my branded domains SSL certificate expires?", a: "RELURL auto-renews SSL certificates. If renewal fails due to DNS changes, you will receive a notification to renew manually." },
      { q: "Can I have multiple branded domains on one account?", a: "Yes. You can add and verify multiple branded domains and assign them to different workspaces or team members." }
    ] },
    { type: "cta", content: "Build trust with every click. Learn how to create a branded link with RELURL and take control of your URL identity." }
  ]
}
