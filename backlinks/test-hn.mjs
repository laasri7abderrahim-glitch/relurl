// Test Hashnode with PAT token
const PAT = "ed4eb8b3-7869-4ec0-9db7-7bb67a7fa1c9"

const data = JSON.stringify({
  query: 'query { publication(host: "relurl.hashnode.dev") { id title url } }',
})

const res = await fetch("https://gql.hashnode.com/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: PAT,
  },
  body: data,
  redirect: "manual", // don't follow redirects
})

console.log("Status:", res.status)
console.log("Headers:", JSON.stringify([...res.headers]))
const body = await res.text()
console.log("Body:", body.slice(0, 1000))
