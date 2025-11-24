import { Link } from 'react-router-dom';
import { Plane, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Plane className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold text-white">SmartTravel</span>
            </div>
            <p className="text-sm mb-4">
              Your trusted partner for unforgettable journeys across India. From spiritual retreats to adventure expeditions, we craft perfect travel experiences.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-500 transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-blue-500 transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-blue-500 transition">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-blue-500 transition">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-blue-500 transition">Home</Link>
              </li>
              <li>
                <Link to="/packages" className="hover:text-blue-500 transition">Tour Packages</Link>
              </li>
              <li>
                <Link to="/smart-planner" className="hover:text-blue-500 transition">Smart Planner</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-500 transition">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-500 transition">Contact</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Popular Destinations</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-500 transition">Rajasthan</a></li>
              <li><a href="#" className="hover:text-blue-500 transition">Kerala</a></li>
              <li><a href="#" className="hover:text-blue-500 transition">Ladakh</a></li>
              <li><a href="#" className="hover:text-blue-500 transition">Goa</a></li>
              <li><a href="#" className="hover:text-blue-500 transition">Uttarakhand</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">123 Travel Street, Mumbai, Maharashtra 400001</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <span className="text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <span className="text-sm">info@smarttravel.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; 2025 SmartTravel. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link to="/privacy" className="hover:text-blue-500 transition">Privacy Policy</Link>
            <span>|</span>
            <Link to="/terms" className="hover:text-blue-500 transition">Terms & Conditions</Link>
            <span>|</span>
            <Link to="/refund" className="hover:text-blue-500 transition">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
