# Manual Publish Instructions — Dofollow Platforms

## Published Already (~520+ backlinks live)
| Platform | DA | Articles | Links | Status |
|----------|-----|---------|-------|--------|
| Dev.to | 88 | 20 | ~300+ | ✅ Live (`ref=dev.to`) |
| Telegra.ph | 89 | 12 | ~219 | ✅ Live (`ref=telegra-ph`) |
| Bluesky | — | 8 | — | ✅ Live (nofollow, brand only) |

## Ready to Publish — Files Generated

### 1. LinkedIn Articles (DA 98, dofollow ✅)
**Highest value platform**. Open the HTML in a browser → copy rendered content → paste into LinkedIn article editor.
- File: `backlinks/articles-linkedin.html`
- Ref: `?ref=linkedin` (112 backlinks across 8 articles)

### 2. Blogger / Blogspot (DA 89, dofollow ✅)
Google-owned, fast indexing. Open HTML → copy → paste into Blogger's **HTML editor** tab.
- File: `backlinks/articles-blogger.html`
- Ref: `?ref=blogger` (112 backlinks across 8 articles)
- Steps: Go to https://blogger.com → create a blog → New Post → HTML tab → paste

### 3. WordPress.com (DA 92, dofollow ✅)
Open HTML → copy → paste into WordPress **Custom HTML block** or Classic editor.
- File: `backlinks/articles-wordpress.html`
- Ref: `?ref=wordpress-com` (112 backlinks across 8 articles)

### 4. HubPages (DA 76, dofollow ✅)
Tutorial / how-to platform. HTML pre-generated with section delimiters.
- File: `backlinks/hubpages-articles.html`
- Ref: `?ref=hubpages` (146 backlinks, 137 unique pages)
- Steps: Go to https://hubpages.com → Write → Create New Hub
- Copy one section at a time (between `<!-- HUBPAGES ARTICLE N -->` comments)
- Paste into HubPages editor → add commentary → publish

### 5. Scoop.it (DA 84, dofollow ✅)
Content curation + original articles. New batch of 8 articles ready.
- File: `backlinks/articles-scoopit.html`
- Ref: `?ref=scoop.it` (32+ backlinks across 8 articles)
- Steps: https://scoop.it → sign up → create topic board → click "Scoop it" → paste article

### 6. LiveJournal (DA 92, dofollow ✅)
Famous blog platform, instant approval, dofollow links.
- File: `backlinks/articles-livejournal.html`
- Ref: `?ref=livejournal` (32+ backlinks across 8 articles)
- Steps: https://livejournal.com → create account → Write → paste HTML

### 7. GrowthHackers (DA 80, dofollow ✅)
Marketing/growth community. Submit articles directly.
- File: `backlinks/articles-growthhackers.html`
- Ref: `?ref=growthhackers` (32+ backlinks across 8 articles)
- Steps: https://growthhackers.com → sign up → Submit Story → paste content

### 8. BizSugar (DA 73, dofollow ✅)
Small business community. Submit articles with links.
- File: `backlinks/articles-bizsugar.html`
- Ref: `?ref=bizsugar` (32+ backlinks across 8 articles)
- Steps: https://bizsugar.com → create account → Submit Article

### 9. APSense (DA 73, dofollow ✅)
Business networking platform with article publishing.
- File: `backlinks/articles-apsense.html`
- Ref: `?ref=apsense` (32+ backlinks across 8 articles)
- Steps: https://apsense.com → sign up → Publish Article

### 10. Vocal.media (DA 72, dofollow ✅)
Creative writing platform, instant publishing.
- File: `backlinks/articles-vocalmedia.html`
- Ref: `?ref=vocal.media` (32+ backlinks across 8 articles)
- Steps: https://vocal.media → create account → Write → paste content

### 11. HackerNoon (DA 88, dofollow ✅)
4 tech articles ready for HackerNoon. Manual copy-paste.
- Files: `backlinks/hackernoon-01-scaling.md` through `backlinks/hackernoon-04-security.md`
- Guide: `backlinks/hackernoon-guide.md`
- Steps: Go to https://hackernoon.com/create → paste markdown → add tags → submit
- ~62 backlinks across 4 articles

### 12. Batch 2 Articles (for any platform)
8 new articles covering QR codes, branded links, social media, restaurant marketing, email marketing, dynamic vs static QR, affiliate tracking, browser extensions.
- Files: `backlinks/batch2-*.md` (8 markdown files)
- Each has 4 links with `{{REF}}` placeholder — replace via find+replace
- Ready to convert to any platform format

### 13. All 119 Platforms Listed
Comprehensive verified list of 119 free dofollow platforms organized by DA tier.
- File: `backlinks/100-plus-platforms.md`
- Tiers: DA 80+ (19 platforms), DA 50-79 (29 platforms), DA 40-49 (20 platforms), Nofollow but high traffic (17 platforms), Tech niche (12 platforms), Article directories (22 platforms)
- Includes strategy guide with recommended batch order and anchor text distribution

## Automated via publish.mjs (needs credentials)

The script `backlinks/publish.mjs` supports all of these. Add credentials to `.env` and run:

```
cd backlinks
node publish.mjs
```

| Platform | DA | Dofollow | Auth Needed | Status |
|----------|-----|---------|-------------|--------|
| Write.as | ~60 | ✅ | None (anon) or token | Ready in script |
| Bear Blog | ~50 | ✅ | API key from dashboard | Ready in script |
| GitHub Gist | 98 | ✅ | PAT with gist scope | Ready in script |
| WriteFreely | ~55 | ✅ | Instance + token | Ready in script |
| Forem | varies | ✅ | Instance + API key | Ready in script |
| ReadMe | ~85 | ✅ | API key from project | Ready in script |
| GitBook | 90+ | ✅ | Token + space ID | Ready in script |
| Blogger | 89 | ✅ | OAuth 2.0 token | Ready in script |

## Quick Checklist
| Platform | DA | Dofollow | How | Status |
|----------|-----|---------|------|--------|
| LinkedIn Articles | 98 | ✅ | Copy from `articles-linkedin.html` | ⏳ Not started |
| WordPress.com | 92 | ✅ | Copy from `articles-wordpress.html` | ⏳ Not started |
| GitHub Gist | 98 | ✅ | Script (needs PAT) | Script ready |
| GitBook | 90+ | ✅ | Script (needs token) | Script ready |
| Blogger | 89 | ✅ | Script (needs OAuth) / manual | Script ready |
| Telegra.ph | 89 | ✅ | Automated (no auth) | ✅ Done (12 articles) |
| Dev.to | 88 | ✅ | Automated (script) | ✅ Done (20 articles) |
| HackerNoon | 88 | ✅ | Copy from MD files | ⏳ In progress |
| ReadMe | ~85 | ✅ | Script (needs API key) | Script ready |
| LiveJournal | 92 | ✅ | Copy from `articles-livejournal.html` | ⏳ Not started |
| Scoop.it | 84 | ✅ | Copy from `articles-scoopit.html` | ⏳ Not started |
| GrowthHackers | 80 | ✅ | Copy from `articles-growthhackers.html` | ⏳ Not started |
| HubPages | 76 | ✅ | Copy from `hubpages-articles.html` | ⏳ Not started |
| BizSugar | 73 | ✅ | Copy from `articles-bizsugar.html` | ⏳ Not started |
| APSense | 73 | ✅ | Copy from `articles-apsense.html` | ⏳ Not started |
| Vocal.media | 72 | ✅ | Copy from `articles-vocalmedia.html` | ⏳ Not started |
| Bear Blog | ~50 | ✅ | Script (needs key) | Script ready |
| WriteFreely | ~55 | ✅ | Script (needs instance) | Script ready |
| Write.as | ~60 | ✅ | Script (anon works) | Script ready |
| Forem | varies | ✅ | Script (needs instance) | Script ready |

## Stats
- **Backlinks live now**: ~520+ (Dev.to 20 articles + Telegra.ph 12 articles)
- **Backlinks ready via scrip**: ~146 per platform × up to 10 platforms = up to **1,460 backlinks**
- **Backlinks ready to copy-paste on 6 new platforms**: 6 platforms × 8 articles × ~4 links each = ~192 backlinks
- **Backlinks ready from earlier batches**: 438 (LinkedIn + Blogger + WordPress + HubPages) + 62 HackerNoon = 500
- **Total addressable backlinks**: ~2,000+ across 20+ platforms
- **Platforms catalogued**: 119 in `backlinks/100-plus-platforms.md`

## How to Use the HTML Files
1. Open any `articles-*.html` file in a browser (Chrome/Edge/Firefox)
2. The page shows all 8 articles in clean formatted cards
3. Select the content of one article card (or use Ctrl+A inside a card)
4. Copy (Ctrl+C) — the browser copies rich text with links
5. Paste into the target platform's editor
6. Repeat for all 8 articles per platform
