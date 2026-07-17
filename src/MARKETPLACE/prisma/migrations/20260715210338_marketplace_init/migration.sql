-- CreateEnum
CREATE TYPE "ListingType" AS ENUM ('VENTE', 'LOCATION', 'SERVICE', 'EMPLOI', 'ECHANGE', 'DON', 'RECHERCHE', 'URGENT', 'PROFESSIONNEL', 'PARTICULIER');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SOLD', 'RENTED', 'DELETED', 'DRAFT', 'PENDING', 'REJECTED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'PROFESSIONAL', 'MODERATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'COUNTERED', 'EXPIRED');

-- CreateTable
CREATE TABLE "marketplace_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT,
    "image" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "emailVerified" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marketplace_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "descriptionFr" TEXT,
    "descriptionAr" TEXT,
    "icon" TEXT,
    "image" TEXT,
    "color" TEXT,
    "parentId" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marketplace_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_listings" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'MAD',
    "listingType" "ListingType" NOT NULL DEFAULT 'VENTE',
    "status" "ListingStatus" NOT NULL DEFAULT 'PENDING',
    "condition" TEXT,
    "year" INTEGER,
    "brand" TEXT,
    "model" TEXT,
    "surface" DOUBLE PRECISION,
    "rooms" INTEGER,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "address" TEXT,
    "city" TEXT NOT NULL,
    "region" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isNegotiable" BOOLEAN NOT NULL DEFAULT false,
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "isProfessional" BOOLEAN NOT NULL DEFAULT false,
    "isPromoted" BOOLEAN NOT NULL DEFAULT false,
    "promotedUntil" TIMESTAMP(3),
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "favoritesCount" INTEGER NOT NULL DEFAULT 0,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "whatsapp" TEXT,
    "tags" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "marketplace_listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_listing_images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT,
    "alt" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "listingId" TEXT NOT NULL,

    CONSTRAINT "marketplace_listing_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_listing_views" (
    "id" TEXT NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "referer" TEXT,
    "country" TEXT,
    "city" TEXT,
    "device" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "listingId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "marketplace_listing_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_favorites" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,

    CONSTRAINT "marketplace_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_reviews" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "listingId" TEXT,

    CONSTRAINT "marketplace_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_conversations" (
    "id" TEXT NOT NULL,
    "subject" TEXT,
    "listingId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,

    CONSTRAINT "marketplace_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_messages" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,

    CONSTRAINT "marketplace_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_reports" (
    "id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,

    CONSTRAINT "marketplace_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_shops" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "logo" TEXT,
    "cover" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "address" TEXT,
    "city" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "marketplace_shops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_subscriptions" (
    "id" TEXT NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'FREE',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "canceledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "marketplace_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_notifications" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'INFO',
    "title" TEXT NOT NULL,
    "message" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "marketplace_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_coupons" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "discount" INTEGER NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'PERCENTAGE',
    "maxUses" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "marketplace_coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_promotions" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'FEATURED',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "listingId" TEXT NOT NULL,

    CONSTRAINT "marketplace_promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_offers" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "message" TEXT,
    "status" "OfferStatus" NOT NULL DEFAULT 'PENDING',
    "counterAmount" DOUBLE PRECISION,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "buyerId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,

    CONSTRAINT "marketplace_offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_saved_searches" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "query" TEXT,
    "filters" JSONB NOT NULL,
    "emailAlerts" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastNotifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "marketplace_saved_searches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_users_email_key" ON "marketplace_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_categories_slug_key" ON "marketplace_categories"("slug");

-- CreateIndex
CREATE INDEX "marketplace_categories_parentId_idx" ON "marketplace_categories"("parentId");

-- CreateIndex
CREATE INDEX "marketplace_categories_slug_idx" ON "marketplace_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_listings_slug_key" ON "marketplace_listings"("slug");

-- CreateIndex
CREATE INDEX "marketplace_listings_userId_idx" ON "marketplace_listings"("userId");

-- CreateIndex
CREATE INDEX "marketplace_listings_categoryId_idx" ON "marketplace_listings"("categoryId");

-- CreateIndex
CREATE INDEX "marketplace_listings_city_idx" ON "marketplace_listings"("city");

-- CreateIndex
CREATE INDEX "marketplace_listings_slug_idx" ON "marketplace_listings"("slug");

-- CreateIndex
CREATE INDEX "marketplace_listings_status_idx" ON "marketplace_listings"("status");

-- CreateIndex
CREATE INDEX "marketplace_listings_listingType_idx" ON "marketplace_listings"("listingType");

-- CreateIndex
CREATE INDEX "marketplace_listings_price_idx" ON "marketplace_listings"("price");

-- CreateIndex
CREATE INDEX "marketplace_listings_createdAt_idx" ON "marketplace_listings"("createdAt");

-- CreateIndex
CREATE INDEX "marketplace_listings_city_categoryId_idx" ON "marketplace_listings"("city", "categoryId");

-- CreateIndex
CREATE INDEX "marketplace_listings_city_status_idx" ON "marketplace_listings"("city", "status");

-- CreateIndex
CREATE INDEX "marketplace_listings_categoryId_status_idx" ON "marketplace_listings"("categoryId", "status");

-- CreateIndex
CREATE INDEX "marketplace_listing_images_listingId_idx" ON "marketplace_listing_images"("listingId");

-- CreateIndex
CREATE INDEX "marketplace_listing_views_listingId_idx" ON "marketplace_listing_views"("listingId");

-- CreateIndex
CREATE INDEX "marketplace_listing_views_createdAt_idx" ON "marketplace_listing_views"("createdAt");

-- CreateIndex
CREATE INDEX "marketplace_favorites_userId_idx" ON "marketplace_favorites"("userId");

-- CreateIndex
CREATE INDEX "marketplace_favorites_listingId_idx" ON "marketplace_favorites"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_favorites_userId_listingId_key" ON "marketplace_favorites"("userId", "listingId");

-- CreateIndex
CREATE INDEX "marketplace_reviews_targetId_idx" ON "marketplace_reviews"("targetId");

-- CreateIndex
CREATE INDEX "marketplace_reviews_authorId_idx" ON "marketplace_reviews"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_reviews_authorId_targetId_listingId_key" ON "marketplace_reviews"("authorId", "targetId", "listingId");

-- CreateIndex
CREATE INDEX "marketplace_conversations_userId_idx" ON "marketplace_conversations"("userId");

-- CreateIndex
CREATE INDEX "marketplace_conversations_participantId_idx" ON "marketplace_conversations"("participantId");

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_conversations_userId_participantId_listingId_key" ON "marketplace_conversations"("userId", "participantId", "listingId");

-- CreateIndex
CREATE INDEX "marketplace_messages_conversationId_idx" ON "marketplace_messages"("conversationId");

-- CreateIndex
CREATE INDEX "marketplace_messages_senderId_idx" ON "marketplace_messages"("senderId");

-- CreateIndex
CREATE INDEX "marketplace_messages_createdAt_idx" ON "marketplace_messages"("createdAt");

-- CreateIndex
CREATE INDEX "marketplace_reports_listingId_idx" ON "marketplace_reports"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_reports_userId_listingId_key" ON "marketplace_reports"("userId", "listingId");

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_shops_slug_key" ON "marketplace_shops"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_shops_userId_key" ON "marketplace_shops"("userId");

-- CreateIndex
CREATE INDEX "marketplace_shops_slug_idx" ON "marketplace_shops"("slug");

-- CreateIndex
CREATE INDEX "marketplace_shops_city_idx" ON "marketplace_shops"("city");

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_subscriptions_userId_key" ON "marketplace_subscriptions"("userId");

-- CreateIndex
CREATE INDEX "marketplace_notifications_userId_idx" ON "marketplace_notifications"("userId");

-- CreateIndex
CREATE INDEX "marketplace_notifications_read_idx" ON "marketplace_notifications"("read");

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_coupons_code_key" ON "marketplace_coupons"("code");

-- CreateIndex
CREATE INDEX "marketplace_promotions_listingId_idx" ON "marketplace_promotions"("listingId");

-- CreateIndex
CREATE INDEX "marketplace_promotions_endDate_idx" ON "marketplace_promotions"("endDate");

-- CreateIndex
CREATE INDEX "marketplace_offers_sellerId_idx" ON "marketplace_offers"("sellerId");

-- CreateIndex
CREATE INDEX "marketplace_offers_listingId_idx" ON "marketplace_offers"("listingId");

-- CreateIndex
CREATE INDEX "marketplace_offers_status_idx" ON "marketplace_offers"("status");

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_offers_buyerId_listingId_key" ON "marketplace_offers"("buyerId", "listingId");

-- CreateIndex
CREATE INDEX "marketplace_saved_searches_userId_idx" ON "marketplace_saved_searches"("userId");

-- CreateIndex
CREATE INDEX "marketplace_saved_searches_emailAlerts_isActive_idx" ON "marketplace_saved_searches"("emailAlerts", "isActive");

-- AddForeignKey
ALTER TABLE "marketplace_categories" ADD CONSTRAINT "marketplace_categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "marketplace_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_listings" ADD CONSTRAINT "marketplace_listings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "marketplace_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_listings" ADD CONSTRAINT "marketplace_listings_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "marketplace_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_listing_images" ADD CONSTRAINT "marketplace_listing_images_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "marketplace_listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_listing_views" ADD CONSTRAINT "marketplace_listing_views_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "marketplace_listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_listing_views" ADD CONSTRAINT "marketplace_listing_views_userId_fkey" FOREIGN KEY ("userId") REFERENCES "marketplace_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_favorites" ADD CONSTRAINT "marketplace_favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "marketplace_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_favorites" ADD CONSTRAINT "marketplace_favorites_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "marketplace_listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_reviews" ADD CONSTRAINT "marketplace_reviews_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "marketplace_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_reviews" ADD CONSTRAINT "marketplace_reviews_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "marketplace_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_conversations" ADD CONSTRAINT "marketplace_conversations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "marketplace_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_conversations" ADD CONSTRAINT "marketplace_conversations_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "marketplace_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_messages" ADD CONSTRAINT "marketplace_messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "marketplace_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_messages" ADD CONSTRAINT "marketplace_messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "marketplace_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_reports" ADD CONSTRAINT "marketplace_reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "marketplace_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_reports" ADD CONSTRAINT "marketplace_reports_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "marketplace_listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_shops" ADD CONSTRAINT "marketplace_shops_userId_fkey" FOREIGN KEY ("userId") REFERENCES "marketplace_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_subscriptions" ADD CONSTRAINT "marketplace_subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "marketplace_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_notifications" ADD CONSTRAINT "marketplace_notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "marketplace_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_promotions" ADD CONSTRAINT "marketplace_promotions_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "marketplace_listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_offers" ADD CONSTRAINT "marketplace_offers_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "marketplace_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_offers" ADD CONSTRAINT "marketplace_offers_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "marketplace_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_offers" ADD CONSTRAINT "marketplace_offers_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "marketplace_listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_saved_searches" ADD CONSTRAINT "marketplace_saved_searches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "marketplace_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
