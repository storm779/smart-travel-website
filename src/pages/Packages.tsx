import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, MapPin, Calendar, Star, ArrowRight, Globe, Home } from "lucide-react";
import { supabase, Package as PackageType } from "../lib/supabase";
import { Reveal } from "../components/Reveal";

export default function Packages() {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "domestic" | "international">(
    "all"
  );
  const [filters, setFilters] = useState({
    destination: "",
    theme: "",
    minPrice: "",
    maxPrice: "",
    minDuration: "",
    maxDuration: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const themes = ["adventure", "honeymoon", "family", "cultural", "religious", "beach", "heritage"];

  useEffect(() => {
    loadPackages();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [packages, searchTerm, filters, selectedCategory]);

  const loadPackages = async () => {
    const { data } = await supabase
      .from("packages")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (data) {
      setPackages(data);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...packages];

    if (selectedCategory !== "all") {
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
      destination: "",
      theme: "",
      minPrice: "",
      maxPrice: "",
      minDuration: "",
      maxDuration: "",
    });
    setSearchTerm("");
    setSelectedCategory("all");
  };

  const domesticPackages = filteredPackages.filter((pkg) => pkg.category === "domestic");
  const internationalPackages = filteredPackages.filter((pkg) => pkg.category === "international");

  const PackageCard = ({ pkg }: { pkg: PackageType }) => {
    const defaultImage = "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg";
    const imageUrl = pkg.images && pkg.images.length > 0 ? pkg.images[0] : defaultImage;

    return (
      <Link
        to={`/packages/${pkg.id}`}
        className="group relative h-[500px] rounded-3xl overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500 block">
        <img
          src={imageUrl}
          alt={pkg.title}
          className="w-full h-full object-cover transition duration-1000 group-hover:scale-110 mt-10"
        />
        <div className="absolute top-6 left-6 bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-white text-sm font-medium border border-white/30 shadow-sm flex items-center gap-2">
          {pkg.theme.charAt(0).toUpperCase() + pkg.theme.slice(1)}
        </div>
        <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-sm font-semibold flex items-center space-x-1 border border-white/30">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span>{pkg.rating}</span>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 transition-all duration-300">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <h3 className="text-2xl font-bold text-white mb-2 font-kugile">{pkg.title}</h3>
            <div className="flex items-center text-white/80 text-sm mb-3 space-x-4">
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
            <p className="text-white/70 text-sm mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
              {pkg.description}
            </p>
            <div className="flex items-center justify-between mt-4">
              <div>
                <span className="text-xl font-bold text-white">
                  ₹{pkg.price_per_person.toLocaleString("en-IN")}
                </span>
                <span className="text-white/60 text-xs"> / person</span>
              </div>
              <div className="bg-white text-gray-900 p-2 rounded-full hover:bg-lilac hover:text-white transition-colors duration-300">
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-white pt-28 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-12 text-center">
            <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 font-kugile italic">
              Tour{" "}
              <span className="text-lilac/80 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Packages
              </span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Explore our curated collection of travel experiences across India and around the world
            </p>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="mb-12 bg-gray-50 p-2 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search packages, destinations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-white border-none rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-lilac/20 text-gray-700 placeholder-gray-400 shadow-sm"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center space-x-2 px-8 py-4 rounded-[1.5rem] transition-all duration-300 ${
                  showFilters
                    ? "bg-lilac text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                }`}>
                <Filter className="h-5 w-5" />
                <span className="font-medium">Filters</span>
              </button>
            </div>

            {showFilters && (
              <div className="p-6 mt-2 bg-white rounded-[1.5rem] shadow-inner animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3 ml-1">
                      Theme
                    </label>
                    <select
                      value={filters.theme}
                      onChange={(e) => setFilters({ ...filters, theme: e.target.value })}
                      className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lilac/20">
                      <option value="">All Themes</option>
                      {themes.map((theme) => (
                        <option
                          key={theme}
                          value={theme}>
                          {theme.charAt(0).toUpperCase() + theme.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3 ml-1">
                      Budget (INR ₹)
                    </label>
                    <div className="flex space-x-3">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                        className="w-1/2 bg-gray-50 border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lilac/20"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                        className="w-1/2 bg-gray-50 border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lilac/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3 ml-1">
                      Duration (Days)
                    </label>
                    <div className="flex space-x-3">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minDuration}
                        onChange={(e) => setFilters({ ...filters, minDuration: e.target.value })}
                        className="w-1/2 bg-gray-50 border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lilac/20"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxDuration}
                        onChange={(e) => setFilters({ ...filters, maxDuration: e.target.value })}
                        className="w-1/2 bg-gray-50 border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lilac/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={resetFilters}
                    className="text-lilac hover:text-purple-600 font-medium px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors">
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={300}>
          <div className="mb-10 flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`flex items-center space-x-2 px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === "all"
                  ? "bg-gray-900 text-white shadow-lg scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}>
              <span>All Packages</span>
            </button>
            <button
              onClick={() => setSelectedCategory("domestic")}
              className={`flex items-center space-x-2 px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === "domestic"
                  ? "bg-gray-900 text-white shadow-lg scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}>
              <Home className="h-4 w-4" />
              <span>Domestic</span>
            </button>
            <button
              onClick={() => setSelectedCategory("international")}
              className={`flex items-center space-x-2 px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === "international"
                  ? "bg-gray-900 text-white shadow-lg scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}>
              <Globe className="h-4 w-4" />
              <span>International</span>
            </button>
          </div>
        </Reveal>

        <div className="mb-6 text-center">
          <p className="text-gray-500">
            Showing <span className="font-semibold text-gray-900">{filteredPackages.length}</span>{" "}
            packages
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="animate-pulse">
                <div className="bg-gray-200 h-[500px] rounded-3xl"></div>
              </div>
            ))}
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 rounded-[2.5rem]">
            <p className="text-gray-500 text-xl mb-4">No packages found matching your criteria.</p>
            <button
              onClick={resetFilters}
              className="text-lilac hover:text-purple-600 font-medium underline">
              Clear all filters
            </button>
          </div>
        ) : selectedCategory === "all" ? (
          <>
            {domesticPackages.length > 0 && (
              <div className="mb-20">
                <Reveal>
                  <div className="flex items-center space-x-4 mb-10">
                    <div className="h-px bg-gray-200 flex-1"></div>
                    <div className="flex items-center space-x-3">
                      <Home className="h-6 w-6 text-lilac" />
                      <h2 className="text-3xl font-light font-kugile italic text-gray-900">
                        Domestic Packages
                      </h2>
                    </div>
                    <div className="h-px bg-gray-200 flex-1"></div>
                  </div>
                </Reveal>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {domesticPackages.map((pkg, index) => (
                    <Reveal
                      key={pkg.id}
                      delay={index * 100}>
                      <PackageCard pkg={pkg} />
                    </Reveal>
                  ))}
                </div>
              </div>
            )}

            {internationalPackages.length > 0 && (
              <div>
                <Reveal>
                  <div className="flex items-center space-x-4 mb-10">
                    <div className="h-px bg-gray-200 flex-1"></div>
                    <div className="flex items-center space-x-3">
                      <Globe className="h-6 w-6 text-lilac" />
                      <h2 className="text-3xl font-light font-kugile italic text-gray-900">
                        International Packages
                      </h2>
                    </div>
                    <div className="h-px bg-gray-200 flex-1"></div>
                  </div>
                </Reveal>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {internationalPackages.map((pkg, index) => (
                    <Reveal
                      key={pkg.id}
                      delay={index * 100}>
                      <PackageCard pkg={pkg} />
                    </Reveal>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg, index) => (
              <Reveal
                key={pkg.id}
                delay={index * 100}>
                <PackageCard pkg={pkg} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
