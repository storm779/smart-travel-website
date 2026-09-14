import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export function useWishlist() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      return;
    }

    setLoading(true);
    const { data } = await supabase
      .from("wishlists")
      .select("package_id")
      .eq("user_id", user.id);

    if (data) {
      setWishlist(data.map((item) => item.package_id));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isWishlisted = useCallback(
    (packageId: string) => wishlist.includes(packageId),
    [wishlist]
  );

  const toggleWishlist = useCallback(
    async (packageId: string) => {
      if (!user) return;

      if (isWishlisted(packageId)) {
        setWishlist((prev) => prev.filter((id) => id !== packageId));
        await supabase
          .from("wishlists")
          .delete()
          .eq("user_id", user.id)
          .eq("package_id", packageId);
      } else {
        setWishlist((prev) => [...prev, packageId]);
        await supabase
          .from("wishlists")
          .insert({ user_id: user.id, package_id: packageId });
      }
    },
    [user, isWishlisted]
  );

  return { wishlist, isWishlisted, toggleWishlist, loading };
}
