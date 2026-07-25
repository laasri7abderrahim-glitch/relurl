const fs = require("fs")

const translations = {
  en: {
    "layout.header.platform": "Platform",
    "layout.header.productsGroup": "Products",
    "layout.header.featuresGroup": "Features",
    "layout.header.urlShortener": "URL Shortener",
    "layout.header.urlShortenerDesc": "Customize, share and track links",
    "layout.header.qrCodeGenerator": "QR Code Generator",
    "layout.header.qrCodeGeneratorDesc": "Dynamic solutions for every need",
    "layout.header.analytics": "Analytics",
    "layout.header.analyticsDesc": "Track and analyze performance",
    "layout.header.brandedLinks": "Branded Links",
    "layout.header.brandedLinksDesc": "Custom links with your domain",
    "layout.header.linkInBio": "Link-in-bio",
    "layout.header.linkInBioDesc": "Curate links for social profiles",
    "layout.header.linkHealth": "Link Health",
    "layout.header.linkHealthDesc": "Monitor your link performance",
    "layout.header.utmBuilder": "UTM Builder",
    "layout.header.utmBuilderDesc": "Track with UTM parameters",
    "layout.header.teamCollaboration": "Team Collaboration",
    "layout.header.teamCollaborationDesc": "Work together seamlessly",
    "layout.header.browserExtension": "Browser Extension",
    "layout.header.browserExtensionDesc": "Shorten links with one click",
    "layout.header.viewAllFeatures": "View all features",
    "layout.header.toggleTheme": "Toggle theme",
    "layout.header.themeLight": "Light",
    "layout.header.themeDark": "Dark",
    "layout.header.openMenu": "Open navigation menu",
    "layout.header.closeMenu": "Close navigation menu",
    "footer.newsletter.title": "Get the latest updates",
    "footer.newsletter.description": "Subscribe to our newsletter for new features and tips.",
    "footer.newsletter.placeholder": "Enter your email",
    "footer.newsletter.subscribe": "Subscribe",
    "footer.newsletter.subscribed": "Subscribed!",
  },
  es: {
    "layout.header.platform": "Plataforma",
    "layout.header.productsGroup": "Productos",
    "layout.header.featuresGroup": "Funciones",
    "layout.header.urlShortener": "Acortador de URL",
    "layout.header.urlShortenerDesc": "Personaliza, comparte y rastrea enlaces",
    "layout.header.qrCodeGenerator": "Generador de c\u00f3digos QR",
    "layout.header.qrCodeGeneratorDesc": "Soluciones din\u00e1micas para cada necesidad",
    "layout.header.analytics": "Estad\u00edsticas",
    "layout.header.analyticsDesc": "Rastrea y analiza el rendimiento",
    "layout.header.brandedLinks": "Enlaces de marca",
    "layout.header.brandedLinksDesc": "Enlaces personalizados con tu dominio",
    "layout.header.linkInBio": "Link-in-bio",
    "layout.header.linkInBioDesc": "Selecciona enlaces para perfiles sociales",
    "layout.header.linkHealth": "Estado de enlaces",
    "layout.header.linkHealthDesc": "Supervisa el rendimiento de tus enlaces",
    "layout.header.utmBuilder": "Constructor UTM",
    "layout.header.utmBuilderDesc": "Rastrea con par\u00e1metros UTM",
    "layout.header.teamCollaboration": "Colaboraci\u00f3n en equipo",
    "layout.header.teamCollaborationDesc": "Trabaja juntos sin problemas",
    "layout.header.browserExtension": "Extensi\u00f3n del Navegador",
    "layout.header.browserExtensionDesc": "Acorta enlaces con un clic",
    "layout.header.viewAllFeatures": "Ver todas las funciones",
    "layout.header.toggleTheme": "Cambiar tema",
    "layout.header.themeLight": "Claro",
    "layout.header.themeDark": "Oscuro",
    "layout.header.openMenu": "Abrir men\u00fa de navegaci\u00f3n",
    "layout.header.closeMenu": "Cerrar men\u00fa de navegaci\u00f3n",
    "footer.newsletter.title": "Recibe las \u00faltimas novedades",
    "footer.newsletter.description": "Suscr\u00edbete a nuestro bolet\u00edn para recibir nuevas funciones y consejos.",
    "footer.newsletter.placeholder": "Introduce tu correo electr\u00f3nico",
    "footer.newsletter.subscribe": "Suscribirse",
    "footer.newsletter.subscribed": "\u00a1Suscrito!",
  },
  fr: {
    "layout.header.platform": "Plateforme",
    "layout.header.productsGroup": "Produits",
    "layout.header.featuresGroup": "Fonctionnalit\u00e9s",
    "layout.header.urlShortener": "Raccourcisseur d'URL",
    "layout.header.urlShortenerDesc": "Personnalisez, partagez et suivez les liens",
    "layout.header.qrCodeGenerator": "G\u00e9n\u00e9rateur de codes QR",
    "layout.header.qrCodeGeneratorDesc": "Solutions dynamiques pour chaque besoin",
    "layout.header.analytics": "Analytique",
    "layout.header.analyticsDesc": "Suivez et analysez les performances",
    "layout.header.brandedLinks": "Liens de marque",
    "layout.header.brandedLinksDesc": "Liens personnalis\u00e9s avec votre domaine",
    "layout.header.linkInBio": "Lien dans la bio",
    "layout.header.linkInBioDesc": "Curiez les liens pour les profils sociaux",
    "layout.header.linkHealth": "Sant\u00e9 des liens",
    "layout.header.linkHealthDesc": "Surveillez les performances de vos liens",
    "layout.header.utmBuilder": "Constructeur UTM",
    "layout.header.utmBuilderDesc": "Suivez avec les param\u00e8tres UTM",
    "layout.header.teamCollaboration": "Collaboration d'\u00e9quipe",
    "layout.header.teamCollaborationDesc": "Travaillez ensemble sans effort",
    "layout.header.browserExtension": "Extension Navigateur",
    "layout.header.browserExtensionDesc": "Raccourcissez les liens en un clic",
    "layout.header.viewAllFeatures": "Voir toutes les fonctionnalit\u00e9s",
    "layout.header.toggleTheme": "Changer de th\u00e8me",
    "layout.header.themeLight": "Clair",
    "layout.header.themeDark": "Sombre",
    "layout.header.openMenu": "Ouvrir le menu de navigation",
    "layout.header.closeMenu": "Fermer le menu de navigation",
    "footer.newsletter.title": "Recevez les derni\u00e8res actualit\u00e9s",
    "footer.newsletter.description": "Abonnez-vous \u00e0 notre newsletter pour d\u00e9couvrir les nouvelles fonctionnalit\u00e9s et astuces.",
    "footer.newsletter.placeholder": "Entrez votre email",
    "footer.newsletter.subscribe": "S'abonner",
    "footer.newsletter.subscribed": "Abonn\u00e9 !",
  }
}

for (const locale of ["en", "es", "fr"]) {
  const path = "messages/" + locale + ".json"
  const data = JSON.parse(fs.readFileSync(path, "utf-8"))
  const t = translations[locale]

  // Add layout.header keys
  if (!data.layout) data.layout = {}
  if (!data.layout.header) data.layout.header = {}
  for (const key of Object.keys(t).filter(k => k.startsWith("layout.header."))) {
    const shortKey = key.replace("layout.header.", "")
    data.layout.header[shortKey] = t[key]
  }

  // Add footer.newsletter keys
  if (!data.footer) data.footer = {}
  if (!data.footer.newsletter) data.footer.newsletter = {}
  for (const key of Object.keys(t).filter(k => k.startsWith("footer.newsletter."))) {
    const shortKey = key.replace("footer.newsletter.", "")
    data.footer.newsletter[shortKey] = t[key]
  }

  fs.writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf-8")
  console.log(locale + ".json: updated")
}
