import { GoogleAuth } from "google-auth-library"
import { readFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const envRaw = readFileSync(resolve(__dirname, "..", ".env"), "utf-8")
const m = envRaw.match(/GOOGLE_INDEXING_KEY="([^"]+)"/)
const creds = JSON.parse(Buffer.from(m[1], "base64").toString("utf-8"))

async function run() {
  const auth = new GoogleAuth({ credentials: creds, scopes: ["https://www.googleapis.com/auth/indexing"] })
  const client = await auth.getClient()
  try {
    const res = await client.request({
      url: "https://indexing.googleapis.com/v3/urlNotifications:publish",
      method: "POST",
      data: { url: "https://relurl.com/en/url-shortener", type: "URL_UPDATED" },
    })
    console.log("OK:", JSON.stringify(res.data, null, 2))
  } catch (e) {
    console.error("Status:", e.response?.status)
    console.error("Body:", JSON.stringify(e.response?.data, null, 2) || e.message)
  }
}
run()
