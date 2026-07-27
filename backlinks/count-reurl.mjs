import fs from "fs"
import { execSync } from "child_process"
import path from "path"

const outputFile = path.join(__dirname, "articles-reurl-backlinks.txt")
let summary = "RELURL Backlink Summary by Platform\n================\n\n"
let total = 0

// Get the list of social archive directories
const { stdout } = execSync("dir backlinks/articles-* 2>&1")
const lines = stdout.split('\n')
const dirs = lines
  .filter(l => l.includes(' <DIR>'))
  .map(l => l.split('   ').filter(Boolean)[1])
  .filter(d => d !== 'articles-all' && d !== 'articles-index')
  .sort()

for (const dir of dirs) {
  const platform = dir.replace('articles-', '').replace(/-.*/, '')
  const { stdout: files } = execSync(`dir ${dir} /b`)
  let platformTotal = 0
  let platformCount = 0
  
  for (const file of files.split('\n').filter(f => f.endsWith('.html'))) {
    const content = fs.readFileSync(path.join(__dirname, dir, file), "utf-8")
    const matches = content.match(/https:\/\/relurl\.com\/en[^\s)\"'\]]+/g) || []
    if (matches.length > 0) {
      platformTotal += matches.length
      platformCount++
    }
  }
  
  if (platformCount > 0) {
    summary += `${platform}: ${platformTotal} backlinks (${platformCount} articles)\n`
    total += platformTotal
  }
}

summary += `\nTotal: ${total} backlinks across ${dirs.length} platforms\n`
console.log(summary)
fs.writeFileSync(outputFile, summary, "utf-8")
console.log(`Summary written to: ${outputFile}")
