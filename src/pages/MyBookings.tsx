import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  Package,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Reveal } from "../components/Reveal";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface Booking {
  id: string;
  booking_type: "package" | "custom";
  booking_reference: string;
  travel_dates_start: string;
  travel_dates_end: string;
  num_travelers: number;
  pickup_city: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  total_price: number;
  payment_status: string;
  payment_method: string;
  booking_status: string;
  created_at: string;
  itinerary_data?: {
    itinerary?: {
      title: string;
      images?: string[];
    };
    preferences?: {
      destination: string;
    };
  };
  packages?: {
    title: string;
    destination: string;
    images: string[];
  };
}

export default function MyBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadBookings();
  }, [user]);

  const loadBookings = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        *,
        packages (
          title,
          destination,
          images
        )
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading bookings:", error);
    } else if (data) {
      setBookings(data);
    }

    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-muted text-muted-foreground hover:bg-muted";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-72" />
          </div>
          <div className="flex flex-col gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="rounded-[2.5rem] overflow-hidden">
                <div className="md:flex">
                  <Skeleton className="md:w-1/3 h-48" />
                  <CardContent className="md:w-2/3 p-8">
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-32 mb-4" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j}>
                          <Skeleton className="h-3 w-20 mb-1" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-28 pb-16">
      <Helmet>
        <title>My Bookings - Travellah</title>
        <meta name="description" content="View and manage your travel bookings." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-kugile text-foreground mb-2">My Bookings</h1>
            <p className="text-muted-foreground">View and manage your travel bookings</p>
          </div>
        </Reveal>

        {bookings.length === 0 ? (
          <Reveal delay={0.2}>
            <Card className="rounded-[2.5rem] shadow-md">
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-semibold font-kugile text-foreground mb-2">
                  No bookings yet
                </h2>
                <p className="text-muted-foreground mb-6">
                  Start planning your next adventure with our packages or smart planner
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => navigate("/packages")}
                    className="bg-lilac-600 hover:bg-lilac-700 text-white px-6 py-3 rounded-xl font-semibold">
                    Browse Packages
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/smart-planner")}
                    className="border-2 border-lilac-600 text-lilac-600 hover:bg-muted px-6 py-3 rounded-xl font-semibold">
                    Try Smart Planner
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        ) : (
          <div className="flex flex-col gap-6">
            {bookings.map((booking, index) => {
              const title =
                booking.booking_type === "package"
                  ? booking.packages?.title
                  : booking.itinerary_data?.itinerary?.title || "Custom Itinerary";

              const destination =
                booking.booking_type === "package"
                  ? booking.packages?.destination
                  : booking.itinerary_data?.preferences?.destination || booking.pickup_city;

              const image =
                booking.booking_type === "package"
                  ? booking.packages?.images?.[0]
                  : booking.itinerary_data?.itinerary?.images?.[0] ||
                    "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg";

              return (
                <Reveal
                  key={booking.id}
                  delay={index * 0.1}>
                  <Card className="rounded-[2.5rem] shadow-md overflow-hidden hover:shadow-lg transition">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img
                          src={image}
                          alt={title}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <CardContent className="md:w-2/3 p-8">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold font-kugile text-foreground mb-1">
                              {title}
                            </h3>
                            <div className="flex items-center text-muted-foreground text-sm">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{destination}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={getStatusVariant(booking.booking_status)}>
                              {booking.booking_status.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {booking.booking_type === "package" ? "Package" : "Custom"}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Booking Reference</p>
                            <p className="text-sm font-semibold text-foreground">
                              {booking.booking_reference}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Travel Dates</p>
                            <p className="text-sm font-semibold text-foreground">
                              {formatDate(booking.travel_dates_start)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Travelers</p>
                            <p className="text-sm font-semibold text-foreground flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {booking.num_travelers}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
                            <p className="text-sm font-semibold text-lilac-600">
                              ₹{booking.total_price.toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>

                        <Separator className="mb-4" />

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Pickup City</p>
                            <p className="font-medium text-foreground">{booking.pickup_city}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Contact</p>
                            <p className="font-medium text-foreground">{booking.contact_name}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Payment</p>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(booking.payment_status)}
                              <p className="font-medium text-foreground capitalize">
                                {booking.payment_status}
                              </p>
                            </div>
                          </div>
                        </div>

                        <Separator className="my-4" />

                        <p className="text-xs text-muted-foreground">
                          Booked on {formatDate(booking.created_at)}
                        </p>
                      </CardContent>
                    </div>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
