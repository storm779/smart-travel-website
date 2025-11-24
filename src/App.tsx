import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SupportChatbot from './components/SupportChatbot';
import Home from './pages/Home';
import Packages from './pages/Packages';
import PackageDetails from './pages/PackageDetails';
import SmartPlanner from './pages/SmartPlanner';
import ItineraryResults from './pages/ItineraryResults';
import Login from './pages/Login';
import BookPackage from './pages/BookPackage';
import BookCustomItinerary from './pages/BookCustomItinerary';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/packages/:id" element={<PackageDetails />} />
              <Route path="/packages/:id/book" element={<BookPackage />} />
              <Route path="/smart-planner" element={<SmartPlanner />} />
              <Route path="/itinerary-results" element={<ItineraryResults />} />
              <Route path="/book-custom" element={<BookCustomItinerary />} />
              <Route path="/login" element={<Login />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/booking-confirmation" element={<BookingConfirmation />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
          <SupportChatbot />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
