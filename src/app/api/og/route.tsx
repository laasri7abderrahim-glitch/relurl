import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
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
          background: "linear-gradient(135deg, #0f172a 0%, #1F6F5F 100%)",
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
            fontSize: 28,
            color: "#94a3b8",
            marginTop: 20,
            textAlign: "center",
            maxWidth: 600,
            lineHeight: 1.4,
          }}
        >
          URL Shortener, Branded Short Links & Analytics
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
