import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export default function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);
  const isInteractive = !readonly && !!onChange;
  const displayValue = hoverValue || value;

  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!isInteractive}
          onClick={() => isInteractive && onChange(star)}
          onMouseEnter={() => isInteractive && setHoverValue(star)}
          onMouseLeave={() => isInteractive && setHoverValue(0)}
          className={cn(
            "transition-colors focus:outline-none",
            isInteractive
              ? "cursor-pointer hover:scale-110 transition-transform"
              : "cursor-default"
          )}
        >
          <Star
            className={cn(
              sizeClasses[size],
              "transition-colors",
              star <= displayValue
                ? "text-yellow-500 fill-yellow-500"
                : "text-muted-foreground/30"
            )}
          />
        </button>
      ))}
    </div>
  );
}
