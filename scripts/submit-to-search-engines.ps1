# RELURL - Search Engine Submission Script
# Run after deploying to production to trigger crawling & indexing

param(
  [string]$BaseUrl = "https://relurl.com",
  [string]$SitemapUrl = "https://relurl.com/sitemap.xml"
)

$key = Get-Content -Path "$PSScriptRoot\..\public\indexnow-key.txt" -Raw
$statuses = @{}

# 1. IndexNow API (Bing, Yandex, Seznam, Naver)
Write-Host "Submitting to IndexNow..." -ForegroundColor Cyan
try {
  $body = @{
    host = $BaseUrl.Replace("https://", "")
    key = $key.Trim()
    keyLocation = "$BaseUrl/indexnow-key.txt"
    urlList = @(
      "$BaseUrl/",
      "$BaseUrl/en/",
      "$BaseUrl/fr/",
      "$BaseUrl/es/",
      "$BaseUrl/sitemap.xml"
    )
  } | ConvertTo-Json
  $r = Invoke-WebRequest -Uri "https://api.indexnow.org/indexnow" -Method Post -Body $body -ContentType "application/json" -UseBasicParsing
  $statuses.IndexNow = $r.StatusCode
  Write-Host "  ✓ IndexNow: $($r.StatusCode)" -ForegroundColor Green
} catch {
  $statuses.IndexNow = "FAILED: $($_.Exception.Message)"
  Write-Host "  ✗ IndexNow: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Bing IndexNow endpoint
Write-Host "Submitting to Bing IndexNow..." -ForegroundColor Cyan
try {
  $body = @{
    host = $BaseUrl.Replace("https://", "")
    key = $key.Trim()
    urlList = @("$BaseUrl/", "$BaseUrl/sitemap.xml")
  } | ConvertTo-Json
  $r = Invoke-WebRequest -Uri "https://www.bing.com/indexnow" -Method Post -Body $body -ContentType "application/json" -UseBasicParsing
  $statuses.Bing = $r.StatusCode
  Write-Host "  ✓ Bing: $($r.StatusCode)" -ForegroundColor Green
} catch {
  $statuses.Bing = "FAILED: $($_.Exception.Message)"
  Write-Host "  ✗ Bing: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Google Search Console API requires OAuth — will work via Search Console web
Write-Host "`nIMPORTANT: Google Search Console requires manual submission:" -ForegroundColor Yellow
Write-Host "  1. Visit https://search.google.com/search-console" -ForegroundColor Yellow
Write-Host "  2. Select your property (relurl.com)" -ForegroundColor Yellow
Write-Host "  3. Go to URL Inspection > enter your URL > Request Indexing" -ForegroundColor Yellow
Write-Host "  4. Or: Sitemaps > paste $SitemapUrl > Submit" -ForegroundColor Yellow

Write-Host "`nSubmission Results:" -ForegroundColor Cyan
$statuses | Format-Table -AutoSize

Write-Host "`nKey file deployed at: $BaseUrl/indexnow-key.txt" -ForegroundColor Green
