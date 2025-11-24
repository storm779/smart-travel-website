import { Award, Users, Heart, Globe } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About SmartTravel</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted partner in creating unforgettable travel experiences across India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">15+ Years</h3>
            <p className="text-gray-600">Industry Experience</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">50,000+</h3>
            <p className="text-gray-600">Happy Travelers</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <Globe className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">200+</h3>
            <p className="text-gray-600">Destinations</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <Heart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">4.8/5</h3>
            <p className="text-gray-600">Customer Rating</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Founded in 2009, SmartTravel began with a simple mission: to make travel planning
              effortless and accessible to everyone. What started as a small team of travel
              enthusiasts has grown into India's leading smart travel platform, serving thousands
              of travelers every month.
            </p>
            <p>
              We specialize in creating personalized travel experiences that blend cultural
              immersion, spiritual journeys, and adventure. From the sacred ghats of Varanasi to
              the majestic peaks of Ladakh, from heritage walks through Rajasthan to serene
              backwaters of Kerala, we curate journeys that leave lasting impressions.
            </p>
            <p>
              Our innovative AI-powered itinerary planner revolutionizes travel planning by
              generating customized trips based on your preferences, budget, and interests. Whether
              you're seeking a spiritual retreat, an adventure expedition, or a cultural
              exploration, we have the perfect journey waiting for you.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Expert Local Knowledge
              </h3>
              <p className="text-gray-700">
                Our team consists of travel experts with deep knowledge of Indian destinations,
                ensuring authentic and enriching experiences.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Planning</h3>
              <p className="text-gray-700">
                Our smart planner uses advanced algorithms to create personalized itineraries
                matching your exact preferences and budget.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-700">
                Round-the-clock customer support ensures you're never alone during your journey,
                with assistance always just a call away.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Best Price Guarantee</h3>
              <p className="text-gray-700">
                Competitive pricing without compromising on quality, with flexible options for
                every budget range.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
