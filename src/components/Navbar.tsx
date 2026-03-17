import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, Plane, Sun, Moon, ChevronDown, Sparkles, Calendar, MapPin } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
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
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

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

  const onHeroTransparent = isHome && !scrolled;

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/packages", label: "Packages" },
    { to: "/explore-map", label: "Explore Map" },
    { to: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav
        className={`fixed w-full top-0 z-50 transition-all duration-500 ${
          onHeroTransparent
            ? "bg-transparent"
            : isDark
            ? "bg-gray-950/80 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_1px_30px_rgba(0,0,0,0.3)]"
            : "bg-white/80 backdrop-blur-2xl border-b border-gray-900/[0.06] shadow-[0_1px_30px_rgba(0,0,0,0.04)]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex justify-between h-[4.25rem] items-center">

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-2.5 group relative z-10">
              <div className={`relative flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300 group-hover:scale-105 ${
                onHeroTransparent
                  ? "bg-white/15 backdrop-blur-sm"
                  : isDark
                  ? "bg-lilac-600/15"
                  : "bg-lilac-50"
              }`}>
                <Plane className={`h-[18px] w-[18px] transition-all duration-300 group-hover:rotate-12 ${
                  onHeroTransparent ? "text-white" : "text-lilac-500"
                }`} />
              </div>
              <span className={`text-lg font-bold font-kugile tracking-tight transition-colors duration-300 ${
                onHeroTransparent ? "text-white" : isDark ? "text-white" : "text-gray-900"
              }`}>
                Travellah
              </span>
            </Link>

            {/* ── Center Nav (Desktop) ── */}
            <div className="hidden lg:flex items-center">
              <div className={`flex items-center gap-0.5 px-1.5 py-1.5 rounded-2xl transition-all duration-500 ${
                onHeroTransparent
                  ? "bg-white/[0.08] backdrop-blur-sm"
                  : isDark
                  ? "bg-white/[0.04]"
                  : "bg-gray-100/80"
              }`}>
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative px-4 py-[7px] rounded-xl text-[13px] font-medium tracking-wide transition-all duration-300 ${
                      isActive(link.to)
                        ? onHeroTransparent
                          ? "bg-white/20 text-white shadow-sm"
                          : isDark
                          ? "bg-lilac-500/15 text-lilac-400 shadow-sm"
                          : "bg-white text-lilac-700 shadow-sm"
                        : onHeroTransparent
                        ? "text-white/75 hover:text-white hover:bg-white/10"
                        : isDark
                        ? "text-gray-400 hover:text-gray-200 hover:bg-white/[0.06]"
                        : "text-gray-500 hover:text-gray-900 hover:bg-white/60"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* ── AI Planner — Featured Link ── */}
                <Link
                  to="/smart-planner"
                  className={`relative flex items-center gap-1.5 px-4 py-[7px] rounded-xl text-[13px] font-medium tracking-wide transition-all duration-300 ${
                    isActive("/smart-planner")
                      ? onHeroTransparent
                        ? "bg-white/25 text-white shadow-sm"
                        : isDark
                        ? "bg-lilac-500/20 text-lilac-300 shadow-sm"
                        : "bg-lilac-100 text-lilac-700 shadow-sm"
                      : onHeroTransparent
                      ? "text-lilac-200 hover:text-white hover:bg-white/10"
                      : isDark
                      ? "text-lilac-400 hover:text-lilac-300 hover:bg-lilac-500/10"
                      : "text-lilac-600 hover:text-lilac-700 hover:bg-lilac-50"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Planner
                </Link>
              </div>
            </div>

            {/* ── Right Side (Desktop) ── */}
            <div className="hidden lg:flex items-center gap-1.5">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                className={`relative p-2.5 rounded-xl transition-all duration-300 ${
                  onHeroTransparent
                    ? "text-white/60 hover:text-white hover:bg-white/10"
                    : isDark
                    ? "text-gray-500 hover:text-amber-400 hover:bg-white/[0.06]"
                    : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isDark ? "sun" : "moon"}
                    initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
                  </motion.div>
                </AnimatePresence>
              </button>

              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl transition-all duration-300 ${
                      onHeroTransparent
                        ? "hover:bg-white/10 text-white"
                        : isDark
                        ? "hover:bg-white/[0.06] text-gray-200"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      onHeroTransparent
                        ? "bg-white/20 text-white"
                        : isDark
                        ? "bg-gradient-to-br from-lilac-500/25 to-lilac-600/25 text-lilac-300 ring-1 ring-lilac-500/20"
                        : "bg-gradient-to-br from-lilac-100 to-lilac-50 text-lilac-700 ring-1 ring-lilac-200/60"
                    }`}>
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-[13px] font-medium max-w-[100px] truncate">
                      {userName}
                    </span>
                    <ChevronDown className={`h-3.5 w-3.5 opacity-50 transition-transform duration-300 ${showUserMenu ? "rotate-180" : ""}`} />
                  </button>

                  {/* User Dropdown */}
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                        className={`absolute right-0 top-full mt-2 w-56 rounded-2xl shadow-xl overflow-hidden border ${
                          isDark
                            ? "bg-gray-900 border-white/10 shadow-black/40"
                            : "bg-white border-gray-200/80 shadow-gray-200/50"
                        }`}
                      >
                        <div className={`px-4 py-3.5 ${
                          isDark
                            ? "bg-gradient-to-r from-lilac-900/30 to-transparent border-b border-white/[0.06]"
                            : "bg-gradient-to-r from-lilac-50/80 to-transparent border-b border-gray-100"
                        }`}>
                          <p className={`text-sm font-semibold truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                            {userName}
                          </p>
                          <p className={`text-xs truncate mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                            {user.email}
                          </p>
                        </div>

                        <div className="py-1.5 px-1.5">
                          <Link
                            to="/my-bookings"
                            onClick={() => setShowUserMenu(false)}
                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                              isDark
                                ? "text-gray-300 hover:bg-white/[0.06] hover:text-white"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            <Calendar className="h-4 w-4 opacity-50" />
                            My Bookings
                          </Link>
                          <button
                            onClick={handleSignOut}
                            className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                              isDark
                                ? "text-red-400/80 hover:bg-red-500/10 hover:text-red-400"
                                : "text-red-500/80 hover:bg-red-50 hover:text-red-600"
                            }`}
                          >
                            <LogOut className="h-4 w-4 opacity-60" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[13px] font-medium transition-all duration-300 ${
                    onHeroTransparent
                      ? "bg-white/15 backdrop-blur-sm text-white border border-white/20 hover:bg-white/25 hover:border-white/30"
                      : isDark
                      ? "bg-lilac-600 text-white hover:bg-lilac-500 shadow-lg shadow-lilac-600/20"
                      : "bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-900/15"
                  }`}
                >
                  <User className="h-3.5 w-3.5" />
                  Login
                </Link>
              )}
            </div>

            {/* ── Mobile Right Side ── */}
            <div className="lg:hidden flex items-center gap-1">
              <button
                onClick={toggleTheme}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                className={`p-2.5 rounded-xl transition-all duration-300 ${
                  onHeroTransparent
                    ? "text-white/70 hover:text-white"
                    : isDark
                    ? "text-gray-400 hover:text-amber-400"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2.5 rounded-xl transition-all duration-300 ${
                  onHeroTransparent
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : isDark
                    ? "text-gray-400 hover:text-white hover:bg-white/[0.06]"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu Overlay ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={`fixed top-0 right-0 bottom-0 z-50 w-[85vw] max-w-sm lg:hidden flex flex-col overflow-y-auto ${
                isDark
                  ? "bg-gray-950 border-l border-white/[0.06]"
                  : "bg-white border-l border-gray-100"
              }`}
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between px-5 h-[4.25rem] flex-shrink-0">
                <Link to="/" className="flex items-center gap-2.5" onClick={() => setIsOpen(false)}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-xl ${
                    isDark ? "bg-lilac-600/15" : "bg-lilac-50"
                  }`}>
                    <Plane className="h-[18px] w-[18px] text-lilac-500" />
                  </div>
                  <span className={`text-lg font-bold font-kugile ${isDark ? "text-white" : "text-gray-900"}`}>
                    Travellah
                  </span>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-2.5 rounded-xl transition-all duration-200 ${
                    isDark
                      ? "text-gray-500 hover:text-white hover:bg-white/[0.06]"
                      : "text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Nav Links */}
              <div className="flex-1 px-4 pt-2 pb-6">
                <div className="space-y-1">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.04, duration: 0.3 }}
                    >
                      <Link
                        to={link.to}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[15px] font-medium transition-all duration-200 ${
                          isActive(link.to)
                            ? isDark
                              ? "bg-lilac-500/15 text-lilac-400"
                              : "bg-lilac-50 text-lilac-700"
                            : isDark
                            ? "text-gray-300 hover:bg-white/[0.04] hover:text-white"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}

                  {/* AI Planner — Featured (Mobile) */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + navLinks.length * 0.04, duration: 0.3 }}
                  >
                    <Link
                      to="/smart-planner"
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[15px] font-medium transition-all duration-200 ${
                        isActive("/smart-planner")
                          ? isDark
                            ? "bg-lilac-500/20 text-lilac-300"
                            : "bg-lilac-100 text-lilac-700"
                          : isDark
                          ? "text-lilac-400 hover:bg-lilac-500/10"
                          : "text-lilac-600 hover:bg-lilac-50"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Sparkles className="h-4 w-4" />
                      AI Planner
                    </Link>
                  </motion.div>
                </div>

                {/* Divider */}
                <div className={`my-5 h-px ${isDark ? "bg-white/[0.06]" : "bg-gray-100"}`} />

                {/* User Section (Mobile) */}
                {user ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    <div className={`px-4 py-3 rounded-xl mb-2 ${
                      isDark
                        ? "bg-gradient-to-r from-lilac-900/20 to-transparent"
                        : "bg-gradient-to-r from-lilac-50/80 to-transparent"
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                          isDark
                            ? "bg-gradient-to-br from-lilac-500/25 to-lilac-600/25 text-lilac-300 ring-1 ring-lilac-500/20"
                            : "bg-gradient-to-br from-lilac-100 to-lilac-50 text-lilac-700 ring-1 ring-lilac-200/60"
                        }`}>
                          {userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-semibold truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                            {userName}
                          </p>
                          <p className={`text-xs truncate ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Link
                      to="/my-bookings"
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[15px] font-medium transition-all duration-200 ${
                        isDark
                          ? "text-gray-300 hover:bg-white/[0.04] hover:text-white"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Calendar className="h-4 w-4 opacity-50" />
                      My Bookings
                    </Link>
                    <button
                      onClick={() => { handleSignOut(); setIsOpen(false); }}
                      className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-[15px] font-medium transition-all duration-200 ${
                        isDark
                          ? "text-red-400/80 hover:bg-red-500/10 hover:text-red-400"
                          : "text-red-500/80 hover:bg-red-50 hover:text-red-600"
                      }`}
                    >
                      <LogOut className="h-4 w-4 opacity-60" />
                      Sign Out
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    <Link
                      to="/login"
                      className={`flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl text-[15px] font-medium transition-all duration-200 ${
                        isDark
                          ? "bg-lilac-600 text-white hover:bg-lilac-500"
                          : "bg-gray-900 text-white hover:bg-gray-800"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Login / Sign Up
                    </Link>
                  </motion.div>
                )}
              </div>

              {/* Mobile Footer Accent */}
              <div className={`flex-shrink-0 px-5 py-4 border-t ${
                isDark ? "border-white/[0.06]" : "border-gray-100"
              }`}>
                <div className="flex items-center gap-2">
                  <MapPin className={`h-3.5 w-3.5 ${isDark ? "text-gray-600" : "text-gray-300"}`} />
                  <span className={`text-xs ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                    Explore India & beyond
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
