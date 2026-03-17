import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { getCoordinates } from "../utils/coordinates";
import { useTheme } from "../contexts/ThemeContext";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface ItineraryDay {
  day: number;
  city: string;
  title: string;
  activities?: string[];
}

interface ItineraryMapViewProps {
  days: ItineraryDay[];
}

function createNumberedIcon(dayNumber: number) {
  return L.divIcon({
    html: `<div style="
      width: 30px; height: 30px; border-radius: 50%;
      background: linear-gradient(135deg, #7c3aed, #6d28d9);
      border: 3px solid white;
      display: flex; align-items: center; justify-content: center;
      color: white; font-size: 13px; font-weight: 700;
      box-shadow: 0 2px 10px rgba(124,58,237,0.4);
    ">${dayNumber}</div>`,
    className: "numbered-marker",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -18],
  });
}

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useMemo(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 });
    }
  }, [map, positions]);
  return null;
}

export default function ItineraryMapView({ days }: ItineraryMapViewProps) {
  const { isDark } = useTheme();

  // Resolve coordinates for each day, deduplicating consecutive same-city days
  const dayPoints = useMemo(() => {
    const points: { day: number; city: string; title: string; activities: string[]; coords: [number, number] }[] = [];

    for (const d of days) {
      const coords = getCoordinates(d.city);
      if (!coords) continue;

      // Skip if same city as previous point
      if (points.length > 0) {
        const prev = points[points.length - 1];
        if (prev.coords[0] === coords[0] && prev.coords[1] === coords[1]) {
          // Merge into previous point
          prev.activities = [...prev.activities, ...(d.activities || [])];
          continue;
        }
      }

      points.push({
        day: d.day,
        city: d.city,
        title: d.title,
        activities: d.activities || [],
        coords,
      });
    }
    return points;
  }, [days]);

  if (dayPoints.length === 0) return null;

  const positions = dayPoints.map((p) => p.coords);

  const tileUrl = isDark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  return (
    <div className="w-full h-[350px] md:h-[400px] rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700">
      <MapContainer
        center={positions[0]}
        zoom={6}
        minZoom={2}
        maxBounds={[[-85, -180], [85, 180]]}
        maxBoundsViscosity={1.0}
        worldCopyJump={false}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        attributionControl={false}>
        <FitBounds positions={positions} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={tileUrl}
        />

        {/* Route polyline */}
        <Polyline
          positions={positions}
          pathOptions={{
            color: "#7c3aed",
            weight: 3,
            opacity: 0.8,
            dashArray: "10, 8",
          }}
        />

        {/* Day markers */}
        {dayPoints.map((point, idx) => (
          <Marker
            key={idx}
            position={point.coords}
            icon={createNumberedIcon(point.day)}>
            <Popup closeButton={false}>
              <div className="p-1 min-w-[180px]">
                <p className="text-xs font-bold text-lilac-600 uppercase tracking-wide mb-1">
                  Day {point.day} — {point.city}
                </p>
                <p className="font-semibold text-gray-900 text-sm mb-1">{point.title}</p>
                {point.activities.length > 0 && (
                  <ul className="text-xs text-gray-600 space-y-0.5">
                    {point.activities.slice(0, 3).map((a, i) => (
                      <li key={i} className="truncate">• {a}</li>
                    ))}
                    {point.activities.length > 3 && (
                      <li className="text-gray-400">+{point.activities.length - 3} more</li>
                    )}
                  </ul>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
