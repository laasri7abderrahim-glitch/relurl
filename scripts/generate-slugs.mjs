// Generate complete pathnames config including all app routes
import fs from "fs"
import path from "path"

const frMessages = JSON.parse(fs.readFileSync("messages/fr.json", "utf-8"))
const esMessages = JSON.parse(fs.readFileSync("messages/es.json", "utf-8"))

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .replace(/-+/g, "-")
}

// Extract all landing page slugs from the [locale] directory and url-pages.ts
const localeDir = "src/app/[locale]"
const dirs = fs.readdirSync(localeDir).filter(f => {
  const stat = fs.statSync(localeDir + "/" + f)
  const exclude = ["(auth)", "[...rest]", "admin", "api", "dashboard", "p", "error", "loading", "not-found"]
  return stat.isDirectory() && !exclude.includes(f) && !f.startsWith("(") && !f.startsWith("[")
})

// All non-landing-page paths used across the app (from TypeScript errors)
const appPaths = [
  "/", "/login", "/register", "/forgot-password", "/reset-password",
  "/api",
  "/admin",
  "/dashboard", "/dashboard/analytics", "/dashboard/billing",
  "/dashboard/bio-pages", "/dashboard/bio-pages/new",
  "/dashboard/campaigns", "/dashboard/links", "/dashboard/links/new",
  "/dashboard/notifications", "/dashboard/qrcodes",
  "/dashboard/settings", "/dashboard/settings/reports",
  "/dashboard/utm-builder",
]

// Build pathnames: translated slugs for landing pages, identity for app paths
const pathnames = {}

// Landing pages with translated slugs
for (const slug of dirs) {
  let frSlug = slug, esSlug = slug
  
  try {
    if (frMessages.pages?.[slug]?.title) {
      frSlug = slugify(frMessages.pages[slug].title)
    }
  } catch {}
  try {
    if (esMessages.pages?.[slug]?.title) {
      esSlug = slugify(esMessages.pages[slug].title)
    }
  } catch {}
  
  pathnames["/" + slug] = {
    en: "/" + slug,
    fr: "/" + frSlug,
    es: "/" + esSlug,
  }
}

// App paths (identity mapping - same for all locales)
for (const p of appPaths) {
  if (!pathnames[p]) {
    pathnames[p] = { en: p, fr: p, es: p }
  }
}

// Write the pathnames file
let output = "// Auto-generated pathnames config for next-intl\n"
output += "// Last generated: " + new Date().toISOString().split("T")[0] + "\n\n"
output += "export const pathnames: Record<string, { en: string; fr: string; es: string }> = " + JSON.stringify(pathnames, null, 2) + "\n"

fs.writeFileSync("src/i18n/pathnames.ts", output)
console.log("Written to src/i18n/pathnames.ts")
console.log("Total paths:", Object.keys(pathnames).length)
