async function main() {
  const r = await fetch("https://relurl.com/fr/", {headers: {"User-Agent": "Mozilla/5.0"}})
  const text = await r.text()
  
  const checks = {
    "Plateforme (button)": text.includes(">Plateforme<"),
    "Produits (group)": text.includes(">Produits<"),
    "Fonctionnalit\u00e9s (group)": text.includes("Fonctionnalit\u00e9s"),
    "Voir toutes les fonctionnalit\u00e9s": text.includes("Voir toutes les fonctionnalit\u00e9s"),
    "Raccourcisseur d'URL": text.includes("Raccourcisseur d'URL"),
    "newsletter title": text.includes("Recevez les derni\u00e8res actualit\u00e9s"),
    "newsletter placeholder": text.includes("Entrez votre email"),
    "S'abonner": text.includes("S'abonner"),
  }
  Object.entries(checks).forEach(([k, v]) => console.log(k + ": " + (v ? "✓" : "✗")))
}
main().catch(console.error)
