import { useState } from "react";

interface DestinationCard {
  name: string;
  image: string;
  tagline: string;
}

const destinations: DestinationCard[] = [
  { name: "Goa", image: "https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg?auto=compress&cs=tinysrgb&w=800", tagline: "Sun, Sand & Serenity" },
  { name: "Kerala", image: "https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=800", tagline: "God's Own Country" },
  { name: "Rajasthan", image: "https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=800", tagline: "Land of Kings" },
  { name: "Maldives", image: "https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800", tagline: "Paradise on Earth" },
  { name: "Bali", image: "https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=800", tagline: "Island of Gods" },
  { name: "Dubai", image: "https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg?auto=compress&cs=tinysrgb&w=800", tagline: "City of Gold" },
  { name: "Thailand", image: "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800", tagline: "Land of Smiles" },
];

export function ExpandCards() {
  const [activeIndex, setActiveIndex] = useState(3);

  return (
    <div className="w-full">
      {/* Desktop: expand-on-hover horizontal cards */}
      <div className="hidden lg:flex gap-3 h-80">
        {destinations.map((dest, i) => {
          const isActive = i === activeIndex;
          return (
            <div
              key={dest.name}
              onMouseEnter={() => setActiveIndex(i)}
              className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-in-out"
              style={{ flex: isActive ? "0 0 24rem" : "1 1 0%" }}
            >
              {/* Background image */}
              <img
                src={dest.image}
                alt={dest.name}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Gradient overlay */}
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                  isActive
                    ? "bg-gradient-to-t from-black/70 via-black/10 to-transparent"
                    : "bg-gradient-to-t from-black/50 via-black/20 to-black/10"
                }`}
              />

              {/* Expanded content */}
              <div
                className={`absolute bottom-0 left-0 right-0 p-6 transition-all duration-500 ${
                  isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h3 className="text-3xl font-kugile text-white font-bold mb-1">
                  {dest.name}
                </h3>
                <p className="text-white/70 text-sm">{dest.tagline}</p>
              </div>

              {/* Collapsed: vertical text */}
              <div
                className={`absolute inset-0 flex items-end justify-center pb-4 transition-all duration-500 ${
                  isActive ? "opacity-0" : "opacity-100"
                }`}
              >
                <span
                  className="text-white font-kugile text-sm font-bold tracking-wider"
                  style={{
                    writingMode: "vertical-rl",
                    textOrientation: "mixed",
                  }}
                >
                  {dest.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: 2x2 grid of first 4 destinations */}
      <div className="grid grid-cols-2 gap-3 lg:hidden">
        {destinations.slice(0, 4).map((dest) => (
          <div
            key={dest.name}
            className="relative rounded-2xl overflow-hidden h-48"
          >
            <img
              src={dest.image}
              alt={dest.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-lg font-kugile text-white font-bold">
                {dest.name}
              </h3>
              <p className="text-white/60 text-xs">{dest.tagline}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
