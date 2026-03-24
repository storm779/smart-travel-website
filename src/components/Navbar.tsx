import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, User, LogOut, Plane, Sun, Moon, ChevronDown, Sparkles, Calendar, MapPin, Heart, Settings } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useWishlist } from "../hooks/useWishlist";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut, loading: authLoading, isAdmin } = useAuth();
  const [userName, setUserName] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const { wishlist } = useWishlist();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
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

          {/* Logo */}
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
              onHeroTransparent ? "text-white" : isDark ? "text-white" : "text-foreground"
            }`}>
              Travellah
            </span>
          </Link>

          {/* Center Nav (Desktop) */}
          <div className="hidden lg:flex items-center">
            <div className={`flex items-center gap-0.5 px-1.5 py-1.5 rounded-2xl transition-all duration-500 ${
              onHeroTransparent
                ? "bg-white/[0.08] backdrop-blur-sm"
                : isDark
                ? "bg-white/[0.04]"
                : "bg-muted/80"
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
                        : "bg-background text-lilac-700 shadow-sm"
                      : onHeroTransparent
                      ? "text-white/75 hover:text-white hover:bg-white/10"
                      : isDark
                      ? "text-muted-foreground hover:text-foreground hover:bg-white/[0.06]"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/60"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* AI Planner — Featured Link */}
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

          {/* Right Side (Desktop) */}
          <div className="hidden lg:flex items-center gap-1.5">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className={`rounded-xl transition-all duration-300 ${
                onHeroTransparent
                  ? "text-white/60 hover:text-white hover:bg-white/10"
                  : isDark
                  ? "text-muted-foreground hover:text-amber-400 hover:bg-white/[0.06]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
            </Button>

            {user && (
              <Link to="/wishlist" className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Wishlist"
                  className={`rounded-xl transition-all duration-300 ${
                    isActive("/wishlist")
                      ? onHeroTransparent
                        ? "bg-white/20 text-white"
                        : isDark
                        ? "bg-lilac-500/15 text-lilac-400"
                        : "bg-lilac-50 text-lilac-700"
                      : onHeroTransparent
                      ? "text-white/60 hover:text-white hover:bg-white/10"
                      : isDark
                      ? "text-muted-foreground hover:text-foreground hover:bg-white/[0.06]"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Heart className="h-[18px] w-[18px]" />
                </Button>
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 min-w-4 px-1 text-[10px] font-bold text-white bg-red-500 rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl transition-all duration-300 ${
                      onHeroTransparent
                        ? "hover:bg-white/10 text-white"
                        : isDark
                        ? "hover:bg-white/[0.06] text-foreground"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <Avatar size="sm" className="rounded-lg">
                      <AvatarFallback className={`rounded-lg text-xs font-bold ${
                        onHeroTransparent
                          ? "bg-white/20 text-white"
                          : isDark
                          ? "bg-gradient-to-br from-lilac-500/25 to-lilac-600/25 text-lilac-300 ring-1 ring-lilac-500/20"
                          : "bg-gradient-to-br from-lilac-100 to-lilac-50 text-lilac-700 ring-1 ring-lilac-200/60"
                      }`}>
                        {userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[13px] font-medium max-w-[100px] truncate">
                      {userName}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold truncate text-foreground">
                        {userName}
                      </p>
                      <p className="text-xs truncate text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/my-bookings" className="flex items-center gap-2.5 cursor-pointer">
                      <Calendar className="h-4 w-4 opacity-50" />
                      My Bookings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wishlist" className="flex items-center gap-2.5 cursor-pointer">
                      <Heart className="h-4 w-4 opacity-50" />
                      Wishlist
                      {wishlist.length > 0 && (
                        <span className="ml-auto flex items-center justify-center h-5 min-w-5 px-1.5 text-[11px] font-bold text-white bg-red-500 rounded-full">
                          {wishlist.length}
                        </span>
                      )}
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center gap-2.5 cursor-pointer">
                        <Settings className="h-4 w-4 opacity-50" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={handleSignOut}
                    className="flex items-center gap-2.5 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 opacity-60" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className={`rounded-xl text-[13px] font-medium transition-all duration-300 ${
                onHeroTransparent
                  ? "bg-white/15 backdrop-blur-sm text-white border border-white/20 hover:bg-white/25 hover:border-white/30"
                  : isDark
                  ? "bg-lilac-600 text-white hover:bg-lilac-500 shadow-lg shadow-lilac-600/20"
                  : "bg-foreground text-background hover:bg-foreground/90 shadow-lg shadow-foreground/15"
              }`}>
                <Link to="/login" className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5" />
                  Login
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Right Side */}
          <div className="lg:hidden flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className={`rounded-xl transition-all duration-300 ${
                onHeroTransparent
                  ? "text-white/70 hover:text-white"
                  : isDark
                  ? "text-muted-foreground hover:text-amber-400"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
            </Button>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-xl transition-all duration-300 ${
                    onHeroTransparent
                      ? "text-white/80 hover:text-white hover:bg-white/10"
                      : isDark
                      ? "text-muted-foreground hover:text-foreground hover:bg-white/[0.06]"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                showCloseButton={true}
                className={`w-[85vw] max-w-sm flex flex-col p-0 ${
                  isDark
                    ? "bg-gray-950 border-white/[0.06]"
                    : "bg-background border-border"
                }`}
              >
                {/* Mobile Header */}
                <SheetHeader className="flex-row items-center justify-between px-5 h-[4.25rem] flex-shrink-0 border-b-0">
                  <SheetTitle asChild>
                    <Link to="/" className="flex items-center gap-2.5" onClick={() => setIsOpen(false)}>
                      <div className={`flex items-center justify-center w-8 h-8 rounded-xl ${
                        isDark ? "bg-lilac-600/15" : "bg-lilac-50"
                      }`}>
                        <Plane className="h-[18px] w-[18px] text-lilac-500" />
                      </div>
                      <span className={`text-lg font-bold font-kugile ${isDark ? "text-white" : "text-foreground"}`}>
                        Travellah
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile Nav Links */}
                <div className="flex-1 px-4 pt-2 pb-6 overflow-y-auto">
                  <div className="flex flex-col gap-1">
                    {navLinks.map((link, i) => (
                      <motion.div
                        key={link.to}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + i * 0.04, duration: 0.3 }}
                      >
                        <SheetClose asChild>
                          <Link
                            to={link.to}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[15px] font-medium transition-all duration-200 ${
                              isActive(link.to)
                                ? isDark
                                  ? "bg-lilac-500/15 text-lilac-400"
                                  : "bg-lilac-50 text-lilac-700"
                                : isDark
                                ? "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                          >
                            {link.label}
                          </Link>
                        </SheetClose>
                      </motion.div>
                    ))}

                    {/* AI Planner — Featured (Mobile) */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + navLinks.length * 0.04, duration: 0.3 }}
                    >
                      <SheetClose asChild>
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
                        >
                          <Sparkles className="h-4 w-4" />
                          AI Planner
                        </Link>
                      </SheetClose>
                    </motion.div>
                  </div>

                  <Separator className={`my-5 ${isDark ? "bg-white/[0.06]" : ""}`} />

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
                          <Avatar className="rounded-xl w-10 h-10">
                            <AvatarFallback className={`rounded-xl text-sm font-bold ${
                              isDark
                                ? "bg-gradient-to-br from-lilac-500/25 to-lilac-600/25 text-lilac-300 ring-1 ring-lilac-500/20"
                                : "bg-gradient-to-br from-lilac-100 to-lilac-50 text-lilac-700 ring-1 ring-lilac-200/60"
                            }`}>
                              {userName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate text-foreground">
                              {userName}
                            </p>
                            <p className="text-xs truncate text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <SheetClose asChild>
                        <Link
                          to="/my-bookings"
                          className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[15px] font-medium transition-all duration-200 ${
                            isDark
                              ? "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <Calendar className="h-4 w-4 opacity-50" />
                          My Bookings
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          to="/wishlist"
                          className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[15px] font-medium transition-all duration-200 ${
                            isDark
                              ? "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <Heart className="h-4 w-4 opacity-50" />
                          Wishlist
                          {wishlist.length > 0 && (
                            <span className="ml-auto flex items-center justify-center h-5 min-w-5 px-1.5 text-[11px] font-bold text-white bg-red-500 rounded-full">
                              {wishlist.length}
                            </span>
                          )}
                        </Link>
                      </SheetClose>
                      {isAdmin && (
                        <SheetClose asChild>
                          <Link
                            to="/admin"
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[15px] font-medium transition-all duration-200 ${
                              isDark
                                ? "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                          >
                            <Settings className="h-4 w-4 opacity-50" />
                            Admin Dashboard
                          </Link>
                        </SheetClose>
                      )}
                      <Button
                        variant="ghost"
                        onClick={() => { handleSignOut(); setIsOpen(false); }}
                        className={`flex items-center gap-3 w-full justify-start px-4 py-3.5 rounded-xl text-[15px] font-medium h-auto transition-all duration-200 ${
                          isDark
                            ? "text-red-400/80 hover:bg-red-500/10 hover:text-red-400"
                            : "text-red-500/80 hover:bg-red-50 hover:text-red-600"
                        }`}
                      >
                        <LogOut className="h-4 w-4 opacity-60" />
                        Sign Out
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                    >
                      <SheetClose asChild>
                        <Button asChild className={`w-full rounded-xl text-[15px] font-medium h-auto py-3.5 transition-all duration-200 ${
                          isDark
                            ? "bg-lilac-600 text-white hover:bg-lilac-500"
                            : "bg-foreground text-background hover:bg-foreground/90"
                        }`}>
                          <Link to="/login" className="flex items-center justify-center gap-2">
                            <User className="h-4 w-4" />
                            Login / Sign Up
                          </Link>
                        </Button>
                      </SheetClose>
                    </motion.div>
                  )}
                </div>

                {/* Mobile Footer Accent */}
                <SheetFooter className="flex-shrink-0 px-5 py-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Explore India & beyond
                    </span>
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
