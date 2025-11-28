import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Globe, X, Map as MapIcon, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase, Package } from "../lib/supabase";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon in React Leaflet
// We need to delete the default icon options and reset them because of webpack/bundler issues with Leaflet assets
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Common destination coordinates
const CITY_COORDINATES: Record<string, [number, number]> = {
  Pokhara: [28.2096, 83.9856],
  Chitwan: [27.5291, 84.3542],
  Kathmandu: [27.7172, 85.324],
  Bali: [-8.4095, 115.1889],
  Singapore: [1.3521, 103.8198],
  Bangkok: [13.7563, 100.5018],
  Phuket: [7.8804, 98.3923],
  Dubai: [25.2048, 55.2708],
  Maldives: [3.2028, 73.2207],
  Paris: [48.8566, 2.3522],
  London: [51.5074, -0.1278],
  "New York": [40.7128, -74.006],
  Tokyo: [35.6762, 139.6503],
  Sydney: [-33.8688, 151.2093],
  Rome: [41.9028, 12.4964],
  Venice: [45.4408, 12.3155],
  Santorini: [36.3932, 25.4615],
  Cairo: [30.0444, 31.2357],
  "Cape Town": [-33.9249, 18.4241],
  "Rio de Janeiro": [-22.9068, -43.1729],
  Kyoto: [35.0116, 135.7681],
  Istanbul: [41.0082, 28.9784],
  Barcelona: [41.3851, 2.1734],
  Amsterdam: [52.3676, 4.9041],
  Vietnam: [14.0583, 108.2772],
  Hanoi: [21.0285, 105.8542],
  "Ho Chi Minh City": [10.8231, 106.6297],
  "Da Nang": [16.0544, 108.2022],
  Japan: [36.2048, 138.2529],
  Thailand: [15.87, 100.9925],
  Indonesia: [-0.7893, 113.9213],
  Malaysia: [4.2105, 101.9758],
  "Kuala Lumpur": [3.139, 101.6869],
  Nepal: [28.3949, 84.124],
  India: [20.5937, 78.9629],
  Delhi: [28.6139, 77.209],
  Mumbai: [19.076, 72.8777],
  Goa: [15.2993, 74.124],
  Kerala: [10.8505, 76.2711],
  Jaipur: [26.9124, 75.7873],
  Agra: [27.1767, 78.0081],
  Varanasi: [25.3176, 82.9739],
  "Sri Lanka": [7.8731, 80.7718],
  Colombo: [6.9271, 79.8612],
  Kandy: [7.2906, 80.6337],
  Bhutan: [27.5142, 90.4336],
  Thimphu: [27.4728, 89.6393],
  Paro: [27.4287, 89.4164],
};

export default function PackageMapWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && packages.length === 0) {
      loadPackages();
    }
  }, [isOpen]);

  const loadPackages = async () => {
    setLoading(true);
    const { data } = await supabase.from("packages").select("*").eq("is_active", true);

    if (data) {
      setPackages(data);
    }
    setLoading(false);
  };

  const getCoordinates = (destination: string): [number, number] | null => {
    // Try exact match
    if (CITY_COORDINATES[destination]) {
      return CITY_COORDINATES[destination];
    }

    // Try partial match
    const key = Object.keys(CITY_COORDINATES).find(
      (key) =>
        destination.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(destination.toLowerCase())
    );

    return key ? CITY_COORDINATES[key] : null;
  };

  // Filter packages that have coordinates
  const packagesWithCoords = packages.filter((pkg) => getCoordinates(pkg.destination) !== null);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-1 ${
          isOpen
            ? "bg-gray-900 text-white rotate-90"
            : "bg-white text-gray-900 hover:text-lilac-600 border border-gray-100"
        }`}
        aria-label="Explore Map">
        {isOpen ? <X size={24} /> : <Globe size={24} />}
      </button>

      {/* Map Modal */}
      <div
        className={`fixed bottom-40 right-6 z-50 w-[80vw] md:w-[400px] h-[450px] bg-white rounded-[2.5rem] shadow-2xl transition-all duration-500 origin-bottom-right overflow-hidden border border-gray-100 flex flex-col ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-10 pointer-events-none"
        }`}>
        {/* Header */}
        <div className="px-8 py-6 bg-white z-10 border-b border-gray-50">
          <h3 className="font-kugile italic text-3xl text-gray-900 leading-tight">
            Discover <br />
            <span className="not-italic font-sans text-lg font-bold text-lilac-600 uppercase tracking-wider">
              Destinations
            </span>
          </h3>
          <p className="text-gray-400 text-xs mt-2 font-medium tracking-wide uppercase">
            {packagesWithCoords.length} locations available
          </p>
        </div>

        {/* Map Content */}
        <div className="flex-grow relative bg-gray-50">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2
                className="animate-spin text-lilac-600"
                size={32}
              />
            </div>
          ) : (
            <MapContainer
              center={[20, 0]}
              zoom={2}
              style={{ height: "100%", width: "100%" }}
              zoomControl={false}
              attributionControl={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />

              {packagesWithCoords.map((pkg) => {
                const coords = getCoordinates(pkg.destination);
                if (!coords) return null;

                return (
                  <Marker
                    key={pkg.id}
                    position={coords}>
                    <Popup
                      className="custom-popup"
                      closeButton={false}>
                      <div className="w-52 p-1">
                        <div className="h-28 w-full mb-3 rounded-xl overflow-hidden bg-gray-100 relative group">
                          <img
                            src={pkg.images[0]}
                            alt={pkg.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                          <span className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-900 shadow-sm">
                            ₹{pkg.price_per_person}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-900 text-base mb-1 line-clamp-1 font-kugile">
                          {pkg.title}
                        </h4>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-xs text-gray-500 flex items-center gap-1 uppercase tracking-wide font-medium">
                            <MapIcon size={10} /> {pkg.destination}
                          </p>
                          <Link
                            to={`/packages/${pkg.id}`}
                            className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-full hover:bg-gray-800 flex items-center gap-1 transition-all hover:shadow-md">
                            View <ArrowRight size={10} />
                          </Link>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          )}
        </div>
      </div>
    </>
  );
}
