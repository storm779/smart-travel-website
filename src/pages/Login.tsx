import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Plane, Mail, Lock, User, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Reveal } from "../components/Reveal";

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
        if (signInError) {
          setError(signInError.message);
        } else {
          navigate(returnTo);
        }
      } else {
        if (!formData.fullName) {
          setError("Please enter your full name");
          setLoading(false);
          return;
        }
        const { error: signUpError } = await signUp(
          formData.email,
          formData.password,
          formData.fullName
        );
        if (signUpError) {
          setError(signUpError.message);
        } else {
          navigate(returnTo);
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20 transition-colors duration-200">
      <div className="max-w-md w-full">
        <Reveal>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-kugile text-gray-900 mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-gray-600">
              {isLogin
                ? "Sign in to continue your journey"
                : "Start planning your perfect trip today"}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="bg-white rounded-[2.5rem] shadow-xl p-8 transition-colors duration-200">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-6">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lilac-500 bg-gray-50 text-gray-900"
                      placeholder="Enter your full name"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lilac-500 bg-gray-50 text-gray-900"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lilac-500 bg-gray-50 text-gray-900"
                    placeholder="Enter your password"
                    required
                    minLength={6}
                  />
                </div>
                {!isLogin && (
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 6 characters long
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-lilac-600 hover:bg-lilac-700 text-white font-semibold py-3 rounded-xl transition disabled:bg-gray-400 disabled:cursor-not-allowed">
                {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="text-lilac-600 hover:text-lilac-700 font-medium">
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900">
              ← Back to Home
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
