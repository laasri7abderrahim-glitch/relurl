import { generateSEOMetadata } from "@/lib/seo"
import { Link } from "@/i18n/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Integrations - Connect RELURL with Your Tools",
    description: "Connect RELURL with Zapier, Make, and other tools to automate your link management workflow.",
    path: "/integrations",
    locale,
  })
}

const featuredIntegrations = [
  {
    name: "Zapier",
    description: "Connect RELURL to 5,000+ apps. Create short links automatically when new rows are added to Google Sheets, when emails are received, or from any Zapier trigger.",
    icon: "⚡",
    category: "Automation",
    endpoint: "/api/integrations/zapier",
    color: "from-orange-500 to-red-500",
    steps: [
      "Get your API key from the API settings page",
      "Create a new Zap in Zapier",
      "Use the Webhooks by Zapier action (POST)",
      "Set the URL to https://relurl.com/api/integrations/zapier",
      "Add Authorization header: Bearer YOUR_API_KEY",
      "Send JSON body with url, slug, and title fields",
    ],
  },
  {
    name: "Make (Integromat)",
    description: "Build advanced automation workflows with Make. Connect RELURL to hundreds of apps and create powerful multi-step scenarios.",
    icon: "🔧",
    category: "Automation",
    endpoint: "/api/integrations/make",
    color: "from-purple-500 to-indigo-500",
    steps: [
      "Get your API key from the API settings page",
      "Create a new scenario in Make",
      "Add an HTTP module (Make a request)",
      "Set URL to https://relurl.com/api/integrations/make",
      "Set Method to POST",
      "Add Authorization header: Bearer YOUR_API_KEY",
      "Set Content-Type to application/json",
      "Send JSON body with url, slug, and title fields",
    ],
  },
  {
    name: "WordPress",
    description: "Automatically shorten all links in your WordPress posts. Our plugin detects URLs and replaces them with trackable short links.",
    icon: "📝",
    category: "CMS",
    endpoint: null,
    color: "from-blue-500 to-cyan-500",
    steps: [
      "Install the RELURL WordPress plugin from the plugin directory",
      "Activate the plugin and go to Settings > RELURL",
      "Enter your API key",
      "Configure auto-shortening options",
      "All new links in posts will be automatically shortened",
    ],
  },
  {
    name: "REST API",
    description: "Build custom integrations with our full-featured REST API. Create, read, update, and delete short links programmatically.",
    icon: "🛠️",
    category: "Developer",
    endpoint: "/api",
    color: "from-green-500 to-emerald-500",
    steps: [
      "Generate an API key in your account settings",
      "Use the API base URL: https://relurl.com/api",
      "Authenticate with Bearer token in the Authorization header",
      "Refer to the API documentation for all endpoints",
    ],
  },
]

const moreIntegrations = [
  { name: "Google Analytics", description: "Track campaigns with UTM parameters", icon: "📊", category: "Analytics" },
  { name: "Slack", description: "Get notifications for link activity", icon: "💬", category: "Communication" },
  { name: "HubSpot", description: "Sync contacts with link data", icon: "🎯", category: "CRM" },
  { name: "Mailchimp", description: "Shorten links in email campaigns", icon: "📧", category: "Email" },
  { name: "Buffer", description: "Schedule and share short links", icon: "📅", category: "Social" },
  { name: "Airtable", description: "Manage links in a spreadsheet", icon: "📋", category: "Productivity" },
  { name: "Notion", description: "Embed link analytics in docs", icon: "📓", category: "Productivity" },
  { name: "Webhooks", description: "Real-time event notifications", icon: "🔌", category: "Developer" },
]

export default function IntegrationsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-dark-700">
        <section className="container py-20 text-center">
          <h1 className="text-4xl font-bold text-dark-50 mb-4">Integrations</h1>
          <p className="text-lg text-dark-100 max-w-2xl mx-auto">
            Connect RELURL with your favorite tools and automate your link management workflow.
          </p>
        </section>

        <section className="container pb-16">
          <div className="grid gap-8 md:grid-cols-2">
            {featuredIntegrations.map((integration) => (
              <div
                key={integration.name}
                className="bg-dark-500 border border-dark-100 rounded-xl p-8 hover:border-[#2FA084] transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-3xl mb-2">{integration.icon}</div>
                    <h2 className="text-xl font-bold text-dark-50">{integration.name}</h2>
                  </div>
                  <span className="inline-block px-2 py-1 text-xs bg-dark-300 text-dark-100 rounded">
                    {integration.category}
                  </span>
                </div>
                <p className="text-sm text-dark-100 mb-4">{integration.description}</p>
                {integration.endpoint && (
                  <div className="bg-dark-700 rounded-lg p-3 mb-4">
                    <p className="text-xs text-dark-100 mb-1">Endpoint:</p>
                    <code className="text-sm text-[#2FA084]">POST {integration.endpoint}</code>
                  </div>
                )}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-dark-100 uppercase tracking-wider">Setup Steps:</p>
                  <ol className="text-sm text-dark-100 space-y-1 list-decimal list-inside">
                    {integration.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="container pb-16">
          <h2 className="text-2xl font-bold text-dark-50 mb-6 text-center">More Integrations</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {moreIntegrations.map((integration) => (
              <div
                key={integration.name}
                className="bg-dark-500 border border-dark-100 rounded-xl p-6 hover:border-[#2FA084] transition-colors"
              >
                <div className="text-2xl mb-2">{integration.icon}</div>
                <h3 className="text-base font-semibold text-dark-50 mb-1">{integration.name}</h3>
                <p className="text-xs text-dark-100 mb-2">{integration.description}</p>
                <span className="inline-block px-2 py-1 text-xs bg-dark-300 text-dark-100 rounded">
                  {integration.category}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="container pb-20 text-center">
          <div className="bg-dark-500 border border-dark-100 rounded-xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-dark-50 mb-3">Need a Custom Integration?</h2>
            <p className="text-dark-100 mb-6">
              Use our REST API or webhooks to build exactly what you need.
            </p>
            <Link
              href="/api"
              className="inline-block px-6 py-3 bg-[#1F6F5F] text-white rounded-lg hover:bg-[#2FA084] transition-colors font-medium"
            >
              View API Docs
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}