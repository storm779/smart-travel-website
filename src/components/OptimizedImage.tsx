import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
}

const FALLBACK_IMAGE = "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=800";

export default function OptimizedImage({ src, alt, className = "" }: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const displaySrc = error ? FALLBACK_IMAGE : src;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Blurred placeholder */}
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        src={displaySrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (!error) setError(true);
        }}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
