import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import crypto from "crypto"
import OAuth from "oauth-1.0a"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

try {
  const envPath = path.join(__dirname, ".env")
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue
      const eqIdx = trimmed.indexOf("=")
      if (eqIdx === -1) continue
      const key = trimmed.slice(0, eqIdx).trim()
      const val = trimmed.slice(eqIdx + 1).trim()
      if (!process.env[key]) process.env[key] = val
    }
  }
} catch {}

const CONSUMER_KEY = process.env.TUMBLR_CONSUMER_KEY || "J4eEhh99OUiPznQYdyK4WPIXQBBOfQ50pQ5BBDA729gVMGUEtr"
const CONSUMER_SECRET = process.env.TUMBLR_CONSUMER_SECRET || "QgEGac78ulWPBeJN39beIl8eqcKGwWLbZexCeSCMFzoV1tiu4g"

const oauth = new OAuth({
  consumer: { key: CONSUMER_KEY, secret: CONSUMER_SECRET },
  signature_method: "HMAC-SHA1",
  hash_function(base_string, key) {
    return crypto.createHmac("sha1", key).update(base_string).digest("base64")
  },
})

async function oauthFetch(url, method, bodyParams = {}, token = null) {
  const requestData = { url, method, data: bodyParams }
  const oauthParams = oauth.authorize(requestData, token)
  const header = oauth.toHeader(oauthParams)
  const options = {
    method,
    headers: {
      ...header,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  }
  if (Object.keys(bodyParams).length > 0) {
    options.body = new URLSearchParams(bodyParams).toString()
  }
  const res = await fetch(url, options)
  const text = await res.text()
  return { res, text }
}

// Get request token
console.log("Getting request token...")
const { res: reqRes, text: reqText } = await oauthFetch(
  "https://www.tumblr.com/oauth/request_token",
  "POST",
  { oauth_callback: "https://relurl.com/en/tumblr-auth" }
)
if (!reqRes.ok) { console.error("Request token failed:", reqRes.status, reqText); process.exit(1) }
const reqParams = Object.fromEntries(new URLSearchParams(reqText))
const requestToken = reqParams.oauth_token
const requestTokenSecret = reqParams.oauth_token_secret
console.log("Request token obtained")

const authUrl = `https://www.tumblr.com/oauth/authorize?oauth_token=${requestToken}`
console.log(`\nAuth URL: ${authUrl}`)

const verifier = process.argv[2]
if (!verifier) {
  console.log("\nVisit the URL above, authorize, then run:")
  console.log(`node backlinks/do-tumblr.mjs <verifier_code>`)
  process.exit(0)
}

console.log(`\nUsing verifier: ${verifier}`)

// Exchange for access token
console.log("Exchanging for access token...")
const reqToken = { key: requestToken, secret: requestTokenSecret }
const { res: accRes, text: accText } = await oauthFetch(
  "https://www.tumblr.com/oauth/access_token",
  "POST",
  { oauth_verifier: verifier },
  reqToken
)
if (!accRes.ok) { console.error("Access token failed:", accRes.status, accText); process.exit(1) }
const accParams = Object.fromEntries(new URLSearchParams(accText))
console.log("Response params:", JSON.stringify(accParams))
const accessToken = accParams.oauth_token
const accessTokenSecret = accParams.oauth_token_secret

// Save to .env
const envPath = path.join(__dirname, ".env")
let env = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf-8") : ""
env = env.replace(/TUMBLR_ACCESS_TOKEN=.*\n?/, "").replace(/TUMBLR_ACCESS_TOKEN_SECRET=.*\n?/, "").trim()
env += `\nTUMBLR_ACCESS_TOKEN=${accessToken}\nTUMBLR_ACCESS_TOKEN_SECRET=${accessTokenSecret}\n`
fs.writeFileSync(envPath, env)
console.log(`\n✓ Access token saved! Token: ${accessToken.substring(0,10)}...`)
