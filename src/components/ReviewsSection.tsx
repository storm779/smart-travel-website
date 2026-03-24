import { useEffect, useState, useCallback } from "react";
import { Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { supabase, Review } from "@/lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import StarRating from "./StarRating";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";

interface ReviewsSectionProps {
  packageId: string;
}

export default function ReviewsSection({ packageId }: ReviewsSectionProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasReviewed, setHasReviewed] = useState(false);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("reviews")
      .select("*, profiles:user_id(full_name)")
      .eq("package_id", packageId)
      .order("created_at", { ascending: false });

    if (data) {
      setReviews(data as Review[]);
      if (user) {
        setHasReviewed(data.some((r: Review) => r.user_id === user.id));
      }
    }
    setLoading(false);
  }, [packageId, user]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "0";

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage:
      reviews.length > 0
        ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100
        : 0,
  }));

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold font-kugile text-foreground mb-6">
        Reviews & Ratings
      </h2>

      {/* Summary */}
      {reviews.length > 0 && (
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Average Rating */}
          <div className="flex flex-col items-center gap-2">
            <div className="text-5xl font-bold text-foreground">
              {averageRating}
            </div>
            <StarRating
              value={Math.round(Number(averageRating))}
              readonly
              size="md"
            />
            <p className="text-sm text-muted-foreground">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </p>
          </div>

          {/* Rating Bars */}
          <div className="flex-1 flex flex-col gap-2">
            {ratingDistribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground w-6 text-right">
                  {star}
                </span>
                <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-8">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Form */}
      {user && !hasReviewed && (
        <div className="mb-6">
          <ReviewForm packageId={packageId} onSubmitted={loadReviews} />
        </div>
      )}

      {!user && (
        <p className="text-sm text-muted-foreground mb-6">
          Log in to leave a review.
        </p>
      )}

      {user && hasReviewed && (
        <p className="text-sm text-muted-foreground mb-6">
          You have already reviewed this package.
        </p>
      )}

      {/* Review List */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lilac-600"></div>
        </div>
      ) : reviews.length > 0 ? (
        <>
          <Separator className="mb-6" />
          <div className="flex flex-col gap-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No reviews yet. Be the first to review!
          </p>
        </div>
      )}
    </div>
  );
}
