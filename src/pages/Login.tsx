import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Plane, Mail, Lock, User, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Reveal } from "../components/Reveal";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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

  const handleTabChange = (value: string) => {
    setIsLogin(value === "signin");
    setError("");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-20 transition-colors duration-200">
      <Helmet>
        <title>Login - Travellah</title>
        <meta name="description" content="Sign in to your Travellah account to manage bookings and create personalized itineraries." />
      </Helmet>
      <div className="max-w-md w-full">
        <Reveal>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-kugile text-foreground mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-muted-foreground">
              {isLogin
                ? "Sign in to continue your journey"
                : "Start planning your perfect trip today"}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <Card className="rounded-[2.5rem] shadow-xl transition-colors duration-200">
            <CardContent className="p-8">
              <Tabs
                value={isLogin ? "signin" : "signup"}
                onValueChange={handleTabChange}
                className="mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
              </Tabs>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6">
                {!isLogin && (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <Input
                        id="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="pl-10"
                        placeholder="Enter your full name"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10"
                      placeholder="Enter your password"
                      required
                      minLength={6}
                    />
                  </div>
                  {!isLogin && (
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 6 characters long
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-lilac-600 hover:bg-lilac-700 text-white font-semibold py-6 rounded-xl transition">
                  {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-6 text-center">
            <Button variant="link" asChild>
              <Link to="/" className="text-muted-foreground hover:text-foreground">
                ← Back to Home
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
