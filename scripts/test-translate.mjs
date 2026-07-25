async function translate(texts, target) {
  const q = encodeURIComponent(texts.join("\n---SEP---\n"))
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${target}&dt=t&q=${q}`
  const r = await fetch(url)
  const d = await r.json()
  const full = d[0].map(s => s[0]).filter(Boolean).join("")
  return full.split("---SEP---").map(s => s.trim())
}

const result = await translate(["Hello world", "Goodbye world"], "es")
console.log(JSON.stringify(result))
