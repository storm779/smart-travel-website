import { Link } from "react-router-dom";
import { Plane, MapPin, Mail, Phone, ArrowUpRight, Heart } from "lucide-react";

const footerLinks = {
  company: [
    { label: "About Us", to: "/about" },
    { label: "Careers", to: "/careers" },
    { label: "Press", to: "/press" },
    { label: "Legal", to: "/legal" },
  ],
  explore: [
    { label: "Packages", to: "/packages" },
    { label: "AI Planner", to: "/smart-planner" },
    { label: "Explore Map", to: "/explore-map" },
    { label: "Contact", to: "/contact" },
  ],
  support: [
    { label: "Help Center", to: "/support" },
    { label: "Cancellation Policy", to: "/legal" },
    { label: "Terms of Service", to: "/legal" },
    { label: "Privacy Policy", to: "/legal" },
  ],
};

const destinations = [
  "Goa", "Kerala", "Rajasthan", "Kashmir", "Bali", "Dubai", "Thailand", "Maldives",
];

export default function Footer() {
  return (
    <footer className="relative bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white overflow-hidden">
      {/* Subtle gradient accent at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lilac-500 to-transparent" />

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-lilac-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Top section — CTA */}
        <div className="py-16 border-b border-gray-200 dark:border-white/10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <h3 className="text-3xl md:text-4xl font-kugile font-bold leading-tight">
                Ready for your next
                <span className="text-lilac-400"> adventure</span>?
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm max-w-md">
                Let our AI planner craft the perfect itinerary tailored to your preferences, budget, and travel style.
              </p>
            </div>
            <Link
              to="/smart-planner"
              className="group flex items-center gap-2 bg-lilac-600 hover:bg-lilac-500 text-white px-8 py-3.5 rounded-full font-medium text-sm transition-all hover:shadow-lg hover:shadow-lilac-600/25 flex-shrink-0">
              Plan Your Trip
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        {/* Main footer grid */}
        <div className="py-14 grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-4">
            <Link to="/" className="flex items-center gap-2 group mb-5">
              <Plane className="h-6 w-6 text-lilac-400 transition-transform group-hover:rotate-12" />
              <span className="text-xl font-bold font-kugile">Travellah</span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              AI-powered travel planning that creates personalized itineraries for unforgettable experiences across India and the world.
            </p>
            <div className="space-y-2.5">
              <a href="mailto:hello@travellah.com" className="flex items-center gap-2.5 text-gray-500 dark:text-gray-400 hover:text-lilac-500 dark:hover:text-lilac-400 transition-colors text-sm">
                <Mail size={14} />
                hello@travellah.com
              </a>
              <a href="tel:+911234567890" className="flex items-center gap-2.5 text-gray-500 dark:text-gray-400 hover:text-lilac-500 dark:hover:text-lilac-400 transition-colors text-sm">
                <Phone size={14} />
                +91 123 456 7890
              </a>
            </div>
          </div>

          {/* Company */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-5">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.to + link.label}>
                  <Link
                    to={link.to}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-5">Explore</h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.to + link.label}>
                  <Link
                    to={link.to}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-5">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.to + link.label}>
                  <Link
                    to={link.to}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular destinations */}
          <div className="col-span-2 md:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-5">Top Destinations</h4>
            <div className="flex flex-wrap gap-2">
              {destinations.map((dest) => (
                <Link
                  key={dest}
                  to={`/packages?search=${dest}`}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-200/60 dark:bg-white/5 hover:bg-lilac-100 dark:hover:bg-lilac-600/20 border border-gray-200 dark:border-white/10 hover:border-lilac-300 dark:hover:border-lilac-500/30 text-gray-500 dark:text-gray-400 hover:text-lilac-600 dark:hover:text-lilac-300 text-xs transition-all duration-200">
                  <MapPin size={10} />
                  {dest}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-gray-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 dark:text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} Travellah Inc. All rights reserved.
          </p>
          <p className="text-gray-400 dark:text-gray-600 text-xs flex items-center gap-1">
            Made with <Heart size={11} className="text-lilac-500" fill="currentColor" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
}
