import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Users, MapPin, CreditCard, Check } from 'lucide-react';
import { supabase, Package as PackageType } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function BookPackage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pkg, setPkg] = useState<PackageType | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [bookingData, setBookingData] = useState({
    startDate: '',
    numTravelers: 2,
    pickupCity: '',
    contactName: '',
    contactEmail: user?.email || '',
    contactPhone: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { returnTo: `/packages/${id}/book` } });
      return;
    }
    if (id) {
      loadPackage();
    }
  }, [id, user]);

  const loadPackage = async () => {
    const { data } = await supabase
      .from('packages')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .maybeSingle();

    if (data) {
      setPkg(data);
    }
    setLoading(false);
  };

  const calculateTotal = () => {
    if (!pkg) return 0;
    return pkg.price_per_person * bookingData.numTravelers;
  };

  const calculateEndDate = () => {
    if (!bookingData.startDate || !pkg) return '';
    const start = new Date(bookingData.startDate);
    start.setDate(start.getDate() + pkg.duration_days - 1);
    return start.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !pkg) return;

    setSubmitting(true);

    const bookingReference = `TRV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const { error } = await supabase.from('bookings').insert({
      user_id: user.id,
      package_id: pkg.id,
      booking_type: 'package',
      travel_dates_start: bookingData.startDate,
      travel_dates_end: calculateEndDate(),
      num_travelers: bookingData.numTravelers,
      pickup_city: bookingData.pickupCity,
      contact_name: bookingData.contactName,
      contact_email: bookingData.contactEmail,
      contact_phone: bookingData.contactPhone,
      total_price: calculateTotal(),
      payment_method: paymentMethod,
      payment_status: 'completed',
      booking_status: 'confirmed',
      booking_reference: bookingReference,
    });

    setSubmitting(false);

    if (error) {
      alert('Error creating booking. Please try again.');
      console.error(error);
    } else {
      navigate('/booking-confirmation', { state: { bookingReference } });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading package...</p>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Package not found</h2>
          <button
            onClick={() => navigate('/packages')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Packages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Travel Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Travel Start Date
                    </label>
                    <input
                      type="date"
                      value={bookingData.startDate}
                      onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Travelers
                    </label>
                    <input
                      type="number"
                      value={bookingData.numTravelers}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, numTravelers: parseInt(e.target.value) })
                      }
                      min="1"
                      max="20"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pickup City
                    </label>
                    <input
                      type="text"
                      value={bookingData.pickupCity}
                      onChange={(e) => setBookingData({ ...bookingData, pickupCity: e.target.value })}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your city"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={bookingData.contactName}
                      onChange={(e) => setBookingData({ ...bookingData, contactName: e.target.value })}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={bookingData.contactEmail}
                      onChange={(e) => setBookingData({ ...bookingData, contactEmail: e.target.value })}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      onChange={(e) => setBookingData({ ...bookingData, contactPhone: e.target.value })}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>

                <div className="space-y-3">
                  {['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet'].map((method) => (
                    <label key={method} className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                      <input
                        type="radio"
                        name="payment"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        required
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-3 font-medium text-gray-900">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <CreditCard className="h-5 w-5" />
                <span>{submitting ? 'Processing...' : 'Proceed to Payment'}</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h2>

              <div className="space-y-4">
                <div>
                  <img
                    src={pkg.images[0]}
                    alt={pkg.title}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-semibold text-gray-900">{pkg.title}</h3>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Price per person</span>
                    <span className="font-semibold">₹{pkg.price_per_person.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Number of travelers</span>
                    <span className="font-semibold">{bookingData.numTravelers}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold">{pkg.duration_days}D/{pkg.duration_nights}N</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ₹{calculateTotal().toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
