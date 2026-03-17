import { useState, useEffect, useRef, useCallback, useMemo, lazy, Suspense } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import {
  Map as MapIcon,
  ArrowRight,
  Loader2,
  Filter,
  X,
  Star,
  Clock,
  IndianRupee,
  Search,
  ChevronLeft,
  Globe as GlobeIcon,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase, Package } from "../lib/supabase";
import { getCoordinates } from "../utils/coordinates";
import { useTheme } from "../contexts/ThemeContext";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Globe = lazy(() => import("react-globe.gl"));

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function createCustomIcon(category: "domestic" | "international", isActive: boolean) {
  const color = category === "domestic" ? "#7c3aed" : "#2563eb";
  const bgColor = category === "domestic" ? "#ede9fe" : "#dbeafe";
  const size = isActive ? 38 : 30;

  return L.divIcon({
    html: `<div style="
      width: ${size}px; height: ${size}px; border-radius: 50% 50% 50% 0;
      background: ${color}; border: 3px solid ${isActive ? "#fbbf24" : bgColor};
      transform: rotate(-45deg); display: flex; align-items: center; justify-content: center;
      box-shadow: 0 3px 10px rgba(0,0,0,${isActive ? 0.5 : 0.25});
      transition: all 0.3s ease;
    "><div style="transform: rotate(45deg); color: white; font-size: ${isActive ? 14 : 11}px; font-weight: bold;">
      ${category === "domestic" ? "D" : "I"}
    </div></div>`,
    className: "custom-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

const THEMES = ["Adventure", "Beach", "Heritage", "Wildlife", "Honeymoon", "Pilgrimage", "Hill Station", "City"];

function FlyToLocation({ coords, zoom }: { coords: [number, number] | null; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, zoom || 6, { duration: 1.2 });
    }
  }, [map, coords, zoom]);
  return null;
}

// Image slideshow component for sidebar cards
function SlideshowImage({ images, title }: { images: string[]; title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startSlideshow = useCallback(() => {
    if (images.length <= 1) return;
    setIsHovering(true);
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 1200);
  }, [images.length]);

  const stopSlideshow = useCallback(() => {
    setIsHovering(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentIndex(0);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div
      className="w-28 h-[82px] rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-slate-700 relative"
      onMouseEnter={startSlideshow}
      onMouseLeave={stopSlideshow}>
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`${title} ${idx + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            idx === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
        />
      ))}
      {isHovering && images.length > 1 && (
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1">
          {images.slice(0, 5).map((_, idx) => (
            <span
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex % Math.min(images.length, 5)
                  ? "bg-white w-3"
                  : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// 3D Globe component
function GlobeView({
  packages,
  selectedPkg,
  onSelectPkg,
  isDark,
}: {
  packages: (Package & { coords: [number, number] })[];
  selectedPkg: string | null;
  onSelectPkg: (id: string) => void;
  isDark: boolean;
}) {
  const globeRef = useRef<any>(null);
  const [hoverPkg, setHoverPkg] = useState<Package | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // India center
  const INDIA_CENTER = { lat: 20.5937, lng: 78.9629, altitude: 1.8 };

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.pointOfView(INDIA_CENTER, 1500);
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  // Stop auto-rotate on interaction
  const handleInteraction = useCallback(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = false;
    }
  }, []);

  const pointsData = useMemo(
    () =>
      packages.map((pkg) => ({
        lat: pkg.coords[0],
        lng: pkg.coords[1],
        size: selectedPkg === pkg.id ? 0.4 : 0.2,
        color: pkg.category === "domestic" ? "#7c3aed" : "#2563eb",
        id: pkg.id,
        pkg,
      })),
    [packages, selectedPkg]
  );

  // Arcs from India center to each destination
  const arcsData = useMemo(
    () =>
      packages.map((pkg) => ({
        startLat: INDIA_CENTER.lat,
        startLng: INDIA_CENTER.lng,
        endLat: pkg.coords[0],
        endLng: pkg.coords[1],
        color: pkg.category === "domestic" ? ["#7c3aed40", "#7c3aed"] : ["#2563eb40", "#2563eb"],
      })),
    [packages]
  );

  // Ring data for selected package
  const ringsData = useMemo(() => {
    if (!selectedPkg) return [];
    const pkg = packages.find((p) => p.id === selectedPkg);
    if (!pkg) return [];
    return [{ lat: pkg.coords[0], lng: pkg.coords[1], maxR: 3, propagationSpeed: 2, repeatPeriod: 800 }];
  }, [packages, selectedPkg]);

  // Labels
  const labelsData = useMemo(
    () =>
      packages.map((pkg) => ({
        lat: pkg.coords[0],
        lng: pkg.coords[1],
        text: pkg.destination,
        size: 0.6,
        color: isDark ? "#e2e8f0" : "#1e293b",
        id: pkg.id,
      })),
    [packages, isDark]
  );

  return (
    <div className="w-full h-full relative" onMouseDown={handleInteraction}>
      <Suspense
        fallback={
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-slate-900">
            <Loader2 className="animate-spin text-lilac-600" size={36} />
          </div>
        }>
        <Globe
          ref={globeRef}
          globeImageUrl={
            isDark
              ? "//unpkg.com/three-globe/example/img/earth-night.jpg"
              : "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          }
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl={isDark ? "//unpkg.com/three-globe/example/img/night-sky.png" : ""}
          backgroundColor={isDark ? "#0f172a" : "#f8fafc"}
          atmosphereColor={isDark ? "#6d28d9" : "#3b82f6"}
          atmosphereAltitude={0.2}
          pointsData={pointsData}
          pointLat="lat"
          pointLng="lng"
          pointAltitude={0.01}
          pointRadius="size"
          pointColor="color"
          onPointClick={(point: any) => onSelectPkg(point.id)}
          onPointHover={(point: any, _prevPoint: any, event: MouseEvent) => {
            if (point) {
              setHoverPkg(point.pkg);
              setTooltipPos({ x: event.clientX, y: event.clientY });
            } else {
              setHoverPkg(null);
            }
          }}
          arcsData={arcsData}
          arcStartLat="startLat"
          arcStartLng="startLng"
          arcEndLat="endLat"
          arcEndLng="endLng"
          arcColor="color"
          arcDashLength={0.4}
          arcDashGap={0.2}
          arcDashAnimateTime={2000}
          arcStroke={0.5}
          ringsData={ringsData}
          ringLat="lat"
          ringLng="lng"
          ringMaxRadius="maxR"
          ringPropagationSpeed="propagationSpeed"
          ringRepeatPeriod="repeatPeriod"
          ringColor={() => isDark ? "#a78bfa80" : "#7c3aed60"}
          labelsData={labelsData}
          labelLat="lat"
          labelLng="lng"
          labelText="text"
          labelSize="size"
          labelColor="color"
          labelDotRadius={0.3}
          labelAltitude={0.015}
          labelResolution={2}
        />
      </Suspense>

      {/* Hover tooltip */}
      {hoverPkg && (
        <div
          className="fixed z-50 pointer-events-none bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 p-3 min-w-[200px]"
          style={{ left: tooltipPos.x + 15, top: tooltipPos.y - 10 }}>
          <p className="font-bold text-sm text-gray-900 dark:text-white">{hoverPkg.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
            <MapPin size={10} /> {hoverPkg.destination}
          </p>
          <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-0.5">
              <Star size={10} className="text-amber-500" fill="currentColor" />
              {hoverPkg.rating}
            </span>
            <span>{hoverPkg.duration_days}D/{hoverPkg.duration_nights}N</span>
            <span className="font-bold text-gray-900 dark:text-white">₹{hoverPkg.price_per_person.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExploreMap() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPkg, setSelectedPkg] = useState<string | null>(null);
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");
  const { isDark } = useTheme();

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<"all" | "domestic" | "international">("all");
  const [themeFilter, setThemeFilter] = useState<string>("all");
  const [budgetMax, setBudgetMax] = useState<number>(0);

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    setLoading(true);
    const { data } = await supabase.from("packages").select("*").eq("is_active", true);
    if (data) {
      setPackages(data);
      const maxPrice = Math.max(...data.map((p) => p.price_per_person));
      setBudgetMax(maxPrice);
    }
    setLoading(false);
  };

  const filteredPackages = packages.filter((pkg) => {
    if (categoryFilter !== "all" && pkg.category !== categoryFilter) return false;
    if (themeFilter !== "all" && !pkg.theme.toLowerCase().includes(themeFilter.toLowerCase())) return false;
    if (budgetMax > 0 && pkg.price_per_person > budgetMax) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !pkg.title.toLowerCase().includes(q) &&
        !pkg.destination.toLowerCase().includes(q) &&
        !pkg.theme.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  const packagesWithCoords = filteredPackages.filter((pkg) => getCoordinates(pkg.destination) !== null);

  // For globe view — packages with resolved coords
  const packagesForGlobe = useMemo(
    () =>
      packagesWithCoords.map((pkg) => ({
        ...pkg,
        coords: getCoordinates(pkg.destination)!,
      })),
    [packagesWithCoords]
  );

  const handleCardClick = (pkg: Package) => {
    const coords = getCoordinates(pkg.destination);
    if (coords) {
      setSelectedPkg(pkg.id);
      setFlyTarget(coords);
    }
  };

  const handleMarkerClick = (pkgId: string) => {
    setSelectedPkg(pkgId);
    const card = cardRefs.current[pkgId];
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const tileUrl = isDark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  const maxPrice = packages.length > 0 ? Math.max(...packages.map((p) => p.price_per_person)) : 100000;

  return (
    <>
      <Helmet>
        <title>Explore Destinations on Map | Smart Travel</title>
        <meta name="description" content="Explore travel destinations on an interactive map. Find packages by location, theme, and budget." />
      </Helmet>

      <div className="h-screen flex flex-col pt-16">
        <div className="flex-grow flex relative overflow-hidden">
          {/* Sidebar */}
          <div
            className={`transition-all duration-300 ${
              sidebarOpen ? "w-full md:w-[400px]" : "w-0"
            } flex-shrink-0 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col overflow-hidden z-10`}>

            {/* Header */}
            <div className="px-4 pt-4 pb-3 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-3">
                <Link
                  to="/packages"
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                  <ChevronLeft size={18} className="text-gray-500 dark:text-gray-400" />
                </Link>
                <h2 className="font-kugile text-xl text-gray-900 dark:text-white">Explore Map</h2>
                <div className="ml-auto flex items-center gap-1.5">
                  {/* 2D / 3D toggle */}
                  <div className="flex bg-gray-100 dark:bg-slate-800 rounded-lg p-0.5">
                    <button
                      onClick={() => setViewMode("2d")}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                        viewMode === "2d"
                          ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                      }`}>
                      <MapIcon size={13} className="inline mr-1" />
                      2D
                    </button>
                    <button
                      onClick={() => setViewMode("3d")}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                        viewMode === "3d"
                          ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                      }`}>
                      <GlobeIcon size={13} className="inline mr-1" />
                      3D
                    </button>
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-2 rounded-xl border transition-colors ${
                      showFilters
                        ? "bg-lilac-600 text-white border-lilac-600"
                        : "bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-slate-700 hover:bg-gray-50"
                    }`}>
                    <Filter size={16} />
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search destinations, themes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-lilac-500 text-gray-900 dark:text-white placeholder:text-gray-400"
                />
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="mt-3 space-y-3 animate-fade-in">
                  <div className="flex gap-1.5">
                    {(["all", "domestic", "international"] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                          categoryFilter === cat
                            ? "bg-lilac-600 text-white"
                            : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
                        }`}>
                        {cat === "all" ? "All" : cat}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    <button
                      onClick={() => setThemeFilter("all")}
                      className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                        themeFilter === "all"
                          ? "bg-lilac-600 text-white"
                          : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400"
                      }`}>
                      All
                    </button>
                    {THEMES.map((theme) => (
                      <button
                        key={theme}
                        onClick={() => setThemeFilter(theme)}
                        className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                          themeFilter === theme
                            ? "bg-lilac-600 text-white"
                            : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400"
                        }`}>
                        {theme}
                      </button>
                    ))}
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>Max Budget</span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">₹{budgetMax.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={maxPrice}
                      step={1000}
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(Number(e.target.value))}
                      className="w-full accent-lilac-600 h-1.5"
                    />
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-400 font-medium mt-2">
                {packagesWithCoords.length} destination{packagesWithCoords.length !== 1 ? "s" : ""} on map
              </p>
            </div>

            {/* Package cards */}
            <div className="flex-grow overflow-y-auto p-3 space-y-2">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="animate-spin text-lilac-600" size={28} />
                </div>
              ) : packagesWithCoords.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <MapIcon size={36} className="mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No destinations match your filters</p>
                </div>
              ) : (
                packagesWithCoords.map((pkg) => (
                  <div
                    key={pkg.id}
                    ref={(el) => { cardRefs.current[pkg.id] = el; }}
                    onClick={() => handleCardClick(pkg)}
                    className={`flex gap-3 p-2.5 rounded-2xl cursor-pointer transition-all duration-200 border group ${
                      selectedPkg === pkg.id
                        ? "bg-lilac-50 dark:bg-lilac-900/20 border-lilac-300 dark:border-lilac-600 shadow-md ring-1 ring-lilac-200 dark:ring-lilac-800"
                        : "bg-white dark:bg-slate-800/80 border-gray-100 dark:border-slate-700 hover:shadow-md hover:border-gray-200 dark:hover:border-slate-600"
                    }`}>
                    {/* Slideshow Image */}
                    <SlideshowImage images={pkg.images} title={pkg.title} />

                    {/* Info */}
                    <div className="flex-grow min-w-0 py-0.5">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-[13px] line-clamp-1 leading-tight">
                        {pkg.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                        <MapIcon size={9} /> {pkg.destination}
                        <span className="ml-1 px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-700 text-[10px] font-medium capitalize">
                          {pkg.category}
                        </span>
                      </p>
                      <div className="flex items-center gap-2.5 mt-2 text-[11px] text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-0.5">
                          <Star size={10} className="text-amber-500" fill="currentColor" />
                          {pkg.rating}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Clock size={9} />
                          {pkg.duration_days}D/{pkg.duration_nights}N
                        </span>
                        <span className="flex items-center gap-0.5 font-bold text-gray-800 dark:text-white text-xs">
                          <IndianRupee size={10} />
                          {pkg.price_per_person.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/packages/${pkg.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="self-center p-2 rounded-xl bg-gray-900 dark:bg-lilac-600 text-white hover:bg-lilac-600 dark:hover:bg-lilac-700 transition-all flex-shrink-0 opacity-70 group-hover:opacity-100">
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`absolute top-4 z-20 md:hidden p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-slate-700 transition-all ${
              sidebarOpen ? "left-[calc(100%-3rem)]" : "left-4"
            }`}>
            {sidebarOpen ? <X size={18} /> : <Filter size={18} />}
          </button>

          {/* Map / Globe area */}
          <div className="flex-grow relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-slate-900">
                <div className="text-center">
                  <Loader2 className="animate-spin text-lilac-600 mx-auto mb-3" size={36} />
                  <p className="text-sm text-gray-400">Loading destinations...</p>
                </div>
              </div>
            ) : viewMode === "3d" ? (
              /* 3D Globe View */
              <GlobeView
                packages={packagesForGlobe}
                selectedPkg={selectedPkg}
                onSelectPkg={handleMarkerClick}
                isDark={isDark}
              />
            ) : (
              /* 2D Map View */
              <MapContainer
                center={[20.5937, 78.9629]}
                zoom={4}
                minZoom={2}
                maxZoom={18}
                maxBounds={[[-85, -180], [85, 180]]}
                maxBoundsViscosity={1.0}
                worldCopyJump={false}
                style={{ height: "100%", width: "100%" }}
                zoomControl={true}
                attributionControl={false}>
                <FlyToLocation coords={flyTarget} />
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
                        icon={createCustomIcon(pkg.category, selectedPkg === pkg.id)}
                        eventHandlers={{
                          click: () => handleMarkerClick(pkg.id),
                        }}>
                        <Popup className="custom-popup" closeButton={false}>
                          <div className="w-56 p-1">
                            <div className="h-32 w-full mb-2.5 rounded-xl overflow-hidden bg-gray-100 relative group">
                              <img
                                src={pkg.images[0]}
                                alt={pkg.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                              <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-semibold capitalize text-gray-700">
                                {pkg.category}
                              </span>
                              <span className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-gray-900">
                                ₹{pkg.price_per_person.toLocaleString()}
                              </span>
                            </div>
                            <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">
                              {pkg.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2.5">
                              <span className="flex items-center gap-0.5">
                                <Star size={10} className="text-amber-500" fill="currentColor" />
                                {pkg.rating}
                              </span>
                              <span>{pkg.duration_days}D/{pkg.duration_nights}N</span>
                              <span className="capitalize">{pkg.theme}</span>
                            </div>
                            <Link
                              to={`/packages/${pkg.id}`}
                              className="block text-center text-xs bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-lilac-600 transition-all font-medium">
                              View Details <ArrowRight size={10} className="inline ml-1" />
                            </Link>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MarkerClusterGroup>
              </MapContainer>
            )}

            {/* Legend — only show on 2D map */}
            {viewMode === "2d" && (
              <div className="absolute bottom-5 right-5 z-10 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl px-3.5 py-2.5 shadow-lg border border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shadow-sm" />
                    Domestic
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm" />
                    International
                  </div>
                </div>
              </div>
            )}

            {/* 3D Globe legend */}
            {viewMode === "3d" && (
              <div className="absolute bottom-5 right-5 z-10 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg border border-gray-200 dark:border-slate-700">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                    Domestic
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    International
                  </div>
                  <p className="text-[10px] text-gray-400 pt-1 border-t border-gray-200 dark:border-slate-700">
                    Click a point to select • Drag to rotate
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
