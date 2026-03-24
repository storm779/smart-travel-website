import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Calendar, Star, Check, X, Users, ArrowLeft, Heart } from "lucide-react";
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

              <TabsContent value="itinerary">
                <div className="flex flex-col gap-6">
                  {pkg.detailed_itinerary.map((day, index) => (
                    <div
                      key={index}
                      className="flex">
                      <div className="flex-shrink-0 w-16 h-16 bg-lilac-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
                        {day.day}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold font-kugile text-foreground mb-2">
                          {day.title}
                        </h3>
                        <ul className="flex flex-col gap-2">
                          {day.activities.map((activity, actIndex) => (
                            <li
                              key={actIndex}
                              className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                              <span className="text-foreground/80">{activity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="inclusions">
                <div>
                  <h3 className="text-xl font-bold font-kugile text-foreground mb-4 flex items-center gap-2">
                    <Check className="h-6 w-6 text-green-600" />
                    <span>What's Included</span>
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {pkg.inclusions.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="exclusions">
                <div>
                  <h3 className="text-xl font-bold font-kugile text-foreground mb-4 flex items-center gap-2">
                    <X className="h-6 w-6 text-red-600" />
                    <span>What's Not Included</span>
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {pkg.exclusions.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2">
                        <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{item}</span>
                      </li>
                    ))}
                  </ul>
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
