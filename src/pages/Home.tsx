import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, MapPin, Plus, Minus, Star, Quote, Sparkles, Building2, Fingerprint, Headphones } from "lucide-react";
import { motion } from "framer-motion";
import { supabase, Package as PackageType } from "../lib/supabase";
import { CountUp } from "../components/CountUp";
import { Reveal } from "../components/Reveal";

// --- Animation variants ---
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function Home() {
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
    if (data) setPopularPackages(data);
    setLoading(false);
  };

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Solo Traveler",
      text: "The AI planner understood exactly what I wanted — a budget-friendly Kerala trip with offbeat spots. Every restaurant, every homestay was handpicked perfection.",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    },
    {
      name: "Arjun Mehta",
      role: "Family Travel",
      text: "Planning a 10-day Rajasthan trip for a family of six used to take weeks. Travellah did it in seconds, and the itinerary was better than what any agent gave us.",
      image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    },
    {
      name: "Sneha Reddy",
      role: "Honeymoon",
      text: "Our Maldives honeymoon was magical. The custom itinerary included sunset cruises and private dinners we never would have found on our own.",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
    },
  ];

  const faqs = [
    {
      question: "How does the AI travel planner work?",
      answer: "Our AI analyzes your preferences — budget, interests, travel style, and dates — to generate three personalized itineraries (Economic, Mid-Luxury, Luxury) with day-by-day activities, restaurants, and hotels.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept UPI, all major credit/debit cards, net banking, and digital wallets. Payment is processed securely through our platform.",
    },
    {
      question: "Can I modify my itinerary after booking?",
      answer: "Yes, you can request modifications up to 7 days before your travel date. Our support team will help adjust your plan at no extra charge.",
    },
    {
      question: "Do you offer group travel packages?",
      answer: "Absolutely. Our AI planner supports groups up to 20 people with special rates, shared activities, and customized accommodation arrangements.",
    },
    {
      question: "Is travel insurance included?",
      answer: "Travel insurance is available as an add-on during checkout. We partner with leading insurers to offer comprehensive coverage for your peace of mind.",
    },
  ];

  const stats = [
    { value: 50000, suffix: "+", label: "Travelers" },
    { value: 200, suffix: "+", label: "Destinations" },
    { value: 4.8, suffix: "/5", label: "Rating", isDecimal: true },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100 overflow-hidden">
      <Helmet>
        <title>Travellah — AI-Powered Travel Planning</title>
        <meta name="description" content="Plan your perfect trip with AI-powered itineraries. Explore curated travel packages across India and worldwide." />
      </Helmet>

      {/* ===================== HERO ===================== */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background image with slow zoom */}
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/2161449/pexels-photo-2161449.jpeg"
            alt="Scenic travel destination"
            className="w-full h-full object-cover scale-105 animate-[slowZoom_25s_ease-in-out_infinite_alternate]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/60" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 h-full flex flex-col justify-end pb-20 md:pb-28 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-3xl">
            <motion.p
              variants={fadeUp}
              custom={0}
              className="text-white/70 text-sm uppercase tracking-[0.25em] mb-4 font-medium">
              AI-Powered Travel Planning
            </motion.p>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl sm:text-5xl md:text-7xl text-white leading-[1.1] mb-6">
              Begin your{" "}
              <span className="font-kugile italic font-normal">dream journey</span>
              <br className="hidden md:block" /> with us
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-white/60 text-lg max-w-lg mb-10 leading-relaxed">
              Personalized itineraries crafted by AI. From hidden gems to iconic landmarks — your perfect trip, planned in seconds.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
              <Link
                to="/smart-planner"
                className="group flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-full font-medium text-sm hover:bg-lilac-100 transition-all duration-300 shadow-lg hover:shadow-xl">
                Plan Your Trip
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/packages"
                className="flex items-center gap-3 border border-white/40 text-white px-8 py-4 rounded-full font-medium text-sm hover:bg-white/10 backdrop-blur-sm transition-all duration-300">
                Browse Packages
              </Link>
            </motion.div>
          </motion.div>

          {/* Location tag */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-8 right-6 sm:right-10 lg:right-16 text-white/50 text-xs flex items-center gap-1.5 uppercase tracking-widest">
            <MapPin size={12} />
            Bali, Indonesia
          </motion.div>
        </div>
      </section>

      {/* ===================== STATS BAR ===================== */}
      <section className="relative -mt-16 z-20 px-6 sm:px-10 lg:px-16 max-w-5xl mx-auto">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl dark:shadow-slate-900/50 border border-gray-100 dark:border-slate-800 px-8 py-8 grid grid-cols-3 divide-x divide-gray-100 dark:divide-slate-800">
          {stats.map((stat, i) => (
            <Reveal key={i} delay={i * 150}>
              <div className="text-center px-4">
                <p className="text-3xl md:text-4xl font-kugile text-gray-900 dark:text-white mb-1">
                  {stat.isDecimal ? (
                    <span>{stat.value}{stat.suffix}</span>
                  ) : (
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  )}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-[0.15em] font-medium">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===================== ABOUT ===================== */}
      <section className="py-28 md:py-36 px-6 sm:px-10 lg:px-16 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <Reveal className="lg:col-span-7">
            <p className="text-xs uppercase tracking-[0.2em] text-lilac-600 dark:text-lilac-400 font-semibold mb-6">
              Why Travellah
            </p>
            <h2 className="text-3xl md:text-5xl font-kugile italic leading-[1.2] text-gray-900 dark:text-white mb-8">
              We don't just plan trips.{" "}
              <span className="text-lilac-600 dark:text-lilac-400 not-italic">
                We craft experiences
              </span>{" "}
              you'll remember forever.
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed max-w-xl">
              Our AI understands your travel personality — adventurer, culture seeker, beach lover, foodie — and builds itineraries that feel hand-curated by a local expert.
            </p>
          </Reveal>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {[
              { icon: Sparkles, title: "AI Itineraries", desc: "3 tiers generated in seconds", accent: "from-lilac-500/20 to-purple-500/20 dark:from-lilac-500/10 dark:to-purple-500/10", iconColor: "text-lilac-600 dark:text-lilac-400", border: "hover:border-lilac-300 dark:hover:border-lilac-600/40", shadow: "hover:shadow-lilac-200/40 dark:hover:shadow-lilac-900/30" },
              { icon: Building2, title: "Curated Stays", desc: "Handpicked hotels & homestays", accent: "from-amber-500/20 to-orange-500/20 dark:from-amber-500/10 dark:to-orange-500/10", iconColor: "text-amber-600 dark:text-amber-400", border: "hover:border-amber-300 dark:hover:border-amber-600/40", shadow: "hover:shadow-amber-200/40 dark:hover:shadow-amber-900/30" },
              { icon: Fingerprint, title: "Personalized", desc: "Matched to your travel style", accent: "from-teal-500/20 to-emerald-500/20 dark:from-teal-500/10 dark:to-emerald-500/10", iconColor: "text-teal-600 dark:text-teal-400", border: "hover:border-teal-300 dark:hover:border-teal-600/40", shadow: "hover:shadow-teal-200/40 dark:hover:shadow-teal-900/30" },
              { icon: Headphones, title: "24/7 Support", desc: "AI chatbot always available", accent: "from-blue-500/20 to-indigo-500/20 dark:from-blue-500/10 dark:to-indigo-500/10", iconColor: "text-blue-600 dark:text-blue-400", border: "hover:border-blue-300 dark:hover:border-blue-600/40", shadow: "hover:shadow-blue-200/40 dark:hover:shadow-blue-900/30" },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 100}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={`bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 hover:shadow-xl ${item.border} ${item.shadow} transition-[border-color,box-shadow] duration-300 group cursor-default`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.accent} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <item.icon className={`h-5 w-5 ${item.iconColor} transition-transform duration-300 group-hover:scale-110`} />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 transition-colors duration-300">{item.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== SERVICES ===================== */}
      <section className="py-28 px-6 sm:px-10 lg:px-16 bg-gray-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.2em] text-lilac-600 dark:text-lilac-400 font-semibold mb-4">
              Our Services
            </p>
            <h2 className="text-3xl md:text-5xl font-kugile italic text-gray-900 dark:text-white mb-4 leading-tight">
              Explore endless possibilities
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-lg text-lg leading-relaxed mb-14">
              From curated packages to AI-powered custom planning — every kind of trip, covered.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[550px]">
            <Reveal>
              <div className="relative rounded-3xl overflow-hidden h-[350px] md:h-full group cursor-pointer">
                <img
                  src="https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg"
                  alt="Comprehensive Travel Support"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                  <span className="text-lilac-300 text-xs uppercase tracking-[0.2em] font-semibold mb-2 block">Featured</span>
                  <h3 className="text-2xl md:text-3xl font-kugile italic text-white mb-2">
                    AI-Powered Planning
                  </h3>
                  <p className="text-white/60 text-sm max-w-md opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500">
                    Tell us your dream trip. Our AI builds a complete day-by-day itinerary with activities, meals, hotels, and insider tips.
                  </p>
                </div>
              </div>
            </Reveal>
            <div className="grid grid-rows-2 gap-4 h-full">
              {[
                {
                  img: "https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg",
                  label: "Expert Guidance",
                  title: "Local Insights",
                  desc: "Curated tips from seasoned travelers and local experts.",
                },
                {
                  img: "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg",
                  label: "200+ Places",
                  title: "Global Destinations",
                  desc: "From Goa to Switzerland — domestic and international coverage.",
                },
              ].map((card, i) => (
                <Reveal key={i} delay={i * 200}>
                  <div className="relative rounded-3xl overflow-hidden h-[250px] md:h-full group cursor-pointer">
                    <img
                      src={card.img}
                      alt={card.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <span className="text-lilac-300 text-xs uppercase tracking-[0.2em] font-semibold mb-1.5 block">{card.label}</span>
                      <h3 className="text-xl font-kugile italic text-white mb-1">{card.title}</h3>
                      <p className="text-white/50 text-xs opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FEATURED PACKAGES ===================== */}
      <section className="py-28 px-6 sm:px-10 lg:px-16 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <Reveal>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-lilac-600 dark:text-lilac-400 font-semibold mb-4">
                  Top Rated
                </p>
                <h2 className="text-3xl md:text-5xl font-kugile italic text-gray-900 dark:text-white leading-tight">
                  Handpicked packages
                </h2>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <Link
                to="/packages"
                className="group flex items-center gap-2 text-sm font-medium text-lilac-600 dark:text-lilac-400 hover:text-lilac-700 dark:hover:text-lilac-300 transition-colors">
                View all packages
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </Reveal>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[480px] bg-gray-100 dark:bg-slate-800 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularPackages.map((pkg, i) => (
                <Reveal key={pkg.id} delay={i * 150}>
                  <Link
                    to={`/packages/${pkg.id}`}
                    className="group relative h-[480px] rounded-3xl overflow-hidden block">
                    <img
                      src={pkg.images[0]}
                      alt={pkg.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                    {/* Top badges */}
                    <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
                      <span className="bg-white/15 backdrop-blur-md text-white text-xs font-medium px-4 py-1.5 rounded-full border border-white/20">
                        {pkg.duration_days}D / {pkg.duration_nights}N
                      </span>
                      <span className="bg-white/15 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1">
                        <Star size={10} fill="currentColor" /> {pkg.rating}
                      </span>
                    </div>

                    {/* Bottom content */}
                    <div className="absolute bottom-0 left-0 right-0 p-7">
                      <p className="text-lilac-300 text-xs uppercase tracking-[0.15em] font-semibold mb-2">
                        {pkg.destination}
                      </p>
                      <h3 className="text-xl font-kugile italic text-white mb-2 leading-tight">
                        {pkg.title}
                      </h3>
                      <p className="text-white/50 text-xs mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                        {pkg.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-white font-semibold text-lg">
                          ₹{pkg.price_per_person.toLocaleString()}
                          <span className="text-white/40 text-xs font-normal ml-1">/ person</span>
                        </span>
                        <span className="text-white/60 text-xs border border-white/20 px-4 py-2 rounded-full group-hover:bg-white group-hover:text-gray-900 transition-all duration-300">
                          View details
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <section className="py-28 px-6 sm:px-10 lg:px-16 bg-gray-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.2em] text-lilac-600 dark:text-lilac-400 font-semibold mb-4">
              Testimonials
            </p>
            <h2 className="text-3xl md:text-5xl font-kugile italic text-gray-900 dark:text-white mb-14 leading-tight">
              Loved by travelers
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 150}>
                <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-8 hover:shadow-lg dark:hover:shadow-slate-900/50 hover:border-lilac-200 dark:hover:border-lilac-800 transition-all duration-300 h-full flex flex-col">
                  <Quote size={24} className="text-lilac-300 dark:text-lilac-700 mb-4 flex-shrink-0" />
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm mb-8 flex-grow">
                    {t.text}
                  </p>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-lilac-100 dark:ring-lilac-900"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{t.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FAQ ===================== */}
      <section className="py-28 px-6 sm:px-10 lg:px-16 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          <Reveal className="lg:col-span-5">
            <p className="text-xs uppercase tracking-[0.2em] text-lilac-600 dark:text-lilac-400 font-semibold mb-4">
              FAQ
            </p>
            <h2 className="text-3xl md:text-5xl font-kugile italic text-gray-900 dark:text-white mb-6 leading-tight">
              Got questions?
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
              Everything you need to know about planning and booking your trip with Travellah.
            </p>
          </Reveal>

          <div className="lg:col-span-7 space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-300 ${
                  openFaq === index
                    ? "bg-lilac-50 dark:bg-lilac-950/30 border-lilac-200 dark:border-lilac-800"
                    : "bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 hover:border-gray-200 dark:hover:border-slate-700"
                }`}>
                <button
                  className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                  <span className="font-medium text-gray-900 dark:text-white text-[15px] pr-4">
                    {faq.question}
                  </span>
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    openFaq === index
                      ? "bg-lilac-600 text-white"
                      : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400"
                  }`}>
                    {openFaq === index ? <Minus size={14} /> : <Plus size={14} />}
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openFaq === index ? "max-h-48 pb-6 opacity-100" : "max-h-0 opacity-0"
                }`}>
                  <p className="px-6 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="py-20 px-6 sm:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden min-h-[420px] flex items-center">
            <img
              src="https://images.pexels.com/photos/2108845/pexels-photo-2108845.jpeg"
              alt="Start your journey"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
            <div className="relative z-10 px-10 md:px-16 py-16 max-w-2xl">
              <Reveal>
                <p className="text-lilac-300 text-xs uppercase tracking-[0.2em] font-semibold mb-4">
                  Start Today
                </p>
                <h2 className="text-3xl md:text-5xl font-kugile italic text-white leading-tight mb-6">
                  Your next adventure is one click away
                </h2>
                <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-md">
                  Let our AI craft a personalized itinerary that matches your budget, interests, and travel style — in seconds, not hours.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/smart-planner"
                    className="group flex items-center gap-2 bg-white text-gray-900 px-8 py-3.5 rounded-full font-medium text-sm hover:bg-lilac-100 transition-all duration-300">
                    Plan My Trip
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/explore-map"
                    className="flex items-center gap-2 border border-white/30 text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-white/10 transition-all duration-300">
                    <MapPin size={14} />
                    Explore Map
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
