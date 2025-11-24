import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Package, Star, ArrowRight, MapPin, Calendar, Users } from 'lucide-react';
import { supabase, Package as PackageType } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [popularPackages, setPopularPackages] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    loadPopularPackages();
  }, []);

  useEffect(() => {
    if (!authLoading && user) {
      loadUserProfile();
    }
  }, [user, authLoading]);

  const loadPopularPackages = async () => {
    const { data } = await supabase
      .from('packages')
      .select('*')
      .eq('is_active', true)
      .order('rating', { ascending: false })
      .limit(6);

    if (data) {
      setPopularPackages(data);
    }
    setLoading(false);
  };

  const loadUserProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error loading profile:', error);
      const emailName = user.email?.split('@')[0] || 'Traveler';
      setUserName(emailName.charAt(0).toUpperCase() + emailName.slice(1));
      return;
    }

    if (data?.full_name) {
      setUserName(data.full_name);
    } else {
      const emailName = user.email?.split('@')[0] || 'Traveler';
      setUserName(emailName.charAt(0).toUpperCase() + emailName.slice(1));
    }
  };

  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Mumbai',
      text: 'Amazing experience! The Char Dham Yatra was perfectly organized. Every detail was taken care of.',
      rating: 5,
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    },
    {
      name: 'Rajesh Kumar',
      location: 'Delhi',
      text: 'The AI itinerary planner saved us so much time! Got three perfect options matching our budget.',
      rating: 5,
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    },
    {
      name: 'Anita Patel',
      location: 'Ahmedabad',
      text: 'Kerala honeymoon package was wonderful. Beautiful locations and excellent service throughout.',
      rating: 5,
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    },
  ];

  return (
    <div className="min-h-screen">
      <section
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg)',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {userName && (
            <p className="text-xl md:text-2xl text-white mb-4 font-light">
              Welcome back, {userName}!
            </p>
          )}
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Plan Your Perfect Trip in Minutes
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8">
            Experience India's rich heritage, spiritual destinations, and breathtaking landscapes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/smart-planner"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition flex items-center justify-center space-x-2 shadow-lg"
            >
              <Sparkles className="h-6 w-6" />
              <span>Start Smart Trip Planner</span>
            </Link>
            <Link
              to="/packages"
              className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition flex items-center justify-center space-x-2 shadow-lg"
            >
              <Package className="h-6 w-6" />
              <span>Browse Tour Packages</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Destinations
            </h2>
            <p className="text-lg text-gray-600">
              Handpicked packages for unforgettable experiences
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-300 h-64 rounded-t-lg"></div>
                  <div className="bg-gray-100 p-6 rounded-b-lg">
                    <div className="h-6 bg-gray-300 mb-2"></div>
                    <div className="h-4 bg-gray-300 w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularPackages.map((pkg) => (
                <Link
                  key={pkg.id}
                  to={`/packages/${pkg.id}`}
                  className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={pkg.images[0]}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span>{pkg.rating}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                      {pkg.title}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm mb-3 space-x-4">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{pkg.destination}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{pkg.duration_days}D/{pkg.duration_nights}N</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {pkg.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-blue-600">
                          ₹{pkg.price_per_person.toLocaleString('en-IN')}
                        </span>
                        <span className="text-gray-600 text-sm"> / person</span>
                      </div>
                      <ArrowRight className="h-5 w-5 text-blue-600 group-hover:translate-x-2 transition" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/packages"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold text-lg"
            >
              <span>View All Packages</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Travelers Say
            </h2>
            <p className="text-lg text-gray-600">
              Real experiences from real travelers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8">
            Let our AI create the perfect itinerary for you in seconds
          </p>
          <Link
            to="/smart-planner"
            className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition shadow-lg"
          >
            <Sparkles className="h-6 w-6" />
            <span>Plan My Trip Now</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
