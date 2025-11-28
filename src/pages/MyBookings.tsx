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
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      <div className="min-h-screen bg-gray-50 pt-28 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lilac-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-kugile text-gray-900 mb-2">My Bookings</h1>
            <p className="text-gray-600">View and manage your travel bookings</p>
          </div>
        </Reveal>

        {bookings.length === 0 ? (
          <Reveal delay={0.2}>
            <div className="bg-white rounded-[2.5rem] shadow-md p-12 text-center">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold font-kugile text-gray-900 mb-2">
                No bookings yet
              </h2>
              <p className="text-gray-600 mb-6">
                Start planning your next adventure with our packages or smart planner
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/packages")}
                  className="bg-lilac-600 hover:bg-lilac-700 text-white px-6 py-3 rounded-xl font-semibold transition">
                  Browse Packages
                </button>
                <button
                  onClick={() => navigate("/smart-planner")}
                  className="bg-white hover:bg-gray-50 text-lilac-600 border-2 border-lilac-600 px-6 py-3 rounded-xl font-semibold transition">
                  Try Smart Planner
                </button>
              </div>
            </div>
          </Reveal>
        ) : (
          <div className="space-y-6">
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
                  <div className="bg-white rounded-[2.5rem] shadow-md overflow-hidden hover:shadow-lg transition">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img
                          src={image}
                          alt={title}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="md:w-2/3 p-8">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold font-kugile text-gray-900 mb-1">
                              {title}
                            </h3>
                            <div className="flex items-center text-gray-600 text-sm">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{destination}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                booking.booking_status
                              )}`}>
                              {booking.booking_status.toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-500">
                              {booking.booking_type === "package" ? "Package" : "Custom"}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Booking Reference</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {booking.booking_reference}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Travel Dates</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {formatDate(booking.travel_dates_start)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Travelers</p>
                            <p className="text-sm font-semibold text-gray-900 flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {booking.num_travelers}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                            <p className="text-sm font-semibold text-lilac-600">
                              ₹{booking.total_price.toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>

                        <div className="border-t pt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Pickup City</p>
                            <p className="font-medium text-gray-900">{booking.pickup_city}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Contact</p>
                            <p className="font-medium text-gray-900">{booking.contact_name}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Payment</p>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(booking.payment_status)}
                              <p className="font-medium text-gray-900 capitalize">
                                {booking.payment_status}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <p className="text-xs text-gray-500">
                            Booked on {formatDate(booking.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
