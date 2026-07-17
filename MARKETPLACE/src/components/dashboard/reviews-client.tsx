"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Star, ThumbsUp, ThumbsDown, MessageCircle, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Review {
  id: string
  rating: number
  comment: string
  authorName: string
  authorAvatar?: string
  createdAt: string
  listingTitle?: string
  helpful: number
  notHelpful: number
}

interface Props {
  locale: string
}

const MOCK_REVIEWS: Review[] = []

export function ReviewsClient({ locale }: Props) {
  const t = useTranslations("marketplace")
  const isArabic = locale === "ar"
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS)
  const [filter, setFilter] = useState<"all" | "5" | "4" | "3" | "2" | "1">("all")
  const [showWriteReview, setShowWriteReview] = useState(false)
  const [newRating, setNewRating] = useState(0)
  const [newComment, setNewComment] = useState("")

  const filteredReviews = filter === "all"
    ? reviews
    : reviews.filter((r) => r.rating === parseInt(filter))

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0"

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: reviews.length
      ? (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100
      : 0,
  }))

  const StarRating = ({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) => {
    const sizeClass = size === "sm" ? "w-3 h-3" : size === "lg" ? "w-6 h-6" : "w-4 h-4"
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {isArabic ? "التقييمات" : "Mes avis"}
        </h1>
        <Button onClick={() => setShowWriteReview(!showWriteReview)}>
          {isArabic ? "كتابة تقييم" : "Laisser un avis"}
        </Button>
      </div>

      {showWriteReview && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {isArabic ? "تقييمك" : "Votre évaluation"}
          </h3>
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setNewRating(star)}
                className="p-1"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= newRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                  } hover:fill-yellow-400 hover:text-yellow-400 transition-colors`}
                />
              </button>
            ))}
            <span className="text-sm text-gray-500 ml-2">
              {newRating > 0
                ? `${newRating}/5`
                : isArabic ? "اختر تقييم" : "Sélectionnez une note"}
            </span>
          </div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={4}
            placeholder={isArabic ? "اكتب تقييمك..." : "Partagez votre expérience..."}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowWriteReview(false)}>
              {isArabic ? "إلغاء" : "Annuler"}
            </Button>
            <Button disabled={newRating === 0}>
              {isArabic ? "إرسال" : "Publier"}
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="text-center mb-6">
            <p className="text-5xl font-bold text-gray-900 dark:text-gray-100">{avgRating}</p>
            <StarRating rating={Math.round(parseFloat(avgRating))} size="lg" />
            <p className="text-sm text-gray-500 mt-2">
              {reviews.length} {isArabic ? "تقييم" : "avis"}
            </p>
          </div>

          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-2 text-sm">
                <span className="w-3 text-gray-500">{rating}</span>
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right text-gray-500">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-500" />
            {(["all", "5", "4", "3", "2", "1"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  filter === f
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {f === "all" ? (isArabic ? "الكل" : "Tous") : f}
              </button>
            ))}
          </div>

          {filteredReviews.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
              <Star className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {isArabic ? "لا توجد تقييمات بعد" : "Aucun avis pour le moment"}
              </p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5"
              >
                <div className="flex items-start gap-3">
                  {review.authorAvatar ? (
                    <img src={review.authorAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-medium text-sm">
                        {review.authorName.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                          {review.authorName}
                        </p>
                        <div className="flex items-center gap-2">
                          <StarRating rating={review.rating} size="sm" />
                          <span className="text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {review.listingTitle && (
                      <p className="text-xs text-gray-500 mt-1">
                        {isArabic ? "بخصوص" : "Concernant"}: {review.listingTitle}
                      </p>
                    )}

                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {review.comment}
                    </p>

                    <div className="flex items-center gap-4 mt-3">
                      <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-600 transition-colors">
                        <ThumbsUp className="w-3 h-3" />
                        {review.helpful}
                      </button>
                      <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors">
                        <ThumbsDown className="w-3 h-3" />
                        {review.notHelpful}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}