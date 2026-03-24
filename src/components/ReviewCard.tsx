import { BadgeCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import StarRating from "./StarRating";
import type { Review } from "@/lib/supabase";

interface ReviewCardProps {
  review: Review;
}

function getInitials(name?: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const displayName = review.profiles?.full_name || "Anonymous";

  return (
    <Card className="rounded-2xl border-none shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-foreground">
                {displayName}
              </span>
              {review.is_verified_purchase && (
                <Badge
                  variant="secondary"
                  className="gap-1 text-xs px-2 py-0.5 rounded-full"
                >
                  <BadgeCheck className="h-3 w-3" />
                  Verified Purchase
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <StarRating value={review.rating} readonly size="sm" />
              <span className="text-xs text-muted-foreground">
                {formatDate(review.created_at)}
              </span>
            </div>
          </div>
        </div>

        {(review.title || review.comment) && (
          <>
            <Separator className="my-3" />
            <div className="flex flex-col gap-1">
              {review.title && (
                <h4 className="font-semibold text-foreground text-sm">
                  {review.title}
                </h4>
              )}
              {review.comment && (
                <p className="text-foreground/80 text-sm leading-relaxed">
                  {review.comment}
                </p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
