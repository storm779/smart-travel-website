import { Award, Users, Heart, Globe } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { CountUp } from "../components/CountUp";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function About() {
  return (
    <div className="min-h-screen bg-background pt-28 pb-16 font-sans">
      <Helmet>
        <title>About Us - Travellah</title>
        <meta name="description" content="Learn about Travellah - your trusted travel partner for cultural, religious, and adventure travel across India and worldwide." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-light text-foreground mb-6 font-kugile italic">
              About{" "}
              <span className="text-primary">
                SmartTravel
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Your trusted partner in creating unforgettable travel experiences across India
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Reveal delay={200}>
            <Card className="rounded-3xl ring-0 border border-transparent hover:border-border hover:shadow-xl transition-all duration-300 text-center group bg-muted/50">
              <CardContent className="p-8">
                <Award className="h-12 w-12 text-lilac mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-4xl font-bold text-foreground mb-2 font-kugile">
                  <CountUp end={15} suffix="+" />
                </h3>
                <p className="text-muted-foreground uppercase tracking-wide text-sm font-medium">
                  Industry Experience
                </p>
              </CardContent>
            </Card>
          </Reveal>
          <Reveal delay={400}>
            <Card className="rounded-3xl ring-0 border border-transparent hover:border-border hover:shadow-xl transition-all duration-300 text-center group bg-muted/50">
              <CardContent className="p-8">
                <Users className="h-12 w-12 text-lilac mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-4xl font-bold text-foreground mb-2 font-kugile">
                  <CountUp end={50000} suffix="+" />
                </h3>
                <p className="text-muted-foreground uppercase tracking-wide text-sm font-medium">
                  Happy Travelers
                </p>
              </CardContent>
            </Card>
          </Reveal>
          <Reveal delay={600}>
            <Card className="rounded-3xl ring-0 border border-transparent hover:border-border hover:shadow-xl transition-all duration-300 text-center group bg-muted/50">
              <CardContent className="p-8">
                <Globe className="h-12 w-12 text-lilac mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-4xl font-bold text-foreground mb-2 font-kugile">
                  <CountUp end={200} suffix="+" />
                </h3>
                <p className="text-muted-foreground uppercase tracking-wide text-sm font-medium">
                  Destinations
                </p>
              </CardContent>
            </Card>
          </Reveal>
          <Reveal delay={800}>
            <Card className="rounded-3xl ring-0 border border-transparent hover:border-border hover:shadow-xl transition-all duration-300 text-center group bg-muted/50">
              <CardContent className="p-8">
                <Heart className="h-12 w-12 text-lilac mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-4xl font-bold text-foreground mb-2 font-kugile">4.8/5</h3>
                <p className="text-muted-foreground uppercase tracking-wide text-sm font-medium">
                  Customer Rating
                </p>
              </CardContent>
            </Card>
          </Reveal>
        </div>

        <Reveal>
          <Card className="rounded-[2.5rem] ring-0 border-0 shadow-sm mb-12 bg-muted/50">
            <CardContent className="p-10 md:p-16">
              <h2 className="text-4xl md:text-5xl font-light text-foreground mb-8 font-kugile italic">
                Our Story
              </h2>
              <Separator className="mb-8" />
              <div className="flex flex-col gap-6 text-muted-foreground leading-relaxed text-lg">
                <p>
                  Founded in 2009, SmartTravel began with a simple mission: to make travel planning
                  effortless and accessible to everyone. What started as a small team of travel
                  enthusiasts has grown into India's leading smart travel platform, serving thousands
                  of travelers every month.
                </p>
                <p>
                  We specialize in creating personalized travel experiences that blend cultural
                  immersion, spiritual journeys, and adventure. From the sacred ghats of Varanasi to
                  the majestic peaks of Ladakh, from heritage walks through Rajasthan to serene
                  backwaters of Kerala, we curate journeys that leave lasting impressions.
                </p>
                <p>
                  Our innovative AI-powered itinerary planner revolutionizes travel planning by
                  generating customized trips based on your preferences, budget, and interests.
                  Whether you're seeking a spiritual retreat, an adventure expedition, or a cultural
                  exploration, we have the perfect journey waiting for you.
                </p>
              </div>
            </CardContent>
          </Card>
        </Reveal>

        <Reveal>
          <Card className="rounded-[2.5rem] ring-0 border border-border shadow-lg bg-card">
            <CardContent className="p-10 md:p-16">
              <h2 className="text-4xl md:text-5xl font-light text-foreground mb-4 font-kugile italic text-center">
                Why Choose Us
              </h2>
              <Separator className="mb-10" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className="bg-lilac/10 text-lilac border-lilac/20 h-auto px-3 py-1">Expert</Badge>
                    <h3 className="text-2xl font-bold text-foreground font-kugile group-hover:text-lilac transition-colors">
                      Expert Local Knowledge
                    </h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Our team consists of travel experts with deep knowledge of Indian destinations,
                    ensuring authentic and enriching experiences.
                  </p>
                </div>
                <div className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className="bg-lilac/10 text-lilac border-lilac/20 h-auto px-3 py-1">AI</Badge>
                    <h3 className="text-2xl font-bold text-foreground font-kugile group-hover:text-lilac transition-colors">
                      AI-Powered Planning
                    </h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Our smart planner uses advanced algorithms to create personalized itineraries
                    matching your exact preferences and budget.
                  </p>
                </div>
                <div className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className="bg-lilac/10 text-lilac border-lilac/20 h-auto px-3 py-1">24/7</Badge>
                    <h3 className="text-2xl font-bold text-foreground font-kugile group-hover:text-lilac transition-colors">
                      24/7 Support
                    </h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Round-the-clock customer support ensures you're never alone during your journey,
                    with assistance always just a call away.
                  </p>
                </div>
                <div className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className="bg-lilac/10 text-lilac border-lilac/20 h-auto px-3 py-1">Best Price</Badge>
                    <h3 className="text-2xl font-bold text-foreground font-kugile group-hover:text-lilac transition-colors">
                      Best Price Guarantee
                    </h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Competitive pricing without compromising on quality, with flexible options for
                    every budget range.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </div>
  );
}
