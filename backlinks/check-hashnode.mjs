import { readFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const env = readFileSync(resolve(__dirname, ".env"), "utf-8")
const token = env.match(/HASHNODE_TOKEN=(\S+)/)?.[1]

console.log("Token found:", !!token)

async function main() {
  // Try with trailing slash and specific headers matching curl behavior
  const endpoints = [
    "https://gql.hashnode.com/",
    "https://gql.hashnode.com/graphql",
  ]
  for (const ep of endpoints) {
    console.log("\n=== Trying:", ep, "===")
    try {
      const res = await fetch(ep, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          Accept: "application/json",
          "User-Agent": "curl/8.0",
        },
        body: JSON.stringify({
          query: `query { me { name publications(first: 10) { edges { node { id title url } } } } }`,
        }),
      })
      const body = await res.text()
      console.log("Status:", res.status)
      console.log("Content-Type:", res.headers.get("content-type"))
      console.log("x-powered-by:", res.headers.get("x-powered-by"))
      console.log("Body:", body.slice(0, 1000))
    } catch (e) {
      console.log("Error:", e.message)
    }
  }
}
main().catch(console.error)
