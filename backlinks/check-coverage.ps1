$landing = @(
  "/custom-url-shortener","/branded-link-shortener","/bulk-url-shortener",
  "/affiliate-link-shortener","/marketing-url-shortener","/free-url-shortener",
  "/url-tracking-tool","/campaign-link-generator","/short-url-analytics",
  "/custom-alias-generator","/ecommerce-url-shortener","/real-estate-link-shortener",
  "/saas-link-shortener","/podcast-link-shortener","/event-link-shortener",
  "/news-link-shortener","/education-link-shortener","/healthcare-link-shortener",
  "/nonprofit-link-shortener","/travel-link-shortener","/restaurant-link-shortener",
  "/music-link-shortener","/photography-link-shortener","/gaming-link-shortener",
  "/crypto-link-shortener","/agency-link-shortener","/startup-link-shortener",
  "/ebook-link-shortener","/course-link-shortener","/webinar-link-shortener",
  "/password-protected-links","/link-expiration","/url-shortener-api",
  "/custom-domain-links","/link-in-bio","/shorten-pdf-link",
  "/shorten-image-url","/shorten-video-url","/shorten-github-url",
  "/shorten-google-drive-link","/shorten-google-docs-link","/shorten-dropbox-link",
  "/shorten-spotify-link","/shorten-amazon-link","/shorten-shopify-link",
  "/shorten-medium-link","/shorten-notion-link","/shorten-figma-link",
  "/shorten-calendly-link","/shorten-patreon-link","/shorten-etsy-link",
  "/shorten-airbnb-link","/shorten-substack-link",
  "/url-shortener-no-signup","/url-shortener-without-signup",
  "/url-shortener-for-business","/url-shortener-for-marketers",
  "/url-shortener-for-social-media","/url-shortener-in-india",
  "/url-shortener-in-uk","/url-shortener-in-canada",
  "/url-shortener-with-qr-codes","/url-shortener-with-analytics",
  "/url-shortener-no-ads"
)

$social = @(
  "/instagram-link-generator","/whatsapp-link-generator","/telegram-link-generator",
  "/signal-link-generator","/wechat-link-generator","/slack-link-generator",
  "/tiktok-bio-link-generator","/youtube-link-generator","/facebook-url-generator",
  "/linkedin-url-generator","/pinterest-link-generator","/snapchat-link-generator",
  "/reddit-link-generator","/discord-link-generator","/twitch-link-generator",
  "/twitter-link-generator","/threads-link-generator","/mastodon-link-generator",
  "/shorten-youtube-url","/shorten-instagram-url","/shorten-facebook-url",
  "/shorten-whatsapp-link","/shorten-linkedin-url","/shorten-tiktok-url",
  "/shorten-x-url","/shorten-discord-invite-link"
)

$qr = @(
  "/qr-code-generator","/dynamic-qr-code-generator","/free-qr-code-generator",
  "/qr-code-for-wifi","/qr-code-for-vcard","/qr-code-for-business-card",
  "/qr-code-for-restaurant-menu","/qr-code-for-app-download",
  "/qr-code-for-google-maps","/qr-code-for-google-reviews",
  "/qr-code-for-facebook","/qr-code-for-instagram","/qr-code-for-linkedin",
  "/qr-code-for-youtube","/qr-code-for-whatsapp","/qr-code-for-email",
  "/qr-code-for-sms","/qr-code-for-phone","/qr-code-for-event",
  "/qr-code-for-pdf","/qr-code-for-restaurant","/qr-code-for-hotel",
  "/qr-code-for-gym","/qr-code-for-salon","/qr-code-for-store",
  "/qr-code-for-resume","/qr-code-for-portfolio","/qr-code-for-wedding",
  "/qr-code-for-birthday","/qr-code-for-concert","/qr-code-for-class",
  "/qr-code-for-fundraiser"
)

$comparison = @(
  "/bitly-alternative","/tinyurl-alternative","/rebrandly-alternative",
  "/short-io-alternative","/best-url-shortener","/relurl-vs-tinyurl",
  "/relurl-vs-bitly"
)

$guide = @(
  "/how-to-shorten-a-url","/how-to-create-short-links",
  "/how-to-track-link-clicks","/how-to-create-qr-codes",
  "/how-to-create-branded-links","/how-to-use-utm-parameters",
  "/how-to-create-qr-codes-for-business","/how-to-make-money-with-url-shortener"
)

$allPages = $landing + $social + $qr + $comparison + $guide
Write-Host "Total EN-only pages: $($allPages.Count)"

# Scan article files for linked paths
$dir = "C:\Users\store one\Documents\Nouveau dossier\RELURL,COM\new-site\backlinks"
$linked = @{}
Get-ChildItem "$dir\*.md" | Sort-Object Name | ForEach-Object {
  $content = Get-Content $_.FullName -Raw
  $matches = [regex]::Matches($content, 'https://relurl\.com/en([^\s)"''\]]+)')
  foreach ($m in $matches) { $linked[$m.Groups[1].Value] = $true }
}

$linkedCount = 0
$missing = @()
foreach ($p in $allPages) {
  if ($linked.ContainsKey($p)) { $linkedCount++ }
  else { $missing += $p }
}

Write-Host "Linked: $linkedCount / $($allPages.Count)"
if ($missing.Count -gt 0) {
  Write-Host "MISSING ($($missing.Count)):"
  $missing | ForEach-Object { Write-Host "  $_" }
} else {
  Write-Host "All EN-only pages covered!"
}
