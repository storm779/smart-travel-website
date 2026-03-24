import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import StarRating from "./StarRating";

interface ReviewFormProps {
  packageId: string;
  onSubmitted: () => void;
}

export default function ReviewForm({ packageId, onSubmitted }: ReviewFormProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [verifiedBookingId, setVerifiedBookingId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (user) {
      checkVerifiedPurchase();
    }
  }, [user, packageId]);

  const checkVerifiedPurchase = async () => {
    const { data } = await supabase
      .from("bookings")
      .select("id")
      .eq("user_id", user!.id)
      .eq("package_id", packageId)
      .eq("booking_status", "confirmed")
      .eq("payment_status", "completed")
      .limit(1)
      .maybeSingle();

    if (data) {
      setVerifiedBookingId(data.id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      showToast("Please select a rating", "warning");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("reviews").insert({
        user_id: user!.id,
        package_id: packageId,
        booking_id: verifiedBookingId,
        rating,
        title: title.trim() || null,
        comment: comment.trim() || null,
        is_verified_purchase: !!verifiedBookingId,
      });

      if (error) {
        if (error.code === "23505") {
          showToast("You have already reviewed this package", "error");
        } else {
          showToast("Failed to submit review. Please try again.", "error");
        }
        return;
      }

      showToast("Review submitted successfully!", "success");
      setRating(0);
      setTitle("");
      setComment("");
      onSubmitted();
    } catch {
      showToast("An unexpected error occurred", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="rounded-2xl border-none shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-lg font-bold font-kugile text-foreground mb-4">
          Write a Review
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="rating">Your Rating</Label>
            <StarRating value={rating} onChange={setRating} size="lg" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="review-title">Title (optional)</Label>
            <Input
              id="review-title"
              placeholder="Summarize your experience"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className="rounded-xl"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="review-comment">Your Review (optional)</Label>
            <Textarea
              id="review-comment"
              placeholder="Tell others about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={2000}
              className="rounded-xl resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={submitting || rating === 0}
            className="bg-lilac-600 hover:bg-lilac-700 text-white font-semibold rounded-xl h-11 gap-2"
          >
            <Send className="h-4 w-4" />
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
