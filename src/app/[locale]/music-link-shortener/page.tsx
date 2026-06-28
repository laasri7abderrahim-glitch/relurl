import type { Metadata } from "next"
import URLLandingPage from "@/components/url/URLLandingPage"
import { allLandingPages, qrPages, getRelatedPages } from "@/lib/url-pages"
import { generateSEOMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Music Link Shortener - Song & Album Links",
  description: "Create short links for songs, albums, and playlists. Share music across platforms and track listener engagement with RELURL.",
  path: "/music-link-shortener",
  keywords: ["music link shortener", "song link generator", "album link shortener"],
})

export default function MusicLinkShortenerPage() {
  const href = "/music-link-shortener"
  return (
    <URLLandingPage
      title="Music Link Shortener"
      subtitle="Share Your Sound"
      description="Create short links for songs, albums, and playlists. Share music across platforms and track listener engagement from every source."
      placeholder="https://open.spotify.com/track/your-song-id"
      inputLabel="Enter your music URL"
      generateLabel="Shorten URL"
      features={[
        "Multi-Platform Links",
        "Listener Source Tracking",
        "Playlist Shortening",
        "Release Campaign Analytics",
        "Pre-Save Link Support",
        "Merch Store Integration",
      ]}
      howItWorks={[
        { step: "Paste Music URL", desc: "Enter your Spotify, Apple Music, or SoundCloud link." },
        { step: "Generate Short Link", desc: "Create a clean URL for fans to find your music." },
        { step: "Share & Track Plays", desc: "Distribute on social media and monitor listener sources." },
      ]}
      useCases={[
        "New release promotions",
        "Playlist sharing",
        "Concert ticket sales",
        "Merch store links",
        "Collaboration announcements",
        "Fan engagement campaigns",
      ]}
      relatedPages={getRelatedPages(href)}
      allPages={[...allLandingPages, ...qrPages]}
    />
  )
}
