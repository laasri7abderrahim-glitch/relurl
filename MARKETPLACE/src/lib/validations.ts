import { z } from "zod"

export const listingSchema = z.object({
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères").max(120, "Le titre ne peut pas dépasser 120 caractères"),
  description: z.string().min(20, "La description doit contenir au moins 20 caractères").max(10000, "La description ne peut pas dépasser 10000 caractères"),
  price: z.number().positive("Le prix doit être positif").optional().nullable(),
  currency: z.string().default("MAD"),
  listingType: z.enum(["VENTE", "LOCATION", "SERVICE", "EMPLOI", "ECHANGE", "DON", "RECHERCHE", "URGENT", "PROFESSIONNEL", "PARTICULIER"]),
  condition: z.string().optional().nullable(),
  year: z.number().int().min(1900).max(2030).optional().nullable(),
  brand: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  surface: z.number().positive().optional().nullable(),
  rooms: z.number().int().positive().optional().nullable(),
  bedrooms: z.number().int().positive().optional().nullable(),
  bathrooms: z.number().int().positive().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().min(1, "La ville est requise"),
  region: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  isNegotiable: z.boolean().default(false),
  isUrgent: z.boolean().default(false),
  contactPhone: z.string().optional().nullable(),
  contactEmail: z.string().email().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  tags: z.string().optional().nullable(),
  categoryId: z.string().min(1, "La catégorie est requise"),
  images: z.array(z.string()).max(20, "Maximum 20 images").optional(),
})

export type ListingFormData = z.infer<typeof listingSchema>

export const searchSchema = z.object({
  query: z.string().optional(),
  categoryId: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  listingType: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  condition: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  sort: z.enum(["date_desc", "date_asc", "price_asc", "price_desc", "views"]).optional().default("date_desc"),
  page: z.number().int().positive().optional().default(1),
  pageSize: z.number().int().positive().max(100).optional().default(20),
  isUrgent: z.boolean().optional(),
  isProfessional: z.boolean().optional(),
  isNegotiable: z.boolean().optional(),
})

export const messageSchema = z.object({
  content: z.string().min(1, "Le message ne peut pas être vide").max(5000, "Le message ne peut pas dépasser 5000 caractères"),
  listingId: z.string().optional(),
  subject: z.string().max(200).optional(),
})

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional(),
  listingId: z.string().optional(),
})

export const reportSchema = z.object({
  reason: z.enum(["SPAM", "INAPPROPRIATE", "SCAM", "DUPLICATE", "WRONG_CATEGORY", "OTHER"]),
  description: z.string().max(1000).optional(),
})

export const shopSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères").max(100),
  description: z.string().max(2000).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  address: z.string().optional(),
  city: z.string().min(1, "La ville est requise"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
})

export const profileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().optional(),
  image: z.string().optional(),
})
