import { Link } from "react-router-dom";
import { Plane, Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const links = [
  { label: "About", to: "/about" },
  { label: "Packages", to: "/packages" },
  { label: "Contact", to: "/contact" },
  { label: "Privacy", to: "/legal" },
  { label: "Terms", to: "/legal" },
];

export default function FooterMinimal() {
  return (
    <footer className="bg-background">
      <Separator />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <Plane className="h-4 w-4 text-lilac-400 transition-transform group-hover:rotate-12" />
          <span className="text-sm font-bold font-kugile text-foreground">Travellah</span>
        </Link>

        {/* Links */}
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-muted-foreground text-xs flex items-center gap-1">
          &copy; {new Date().getFullYear()} Travellah
          <span className="mx-1">&middot;</span>
          Made with <Heart size={10} className="text-lilac-500" fill="currentColor" /> in India
        </p>
      </div>
    </footer>
  );
}
