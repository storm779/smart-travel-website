import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Globe, X, Map as MapIcon, ArrowRight, Loader2, Expand } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase, Package } from "../lib/supabase";
import { getCoordinates } from "../utils/coordinates";
import { useTheme } from "../contexts/ThemeContext";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function createCustomIcon(category: "domestic" | "international") {
  const color = category === "domestic" ? "#7c3aed" : "#2563eb";
  const bgColor = category === "domestic" ? "#ede9fe" : "#dbeafe";

  return L.divIcon({
    html: `<div style="
      width: 32px; height: 32px; border-radius: 50% 50% 50% 0;
      background: ${color}; border: 3px solid ${bgColor};
      transform: rotate(-45deg); display: flex; align-items: center; justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "><div style="transform: rotate(45deg); color: white; font-size: 12px; font-weight: bold;">
      ${category === "domestic" ? "D" : "I"}
    </div></div>`,
    className: "custom-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

function FlyToOnOpen() {
  const map = useMap();
  useEffect(() => {
    map.flyTo([20.5937, 78.9629], 4, { duration: 1.5 });
  }, [map]);
  return null;
}

export default function PackageMapWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    if (isOpen && packages.length === 0) {
      loadPackages();
    }
  }, [isOpen]);

  const loadPackages = async () => {
    setLoading(true);
    const { data } = await supabase.from("packages").select("*").eq("is_active", true);
    if (data) setPackages(data);
    setLoading(false);
  };

  const packagesWithCoords = packages.filter((pkg) => getCoordinates(pkg.destination) !== null);

  const tileUrl = isDark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-1 ${
          isOpen
            ? "bg-gray-900 text-white rotate-90"
            : "bg-white text-gray-900 hover:text-lilac-600 border border-gray-100 dark:bg-slate-800 dark:text-white dark:border-slate-700"
        }`}
        aria-label="Explore Map">
        {isOpen ? <X size={24} /> : <Globe size={24} />}
      </button>

      <div
        className={`fixed bottom-40 right-6 z-50 w-[80vw] md:w-[400px] h-[450px] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl transition-all duration-500 origin-bottom-right overflow-hidden border border-gray-100 dark:border-slate-700 flex flex-col ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-10 pointer-events-none"
        }`}>
        {/* Header */}
        <div className="px-8 py-5 bg-white dark:bg-slate-900 z-10 border-b border-gray-50 dark:border-slate-800 flex items-start justify-between">
          <div>
            <h3 className="font-kugile italic text-3xl text-gray-900 dark:text-white leading-tight">
              Discover <br />
              <span className="not-italic font-sans text-lg font-bold text-lilac-600 uppercase tracking-wider">
                Destinations
              </span>
            </h3>
            <p className="text-gray-400 text-xs mt-1 font-medium tracking-wide uppercase">
              {packagesWithCoords.length} locations available
            </p>
          </div>
          <Link
            to="/explore-map"
            className="mt-1 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            title="Full screen map">
            <Expand size={18} className="text-gray-500 dark:text-gray-400" />
          </Link>
        </div>

        {/* Map */}
        <div className="flex-grow relative bg-gray-50 dark:bg-slate-800">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="animate-spin text-lilac-600" size={32} />
            </div>
          ) : (
            <MapContainer
              center={[20, 0]}
              zoom={2}
              minZoom={2}
              maxBounds={[[-85, -180], [85, 180]]}
              maxBoundsViscosity={1.0}
              worldCopyJump={false}
              style={{ height: "100%", width: "100%" }}
              zoomControl={false}
              attributionControl={false}>
              <FlyToOnOpen />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url={tileUrl}
              />
              <MarkerClusterGroup
                chunkedLoading
                maxClusterRadius={35}
                spiderfyOnMaxZoom
                showCoverageOnHover={false}>
                {packagesWithCoords.map((pkg) => {
                  const coords = getCoordinates(pkg.destination);
                  if (!coords) return null;

                  return (
                    <Marker
                      key={pkg.id}
                      position={coords}
                      icon={createCustomIcon(pkg.category)}>
                      <Popup className="custom-popup" closeButton={false}>
                        <div className="w-52 p-1">
                          <div className="h-28 w-full mb-3 rounded-xl overflow-hidden bg-gray-100 relative group">
                            <img
                              src={pkg.images[0]}
                              alt={pkg.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                            <span className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-900 shadow-sm">
                              ₹{pkg.price_per_person.toLocaleString()}
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
              </MarkerClusterGroup>
            </MapContainer>
          )}
        </div>
      </div>
    </>
  );
}
