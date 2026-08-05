const fs = require("fs")
const path = require("path")

const dir = "src/lib/page-content"
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

const locales = ["en", "fr", "es"]
for (const locale of locales) {
  const msg = JSON.parse(fs.readFileSync(`messages/${locale}.json`, "utf-8"))
  const pages = msg.pages || {}
  // Separate landing-content keys that the client currently pulls via t.raw
  const out = {}
  for (const [slug, obj] of Object.entries(pages)) {
    out[slug] = {
      title: obj.title,
      subtitle: obj.subtitle,
      description: obj.description,
      metaDescription: obj.metaDescription,
      keywords: obj.keywords,
      features: obj.features,
      howItWorks: obj.howItWorks,
      useCases: obj.useCases,
      faqs: obj.faqs,
      // extra fields used by client components via t.raw
      longDescription: obj.longDescription,
      whyChoose: obj.whyChoose,
      comparisonPoints: obj.comparisonPoints,
      benefits: obj.benefits,
      tips: obj.tips,
    }
  }
  fs.writeFileSync(path.join(dir, `${locale}.json`), JSON.stringify(out))
  const sz = fs.statSync(path.join(dir, locale + ".json")).size
  console.log(`${locale}.json: ${Object.keys(out).length} pages, ${Math.round(sz/1024)}KB`)
}
