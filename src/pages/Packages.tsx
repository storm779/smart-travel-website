import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Calendar, Star, ArrowRight, Globe, Home } from 'lucide-react';
import { supabase, Package as PackageType } from '../lib/supabase';

export default function Packages() {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'domestic' | 'international'>('all');
  const [filters, setFilters] = useState({
    destination: '',
    theme: '',
    minPrice: '',
    maxPrice: '',
    minDuration: '',
    maxDuration: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const themes = ['adventure', 'honeymoon', 'family', 'cultural', 'religious', 'beach', 'heritage'];

  useEffect(() => {
    loadPackages();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [packages, searchTerm, filters, selectedCategory]);

  const loadPackages = async () => {
    const { data } = await supabase
      .from('packages')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (data) {
      setPackages(data);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...packages];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((pkg) => pkg.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (pkg) =>
          pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.destination) {
      filtered = filtered.filter((pkg) => pkg.destination === filters.destination);
    }

    if (filters.theme) {
      filtered = filtered.filter((pkg) => pkg.theme === filters.theme);
    }

    if (filters.minPrice) {
      filtered = filtered.filter((pkg) => pkg.price_per_person >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter((pkg) => pkg.price_per_person <= parseFloat(filters.maxPrice));
    }

    if (filters.minDuration) {
      filtered = filtered.filter((pkg) => pkg.duration_days >= parseInt(filters.minDuration));
    }

    if (filters.maxDuration) {
      filtered = filtered.filter((pkg) => pkg.duration_days <= parseInt(filters.maxDuration));
    }

    setFilteredPackages(filtered);
  };

  const resetFilters = () => {
    setFilters({
      destination: '',
      theme: '',
      minPrice: '',
      maxPrice: '',
      minDuration: '',
      maxDuration: '',
    });
    setSearchTerm('');
    setSelectedCategory('all');
  };

  const domesticPackages = filteredPackages.filter(pkg => pkg.category === 'domestic');
  const internationalPackages = filteredPackages.filter(pkg => pkg.category === 'international');

  const PackageCard = ({ pkg }: { pkg: PackageType }) => {
    const defaultImage = 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg';
    const imageUrl = pkg.images && pkg.images.length > 0 ? pkg.images[0] : defaultImage;

    return (
      <Link
        to={`/packages/${pkg.id}`}
        className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
      >
        <div className="relative h-64 overflow-hidden">
          <img
            src={imageUrl}
            alt={pkg.title}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
          />
          <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {pkg.theme.charAt(0).toUpperCase() + pkg.theme.slice(1)}
          </div>
          <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span>{pkg.rating}</span>
          </div>
          {pkg.category && (
            <div className="absolute bottom-4 right-4 bg-gray-900 bg-opacity-75 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
              {pkg.category === 'international' ? (
                <>
                  <Globe className="h-3 w-3" />
                  <span>International</span>
                </>
              ) : (
                <>
                  <Home className="h-3 w-3" />
                  <span>Domestic</span>
                </>
              )}
            </div>
          )}
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
              <span>
                {pkg.duration_days}D/{pkg.duration_nights}N
              </span>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pkg.description}</p>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-blue-600">
                ₹{pkg.price_per_person.toLocaleString('en-IN')}
              </span>
              <span className="text-gray-600 text-sm"> / person</span>
            </div>
            <div className="flex items-center space-x-1 text-blue-600 font-medium">
              <span>View Details</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition" />
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tour Packages</h1>
          <p className="text-lg text-gray-600">
            Explore our curated collection of travel experiences across India and around the world
          </p>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search packages, destinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center space-x-2 bg-white border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition"
          >
            <Filter className="h-5 w-5" />
            <span className="font-medium">Filters</span>
          </button>
        </div>

        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            <span>All Packages</span>
          </button>
          <button
            onClick={() => setSelectedCategory('domestic')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition ${
              selectedCategory === 'domestic'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            <Home className="h-5 w-5" />
            <span>Domestic Packages</span>
          </button>
          <button
            onClick={() => setSelectedCategory('international')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition ${
              selectedCategory === 'international'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            <Globe className="h-5 w-5" />
            <span>International Packages</span>
          </button>
        </div>

        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8 transition-colors duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                <select
                  value={filters.theme}
                  onChange={(e) => setFilters({ ...filters, theme: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Themes</option>
                  {themes.map((theme) => (
                    <option key={theme} value={theme}>
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget (INR ₹)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (Days)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minDuration}
                    onChange={(e) => setFilters({ ...filters, minDuration: e.target.value })}
                    className="w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxDuration}
                    onChange={(e) => setFilters({ ...filters, maxDuration: e.target.value })}
                    className="w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={resetFilters}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredPackages.length}</span> packages
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 h-64 rounded-t-lg"></div>
                <div className="bg-white p-6 rounded-b-lg">
                  <div className="h-6 bg-gray-300 mb-2"></div>
                  <div className="h-4 bg-gray-300 w-2/3 mb-4"></div>
                  <div className="h-4 bg-gray-300"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">No packages found matching your criteria.</p>
            <button
              onClick={resetFilters}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : selectedCategory === 'all' ? (
          <>
            {domesticPackages.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center space-x-3 mb-6">
                  <Home className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Domestic Tour Packages</h2>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {domesticPackages.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {domesticPackages.map((pkg) => (
                    <PackageCard key={pkg.id} pkg={pkg} />
                  ))}
                </div>
              </div>
            )}

            {internationalPackages.length > 0 && (
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <Globe className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">International Tour Packages</h2>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {internationalPackages.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {internationalPackages.map((pkg) => (
                    <PackageCard key={pkg.id} pkg={pkg} />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
