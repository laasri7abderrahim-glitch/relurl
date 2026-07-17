export interface MarketplaceUser {
  id: string
  email: string
  name: string | null
  phone: string | null
  phoneVerified: boolean
  image: string | null
  role: "USER" | "PROFESSIONAL" | "MODERATOR" | "ADMIN"
  emailVerified: string | null
  isActive: boolean
  isVerified: boolean
  verifiedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface MarketplaceCategory {
  id: string
  slug: string
  nameFr: string
  nameAr: string
  descriptionFr: string | null
  descriptionAr: string | null
  icon: string | null
  image: string | null
  color: string | null
  parentId: string | null
  order: number
  isActive: boolean
  parent?: MarketplaceCategory | null
  children?: MarketplaceCategory[]
  listings?: MarketplaceListing[]
}

export interface MarketplaceListing {
  id: string
  title: string
  slug: string
  description: string
  price: number | null
  currency: string
  listingType: ListingType
  status: ListingStatus
  condition: string | null
  year: number | null
  brand: string | null
  model: string | null
  surface: number | null
  rooms: number | null
  bedrooms: number | null
  bathrooms: number | null
  address: string | null
  city: string
  region: string | null
  latitude: number | null
  longitude: number | null
  isNegotiable: boolean
  isUrgent: boolean
  isProfessional: boolean
  isPromoted: boolean
  promotedUntil: string | null
  viewsCount: number
  favoritesCount: number
  contactPhone: string | null
  contactEmail: string | null
  whatsapp: string | null
  tags: string | null
  seoTitle: string | null
  seoDescription: string | null
  expiresAt: string | null
  createdAt: string
  updatedAt: string
  userId: string
  categoryId: string
  user?: MarketplaceUser
  category?: MarketplaceCategory
  images?: MarketplaceListingImage[]
  _count?: { images: number; favorites: number }
}

export type ListingType =
  | "VENTE"
  | "LOCATION"
  | "SERVICE"
  | "EMPLOI"
  | "ECHANGE"
  | "DON"
  | "RECHERCHE"
  | "URGENT"
  | "PROFESSIONNEL"
  | "PARTICULIER"

export type ListingStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "SOLD"
  | "RENTED"
  | "DELETED"
  | "DRAFT"
  | "PENDING"
  | "REJECTED"

export interface MarketplaceListingImage {
  id: string
  url: string
  publicId: string | null
  alt: string | null
  order: number
  isPrimary: boolean
  createdAt: string
  listingId: string
}

export interface MarketplaceFavorite {
  id: string
  createdAt: string
  userId: string
  listingId: string
  listing?: MarketplaceListing
}

export interface MarketplaceReview {
  id: string
  rating: number
  comment: string | null
  status: "PENDING" | "APPROVED" | "REJECTED"
  createdAt: string
  updatedAt: string
  authorId: string
  targetId: string
  listingId: string | null
  author?: MarketplaceUser
  target?: MarketplaceUser
}

export interface MarketplaceConversation {
  id: string
  subject: string | null
  listingId: string | null
  createdAt: string
  updatedAt: string
  userId: string
  participantId: string
  user?: MarketplaceUser
  participant?: MarketplaceUser
  messages?: MarketplaceMessage[]
  _count?: { messages: number }
  lastMessage?: MarketplaceMessage
}

export interface MarketplaceMessage {
  id: string
  content: string
  read: boolean
  readAt: string | null
  createdAt: string
  conversationId: string
  senderId: string
  sender?: MarketplaceUser
}

export interface MarketplaceReport {
  id: string
  reason: string
  description: string | null
  status: string
  createdAt: string
  updatedAt: string
  userId: string
  listingId: string
  user?: MarketplaceUser
  listing?: MarketplaceListing
}

export interface MarketplaceShop {
  id: string
  name: string
  slug: string
  description: string | null
  logo: string | null
  cover: string | null
  phone: string | null
  email: string | null
  website: string | null
  address: string | null
  city: string
  latitude: number | null
  longitude: number | null
  isVerified: boolean
  isActive: boolean
  rating: number
  reviewsCount: number
  createdAt: string
  updatedAt: string
  userId: string
  user?: MarketplaceUser
  listings?: MarketplaceListing[]
}

export interface MarketplaceSubscription {
  id: string
  plan: string
  status: string
  currentPeriodStart: string | null
  currentPeriodEnd: string | null
  canceledAt: string | null
  createdAt: string
  updatedAt: string
  userId: string
}

export interface MarketplacePromotion {
  id: string
  type: string
  startDate: string
  endDate: string
  price: number
  isActive: boolean
  createdAt: string
  listingId: string
}

export type OfferStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "COUNTERED" | "EXPIRED"

export interface MarketplaceOffer {
  id: string
  amount: number
  message: string | null
  status: OfferStatus
  counterAmount: number | null
  expiresAt: string | null
  createdAt: string
  updatedAt: string
  buyerId: string
  sellerId: string
  listingId: string
  buyer?: MarketplaceUser
  seller?: MarketplaceUser
  listing?: MarketplaceListing
}

export interface MarketplaceSavedSearch {
  id: string
  name: string
  query: string | null
  filters: Record<string, unknown>
  emailAlerts: boolean
  isActive: boolean
  lastNotifiedAt: string | null
  createdAt: string
  updatedAt: string
  userId: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasMore: boolean
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface SearchFilters {
  query?: string
  categoryId?: string
  city?: string
  region?: string
  listingType?: ListingType
  minPrice?: number
  maxPrice?: number
  condition?: string
  brand?: string
  model?: string
  sort?: "date_desc" | "date_asc" | "price_asc" | "price_desc" | "views"
  page?: number
  pageSize?: number
  isUrgent?: boolean
  isProfessional?: boolean
  isNegotiable?: boolean
}
