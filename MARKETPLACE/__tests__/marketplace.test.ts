import { describe, it, expect } from "vitest"
import { formatPrice, slugify, truncate, generateListingSlug, getListingTypeLabel } from "../src/lib/utils"

describe("Marketplace Utils", () => {
  describe("formatPrice", () => {
    it("formats price with MAD currency", () => {
      const result = formatPrice(15000)
      expect(result).toContain("15")
      expect(result).toContain("000")
    })

    it("returns fallback for null price", () => {
      const result = formatPrice(null)
      expect(result).toBe("Prix non spécifié")
    })

    it("returns fallback for undefined price", () => {
      const result = formatPrice(undefined)
      expect(result).toBe("Prix non spécifié")
    })
  })

  describe("slugify", () => {
    it("converts text to lowercase slug", () => {
      expect(slugify("Bel Appartement")).toBe("bel-appartement")
    })

    it("removes accents", () => {
      expect(slugify("Voiture à vendre à Casablanca")).toBe("voiture-a-vendre-a-casablanca")
    })

    it("removes special characters", () => {
      expect(slugify("iPhone 15 Pro!")).toBe("iphone-15-pro")
    })
  })

  describe("truncate", () => {
    it("truncates long text", () => {
      const text = "A".repeat(200)
      const result = truncate(text, 50)
      expect(result.length).toBeLessThan(text.length)
      expect(result.endsWith("...")).toBe(true)
    })

    it("keeps short text unchanged", () => {
      const text = "Short text"
      expect(truncate(text, 50)).toBe(text)
    })
  })

  describe("generateListingSlug", () => {
    it("generates slug with id", () => {
      const slug = generateListingSlug("Bel Appartement", "abc12345xyz")
      expect(slug).toContain("bel-appartement")
      expect(slug).toContain("abc12345")
    })
  })

  describe("getListingTypeLabel", () => {
    it("returns French label", () => {
      expect(getListingTypeLabel("VENTE", "fr")).toBe("Vente")
      expect(getListingTypeLabel("LOCATION", "fr")).toBe("Location")
    })

    it("returns Arabic label", () => {
      expect(getListingTypeLabel("VENTE", "ar")).toBe("بيع")
      expect(getListingTypeLabel("LOCATION", "ar")).toBe("إيجار")
    })

    it("returns key for unknown type", () => {
      expect(getListingTypeLabel("UNKNOWN", "fr")).toBe("UNKNOWN")
    })
  })
})

describe("Validation Schemas", () => {
  it("listingSchema validates correctly", async () => {
    const { listingSchema } = await import("../src/lib/validations")

    const validData = {
      title: "Bel appartement à Casablanca",
      description: "Un superbe appartement situé au cœur de Casablanca avec une vue magnifique sur la ville.",
      price: 1200000,
      currency: "MAD",
      listingType: "VENTE" as const,
      city: "Casablanca",
      categoryId: "some-category-id",
    }

    const result = listingSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it("rejects invalid listing data", async () => {
    const { listingSchema } = await import("../src/lib/validations")

    const invalidData = {
      title: "Bad",
      description: "Short",
      listingType: "INVALID" as any,
      city: "",
    }

    const result = listingSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})
