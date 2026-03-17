import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, Plane, Sun, Moon, ChevronDown } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { useTheme } from "../contexts/ThemeContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut, loading: authLoading } = useAuth();
  const [userName, setUserName] = useState<string>("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!authLoading && user) {
      loadUserProfile();
    } else if (!user) {
      setUserName("");
    }
  }, [user, authLoading]);

  const loadUserProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();

    if (data?.full_name) {
      setUserName(data.full_name);
    } else {
      const emailName = user.email?.split("@")[0] || "User";
      setUserName(emailName.charAt(0).toUpperCase() + emailName.slice(1));
    }
  };

  const handleSignOut = async () => {
    setShowUserMenu(false);
    await signOut();
    navigate("/");
  };

  const navBg = scrolled
    ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100/50"
    : isHome
    ? "bg-transparent"
    : "bg-white/80 backdrop-blur-xl";

  const textColor = scrolled || !isHome ? "text-gray-800" : "text-white";
  const logoColor = scrolled || !isHome ? "text-gray-900" : "text-white";
  const hoverColor = scrolled || !isHome ? "hover:text-lilac-600" : "hover:text-white/70";

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/smart-planner", label: "AI Planner" },
    { to: "/packages", label: "Packages" },
    { to: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <Plane className={`h-7 w-7 ${logoColor} transition-transform duration-300 group-hover:rotate-12`} />
            <span className={`text-xl font-bold font-kugile ${logoColor} transition-colors`}>
              Travellah
            </span>
          </Link>

          {/* Center Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-full text-[13px] font-medium tracking-wide transition-all duration-300 ${
                  isActive(link.to)
                    ? scrolled || !isHome
                      ? "bg-lilac-50 text-lilac-700"
                      : "bg-white/15 text-white"
                    : `${textColor} ${hoverColor}`
                }`}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all duration-300 ${
                scrolled || !isHome
                  ? "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
              title={isDark ? "Light mode" : "Dark mode"}>
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
                    scrolled || !isHome
                      ? "hover:bg-gray-100 text-gray-700"
                      : "hover:bg-white/10 text-white"
                  }`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    scrolled || !isHome
                      ? "bg-lilac-100 text-lilac-700"
                      : "bg-white/20 text-white"
                  }`}>
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[13px] font-medium max-w-[100px] truncate">
                    {userName}
                  </span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`} />
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-fade-in">
                    <div className="px-4 py-2 border-b border-gray-50">
                      <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/my-bookings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                      My Bookings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className={`flex items-center space-x-1.5 px-5 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ${
                  scrolled || !isHome
                    ? "bg-gray-900 text-white hover:bg-lilac-600"
                    : "bg-white/15 backdrop-blur-sm text-white border border-white/30 hover:bg-white/25"
                }`}>
                <User className="h-3.5 w-3.5" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${textColor}`}>
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-full ${textColor} hover:opacity-80`}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition ${
                  isActive(link.to)
                    ? "bg-lilac-50 text-lilac-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setIsOpen(false)}>
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <div className="px-4 py-2">
                    <p className="text-sm font-semibold text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Link
                    to="/my-bookings"
                    className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}>
                    My Bookings
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50">
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-gray-100 mt-2 pt-3 px-2">
                <Link
                  to="/login"
                  className="block w-full text-center px-4 py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-lilac-600 transition"
                  onClick={() => setIsOpen(false)}>
                  Login / Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
