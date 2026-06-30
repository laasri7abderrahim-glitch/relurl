export interface AnalyticsReportProps {
  userName: string
  period: string
  stats: {
    totalClicks: number
    uniqueVisitors: number
    totalLinks: number
    topLink?: { slug: string; clicks: number } | null
  }
  topReferrers: { name: string; count: number }[]
  topCountries: { country: string; count: number }[]
  reportUrl: string
}

export function generateAnalyticsReportHtml(data: AnalyticsReportProps): string {
  const periodLabel = data.period.charAt(0).toUpperCase() + data.period.slice(1)

  const topLinkRow = data.stats.topLink
    ? `<tr style="border-bottom: 1px solid #2a2a3e;">
        <td style="padding: 12px; color: #6366f1;">/${data.stats.topLink.slug}</td>
        <td style="padding: 12px; text-align: center; color: #e0e0e0;">${data.stats.topLink.clicks.toLocaleString()}</td>
       </tr>`
    : `<tr><td colspan="2" style="padding: 12px; text-align: center; color: #666;">No clicks yet</td></tr>`

  const referrerRows = data.topReferrers.length > 0
    ? data.topReferrers.map(r => `<tr style="border-bottom: 1px solid #2a2a3e;">
        <td style="padding: 10px; color: #e0e0e0;">${r.name}</td>
        <td style="padding: 10px; text-align: center; color: #e0e0e0;">${r.count.toLocaleString()}</td>
       </tr>`).join("")
    : `<tr><td colspan="2" style="padding: 12px; text-align: center; color: #666;">No referrer data</td></tr>`

  const countryRows = data.topCountries.length > 0
    ? data.topCountries.map(c => `<tr style="border-bottom: 1px solid #2a2a3e;">
        <td style="padding: 10px; color: #e0e0e0;">${c.country}</td>
        <td style="padding: 10px; text-align: center; color: #e0e0e0;">${c.count.toLocaleString()}</td>
       </tr>`).join("")
    : `<tr><td colspan="2" style="padding: 12px; text-align: center; color: #666;">No country data</td></tr>`

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f0f1a; color: #e0e0e0; padding: 40px 20px; max-width: 600px; margin: 0 auto;">
  <div style="text-align: center; margin-bottom: 32px;">
    <h1 style="color: #6366f1; font-size: 28px; margin: 0;">REL<span style="color: #e0e0e0;">URL</span></h1>
    <p style="color: #999; font-size: 14px; margin-top: 4px;">Analytics Report · ${periodLabel}</p>
  </div>

  <p style="font-size: 16px; color: #e0e0e0;">Hi ${data.userName},</p>
  <p style="color: #999; line-height: 1.6;">Here is your ${data.period.toLowerCase()} analytics summary. See how your links are performing.</p>

  <div style="display: flex; gap: 12px; margin: 28px 0; flex-wrap: wrap;">
    <div style="flex: 1; min-width: 120px; background: #1a1a2e; border-radius: 12px; padding: 20px; text-align: center; border: 1px solid #2a2a3e;">
      <p style="font-size: 28px; font-weight: 700; color: #6366f1; margin: 0;">${data.stats.totalClicks.toLocaleString()}</p>
      <p style="font-size: 12px; color: #999; margin: 4px 0 0;">Total Clicks</p>
    </div>
    <div style="flex: 1; min-width: 120px; background: #1a1a2e; border-radius: 12px; padding: 20px; text-align: center; border: 1px solid #2a2a3e;">
      <p style="font-size: 28px; font-weight: 700; color: #22c55e; margin: 0;">${data.stats.uniqueVisitors.toLocaleString()}</p>
      <p style="font-size: 12px; color: #999; margin: 4px 0 0;">Unique Visitors</p>
    </div>
    <div style="flex: 1; min-width: 120px; background: #1a1a2e; border-radius: 12px; padding: 20px; text-align: center; border: 1px solid #2a2a3e;">
      <p style="font-size: 28px; font-weight: 700; color: #f59e0b; margin: 0;">${data.stats.totalLinks.toLocaleString()}</p>
      <p style="font-size: 12px; color: #999; margin: 4px 0 0;">Total Links</p>
    </div>
  </div>

  <div style="background: #1a1a2e; border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 1px solid #2a2a3e;">
    <h2 style="font-size: 16px; color: #e0e0e0; margin: 0 0 12px;">Top Link</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="border-bottom: 2px solid #2a2a3e;">
          <th style="padding: 12px; text-align: left; color: #999; font-size: 12px; text-transform: uppercase;">Link</th>
          <th style="padding: 12px; text-align: center; color: #999; font-size: 12px; text-transform: uppercase;">Clicks</th>
        </tr>
      </thead>
      <tbody>
        ${topLinkRow}
      </tbody>
    </table>
  </div>

  <div style="display: flex; gap: 24px; margin-bottom: 24px; flex-wrap: wrap;">
    <div style="flex: 1; min-width: 240px; background: #1a1a2e; border-radius: 12px; padding: 24px; border: 1px solid #2a2a3e;">
      <h2 style="font-size: 16px; color: #e0e0e0; margin: 0 0 12px;">Top Referrers</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 2px solid #2a2a3e;">
            <th style="padding: 10px; text-align: left; color: #999; font-size: 12px; text-transform: uppercase;">Source</th>
            <th style="padding: 10px; text-align: center; color: #999; font-size: 12px; text-transform: uppercase;">Clicks</th>
          </tr>
        </thead>
        <tbody>
          ${referrerRows}
        </tbody>
      </table>
    </div>
    <div style="flex: 1; min-width: 240px; background: #1a1a2e; border-radius: 12px; padding: 24px; border: 1px solid #2a2a3e;">
      <h2 style="font-size: 16px; color: #e0e0e0; margin: 0 0 12px;">Top Countries</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 2px solid #2a2a3e;">
            <th style="padding: 10px; text-align: left; color: #999; font-size: 12px; text-transform: uppercase;">Country</th>
            <th style="padding: 10px; text-align: center; color: #999; font-size: 12px; text-transform: uppercase;">Clicks</th>
          </tr>
        </thead>
        <tbody>
          ${countryRows}
        </tbody>
      </table>
    </div>
  </div>

  <div style="text-align: center; margin: 32px 0;">
    <a href="${data.reportUrl}" style="display: inline-block; background: #6366f1; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 14px; font-weight: 600;">View Full Dashboard</a>
  </div>

  <div style="border-top: 1px solid #2a2a3e; padding-top: 20px; text-align: center;">
    <p style="font-size: 12px; color: #666;">You are receiving this because you enabled scheduled analytics reports.</p>
    <p style="font-size: 12px; color: #666;">
      <a href="${data.reportUrl}/settings/reports" style="color: #6366f1; text-decoration: underline;">Manage preferences</a>
    </p>
  </div>
</body>
</html>`
}
