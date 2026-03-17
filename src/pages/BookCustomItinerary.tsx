import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Calendar, Users, MapPin, CreditCard, ArrowLeft } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Reveal } from "../components/Reveal";
import { useToast } from "../contexts/ToastContext";

export default function BookCustomItinerary() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const itinerary = location.state?.itinerary;
  const preferences = location.state?.preferences;
  const [loading, setLoading] = useState(false);

  const [bookingData, setBookingData] = useState({
    startDate: "",
    pickupCity: "",
    contactName: "",
    contactEmail: user?.email || "",
    contactPhone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { returnTo: "/itinerary-results" } });
      return;
    }
    if (!itinerary || !preferences) {
      navigate("/smart-planner");
    }
  }, [user, itinerary, preferences]);

  const calculateEndDate = () => {
    if (!bookingData.startDate || !preferences) return "";
    const durationDays = getDurationDays(preferences.duration);
    const start = new Date(bookingData.startDate);
    start.setDate(start.getDate() + durationDays - 1);
    return start.toISOString().split("T")[0];
  };

  const getDurationDays = (duration: string): number => {
    if (duration === "3-5 days") return 4;
    if (duration === "6-8 days") return 7;
    if (duration === "9-12 days") return 10;
    if (duration === "13-15 days") return 14;
    return 18;
  };

  const getTravelerCount = (travelers: string): number => {
    if (travelers === "Solo") return 1;
    if (travelers === "2 people") return 2;
    if (travelers === "3-4 people") return 4;
    if (travelers === "5-8 people") return 6;
    return 10;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !itinerary || !preferences) return;

    setLoading(true);

    const bookingReference = `TRV-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;
    const numTravelers = getTravelerCount(preferences.travelers);

    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      booking_type: "custom",
      itinerary_data: {
        itinerary,
        preferences,
      },
      travel_dates_start: bookingData.startDate,
      travel_dates_end: calculateEndDate(),
      num_travelers: numTravelers,
      pickup_city: bookingData.pickupCity,
      contact_name: bookingData.contactName,
      contact_email: bookingData.contactEmail,
      contact_phone: bookingData.contactPhone,
      total_price: itinerary.totalPrice,
      payment_method: paymentMethod,
      payment_status: "completed",
      booking_status: "confirmed",
      booking_reference: bookingReference,
    });

    setLoading(false);

    if (error) {
      showToast("Error creating booking. Please try again.", "error");
      console.error(error);
    } else {
      navigate("/booking-confirmation", { state: { bookingReference } });
    }
  };

  if (!itinerary || !preferences) {
    return null;
  }

  const numTravelers = getTravelerCount(preferences.travelers);

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Itineraries</span>
          </button>

          <h1 className="text-3xl font-bold font-kugile text-gray-900 mb-8">
            Complete Your Booking
          </h1>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="space-y-6">
              <Reveal delay={0.2}>
                <div className="bg-white rounded-[2.5rem] shadow p-8">
                  <h2 className="text-xl font-bold font-kugile text-gray-900 mb-4">
                    Travel Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Travel Start Date
                      </label>
                      <input
                        type="date"
                        value={bookingData.startDate}
                        onChange={(e) =>
                          setBookingData({ ...bookingData, startDate: e.target.value })
                        }
                        min={new Date().toISOString().split("T")[0]}
                        required
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lilac-500 bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pickup City
                      </label>
                      <input
                        type="text"
                        value={bookingData.pickupCity}
                        onChange={(e) =>
                          setBookingData({ ...bookingData, pickupCity: e.target.value })
                        }
                        required
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lilac-500 bg-gray-50"
                        placeholder="Enter your city"
                      />
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="bg-white rounded-[2.5rem] shadow p-8">
                  <h2 className="text-xl font-bold font-kugile text-gray-900 mb-4">
                    Contact Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={bookingData.contactName}
                        onChange={(e) =>
                          setBookingData({ ...bookingData, contactName: e.target.value })
                        }
                        required
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lilac-500 bg-gray-50"
                        placeholder="Enter your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={bookingData.contactEmail}
                        onChange={(e) =>
                          setBookingData({ ...bookingData, contactEmail: e.target.value })
                        }
                        required
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lilac-500 bg-gray-50"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={bookingData.contactPhone}
                        onChange={(e) =>
                          setBookingData({ ...bookingData, contactPhone: e.target.value })
                        }
                        required
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lilac-500 bg-gray-50"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.4}>
                <div className="bg-white rounded-[2.5rem] shadow p-8">
                  <h2 className="text-xl font-bold font-kugile text-gray-900 mb-4">
                    Payment Method
                  </h2>

                  <div className="space-y-3">
                    {["UPI", "Credit Card", "Debit Card", "Net Banking", "Wallet"].map((method) => (
                      <label
                        key={method}
                        className="flex items-center p-4 border-2 border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                        <input
                          type="radio"
                          name="payment"
                          value={method}
                          checked={paymentMethod === method}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          required
                          className="h-4 w-4 text-lilac-600 focus:ring-lilac-500"
                        />
                        <span className="ml-3 font-medium text-gray-900">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.5}>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-lilac-600 hover:bg-lilac-700 text-white font-semibold py-4 rounded-xl transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>{loading ? "Processing..." : "Proceed to Payment"}</span>
                </button>
              </Reveal>
            </form>
          </div>

          <div className="lg:col-span-1">
            <Reveal delay={0.2}>
              <div className="bg-white rounded-[2.5rem] shadow p-8 sticky top-24">
                <h2 className="text-xl font-bold font-kugile text-gray-900 mb-4">
                  Booking Summary
                </h2>

                <div className="space-y-4">
                  <div>
                    <img
                      src={itinerary.images[0]}
                      alt={preferences.destination}
                      className="w-full h-40 object-cover rounded-xl mb-3"
                    />
                    <h3 className="font-semibold font-kugile text-gray-900 mb-1">
                      {itinerary.title}
                    </h3>
                    <p className="text-sm text-gray-600">{preferences.destination}</p>
                  </div>

                  <div className="pt-4 border-t space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Price per person</span>
                      <span className="font-semibold">
                        ₹{itinerary.pricePerPerson.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Number of travelers</span>
                      <span className="font-semibold">{numTravelers}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-semibold">{preferences.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Travel month</span>
                      <span className="font-semibold">{preferences.travelMonth}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold font-kugile text-gray-900">
                        Total Amount
                      </span>
                      <span className="text-2xl font-bold text-lilac-600">
                        ₹{itinerary.totalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">Package Highlights</h4>
                    <ul className="space-y-1">
                      {itinerary.highlights.slice(0, 3).map((highlight: string, i: number) => (
                        <li
                          key={i}
                          className="text-xs text-gray-600">
                          • {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
