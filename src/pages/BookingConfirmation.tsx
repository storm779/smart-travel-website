import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { CheckCircle, Download, Mail, Phone, Calendar, MapPin } from "lucide-react";
import { supabase } from "../lib/supabase";
import { Reveal } from "../components/Reveal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingReference = location.state?.bookingReference;
  const [booking, setBooking] = useState<any>(null);
  const [packageData, setPackageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingReference) {
      navigate("/");
      return;
    }
    loadBookingDetails();
  }, [bookingReference]);

  const loadBookingDetails = async () => {
    const { data: bookingData } = await supabase
      .from("bookings")
      .select("*")
      .eq("booking_reference", bookingReference)
      .maybeSingle();

    if (bookingData) {
      setBooking(bookingData);

      if (bookingData.package_id) {
        const { data: pkgData } = await supabase
          .from("packages")
          .select("*")
          .eq("id", bookingData.package_id)
          .maybeSingle();
        if (pkgData) {
          setPackageData(pkgData);
        }
      }
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-28 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lilac-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background pt-28 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold font-kugile text-foreground mb-4">Booking not found</h2>
          <Button variant="link" asChild>
            <Link to="/" className="text-lilac-600 hover:text-lilac-700 font-medium">
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-28 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <Card className="rounded-[2.5rem] shadow-lg">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-4" />
                <h1 className="text-3xl font-bold font-kugile text-foreground mb-2">
                  Booking Confirmed!
                </h1>
                <p className="text-lg text-muted-foreground">
                  Your journey is all set. We have sent confirmation details to your email.
                </p>
              </div>

              <Separator className="mb-6" />

              <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Booking Reference</span>
                  <span className="text-xl font-bold text-lilac-600">
                    {booking.booking_reference}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    Confirmed
                  </Badge>
                </div>
              </div>

              <Separator className="mb-6" />

              {packageData && (
                <>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold font-kugile text-foreground mb-4">
                      Package Details
                    </h2>
                    <div className="flex items-start gap-4">
                      <img
                        src={packageData.images[0]}
                        alt={packageData.title}
                        className="w-32 h-32 object-cover rounded-xl"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold font-kugile text-foreground mb-2">
                          {packageData.title}
                        </h3>
                        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{packageData.destination}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {packageData.duration_days} Days / {packageData.duration_nights} Nights
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="mb-6" />
                </>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-bold font-kugile text-foreground mb-4">Travel Details</h2>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Travel Dates</span>
                    <span className="font-medium">
                      {new Date(booking.travel_dates_start).toLocaleDateString("en-IN")} -{" "}
                      {new Date(booking.travel_dates_end).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Number of Travelers</span>
                    <span className="font-medium">{booking.num_travelers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pickup Location</span>
                    <span className="font-medium">{booking.pickup_city}</span>
                  </div>
                </div>
              </div>

              <Separator className="mb-6" />

              <div className="mb-6">
                <h2 className="text-xl font-bold font-kugile text-foreground mb-4">
                  Contact Information
                </h2>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">{booking.contact_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">{booking.contact_email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-medium">{booking.contact_phone}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6 bg-lilac-50 p-4 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold font-kugile text-foreground">
                    Total Amount Paid
                  </span>
                  <span className="text-2xl font-bold text-lilac-600">
                    ₹{parseFloat(booking.total_price).toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Payment method: {booking.payment_method}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => window.print()}
                  variant="default"
                  className="flex-1 bg-foreground hover:bg-foreground/90 text-background font-semibold py-6 rounded-xl flex items-center justify-center gap-2">
                  <Download className="h-5 w-5" />
                  <span>Download/Print</span>
                </Button>
                <Button asChild className="flex-1 bg-lilac-600 hover:bg-lilac-700 text-white font-semibold py-6 rounded-xl">
                  <Link to="/my-bookings" className="flex items-center justify-center gap-2">
                    <span>View All Bookings</span>
                  </Link>
                </Button>
              </div>

              <Card className="mt-8 bg-muted border-none rounded-xl">
                <CardContent className="p-4">
                  <h3 className="font-semibold font-kugile text-foreground mb-2">Need Help?</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Our support team is here to assist you with any questions.
                  </p>
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2 text-foreground/80">
                      <Phone className="h-4 w-4 text-lilac-600" />
                      <span>+91 98765 43210</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground/80">
                      <Mail className="h-4 w-4 text-lilac-600" />
                      <span>support@smarttravel.com</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </div>
  );
}
