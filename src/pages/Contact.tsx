import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { supabase } from "../lib/supabase";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    try {
      const { error } = await supabase.from("contact_messages").insert([formData]);

      if (error) throw error;

      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-28 pb-16 font-sans">
      <Helmet>
        <title>Contact Us - Travellah</title>
        <meta
          name="description"
          content="Get in touch with Travellah. Reach out for travel inquiries, bookings, and support."
        />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-light text-foreground mb-6 font-kugile italic">
              Contact{" "}
              <span className="text-primary">
                Us
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We're here to help. Reach out to us anytime.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-16">
          <Reveal delay={200}>
            <Card className="rounded-3xl hover:shadow-xl transition-all duration-300 text-center group border border-transparent hover:border-border h-full">
              <CardContent className="p-8">
                <Phone className="h-12 w-12 text-lilac mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-bold text-foreground mb-4 font-kugile">Phone</h3>
                <p className="text-muted-foreground mb-1">+91 98765 43210</p>
                <p className="text-muted-foreground">+91 98765 43211</p>
              </CardContent>
            </Card>
          </Reveal>

          <Reveal delay={400}>
            <Card className="rounded-3xl hover:shadow-xl transition-all duration-300 text-center group border border-transparent hover:border-border h-full">
              <CardContent className="p-8">
                <Mail className="h-12 w-12 text-lilac mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-bold text-foreground mb-4 font-kugile">Email</h3>
                <p className="text-muted-foreground mb-1">roychoudhary@smarttravel.com</p>
                <p className="text-muted-foreground">support@smarttravel.com</p>
              </CardContent>
            </Card>
          </Reveal>

          <Reveal delay={600}>
            <Card className="rounded-3xl hover:shadow-xl transition-all duration-300 text-center group border border-transparent hover:border-border h-full">
              <CardContent className="p-8">
                <Clock className="h-12 w-12 text-lilac mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-bold text-foreground mb-4 font-kugile">Working Hours</h3>
                <p className="text-muted-foreground mb-1">Mon - Sat: 9 AM - 9 PM</p>
                <p className="text-muted-foreground">Sunday: 10 AM - 6 PM</p>
              </CardContent>
            </Card>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <Reveal delay={200}>
            <Card className="rounded-[2.5rem] shadow-lg border border-border h-full">
              <CardContent className="p-10">
                <h2 className="text-3xl font-light text-foreground mb-8 font-kugile italic">
                  Send us a Message
                </h2>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Your email"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Your phone number"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      rows={4}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-foreground hover:bg-lilac text-background font-bold py-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2">
                    {loading ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="h-5 w-5" />
                      </>
                    )}
                  </Button>

                  {status === "success" && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-xl">
                      <CheckCircle className="h-5 w-5" />
                      <span>Message sent successfully! We'll get back to you soon.</span>
                    </div>
                  )}

                  {status === "error" && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl">
                      <AlertCircle className="h-5 w-5" />
                      <span>Something went wrong. Please try again later.</span>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </Reveal>

          <Reveal delay={400}>
            <Card className="rounded-[2.5rem] shadow-lg border border-border h-full">
              <CardContent className="p-10 flex flex-col h-full">
                <h2 className="text-3xl font-light text-foreground mb-8 font-kugile italic">
                  Our Office
                </h2>
                <div className="flex flex-col gap-8 flex-1">
                  <div className="flex items-start gap-4">
                    <div className="bg-lilac/10 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-lilac flex-shrink-0" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-2 text-lg font-kugile">Address</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        123 Travel Street, Andheri West
                        <br />
                        Mumbai, Maharashtra 400001
                        <br />
                        India
                      </p>
                    </div>
                  </div>

                  <div className="aspect-video bg-muted rounded-3xl overflow-hidden shadow-inner">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.1160992238!2d72.71637344999999!3d19.082177549999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1234567890"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"></iframe>
                  </div>

                  <div>
                    <h3 className="font-bold text-foreground mb-4 text-lg font-kugile">Quick Links</h3>
                    <ul className="flex flex-col gap-3 text-muted-foreground">
                      <li className="flex items-center gap-2 hover:text-lilac cursor-pointer transition-colors">
                        <span className="w-1.5 h-1.5 bg-lilac rounded-full"></span>
                        <span>FAQ</span>
                      </li>
                      <li className="flex items-center gap-2 hover:text-lilac cursor-pointer transition-colors">
                        <span className="w-1.5 h-1.5 bg-lilac rounded-full"></span>
                        <span>Cancellation Policy</span>
                      </li>
                      <li className="flex items-center gap-2 hover:text-lilac cursor-pointer transition-colors">
                        <span className="w-1.5 h-1.5 bg-lilac rounded-full"></span>
                        <span>Terms & Conditions</span>
                      </li>
                      <li className="flex items-center gap-2 hover:text-lilac cursor-pointer transition-colors">
                        <span className="w-1.5 h-1.5 bg-lilac rounded-full"></span>
                        <span>Privacy Policy</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
