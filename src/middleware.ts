import createMiddleware from "next-intl/middleware"
import { NextResponse } from "next/server"
import { routing } from "./i18n/routing"

const intlMiddleware = createMiddleware(routing)

export default function middleware(request: Request) {
  const response = intlMiddleware(request as any)

  // next-intl issues 307 (temporary) redirects for locale prefixing.
  // 307 tells Google the redirect is temporary and passes zero link equity.
  // Convert to 301 (permanent) so crawl budget and authority are preserved.
  if (response && response.status === 307 && response.headers.get("location")) {
    const location = response.headers.get("location")!
    return NextResponse.redirect(new URL(location, request.url), 301)
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}
