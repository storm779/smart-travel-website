import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, Plane } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut, loading: authLoading } = useAuth();
  const [userName, setUserName] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

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

  const textColorClass = isHome ? "text-white" : "text-gray-900";
  const hoverClass = isHome ? "hover:text-lilac-300" : "hover:text-lilac-600";
  const buttonBorderClass = isHome ? "border-white" : "border-gray-900";
  const buttonHoverClass = isHome
    ? "hover:bg-white hover:text-gray-900"
    : "hover:bg-gray-900 hover:text-white";

  const navClass = "absolute w-full top-0 z-50 bg-transparent pt-6";

  const linkClass = `${textColorClass} ${hoverClass} uppercase tracking-widest text-xs font-medium transition-colors duration-300`;

  return (
    <nav className={navClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-2">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Plane className="h-10 w-10 " />
                <span className="text-2xl font-bold font-kugile text-white">SmartTravel</span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={linkClass}>
              Home
            </Link>
            <Link
              to="/about"
              className={linkClass}>
              About us
            </Link>
            <Link
              to="/smart-planner"
              className={linkClass}>
              Our services
            </Link>
            <Link
              to="/packages"
              className={linkClass}>
              Travel Packages
            </Link>

            {user ? (
              <div className="flex items-center space-x-6">
                <Link
                  to="/my-bookings"
                  className={linkClass}>
                  My Bookings
                </Link>
                {userName && (
                  <span
                    className={`font-semibold uppercase tracking-wider text-xs ${textColorClass}`}>
                    Hi, {userName}
                  </span>
                )}
                <button
                  onClick={handleSignOut}
                  className={`${linkClass} flex items-center space-x-1`}>
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className={`flex items-center space-x-2 px-6 py-2 rounded-full border ${buttonBorderClass} ${textColorClass} ${buttonHoverClass} transition-all duration-300 uppercase tracking-wider text-xs font-medium`}>
                <User className="h-3 w-3" />
                <span>Login</span>
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${textColorClass} hover:opacity-80`}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 text-white absolute w-full left-0 top-full">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md uppercase tracking-wider text-xs"
              onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link
              to="/packages"
              className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md uppercase tracking-wider text-xs"
              onClick={() => setIsOpen(false)}>
              Packages
            </Link>
            <Link
              to="/smart-planner"
              className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md uppercase tracking-wider text-xs"
              onClick={() => setIsOpen(false)}>
              Smart Planner
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md uppercase tracking-wider text-xs"
              onClick={() => setIsOpen(false)}>
              About
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md uppercase tracking-wider text-xs"
              onClick={() => setIsOpen(false)}>
              Contact
            </Link>
            {user ? (
              <>
                <Link
                  to="/my-bookings"
                  className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md uppercase tracking-wider text-xs"
                  onClick={() => setIsOpen(false)}>
                  My Bookings
                </Link>
                {userName && (
                  <div className="px-3 py-2 text-white font-semibold uppercase tracking-wider text-xs">
                    Hi, {userName}
                  </div>
                )}
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-white hover:bg-gray-800 rounded-md uppercase tracking-wider text-xs">
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 bg-white text-gray-900 rounded-md text-center uppercase tracking-wider text-xs font-medium mt-4"
                onClick={() => setIsOpen(false)}>
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
