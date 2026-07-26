import { defineRouting } from "next-intl/routing"
import { pathnames } from "./pathnames"

export const routing = defineRouting({
  locales: ["en", "fr", "es"],
  defaultLocale: "en",
  localePrefix: "always",
  localeDetection: true,
  pathnames,
})
