import { Heart } from "lucide-react";
import { useWishlist } from "../hooks/useWishlist";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  packageId: string;
  className?: string;
}

export default function WishlistButton({ packageId, className }: WishlistButtonProps) {
  const { user } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const wishlisted = isWishlisted(packageId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      showToast("Please sign in to save packages", "warning");
      return;
    }

    await toggleWishlist(packageId);
    showToast(
      wishlisted ? "Removed from wishlist" : "Added to wishlist",
      wishlisted ? "info" : "success"
    );
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className={cn(
        "rounded-full transition-all duration-300",
        wishlisted
          ? "text-red-500 hover:text-red-600 hover:bg-red-50"
          : "text-white/80 hover:text-white hover:bg-white/20",
        className
      )}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={cn("h-5 w-5 transition-all duration-300", wishlisted && "fill-current")}
      />
    </Button>
  );
}
