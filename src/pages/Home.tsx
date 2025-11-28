import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, MapPin, ChevronDown, Plus, Minus } from "lucide-react";
import { supabase, Package as PackageType } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Reveal } from "../components/Reveal";
import { CountUp } from "../components/CountUp";

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [popularPackages, setPopularPackages] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    loadPopularPackages();
  }, []);

  const loadPopularPackages = async () => {
    const { data } = await supabase
      .from("packages")
      .select("*")
      .eq("is_active", true)
      .order("rating", { ascending: false })
      .limit(3);

    if (data) {
      setPopularPackages(data);
    }
    setLoading(false);
  };

  const testimonials = [
    {
      name: "Rex",
      role: "Traveler",
      text: "Cycling app has a great social feature allows me to connect with other cyclists, motivating to see what others are doing.",
      image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    },
    {
      name: "Alex Buckmaster",
      role: "Traveler",
      text: "Traveling with this service was a game-changer for me. The customized itinerary perfectly matched my interests, and I was able to explore hidden gems.",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    },
    {
      name: "Dennis Callis",
      role: "Traveler",
      text: "The flexibility and range of options offered by this service were impressive. I was able to customize my trip to fit my schedule perfectly, and the special deals.",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
    },
  ];

  const faqs = [
    {
      question: "How do I book a trip with your travel service?",
      answer:
        "You can book a trip through our website, by calling our customer service hotline, or by visiting one of our offices. Simply choose your destination, travel dates, and preferred services.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, PayPal, and bank transfers.",
    },
    {
      question: "How do I know if my booking is confirmed?",
      answer:
        "You will receive a confirmation email with your booking details and a reference number immediately after payment.",
    },
    {
      question: "Do you offer group travel packages?",
      answer:
        "Yes, we offer special rates and customized itineraries for group travel. Contact our support team for more details.",
    },
    {
      question: "Do you offer travel insurance?",
      answer:
        "Yes, we provide comprehensive travel insurance options to ensure your peace of mind during your journey.",
    },
  ];

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-white">
      {/* Hero Section */}
      <div className="p-3 md:p-1">
        <section className="relative h-[calc(100vh-0.5rem)] w-full overflow-hidden rounded-[0.5rem]">
          <div
            className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-[20s] hover:scale-100"
            style={{
              backgroundImage:
                "url(https://images.pexels.com/photos/2161449/pexels-photo-2161449.jpeg)",
            }}>
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-20 ">
            <div className="max-w-3xl animate-fade-in-up">
              <h1 className="text-5xl md:text-7xl  text-white mb-6 leading-tight">
                Begin your <span className="font-kugile italic font-normal">dream journey</span>{" "}
                with our expert guidance and support
              </h1>
            </div>

            <div className="absolute bottom-12 left-4 sm:left-8 text-white flex items-center space-x-2 animate-bounce-slow">
              <MapPin className="h-5 w-5" />
              <span>Bali, Indonesia</span>
            </div>

            <div className="absolute bottom-12 right-4 sm:right-8 text-white">
              <button className="flex items-center space-x-2 hover:space-x-4 transition-all duration-300 group">
                <span>Explore more</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* About Us Section */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center font-kugile">
            <Reveal>
              <div className="italic">
                <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-8 leading-tight">
                  We are a passionate team of travel enthusiasts dedicated to making your travel
                  dreams come true.{" "}
                  <span className="italic text-lilac/80 bg-clip-text text-transparent bg-gradient-to-tr from-orange-900 to-orange-100">
                    Our mission is to provide you with the best travel experiences
                  </span>
                </h2>
              </div>
            </Reveal>
            <div className="flex justify-between items-center gap-8 font-light">
              <Reveal delay={200}>
                <div className="text-center group hover:-translate-y-2 transition-transform duration-300">
                  <h3 className="text-5xl  text-gray-900 mb-2 transition-colors">
                    <CountUp
                      end={200}
                      suffix="+"
                    />
                  </h3>
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                    Happy Customers
                  </p>
                </div>
              </Reveal>
              <Reveal delay={400}>
                <div className="text-center group hover:-translate-y-2 transition-transform duration-300 delay-100">
                  <h3 className="text-5xl  text-gray-900 mb-2 transition-colors">
                    <CountUp
                      end={65}
                      suffix="+"
                    />
                  </h3>
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                    Top Hotels
                  </p>
                </div>
              </Reveal>
              <Reveal delay={600}>
                <div className="text-center group hover:-translate-y-2 transition-transform duration-300 delay-200">
                  <h3 className="text-5xl  text-gray-900 mb-2  transition-colors">
                    <CountUp
                      end={250}
                      suffix="+"
                    />
                  </h3>
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                    Experienced Guide
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Our Service Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-5xl md:text-6xl  font-thin text-gray-900 mb-5 font-kugile italic">
              Explore endless <br />
              <span className="italic text-lilac/80 bg-clip-text text-transparent bg-gradient-to-r from-teal-900 to-emerald-400">
                options with our service
              </span>
            </h2>
            <p className="text-gray-500 max-w-xl text-lg leading-relaxed">
              Discover a myriad of choices available through our service, offering limitless
              possibilities for your exploration and enjoyment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 min-h-[600px]">
            <div className="relative rounded-3xl overflow-hidden h-[400px] md:h-auto group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
              <img
                src="https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg"
                alt="Comprehensive Travel Support"
                className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10 transition-opacity duration-300">
                <h3 className="text-3xl font-bold text-white mb-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  Comprehensive Travel Support
                </h3>
                <p className="text-white/90 text-base opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                  24/7 customer service to assist you before, during, and after your trip.
                </p>
              </div>
            </div>
            <div className="grid grid-rows-2 gap-3 h-full">
              <div className="relative rounded-3xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 h-[300px] md:h-auto">
                <img
                  src="https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg"
                  alt="Expert Travel Advice"
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10">
                  <h3 className="text-2xl font-bold text-white mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    Expert Travel Advice
                  </h3>
                  <p className="text-white/90 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    Tips and guides to enhance your travel experience.
                  </p>
                </div>
              </div>
              <div className="relative rounded-3xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 h-[300px] md:h-auto">
                <img
                  src="https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg"
                  alt="Diverse Destinations"
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10">
                  <h3 className="text-2xl font-bold text-white mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    Diverse Destinations
                  </h3>
                  <p className="text-white/90 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    Access to a wide range of domestic and international locations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-32 opacity-60 ">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/512px-Airbnb_Logo_B%C3%A9lo.svg.png"
              alt="Airbnb"
              className="h-12 object-contain hover:scale-110 transition-transform duration-300 cursor-pointer"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Booking.com_logo.svg/512px-Booking.com_logo.svg.png"
              alt="Booking.com"
              className="h-10 object-contain hover:scale-110 transition-transform duration-300 cursor-pointer"
            />
            <img
              src="https://promos.makemytrip.com/Growth/Images/3x/mmt_dt_header_icon_3x.png"
              alt="MakeMyTrip"
              className="h-12 object-contain hover:scale-110 transition-transform duration-300 cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* Our Package Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl text-gray-900 font-light font-kugile italic">
              Discover our exceptional{" "}
              <span className="italic text-lilac/80 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-red-100">
                selection of travel packages and destinations
              </span>
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[500px] bg-gray-100 rounded-3xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {popularPackages.map((pkg) => (
                <Link
                  key={pkg.id}
                  to={`/packages/${pkg.id}`}
                  className="group relative h-[550px] rounded-3xl overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500">
                  <img
                    src={pkg.images[0]}
                    alt={pkg.title}
                    className="w-full h-full object-cover transition duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute top-6 left-6 bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-white text-sm font-medium border border-white/30 shadow-sm">
                    {pkg.duration_days} day, {pkg.duration_nights} night
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 transition-all duration-300">
                    <h3 className="text-2xl font-bold text-white mb-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      {pkg.title}
                    </h3>
                    <p className="text-white/80 text-sm mb-6 line-clamp-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                      {pkg.description}
                    </p>
                    <div className="inline-block border border-white/50 text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-white hover:text-black transition-all duration-300 text-center w-fit hover:scale-105">
                      Choose package
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-32 bg-gradient-to-tr from-white to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-4 italic font-kugile">
                Frequently Asked{" "}
                <span className="italic text-lilac/80 bg-clip-text text-transparent bg-gradient-to-r from-yellow-700 to-yellow-300">
                  Questions
                </span>
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed">
                We believe in the power of collective action to address the urgent environmental
                challenges facing our planet.
              </p>
            </div>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                  <button
                    className="w-full px-8 py-6 text-left flex items-center justify-between focus:outline-none group"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                    <span className="font-medium text-gray-900 text-lg  transition-colors">
                      {faq.question}
                    </span>
                    {openFaq === index ? (
                      <Minus className="h-6 w-6  transition-transform duration-300" />
                    ) : (
                      <Plus className="h-6 w-6 text-gray-400 transition-transform duration-300" />
                    )}
                  </button>
                  <div
                    className={`px-8 overflow-hidden transition-all duration-300 ease-in-out ${
                      openFaq === index ? "max-h-48 pb-6 opacity-100" : "max-h-0 opacity-0"
                    }`}>
                    <p className="text-gray-500 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Review Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-light text-gray-900 font-kugile italic">
              Your trusted{" "}
              <span className="italic text-lilac/80 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-blue-600">
                partner in travel
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 p-10 rounded-3xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 group">
                <div className="flex items-center mb-8">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover mr-4 ring-2 ring-white shadow-md group-hover:scale-110 transition-transform duration-300"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed text-base italic">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[2.5rem] overflow-hidden h-[500px] shadow-2xl group">
            <img
              src="https://images.pexels.com/photos/2108845/pexels-photo-2108845.jpeg"
              alt="CTA Background"
              className="w-full h-full object-cover transition duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-10 max-w-4xl leading-tight font-kugile">
                Don't wait any longer! Start your adventure and explore new experiences today
              </h2>
              <div className="bg-white/20 backdrop-blur-md p-2 rounded-full flex w-full max-w-lg border border-white/30 shadow-lg hover:bg-white/25 transition-all duration-300">
                <input
                  type="email"
                  placeholder="Drop your email address here..."
                  className="bg-transparent flex-1 px-8 py-3 text-white placeholder-white/70 focus:outline-none text-lg"
                />
                <button className="bg-white text-gray-900 px-10 py-3 rounded-full font-bold hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-md">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Section: Big Heading & CTA */}
      <div className="flex flex-col items-center text-center mb-24">
        <h2 className="text-5xl md:text-7xl text-gray-900 mb-12  tracking-tight font-kugile">
          The world is{" "}
          <span className="italic text-lilac/80 bg-clip-text text-transparent bg-gradient-to-r from-purple-950 to-purple-200">
            accessible.
          </span>
        </h2>
        <Link
          to="/packages"
          className="bg-gray-900 text-white px-10 py-4 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
          Start your journey
        </Link>
      </div>
    </div>
  );
}
