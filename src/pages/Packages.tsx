import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Search, Filter, MapPin, Calendar, Star, ArrowRight, Globe, Home, Sparkles, X, Mic, MicOff, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase, Package as PackageType } from "../lib/supabase";
import { Reveal } from "../components/Reveal";
import { parseSearchQuery, formatParsedFilters } from "../services/geminiSearchService";
import { isGeminiAvailable } from "../services/geminiApi";
import { PackageCardSkeleton } from "../components/Skeleton";
import { useSpeechToText } from "../hooks/useSpeechToText";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import WishlistButton from "../components/WishlistButton";

const PACKAGES_PER_PAGE = 12;

export default function Packages() {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "domestic" | "international">(
    "all"
  );
  const [filters, setFilters] = useState({
    destination: "",
    theme: "",
    minPrice: "",
    maxPrice: "",
    minDuration: "",
    maxDuration: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [smartSearchChips, setSmartSearchChips] = useState<string[]>([]);
  const [isSmartSearching, setIsSmartSearching] = useState(false);
  const [smartFilters, setSmartFilters] = useState<{
    theme?: string;
    maxPrice?: number;
    minPrice?: number;
    minDuration?: number;
    maxDuration?: number;
    category?: "domestic" | "international";
  } | null>(null);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const themes = ["adventure", "honeymoon", "family", "cultural", "religious", "beach", "heritage"];

  useEffect(() => {
    loadPackages();
  }, []);

  useEffect(() => {
    applyFilters();
    setCurrentPage(1);
  }, [packages, searchTerm, filters, selectedCategory, smartFilters]);

  const handleSmartSearch = useCallback(
    (query: string) => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
      searchDebounceRef.current = setTimeout(async () => {
        if (!query.trim()) {
          setSmartSearchChips([]);
          return;
        }
        setIsSmartSearching(true);
        const parsed = await parseSearchQuery(query);
        setIsSmartSearching(false);
        if (parsed && Object.keys(parsed).length > 0) {
          setSmartSearchChips(formatParsedFilters(parsed));
          setSmartFilters(parsed);
          if (parsed.category) {
            setSelectedCategory(parsed.category);
          }
        } else {
          setSmartSearchChips([]);
          setSmartFilters(null);
        }
      }, 600);
    },
    []
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setSmartFilters(null);
      setSmartSearchChips([]);
      return;
    }
    if (isGeminiAvailable()) {
      handleSmartSearch(value);
    }
  }, [handleSmartSearch]);

  const onSpeechResult = useCallback((text: string) => {
    handleSearchChange(text);
  }, [handleSearchChange]);

  const { isListening, isSupported: isSpeechSupported, startListening, stopListening, isProcessing: isSpeechProcessing } =
    useSpeechToText(onSpeechResult);

  const loadPackages = async () => {
    const { data } = await supabase
      .from("packages")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (data) {
      setPackages(data);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...packages];

    if (selectedCategory !== "all") {
      filtered = filtered.filter((pkg) => pkg.category === selectedCategory);
    }

    // Smart search mode: use AI-parsed filters directly
    if (smartFilters) {
      if (smartFilters.theme) {
        filtered = filtered.filter((pkg) => pkg.theme.toLowerCase() === smartFilters.theme!.toLowerCase());
      }
      if (smartFilters.maxPrice) {
        filtered = filtered.filter((pkg) => pkg.price_per_person <= smartFilters.maxPrice!);
      }
      if (smartFilters.minPrice) {
        filtered = filtered.filter((pkg) => pkg.price_per_person >= smartFilters.minPrice!);
      }
      if (smartFilters.minDuration) {
        filtered = filtered.filter((pkg) => pkg.duration_days >= smartFilters.minDuration!);
      }
      if (smartFilters.maxDuration) {
        filtered = filtered.filter((pkg) => pkg.duration_days <= smartFilters.maxDuration!);
      }
      setFilteredPackages(filtered);
      return;
    }

    // Regular text search mode
    if (searchTerm) {
      filtered = filtered.filter(
        (pkg) =>
          pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.destination) {
      filtered = filtered.filter((pkg) => pkg.destination.toLowerCase() === filters.destination.toLowerCase());
    }

    if (filters.theme) {
      filtered = filtered.filter((pkg) => pkg.theme.toLowerCase() === filters.theme.toLowerCase());
    }

    if (filters.minPrice) {
      filtered = filtered.filter((pkg) => pkg.price_per_person >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter((pkg) => pkg.price_per_person <= parseFloat(filters.maxPrice));
    }

    if (filters.minDuration) {
      filtered = filtered.filter((pkg) => pkg.duration_days >= parseInt(filters.minDuration));
    }

    if (filters.maxDuration) {
      filtered = filtered.filter((pkg) => pkg.duration_days <= parseInt(filters.maxDuration));
    }

    setFilteredPackages(filtered);
  };

  const resetFilters = () => {
    setFilters({
      destination: "",
      theme: "",
      minPrice: "",
      maxPrice: "",
      minDuration: "",
      maxDuration: "",
    });
    setSearchTerm("");
    setSelectedCategory("all");
    setSmartFilters(null);
    setSmartSearchChips([]);
  };

  const domesticPackages = filteredPackages.filter((pkg) => pkg.category === "domestic");
  const internationalPackages = filteredPackages.filter((pkg) => pkg.category === "international");

  // Pagination logic
  const totalPages = Math.ceil(filteredPackages.length / PACKAGES_PER_PAGE);
  const paginatedPackages = useMemo(() => {
    const start = (currentPage - 1) * PACKAGES_PER_PAGE;
    return filteredPackages.slice(start, start + PACKAGES_PER_PAGE);
  }, [filteredPackages, currentPage]);

  const paginatedDomestic = useMemo(() => {
    const start = (currentPage - 1) * PACKAGES_PER_PAGE;
    const pageItems = filteredPackages.slice(start, start + PACKAGES_PER_PAGE);
    return pageItems.filter((pkg) => pkg.category === "domestic");
  }, [filteredPackages, currentPage]);

  const paginatedInternational = useMemo(() => {
    const start = (currentPage - 1) * PACKAGES_PER_PAGE;
    const pageItems = filteredPackages.slice(start, start + PACKAGES_PER_PAGE);
    return pageItems.filter((pkg) => pkg.category === "international");
  }, [filteredPackages, currentPage]);

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const PackageCard = ({ pkg }: { pkg: PackageType }) => {
    const defaultImage = "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg";
    const imageUrl = pkg.images && pkg.images.length > 0 ? pkg.images[0] : defaultImage;

    return (
      <Link
        to={`/packages/${pkg.id}`}
        className="group block relative rounded-xl overflow-hidden h-[340px] cursor-pointer shadow-md hover:shadow-[0_8px_40px_-8px_rgba(150,73,150,0.35)] transition-all duration-500">
        {/* Full-bleed image */}
        <img
          src={imageUrl}
          alt={pkg.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/20" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Top row: theme badge + rating/wishlist */}
        <div className="absolute top-0 left-0 right-0 p-3 flex items-start justify-between">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide uppercase text-white/90 bg-white/10 backdrop-blur-xl border border-white/20">
            {pkg.theme}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold text-white bg-white/10 backdrop-blur-xl border border-white/20">
              <Star className="size-3 text-amber-400 fill-amber-400" />
              {pkg.rating}
            </span>
            <WishlistButton
              packageId={pkg.id}
              className="size-7 bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20"
            />
          </div>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2">
          <h3 className="text-xl font-semibold text-white font-kugile leading-tight line-clamp-1 drop-shadow-lg">
            {pkg.title}
          </h3>

          <div className="flex items-center gap-3 text-white/70 text-xs">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3" />
              {pkg.destination}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-3" />
              {pkg.duration_days}D/{pkg.duration_nights}N
            </span>
          </div>

          <div className="flex items-end justify-between pt-1">
            <div>
              <span className="text-2xl font-bold text-white tracking-tight">
                ₹{pkg.price_per_person.toLocaleString("en-IN")}
              </span>
              <span className="text-white/50 text-xs ml-1">/ person</span>
            </div>
            <div className="size-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <ArrowRight className="size-4 text-white" />
            </div>
          </div>
        </div>
      </Link>
    );
  };

  const PaginationControls = () => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-xl gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">...</span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page as number)}
              className={`rounded-xl min-w-9 ${currentPage === page ? "bg-foreground text-background" : ""}`}
            >
              {page}
            </Button>
          )
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-xl gap-1"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pt-28 pb-16 font-sans">
      <Helmet>
        <title>Travel Packages - Travellah</title>
        <meta name="description" content="Browse curated domestic and international travel packages. Adventure, honeymoon, family, cultural, religious tours and more." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-12 text-center">
            <h1 className="text-5xl md:text-6xl font-light text-foreground mb-6 font-kugile italic">
              Tour{" "}
              <span className="text-primary">
                Packages
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore our curated collection of travel experiences across India and around the world
            </p>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="mb-12 bg-muted p-2 rounded-[2rem] border border-border shadow-sm">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative flex-1 flex items-center">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder={isGeminiAvailable() ? 'Try "beach vacation under 50k for 5 days"' : "Search packages, destinations..."}
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className={`w-full pl-14 ${isSpeechSupported ? "pr-14" : "pr-6"} py-4 h-auto bg-card border-none rounded-[1.5rem] focus-visible:ring-2 focus-visible:ring-lilac/20 text-foreground placeholder:text-muted-foreground shadow-sm`}
                />
                {isSpeechSupported && (
                  <button
                    onClick={isListening ? stopListening : startListening}
                    disabled={isSpeechProcessing}
                    className={`absolute right-4 p-2 rounded-full transition-all duration-300 ${
                      isListening
                        ? "bg-red-500 text-white animate-pulse"
                        : isSpeechProcessing
                        ? "bg-lilac-100 text-lilac-600 animate-pulse"
                        : "text-muted-foreground hover:text-lilac-600 hover:bg-lilac-50"
                    }`}
                    title={isListening ? "Stop recording" : isSpeechProcessing ? "Transcribing..." : "Search by voice"}>
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>
                )}
              </div>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant={showFilters ? "default" : "outline"}
                className={`flex items-center justify-center gap-2 px-8 py-4 h-auto rounded-[1.5rem] transition-all duration-300 ${
                  showFilters
                    ? "bg-lilac text-white shadow-lg hover:bg-lilac/90"
                    : "bg-card text-foreground hover:bg-muted shadow-sm"
                }`}>
                <Filter className="h-5 w-5" />
                <span className="font-medium">Filters</span>
              </Button>
            </div>

            {/* Smart Search Chips */}
            {(smartSearchChips.length > 0 || isSmartSearching) && (
              <div className="px-6 pt-3 pb-1 flex items-center gap-2 flex-wrap">
                {isSmartSearching ? (
                  <span className="text-xs text-lilac-600 flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 animate-pulse" />
                    Understanding your search...
                  </span>
                ) : (
                  <>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-lilac-500" />
                      Understood as:
                    </span>
                    {smartSearchChips.map((chip) => (
                      <Badge
                        key={chip}
                        variant="secondary"
                        className="gap-1 bg-lilac-100 text-lilac-700 px-3 py-1 rounded-full font-medium h-auto">
                        {chip}
                        <button
                          onClick={() => {
                            setSmartSearchChips((prev) => prev.filter((c) => c !== chip));
                          }}
                          className="hover:text-lilac-900">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </>
                )}
              </div>
            )}

            {showFilters && (
              <Card className="mt-2 rounded-[1.5rem] shadow-inner animate-fade-in border-none">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3 ml-1">
                        Theme
                      </label>
                      <Select
                        value={filters.theme || "all"}
                        onValueChange={(value) => setFilters({ ...filters, theme: value === "all" ? "" : value })}>
                        <SelectTrigger className="w-full bg-muted border-none rounded-xl px-4 py-3 h-auto">
                          <SelectValue placeholder="All Themes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Themes</SelectItem>
                          {themes.map((theme) => (
                            <SelectItem key={theme} value={theme}>
                              {theme.charAt(0).toUpperCase() + theme.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3 ml-1">
                        Budget (INR ₹)
                      </label>
                      <div className="flex gap-3">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={filters.minPrice}
                          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                          className="w-1/2 bg-muted border-none rounded-xl px-4 py-3 h-auto focus-visible:ring-2 focus-visible:ring-lilac/20"
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          value={filters.maxPrice}
                          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                          className="w-1/2 bg-muted border-none rounded-xl px-4 py-3 h-auto focus-visible:ring-2 focus-visible:ring-lilac/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3 ml-1">
                        Duration (Days)
                      </label>
                      <div className="flex gap-3">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={filters.minDuration}
                          onChange={(e) => setFilters({ ...filters, minDuration: e.target.value })}
                          className="w-1/2 bg-muted border-none rounded-xl px-4 py-3 h-auto focus-visible:ring-2 focus-visible:ring-lilac/20"
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          value={filters.maxDuration}
                          onChange={(e) => setFilters({ ...filters, maxDuration: e.target.value })}
                          className="w-1/2 bg-muted border-none rounded-xl px-4 py-3 h-auto focus-visible:ring-2 focus-visible:ring-lilac/20"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={resetFilters}
                      variant="ghost"
                      className="text-lilac hover:text-purple-600 font-medium px-4 py-2 rounded-lg hover:bg-purple-50">
                      Reset Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </Reveal>

        <Reveal delay={300}>
          <div className="mb-10 flex justify-center gap-4 flex-wrap">
            <Button
              onClick={() => setSelectedCategory("all")}
              variant={selectedCategory === "all" ? "default" : "outline"}
              className={`flex items-center gap-2 px-8 py-3 h-auto rounded-full font-medium transition-all duration-300 ${
                selectedCategory === "all"
                  ? "bg-foreground text-background shadow-lg scale-105"
                  : "bg-card text-muted-foreground hover:bg-muted border-border"
              }`}>
              <span>All Packages</span>
            </Button>
            <Button
              onClick={() => setSelectedCategory("domestic")}
              variant={selectedCategory === "domestic" ? "default" : "outline"}
              className={`flex items-center gap-2 px-8 py-3 h-auto rounded-full font-medium transition-all duration-300 ${
                selectedCategory === "domestic"
                  ? "bg-foreground text-background shadow-lg scale-105"
                  : "bg-card text-muted-foreground hover:bg-muted border-border"
              }`}>
              <Home className="h-4 w-4" />
              <span>Domestic</span>
            </Button>
            <Button
              onClick={() => setSelectedCategory("international")}
              variant={selectedCategory === "international" ? "default" : "outline"}
              className={`flex items-center gap-2 px-8 py-3 h-auto rounded-full font-medium transition-all duration-300 ${
                selectedCategory === "international"
                  ? "bg-foreground text-background shadow-lg scale-105"
                  : "bg-card text-muted-foreground hover:bg-muted border-border"
              }`}>
              <Globe className="h-4 w-4" />
              <span>International</span>
            </Button>
          </div>
        </Reveal>

        <div className="mb-6 text-center">
          <p className="text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredPackages.length}</span>{" "}
            packages
            {totalPages > 1 && (
              <span> &middot; Page {currentPage} of {totalPages}</span>
            )}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <PackageCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="text-center py-24 bg-muted rounded-[2.5rem]">
            <p className="text-muted-foreground text-xl mb-4">No packages found matching your criteria.</p>
            <Button
              onClick={resetFilters}
              variant="link"
              className="text-lilac hover:text-purple-600 font-medium">
              Clear all filters
            </Button>
          </div>
        ) : selectedCategory === "all" ? (
          <>
            {paginatedDomestic.length > 0 && (
              <div className="mb-16">
                <Reveal>
                  <div className="flex items-center gap-4 mb-10">
                    <Separator className="flex-1" />
                    <div className="flex items-center gap-3">
                      <Home className="h-6 w-6 text-lilac" />
                      <h2 className="text-3xl font-light font-kugile italic text-foreground">
                        Domestic Packages
                      </h2>
                    </div>
                    <Separator className="flex-1" />
                  </div>
                </Reveal>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {paginatedDomestic.map((pkg, index) => (
                    <Reveal
                      key={pkg.id}
                      delay={index * 80}>
                      <PackageCard pkg={pkg} />
                    </Reveal>
                  ))}
                </div>
              </div>
            )}

            {paginatedInternational.length > 0 && (
              <div>
                <Reveal>
                  <div className="flex items-center gap-4 mb-10">
                    <Separator className="flex-1" />
                    <div className="flex items-center gap-3">
                      <Globe className="h-6 w-6 text-lilac" />
                      <h2 className="text-3xl font-light font-kugile italic text-foreground">
                        International Packages
                      </h2>
                    </div>
                    <Separator className="flex-1" />
                  </div>
                </Reveal>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {paginatedInternational.map((pkg, index) => (
                    <Reveal
                      key={pkg.id}
                      delay={index * 80}>
                      <PackageCard pkg={pkg} />
                    </Reveal>
                  ))}
                </div>
              </div>
            )}

            <PaginationControls />
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {paginatedPackages.map((pkg, index) => (
                <Reveal
                  key={pkg.id}
                  delay={index * 80}>
                  <PackageCard pkg={pkg} />
                </Reveal>
              ))}
            </div>
            <PaginationControls />
          </>
        )}
      </div>
    </div>
  );
}
