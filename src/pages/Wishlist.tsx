import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Heart, MapPin, Calendar, Star, ArrowRight } from "lucide-react";
import { supabase, Package as PackageType } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { useWishlist } from "../hooks/useWishlist";
import WishlistButton from "../components/WishlistButton";
import { Reveal } from "../components/Reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Wishlist() {
  const { user, loading: authLoading } = useAuth();
  const { wishlist, loading: wishlistLoading } = useWishlist();
  const navigate = useNavigate();
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { state: { returnTo: "/wishlist" } });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (wishlist.length > 0) {
      loadWishlistedPackages();
    } else if (!wishlistLoading) {
      setPackages([]);
      setLoading(false);
    }
  }, [wishlist, wishlistLoading]);

  const loadWishlistedPackages = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("packages")
      .select("*")
      .in("id", wishlist)
      .eq("is_active", true);

    if (data) {
      setPackages(data);
    }
    setLoading(false);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background pt-28 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lilac-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-28 pb-16 font-sans">
      <Helmet>
        <title>My Wishlist - Travellah</title>
        <meta name="description" content="Your saved travel packages and destinations." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-12 text-center">
            <h1 className="text-5xl md:text-6xl font-light text-foreground mb-6 font-kugile italic">
              My{" "}
              <span className="text-primary">
                Wishlist
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Your saved travel packages, all in one place
            </p>
          </div>
        </Reveal>

        <Separator className="mb-10" />

        {loading || wishlistLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[500px] rounded-3xl bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : packages.length === 0 ? (
          <Reveal>
            <div className="text-center py-24 bg-muted rounded-[2.5rem]">
              <Heart className="h-16 w-16 text-muted-foreground/30 mx-auto mb-6" />
              <h2 className="text-2xl font-bold font-kugile text-foreground mb-3">
                No saved packages yet
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Start exploring our travel packages and save the ones you love by tapping
                the heart icon.
              </p>
              <Button
                asChild
                className="bg-lilac-600 hover:bg-lilac-700 text-white font-semibold px-8 py-3 h-auto rounded-xl"
              >
                <Link to="/packages">Browse Packages</Link>
              </Button>
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => {
              const defaultImage =
                "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg";
              const imageUrl =
                pkg.images && pkg.images.length > 0 ? pkg.images[0] : defaultImage;

              return (
                <Reveal key={pkg.id} delay={index * 100}>
                  <Link to={`/packages/${pkg.id}`} className="group block">
                    <Card className="relative h-[500px] rounded-3xl overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500 border-none p-0">
                      <img
                        src={imageUrl}
                        alt={pkg.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition duration-1000 group-hover:scale-110 mt-10"
                      />
                      <Badge className="absolute top-6 left-6 bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-white text-sm font-medium border border-white/30 shadow-sm h-auto">
                        {pkg.theme.charAt(0).toUpperCase() + pkg.theme.slice(1)}
                      </Badge>
                      <div className="absolute top-6 right-6 flex items-center gap-2">
                        <Badge className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-sm font-semibold border border-white/30 h-auto gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span>{pkg.rating}</span>
                        </Badge>
                        <WishlistButton
                          packageId={pkg.id}
                          className="bg-white/20 backdrop-blur-md border border-white/30"
                        />
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 transition-all duration-300">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <h3 className="text-2xl font-bold text-white mb-2 font-kugile">
                            {pkg.title}
                          </h3>
                          <div className="flex items-center text-white/80 text-sm mb-3 gap-4">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{pkg.destination}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {pkg.duration_days}D/{pkg.duration_nights}N
                              </span>
                            </div>
                          </div>
                          <p className="text-white/70 text-sm mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                            {pkg.description}
                          </p>
                          <CardFooter className="flex items-center justify-between mt-4 p-0 border-none bg-transparent">
                            <div>
                              <span className="text-xl font-bold text-white">
                                ₹{pkg.price_per_person.toLocaleString("en-IN")}
                              </span>
                              <span className="text-white/60 text-xs"> / person</span>
                            </div>
                            <div className="bg-background text-foreground p-2 rounded-full hover:bg-lilac hover:text-white transition-colors duration-300">
                              <ArrowRight className="h-5 w-5" />
                            </div>
                          </CardFooter>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
