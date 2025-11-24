import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Download, Mail, Phone, Calendar, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingReference = location.state?.bookingReference;
  const [booking, setBooking] = useState<any>(null);
  const [packageData, setPackageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingReference) {
      navigate('/');
      return;
    }
    loadBookingDetails();
  }, [bookingReference]);

  const loadBookingDetails = async () => {
    const { data: bookingData } = await supabase
      .from('bookings')
      .select('*')
      .eq('booking_reference', bookingReference)
      .maybeSingle();

    if (bookingData) {
      setBooking(bookingData);

      if (bookingData.package_id) {
        const { data: pkgData } = await supabase
          .from('packages')
          .select('*')
          .eq('id', bookingData.package_id)
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
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking not found</h2>
          <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-lg text-gray-600">
              Your journey is all set. We have sent confirmation details to your email.
            </p>
          </div>

          <div className="border-t border-b py-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">Booking Reference</span>
              <span className="text-xl font-bold text-blue-600">{booking.booking_reference}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                Confirmed
              </span>
            </div>
          </div>

          {packageData && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Package Details</h2>
              <div className="flex items-start space-x-4">
                <img
                  src={packageData.images[0]}
                  alt={packageData.title}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{packageData.title}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{packageData.destination}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {packageData.duration_days} Days / {packageData.duration_nights} Nights
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Travel Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Travel Dates</span>
                <span className="font-medium">
                  {new Date(booking.travel_dates_start).toLocaleDateString('en-IN')} -{' '}
                  {new Date(booking.travel_dates_end).toLocaleDateString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Number of Travelers</span>
                <span className="font-medium">{booking.num_travelers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pickup Location</span>
                <span className="font-medium">{booking.pickup_city}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Name</span>
                <span className="font-medium">{booking.contact_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email</span>
                <span className="font-medium">{booking.contact_email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone</span>
                <span className="font-medium">{booking.contact_phone}</span>
              </div>
            </div>
          </div>

          <div className="mb-6 bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total Amount Paid</span>
              <span className="text-2xl font-bold text-blue-600">
                ₹{parseFloat(booking.total_price).toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Payment method: {booking.payment_method}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => window.print()}
              className="flex-1 flex items-center justify-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition"
            >
              <Download className="h-5 w-5" />
              <span>Download/Print</span>
            </button>
            <Link
              to="/my-bookings"
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              <span>View All Bookings</span>
            </Link>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-3">
              Our support team is here to assist you with any questions.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-gray-700">
                <Phone className="h-4 w-4 text-blue-600" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <Mail className="h-4 w-4 text-blue-600" />
                <span>support@smarttravel.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
