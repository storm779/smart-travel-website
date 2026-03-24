import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import AdminRoute from "./components/admin/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import Footer from "./components/Footer";
import FooterMinimal from "./components/FooterMinimal";
import SupportChatbot from "./components/SupportChatbot";
import PackageMapWidget from "./components/PackageMapWidget";
import PageLoader from "./components/PageLoader";

const Home = lazy(() => import("./pages/Home"));
const Packages = lazy(() => import("./pages/Packages"));
const PackageDetails = lazy(() => import("./pages/PackageDetails"));
const SmartPlanner = lazy(() => import("./pages/SmartPlanner"));
const ItineraryResults = lazy(() => import("./pages/ItineraryResults"));
const Login = lazy(() => import("./pages/Login"));
const BookPackage = lazy(() => import("./pages/BookPackage"));
const BookCustomItinerary = lazy(() => import("./pages/BookCustomItinerary"));
const BookingConfirmation = lazy(() => import("./pages/BookingConfirmation"));
const MyBookings = lazy(() => import("./pages/MyBookings"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const ExploreMap = lazy(() => import("./pages/ExploreMap"));
const Wishlist = lazy(() => import("./pages/Wishlist"));

// Admin pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminBookings = lazy(() => import("./pages/admin/AdminBookings"));
const AdminPackages = lazy(() => import("./pages/admin/AdminPackages"));
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews"));
const AdminContacts = lazy(() => import("./pages/admin/AdminContacts"));

function AppFooter() {
  const location = useLocation();
  if (location.pathname.startsWith("/admin")) return null;
  return location.pathname === "/" ? <Footer /> : <FooterMinimal />;
}

function AppExtras() {
  const location = useLocation();
  if (location.pathname.startsWith("/admin")) return null;
  return (
    <>
      <SupportChatbot />
      <PackageMapWidget />
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <TooltipProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route
                      path="/"
                      element={<Home />}
                    />
                    <Route
                      path="/packages"
                      element={<Packages />}
                    />
                    <Route
                      path="/packages/:id"
                      element={<PackageDetails />}
                    />
                    <Route
                      path="/packages/:id/book"
                      element={<BookPackage />}
                    />
                    <Route
                      path="/smart-planner"
                      element={<SmartPlanner />}
                    />
                    <Route
                      path="/itinerary-results"
                      element={<ItineraryResults />}
                    />
                    <Route
                      path="/book-custom"
                      element={<BookCustomItinerary />}
                    />
                    <Route
                      path="/login"
                      element={<Login />}
                    />
                    <Route
                      path="/my-bookings"
                      element={<MyBookings />}
                    />
                    <Route
                      path="/booking-confirmation"
                      element={<BookingConfirmation />}
                    />
                    <Route
                      path="/about"
                      element={<About />}
                    />
                    <Route
                      path="/contact"
                      element={<Contact />}
                    />
                    <Route
                      path="/explore-map"
                      element={<ExploreMap />}
                    />
                    <Route
                      path="/wishlist"
                      element={<Wishlist />}
                    />
                    <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="bookings" element={<AdminBookings />} />
                      <Route path="packages" element={<AdminPackages />} />
                      <Route path="reviews" element={<AdminReviews />} />
                      <Route path="contacts" element={<AdminContacts />} />
                    </Route>
                  </Routes>
                </Suspense>
              </main>
              <AppFooter />
              <AppExtras />
            </div>
          </Router>
              </TooltipProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
