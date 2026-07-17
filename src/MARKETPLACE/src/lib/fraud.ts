export interface FraudSignal {
  type: "HIGH" | "MEDIUM" | "LOW"
  code: string
  message: string
  messageAr: string
}

export interface FraudCheckResult {
  score: number
  signals: FraudSignal[]
  shouldBlock: boolean
  shouldReview: boolean
}

export function checkListingFraud(listing: {
  title: string
  description: string
  price: number | null
  city: string
  contactPhone?: string | null
  userId: string
  images?: { url: string }[]
}): FraudCheckResult {
  const signals: FraudSignal[] = []
  let score = 0

  if (listing.price != null && listing.price <= 0) {
    signals.push({
      type: "HIGH",
      code: "ZERO_PRICE",
      message: "Prix nul ou négatif",
      messageAr: "السعر صفر أو سالب",
    })
    score += 30
  }

  const spamWords = [
    "urgent", "cliquez ici", "offre limitée", "gagnez", "gratuit",
    "bitcoin", "crypto", "investissement garanti", "revenu passif",
    "whatsapp", "telegram", "转移", "诈骗",
  ]
  const text = `${listing.title} ${listing.description}`.toLowerCase()
  const foundSpam = spamWords.filter((w) => text.includes(w))
  if (foundSpam.length >= 2) {
    signals.push({
      type: "HIGH",
      code: "SPAM_CONTENT",
      message: `Contenu suspect détecté: ${foundSpam.join(", ")}`,
      messageAr: "تم اكتشاف محتوى مشبوه",
    })
    score += 40
  } else if (foundSpam.length === 1) {
    signals.push({
      type: "MEDIUM",
      code: "POTENTIAL_SPAM",
      message: `Mot suspect: ${foundSpam[0]}`,
      messageAr: "كلمة مشبوهة",
    })
    score += 10
  }

  if (listing.description.length < 20) {
    signals.push({
      type: "MEDIUM",
      code: "SHORT_DESCRIPTION",
      message: "Description très courte",
      messageAr: "وصف قصير جداً",
    })
    score += 10
  }

  if (!listing.images || listing.images.length === 0) {
    signals.push({
      type: "LOW",
      code: "NO_IMAGES",
      message: "Aucune image",
      messageAr: "بدون صور",
    })
    score += 5
  }

  if (listing.price != null && listing.price > 10000000) {
    signals.push({
      type: "MEDIUM",
      code: "HIGH_PRICE",
      message: "Prix anormalement élevé",
      messageAr: "سعر مرتفع بشكل غير طبيعي",
    })
    score += 15
  }

  if (listing.title === listing.description) {
    signals.push({
      type: "MEDIUM",
      code: "DUPLICATE_TEXT",
      message: "Titre identique à la description",
      messageAr: "العنوان مطابق للوصف",
    })
    score += 20
  }

  if (listing.contactPhone) {
    const phoneRegex = /^(\+212|0)[5-7]\d{8}$/
    if (!phoneRegex.test(listing.contactPhone.replace(/\s/g, ""))) {
      signals.push({
        type: "LOW",
        code: "INVALID_PHONE",
        message: "Numéro de téléphone non marocain",
        messageAr: "رقم الهاتف ليس مغربياً",
      })
      score += 5
    }
  }

  return {
    score: Math.min(score, 100),
    signals,
    shouldBlock: score >= 70,
    shouldReview: score >= 40 && score < 70,
  }
}

export function checkUserFraud(user: {
  email: string
  phone?: string | null
  createdAt: Date
  listingsCount?: number
  reportsCount?: number
}): FraudCheckResult {
  const signals: FraudSignal[] = []
  let score = 0

  if (user.listingsCount && user.listingsCount > 20) {
    signals.push({
      type: "MEDIUM",
      code: "HIGH_LISTING_VOLUME",
      message: `${user.listingsCount} annonces publiées`,
      messageAr: `${user.listingsCount} إعلان منشور`,
    })
    score += 15
  }

  if (user.reportsCount && user.reportsCount > 3) {
    signals.push({
      type: "HIGH",
      code: "MULTIPLE_REPORTS",
      message: `${user.reportsCount} signalements reçus`,
      messageAr: `${user.reportsCount} بلاغات`,
    })
    score += 30
  }

  const emailDomains = ["tempmail.com", "throwaway.email", "guerrillamail.com", "mailinator.com"]
  const domain = user.email.split("@")[1]
  if (emailDomains.includes(domain)) {
    signals.push({
      type: "MEDIUM",
      code: "DISPOSABLE_EMAIL",
      message: "Email jetable utilisé",
      messageAr: "بريد إلكتروني مؤقت",
    })
    score += 20
  }

  const accountAge = Date.now() - new Date(user.createdAt).getTime()
  const hoursOld = accountAge / (1000 * 60 * 60)
  if (hoursOld < 1 && (user.listingsCount || 0) > 5) {
    signals.push({
      type: "HIGH",
      code: "RAPID_POSTING",
      message: "Plusieurs annonces créées rapidement",
      messageAr: "عدة إعلانات تم إنشاؤها بسرعة",
    })
    score += 35
  }

  return {
    score: Math.min(score, 100),
    signals,
    shouldBlock: score >= 70,
    shouldReview: score >= 40 && score < 70,
  }
}

export function generateFraudReport(result: FraudCheckResult): string {
  const lines: string[] = []
  lines.push(`Score: ${result.score}/100`)
  lines.push(`Action: ${result.shouldBlock ? "BLOQUER" : result.shouldReview ? "EXAMINER" : "AUTORISER"}`)
  if (result.signals.length > 0) {
    lines.push("Signaux:")
    result.signals.forEach((s) => {
      lines.push(`  [${s.type}] ${s.message} (${s.code})`)
    })
  }
  return lines.join("\n")
}