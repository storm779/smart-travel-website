import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Lock, X, TestTube2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Reveal } from "../components/Reveal";
import { useToast } from "../contexts/ToastContext";
import { useRazorpay } from "@/hooks/useRazorpay";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/services/paymentService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

export default function BookCustomItinerary() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { isLoaded: razorpayLoaded, openPayment } = useRazorpay();
  const itinerary = location.state?.itinerary;
  const preferences = location.state?.preferences;
  const [loading, setLoading] = useState(false);
  const isTestMode = RAZORPAY_KEY_ID?.startsWith("rzp_test_");
  const [showTestBanner, setShowTestBanner] = useState(true);

  const [bookingData, setBookingData] = useState({
    startDate: "",
    pickupCity: "",
    contactName: "",
    contactEmail: user?.email || "",
    contactPhone: "",
  });

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
    if (!user || !itinerary || !preferences || !razorpayLoaded) return;

    setLoading(true);
    const numTravelers = getTravelerCount(preferences.travelers);

    try {
      // Step 1: Create Razorpay order
      const orderData = await createRazorpayOrder({
        amount: itinerary.totalPrice,
        booking_type: "custom",
        itinerary_data: { itinerary, preferences },
        travel_dates_start: bookingData.startDate,
        travel_dates_end: calculateEndDate(),
        num_travelers: numTravelers,
        pickup_city: bookingData.pickupCity,
        contact_name: bookingData.contactName,
        contact_email: bookingData.contactEmail,
        contact_phone: bookingData.contactPhone,
      });

      // Step 2: Open Razorpay checkout
      openPayment({
        key: RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Travellah",
        description: `Custom Itinerary - ${preferences.destination}`,
        order_id: orderData.order_id,
        handler: async (response) => {
          try {
            const result = await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            showToast("Payment successful! Booking confirmed.", "success");
            navigate("/booking-confirmation", {
              state: { bookingReference: result.booking_reference },
            });
          } catch {
            showToast("Payment verification failed. Please contact support.", "error");
          }
        },
        prefill: {
          name: bookingData.contactName,
          email: bookingData.contactEmail,
          contact: bookingData.contactPhone,
        },
        theme: { color: "#964996" },
        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay using UPI",
                instruments: [
                  { method: "upi", flows: ["collect", "intent", "qr"] },
                ],
              },
            },
            sequence: ["block.upi"],
            preferences: { show_default_blocks: true },
          },
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            showToast("Payment cancelled. Your booking is saved as pending.", "info");
          },
        },
      });
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Failed to initiate payment. Please try again.",
        "error"
      );
      setLoading(false);
    }
  };

  if (!itinerary || !preferences) {
    return null;
  }

  const numTravelers = getTravelerCount(preferences.travelers);

  return (
    <div className="min-h-screen bg-background pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="size-5" />
            <span>Back to Itineraries</span>
          </Button>

          <h1 className="text-3xl font-bold font-kugile text-foreground mb-8">
            Complete Your Booking
          </h1>
        </Reveal>

        {isTestMode && showTestBanner && (
          <div className="mb-6 relative bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 pr-12">
            <button
              onClick={() => setShowTestBanner(false)}
              className="absolute top-3 right-3 text-amber-500 hover:text-amber-700 transition-colors">
              <X className="size-4" />
            </button>
            <div className="flex items-start gap-3">
              <TestTube2 className="size-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-amber-800 dark:text-amber-300 text-sm mb-1">
                  Test Mode — No real charges
                </p>
                <p className="text-amber-700 dark:text-amber-400/80 text-xs leading-relaxed">
                  This is a test payment gateway. To complete a test payment, select <strong>UPI</strong> in the
                  Razorpay checkout and enter <code className="bg-amber-200/50 dark:bg-amber-800/50 px-1.5 py-0.5 rounded font-mono text-[11px]">success@razorpay</code> as
                  the UPI ID, then click "Verify and Pay". Use <code className="bg-amber-200/50 dark:bg-amber-800/50 px-1.5 py-0.5 rounded font-mono text-[11px]">failure@razorpay</code> to
                  simulate a failed payment.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <Reveal delay={0.2}>
                <Card>
                  <CardHeader>
                    <CardTitle className="font-kugile">Travel Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="startDate">Travel Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={bookingData.startDate}
                          onChange={(e) =>
                            setBookingData({ ...bookingData, startDate: e.target.value })
                          }
                          min={new Date().toISOString().split("T")[0]}
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="pickupCity">Pickup City</Label>
                        <Input
                          id="pickupCity"
                          value={bookingData.pickupCity}
                          onChange={(e) =>
                            setBookingData({ ...bookingData, pickupCity: e.target.value })
                          }
                          required
                          placeholder="Enter your city"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>

              <Reveal delay={0.3}>
                <Card>
                  <CardHeader>
                    <CardTitle className="font-kugile">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="contactName">Full Name</Label>
                        <Input
                          id="contactName"
                          value={bookingData.contactName}
                          onChange={(e) =>
                            setBookingData({ ...bookingData, contactName: e.target.value })
                          }
                          required
                          placeholder="Enter your name"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="contactEmail">Email</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          value={bookingData.contactEmail}
                          onChange={(e) =>
                            setBookingData({ ...bookingData, contactEmail: e.target.value })
                          }
                          required
                          placeholder="Enter your email"
                        />
                      </div>

                      <div className="md:col-span-2 flex flex-col gap-2">
                        <Label htmlFor="contactPhone">Phone Number</Label>
                        <Input
                          id="contactPhone"
                          type="tel"
                          value={bookingData.contactPhone}
                          onChange={(e) =>
                            setBookingData({ ...bookingData, contactPhone: e.target.value })
                          }
                          required
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>

              <Reveal delay={0.4}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="size-5 text-green-600" />
                      <p className="text-sm text-muted-foreground">
                        Secure payment powered by <strong>Razorpay</strong>. Supports UPI, Cards, Net Banking & Wallets.
                      </p>
                    </div>
                    <Button
                      type="submit"
                      disabled={loading || !razorpayLoaded}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-xl transition flex items-center justify-center gap-2">
                      <Lock className="size-4" />
                      <span>{loading ? "Processing..." : `Pay ₹${itinerary.totalPrice.toLocaleString("en-IN")}`}</span>
                    </Button>
                  </CardContent>
                </Card>
              </Reveal>
            </form>
          </div>

          <div className="lg:col-span-1">
            <Reveal delay={0.2}>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="font-kugile">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div>
                    <img
                      src={itinerary.images[0]}
                      alt={preferences.destination}
                      className="w-full h-40 object-cover rounded-xl mb-3"
                    />
                    <h3 className="font-semibold font-kugile text-foreground mb-1">
                      {itinerary.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{preferences.destination}</p>
                  </div>

                  <Separator />

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Price per person</span>
                      <span className="font-semibold">
                        ₹{itinerary.pricePerPerson.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Number of travelers</span>
                      <span className="font-semibold">{numTravelers}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-semibold">{preferences.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Travel month</span>
                      <span className="font-semibold">{preferences.travelMonth}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold font-kugile text-foreground">
                      Total Amount
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      ₹{itinerary.totalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Badge variant="outline" className="text-xs">
                      <Lock className="size-3 mr-1" />
                      Secure Payment
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Shield className="size-3 mr-1" />
                      Razorpay Protected
                    </Badge>
                  </div>

                  {itinerary.highlights && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-semibold text-foreground mb-2 text-sm">Package Highlights</h4>
                        <ul className="flex flex-col gap-1">
                          {itinerary.highlights.slice(0, 3).map((highlight: string, i: number) => (
                            <li key={i} className="text-xs text-muted-foreground">
                              • {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
