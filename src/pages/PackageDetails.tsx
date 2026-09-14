import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Calendar, Star, Check, X, Users, ArrowLeft } from "lucide-react";
import { supabase, Package as PackageType } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Reveal } from "../components/Reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import ReviewsSection from "../components/ReviewsSection";
import WishlistButton from "../components/WishlistButton";

export default function PackageDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pkg, setPkg] = useState<PackageType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      loadPackage();
    }
  }, [id]);

  const loadPackage = async () => {
    const { data } = await supabase
      .from("packages")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .maybeSingle();

    if (data) {
      setPkg(data);
    }
    setLoading(false);
  };

  const handleBookNow = () => {
    if (!user) {
      navigate("/login", { state: { returnTo: `/packages/${id}/book` } });
    } else {
      navigate(`/packages/${id}/book`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted pt-28 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lilac-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading package details...</p>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-muted pt-28 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold font-kugile text-foreground mb-4">Package not found</h2>
          <Button
            onClick={() => navigate("/packages")}
            variant="link"
            className="text-lilac-600 hover:text-lilac-700 font-medium">
            Back to Packages
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <Button
            onClick={() => navigate("/packages")}
            variant="ghost"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Packages</span>
          </Button>
        </Reveal>

        <Reveal delay={0.2}>
          <Card className="rounded-[2.5rem] shadow-lg overflow-hidden border-none">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Image Gallery */}
              <div>
                <div className="mb-4">
                  <img
                    src={pkg.images[selectedImage]}
                    alt={pkg.title}
                    loading="lazy"
                    className="w-full h-96 object-cover rounded-3xl"
                  />
                </div>
                {pkg.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {pkg.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`h-20 rounded-xl overflow-hidden ${
                          selectedImage === index ? "ring-2 ring-lilac-600" : ""
                        }`}>
                        <img
                          src={image}
                          alt={`${pkg.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Package Info */}
              <div>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-lilac-100 text-lilac-800 px-3 py-1 rounded-full text-sm font-semibold h-auto">
                      {pkg.theme.charAt(0).toUpperCase() + pkg.theme.slice(1)}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <span className="font-semibold">{pkg.rating}</span>
                      <span className="text-muted-foreground text-sm">({pkg.total_ratings} reviews)</span>
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold font-kugile text-foreground mb-4">{pkg.title}</h1>
                  <div className="flex items-center gap-6 text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      <span>{pkg.destination}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      <span>
                        {pkg.duration_days} Days / {pkg.duration_nights} Nights
                      </span>
                    </div>
                  </div>
                  <p className="text-foreground/80 leading-relaxed">{pkg.description}</p>
                </div>

                <Card className="bg-lilac-50 border-none rounded-3xl mb-6">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-muted-foreground mb-2">Starting from</p>
                      <div className="text-4xl font-bold text-lilac-600 mb-1">
                        ₹{pkg.price_per_person.toLocaleString("en-IN")}
                      </div>
                      <p className="text-muted-foreground">per person</p>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleBookNow}
                    className="flex-1 bg-lilac-600 hover:bg-lilac-700 text-white font-semibold py-4 h-auto rounded-xl transition flex items-center justify-center gap-2"
                    size="lg">
                    <Users className="h-5 w-5" />
                    <span>Book This Package</span>
                  </Button>
                  <WishlistButton
                    packageId={id!}
                    className="h-14 w-14 rounded-xl border border-border bg-muted hover:bg-muted/80 text-muted-foreground"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Tabs for Itinerary, Inclusions, Exclusions */}
            <Tabs defaultValue="itinerary" className="p-8">
              <TabsList className="w-full justify-start mb-6 bg-muted rounded-xl h-auto p-1">
                <TabsTrigger value="itinerary" className="rounded-lg px-6 py-2.5 text-base font-kugile data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  Day-wise Itinerary
                </TabsTrigger>
                <TabsTrigger value="inclusions" className="rounded-lg px-6 py-2.5 text-base font-kugile data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  Inclusions
                </TabsTrigger>
                <TabsTrigger value="exclusions" className="rounded-lg px-6 py-2.5 text-base font-kugile data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  Exclusions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="itinerary" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pkg.detailed_itinerary.map((day, index) => (
                    <div
                      key={index}
                      className="group relative p-6 rounded-3xl bg-background border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
                    >
                      {/* Decorative Background Blob */}
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-lilac-500/10 dark:bg-lilac-400/5 rounded-full blur-3xl group-hover:bg-lilac-500/20 transition-all duration-500"></div>

                      <div className="relative flex justify-between items-start mb-5">
                        <h3 className="text-xl font-bold font-kugile text-foreground leading-tight pr-4">
                          {day.title}
                        </h3>
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-lilac-500 to-lilac-600 text-white shadow-md shadow-lilac-500/20 rounded-2xl flex items-center justify-center font-bold text-lg rotate-3 group-hover:rotate-6 transition-transform duration-300">
                          <span className="-rotate-3 group-hover:-rotate-6 transition-transform">
                            {day.day}
                          </span>
                        </div>
                      </div>
                      
                      <Separator className="mb-5 bg-border/50 group-hover:bg-border transition-colors duration-300" />
                      
                      <ul className="flex flex-col gap-3.5 flex-1 relative">
                        {day.activities.map((activity, actIndex) => (
                          <li
                            key={actIndex}
                            className="flex items-start gap-3">
                            <div className="mt-0.5 bg-green-100 dark:bg-green-500/10 p-1 rounded-full text-green-600 dark:text-green-400 flex-shrink-0">
                              <Check className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-[14.5px] text-muted-foreground leading-relaxed">
                              {activity}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="inclusions" className="mt-8">
                <div className="p-8 rounded-3xl bg-green-50/50 dark:bg-green-950/10 border border-green-100 dark:border-green-900/30">
                  <h3 className="text-xl font-bold font-kugile text-foreground mb-6 flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-xl">
                      <Check className="h-6 w-6" />
                    </div>
                    <span>What's Included in this Package</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pkg.inclusions.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 bg-white dark:bg-gray-950/40 p-4 rounded-2xl shadow-sm border border-border/50">
                        <Check className="h-5 w-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-foreground/80 leading-relaxed text-sm font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="exclusions" className="mt-8">
                <div className="p-8 rounded-3xl bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30">
                  <h3 className="text-xl font-bold font-kugile text-foreground mb-6 flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl">
                      <X className="h-6 w-6" />
                    </div>
                    <span>What's Not Included</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pkg.exclusions.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 bg-white dark:bg-gray-950/40 p-4 rounded-2xl shadow-sm border border-border/50">
                        <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-foreground/80 leading-relaxed text-sm font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <Separator />

            {/* Reviews Section */}
            <ReviewsSection packageId={id!} />

            <Separator />

            {/* CTA Section */}
            <div className="p-8 bg-muted">
              <div className="text-center">
                <h3 className="text-2xl font-bold font-kugile text-foreground mb-4">
                  Ready to Book?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start your journey with us today and create memories that last a lifetime
                </p>
                <Button
                  onClick={handleBookNow}
                  className="bg-lilac-600 hover:bg-lilac-700 text-white font-semibold px-8 py-4 h-auto rounded-xl transition inline-flex items-center gap-2"
                  size="lg">
                  <Users className="h-5 w-5" />
                  <span>Book Now - ₹{pkg.price_per_person.toLocaleString("en-IN")} per person</span>
                </Button>
              </div>
            </div>
          </Card>
        </Reveal>
      </div>
    </div>
  );
}
