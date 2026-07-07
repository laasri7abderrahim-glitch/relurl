import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get("title")
  const description = searchParams.get("description")

  const pageTitle = title || "URL Shortener, Branded Short Links & Analytics"
  const pageDesc = description || "Free URL shortener with custom slugs, click analytics, QR codes, and branded domains"

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #0D9488 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: "-0.05em",
          }}
        >
          <span style={{ color: "#6FCF97" }}>REL</span>
          <span style={{ color: "#FFFFFF" }}>URL</span>
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#FFFFFF",
            marginTop: 24,
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.3,
            fontWeight: 600,
          }}
        >
          {pageTitle}
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#94a3b8",
            marginTop: 16,
            textAlign: "center",
            maxWidth: 600,
            lineHeight: 1.4,
          }}
        >
          {pageDesc}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
