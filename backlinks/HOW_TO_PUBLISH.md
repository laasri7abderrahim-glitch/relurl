# How to Publish to All Platforms

## Manual (Copy-Paste — works for all)
Articles ready at:
- `01-url-shortening-guide.md`
- `02-niche-industry-shorteners.md`
- `03-social-media-link-tools.md`
- `04-qr-code-generator-guide.md`
- `05-alternatives-comparison.md`
- `06-guides-tutorials.md`
- `07-advanced-features.md`
- `08-platform-shorteners.md`

Paste the content into each platform's editor:
- https://hackernoon.com/new-story
- https://dev.to/new
- https://medium.com/new-story
- https://hashnode.com/create
- etc.

## Automated (via script)
Edit `backlinks/.env` with your API keys, then:

```
node backlinks/publish.mjs
```

## Where to Get API Keys
| Platform | Get Key At |
|----------|-----------|
| Dev.to | https://dev.to/settings/extensions |
| Hashnode | https://hashnode.com/settings/developer |
| Medium | https://medium.com/me/settings/security |
| WordPress | Users > Application Passwords |
| Ghost | Admin > Integrations > Custom |
| Bluesky | https://bsky.app/settings/app-passwords |
| Mastodon | Settings > Applications |
| Telegram | https://t.me/botfather |
| Discord | Channel > Integrations > Webhooks |
| LinkedIn | https://linkedin.com/developers/apps |
