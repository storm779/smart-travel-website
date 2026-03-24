import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Mail, Lock, User, AlertCircle, Loader2, Plane } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const returnTo = (location.state as any)?.returnTo || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const { error: signInError } = await signIn(formData.email, formData.password);
        if (signInError) setError(signInError.message);
        else navigate(returnTo);
      } else {
        if (!formData.fullName) {
          setError("Please enter your full name");
          setLoading(false);
          return;
        }
        // Need to add terms checkbox validation manually if we want to be strict, but HTML 'required' handles it.
        const { error: signUpError } = await signUp(formData.email, formData.password, formData.fullName);
        if (signUpError) setError(signUpError.message);
        else navigate(returnTo);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setFormData({ email: "", password: "", fullName: "" });
  };

  const FADE_UP_ANIMATION_VARIANTS: import("framer-motion").Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  };

  const imageSrc = isLogin 
    ? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2070" 
    : "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=2070";

  return (
    <div className="relative min-h-[100dvh] w-full flex items-center justify-center p-4 py-8 sm:p-8">
      <Helmet>
        <title>{isLogin ? "Login" : "Sign Up"} - Travellah</title>
        <meta name="description" content="Sign in or create an account for your personalized modern travel planning." />
      </Helmet>

      {/* Decorative Full Background */}
      <div className="fixed inset-0 z-0 bg-background">
        <img 
          src={isLogin ? "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2021" : "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=2070"} 
          alt="Atmospheric travel landscape" 
          className="w-full h-full object-cover blur-[14px] scale-110 opacity-30 dark:opacity-20 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-background/60 backdrop-blur-md" />
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        className={cn(
          "relative w-full max-w-[1024px] z-10 overflow-hidden rounded-[1.5rem] border border-border/40 bg-background/70 shadow-2xl backdrop-blur-2xl flex flex-col md:flex-row min-h-[600px]"
        )}
      >
        {/* Left column: Image & Branding */}
        <div className="relative w-full md:w-5/12 h-64 md:h-auto overflow-hidden flex-shrink-0">
          <AnimatePresence mode="popLayout">
            <motion.img
              key={imageSrc}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              src={imageSrc}
              alt="Welcome Banner"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
          
          {/* Logo overlay on the image */}
          <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-20">
            <Link to="/" className="flex items-center gap-2.5 group relative">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300 group-hover:scale-105 bg-white/20 backdrop-blur-md">
                <Plane className="h-[18px] w-[18px] transition-all duration-300 group-hover:rotate-12 text-white drop-shadow-sm" />
              </div>
              <span className="text-xl font-bold font-kugile tracking-wide transition-colors duration-300 text-white drop-shadow-md">
                Travellah
              </span>
            </Link>
          </div>

          <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 right-6 sm:right-10 text-white z-20">
            <h2 className="text-2xl sm:text-[1.75rem] font-bold font-kugile mb-3 leading-tight drop-shadow-lg tracking-tight">
              {isLogin ? "Capturing Moments, Creating Memories." : "Begin your curated journey today."}
            </h2>
            <p className="text-sm text-white/90 drop-shadow-md max-w-[19rem] hidden sm:block leading-relaxed">
              {isLogin 
                ? "Sign in to access your custom itineraries, track your bookings, and continue exploring the globe."
                : "Create an account to unlock AI-powered travel planning, save favorite destinations, and book unforgettable trips."}
            </p>
          </div>

          <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-20 hidden md:block">
            <Button variant="ghost" asChild className="h-9 px-4 rounded-full bg-white/10 hover:bg-white/20 text-white hover:text-white border border-white/20 backdrop-blur-md text-xs font-medium">
              <Link to="/">Back to website <span className="ml-1">→</span></Link>
            </Button>
          </div>
        </div>

        {/* Right column: Auth Form */}
        <div className="w-full md:w-7/12 p-8 sm:p-12 lg:p-16 relative flex flex-col justify-center bg-background/40">
          
          {/* Mobile only back button */}
          <div className="md:hidden absolute top-4 right-4 focus:outline-none">
             <Button variant="ghost" asChild className="h-8 px-3 rounded-full bg-foreground/5 hover:bg-foreground/10 text-xs font-medium text-muted-foreground">
              <Link to="/">Back <span className="ml-1">→</span></Link>
            </Button>
          </div>

          <div className="max-w-sm w-full mx-auto">
            {/* Main title and description */}
            <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="space-y-1 mb-8">
              <h1 className="font-bold text-3xl font-sans tracking-tight text-foreground drop-shadow-sm">
                {isLogin ? "Log In" : "Create an account"}
              </h1>
              <div className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button 
                  type="button" 
                  onClick={toggleAuthMode} 
                  className="text-[#8952e0] dark:text-[#a074e8] hover:text-[#7843c9] font-semibold underline underline-offset-4 decoration-[#8952e0]/30 hover:decoration-[#8952e0] transition-colors"
                >
                  {isLogin ? "Sign up" : "Log in"}
                </button>
              </div>
            </motion.div>

            {error && (
              <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="p-3 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-red-600 dark:text-red-400 text-left">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="relative overflow-hidden"
                  >
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      placeholder="Full Name"
                      className="pl-10 h-12 bg-background/50 border-input/60 focus-visible:ring-[#8952e0]/40 rounded-xl shadow-sm transition-all"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required={!isLogin}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Email Address"
                  className="pl-10 h-12 bg-background/50 border-input/60 focus-visible:ring-[#8952e0]/40 rounded-xl shadow-sm transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </motion.div>

              <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  className="pl-10 h-12 bg-background/50 border-input/60 focus-visible:ring-[#8952e0]/40 rounded-xl shadow-sm transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                />
              </motion.div>

              {!isLogin && (
                <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="flex items-center space-x-2.5 pt-1 pb-2">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    required
                    className="h-4 w-4 rounded border-gray-300 text-[#8952e0] focus:ring-[#8952e0] bg-background/50" 
                  />
                  <label htmlFor="terms" className="text-xs text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    I agree to the <a href="#" className="underline decoration-[#8952e0]/30 hover:decoration-[#8952e0] text-[#8952e0] dark:text-[#a074e8]">Terms & Conditions</a>
                  </label>
                </motion.div>
              )}

              <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="pt-3">
                <Button type="submit" className="w-full h-12 rounded-xl text-[15px] font-semibold tracking-wide shadow-md hover:shadow-lg transition-all bg-[#6e46b1] hover:bg-[#5b3896] text-white" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  {isLogin ? "Log In" : "Create account"}
                </Button>
              </motion.div>
              
              <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="relative py-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/60"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background/80 px-2 text-muted-foreground/70 font-medium">Or register with</span>
                </div>
              </motion.div>

              <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="grid grid-cols-2 gap-4">
                <Button type="button" variant="outline" className="h-[2.875rem] rounded-xl bg-background/60 border-input/60 hover:bg-background shadow-sm hover:shadow transition-all text-muted-foreground font-medium">
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Google
                </Button>
                <Button type="button" variant="outline" className="h-[2.875rem] rounded-xl bg-background/60 border-input/60 hover:bg-background shadow-sm hover:shadow transition-all text-muted-foreground font-medium">
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.79 3.59-.75 2.28.16 3.73 1.08 4.64 2.53-3.85 2.08-3.07 7.21.6 8.58-1.04 2.65-2.43 4.67-3.91 1.83zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  Apple
                </Button>
              </motion.div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
