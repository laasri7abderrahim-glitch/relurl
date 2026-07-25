const fs = require("fs")
const lines = fs.readFileSync("messages/fr.json", "utf-8").split("\n")
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("siteDescription") || lines[i].includes("orgDescription")) {
    console.log((i+1) + ": " + lines[i])
  }
}
