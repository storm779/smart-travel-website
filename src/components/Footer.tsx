import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-900 py-24 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Divider */}
        <div className="border-t border-gray-200 mb-16"></div>

        {/* Bottom Section: Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Column 1 */}
          <div className="md:col-span-3">
            <h3 className="text-2xl font-bold font-kugile mb-6">Travellah</h3>
            <ul className="space-y-3 text-gray-500 text-sm">
              <li>
                <Link
                  to="/about"
                  className="hover:text-lilac-600 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="hover:text-lilac-600 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/press"
                  className="hover:text-lilac-600 transition-colors">
                  Press
                </Link>
              </li>
              <li>
                <Link
                  to="/legal"
                  className="hover:text-lilac-600 transition-colors">
                  Legal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="md:col-span-3">
            <h3 className="text-xl font-bold font-kugile mb-6">Explore</h3>
            <ul className="space-y-3 text-gray-500 text-sm">
              <li>
                <Link
                  to="/packages"
                  className="hover:text-lilac-600 transition-colors">
                  Packages
                </Link>
              </li>
              <li>
                <Link
                  to="/smart-planner"
                  className="hover:text-lilac-600 transition-colors">
                  Smart Planner
                </Link>
              </li>
              <li>
                <Link
                  to="/destinations"
                  className="hover:text-lilac-600 transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  className="hover:text-lilac-600 transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 (Right Aligned) */}
          <div className="md:col-span-6 md:text-right flex flex-col justify-end">
            <div className="text-gray-400 text-sm">
              <p className="mb-2">&copy; 2025 Travellah Inc.</p>
              <p>Bali • Singapore • Bangkok</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
