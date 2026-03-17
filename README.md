# Travellah - AI-Powered Travel Planning Platform

A production-grade travel booking platform that uses Google Gemini AI to generate personalized itineraries, browse curated travel packages, and book trips. Built with React, TypeScript, Tailwind CSS, Supabase, and Framer Motion.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Features](#features)
  - [AI-Powered Features](#ai-powered-features)
  - [Core Features](#core-features)
  - [UI/UX & Design](#uiux--design)
  - [Performance](#performance)
- [Architecture](#architecture)
  - [Project Structure](#project-structure)
  - [Pages & Workflows](#pages--workflows)
  - [AI Service Architecture](#ai-service-architecture)
  - [Component System](#component-system)
  - [State Management](#state-management)
  - [Database Schema](#database-schema)
  - [Maps & Geolocation](#maps--geolocation)
  - [Styling & Theming](#styling--theming)
- [Destination Coverage](#destination-coverage)

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 + TypeScript 5.5 |
| **Build Tool** | Vite 5 |
| **Routing** | React Router DOM 7 |
| **Styling** | Tailwind CSS 3.4 (custom lilac palette) |
| **Animations** | Framer Motion 12 |
| **Icons** | Lucide React |
| **AI / LLM** | Google Generative AI (Gemini 2.0 Flash) |
| **Backend** | Supabase (PostgreSQL, Auth, RLS) |
| **Maps** | Leaflet + React Leaflet + Marker Clustering |
| **3D Globe** | React Globe.gl |
| **SEO** | React Helmet Async |
| **PWA** | Vite PWA Plugin |

---

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Supabase project
- A Google AI API key (Gemini)

### Installation

```bash
# Clone the repository
git clone https://github.com/souravvrc/smart-travel-website.git
cd smart-travel-website

# Install dependencies
bun install
# or
npm install

# Configure environment (see Environment Variables below)
cp .env.example .env

# Start dev server
bun dev
# or
npm run dev
```

The app runs at `http://localhost:5173`.

### Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Go to **Authentication > Providers > Email** and disable "Confirm email" (for dev)
3. Go to **SQL Editor** and run the contents of `supabase/setup_complete.sql`
4. This creates all tables, RLS policies, indexes, and seeds 22 travel packages

### Production Build

```bash
bun run build   # Output in dist/
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GEMINI_API_KEY=your-gemini-api-key
```

| Variable | Required | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anonymous/public key |
| `VITE_GEMINI_API_KEY` | Yes | Google AI Studio API key for Gemini |

---

## Features

### AI-Powered Features

#### Smart Itinerary Generation

A 10-step wizard collects user preferences (destination, month, duration, budget, interests, accommodation, special needs, cultural preferences) and calls Gemini to generate **3 genuinely different itinerary tiers**: Economic, Mid-Luxury, and Luxury.

Each tier includes:
- Day-by-day breakdown with time-slotted activities (e.g. "9:00 AM - 11:30 AM")
- Real restaurant recommendations with specific dishes and costs
- Named hotels with descriptions per tier
- Transport details, inclusions, and exclusions
- Weather notes and packing tips based on the travel month
- Estimated cost per activity and total pricing in INR

**Technical implementation:** `geminiItineraryService.ts` uses a persona-based prompt ("Ravi, veteran Indian travel planner") with strict constraints for real places, specific times, and tier-appropriate pricing. Responses are validated for structure (3 tiers, correct schema) and cached in sessionStorage with a 30-minute TTL.

**Fallback:** If Gemini is unavailable, `itineraryGenerator.ts` provides a comprehensive rule-based fallback with 31 destinations, 800+ hotel name mappings, and tier-differentiated activity generation.

**Files:** `src/services/geminiItineraryService.ts`, `src/pages/SmartPlanner.tsx`, `src/pages/ItineraryResults.tsx`

#### AI-Powered Natural Language Search

On the Packages page, queries like "beach trip under 20k for 5 days" are detected as natural language (3+ words or contains budget/duration terms) and sent to Gemini, which parses them into structured filters: destination, theme, price range, duration, and category. Parsed filters appear as removable chips labeled "Understood as:".

**Technical implementation:** `geminiSearchService.ts` uses dual-level caching (in-memory Map + sessionStorage) and a 600ms debounce. Falls back to text matching if Gemini is unavailable.

**Files:** `src/services/geminiSearchService.ts`, `src/pages/Packages.tsx`

#### AI Support Chatbot

A floating chat widget in the bottom-right corner. Powered by a Gemini `ChatSession` with a system prompt trained on Travellah's policies, features, pricing, and contact info. Supports multi-turn conversation with history, shows a typing indicator (animated dots), and provides 2-3 dynamic follow-up suggestions after each response.

**Technical implementation:** `geminiChatService.ts` manages a stateful ChatSession. Each response is parsed for both the answer text and suggested follow-ups. A fallback knowledge base with keyword matching handles common queries (payments, cancellations, refunds) if Gemini is unavailable.

**Files:** `src/services/geminiChatService.ts`, `src/components/SupportChatbot.tsx`

#### Voice-to-Text Input

Microphone button on the search bar and chatbot. Uses the browser's MediaRecorder API to capture audio, then sends the audio blob to Gemini for transcription.

**Files:** `src/hooks/useSpeechToText.ts`

---

### Core Features

#### Package Browsing

22 seeded packages (12 domestic, 10 international) stored in Supabase. Browsable with a filter panel (destination, theme, price range, duration, category) and searchable via text or AI-powered natural language queries. Package detail pages show image galleries, day-wise itineraries, inclusions/exclusions, ratings, and a "Book Now" CTA.

#### Booking System

End-to-end booking for both pre-made packages and AI-generated custom itineraries. The booking form collects start date, number of travelers, pickup city, contact info, and payment method (UPI, Credit Card, Debit Card, Net Banking, Wallet). Generates a unique booking reference and persists to Supabase. Post-booking confirmation page with booking summary.

#### User Authentication

Email/password auth via Supabase. On signup, a profile row is created in the `profiles` table with full name. Auth state is reactive via `onAuthStateChange`. Protected routes (`MyBookings`, booking flows) redirect to `/login` with a return URL.

#### My Bookings Dashboard

Authenticated users can view all their bookings with status, dates, traveler count, total price, and package/itinerary images.

#### Contact Form

Contact form that saves submissions (name, email, phone, message) to Supabase's `contact_messages` table with success/error toast feedback.

#### Interactive Map Explorer

Full-screen Leaflet map showing all packages as clustered markers. Features a filter sidebar (theme, category, price, rating, search), hover tooltips with price preview, image slideshows in sidebar cards, dark mode tile switching, and an optional lazy-loaded 3D globe visualization.

---

### UI/UX & Design

#### Redesigned Navbar

The navbar adapts to three visual states:

| State | Appearance |
|---|---|
| Home page, above fold | Fully transparent, white text |
| Home page, scrolled | Frosted glass (`backdrop-blur-2xl`) with subtle shadow |
| Other pages | Frosted glass with theme-aware text |

Design details:
- **Pill container** for nav links -- all links sit inside a tinted capsule (`bg-white/[0.08]` transparent, `bg-gray-100/80` light, `bg-white/[0.04]` dark)
- **Featured AI Planner link** -- separated from regular links with a `Sparkles` icon and lilac accent color to draw attention
- **Logo badge** -- Plane icon sits in a rounded square container with theme-aware gradient tinting
- **Animated theme toggle** -- Framer Motion `AnimatePresence` with rotate + scale transition between Sun/Moon icons
- **Animated user dropdown** -- `motion.div` with fade + slide + scale (spring easing), outside-click dismiss via `useRef`
- **Mobile menu** -- full slide-in panel from the right (`motion.div` with `x: "100%"` -> `x: 0`, spring damping), blurred backdrop overlay, body scroll lock, staggered link animations (`delay: 0.05 + i * 0.04`), auto-close on route change

**Files:** `src/components/Navbar.tsx`

#### Dual Footer System

Two footer variants are rendered conditionally in `App.tsx` via an `AppFooter` component that checks `location.pathname`:

- **Full footer** (`Footer.tsx`, home page only) -- CTA section ("Ready for your next adventure?"), 4-column link grid (Company, Explore, Support, Top Destinations), brand description, contact info (email, phone), destination tag pills
- **Minimal footer** (`FooterMinimal.tsx`, all other pages) -- single-row layout with brand logo, 5 key nav links, and copyright line

Both footers fully support dark/light mode with proper contrast: `bg-gray-100` / `bg-gray-950` backgrounds, `border-gray-200` / `border-white/10` dividers, theme-aware text and hover colors.

**Files:** `src/components/Footer.tsx`, `src/components/FooterMinimal.tsx`, `src/App.tsx`

#### Feature Cards with Micro-interactions

The "Why Travellah" section on the home page uses Lucide icons in gradient-tinted containers instead of emoji:

| Card | Icon | Accent |
|---|---|---|
| AI Itineraries | `Sparkles` | Lilac / Purple gradient |
| Curated Stays | `Building2` | Amber / Orange gradient |
| Personalized | `Fingerprint` | Teal / Emerald gradient |
| 24/7 Support | `Headphones` | Blue / Indigo gradient |

Each card has Framer Motion micro-interactions:
- **Hover lift** -- `whileHover={{ y: -4, scale: 1.02 }}` with spring physics (`stiffness: 400, damping: 20`)
- **Press feedback** -- `whileTap={{ scale: 0.98 }}`
- **Icon tilt** -- icon container rotates 3deg and scales up on card hover
- **Color-matched borders and shadows** -- each card gets its own accent color on hover (lilac for AI, amber for stays, teal for personalized, blue for support) rather than a uniform color

**Files:** `src/pages/Home.tsx`

#### Dark / Light Mode

Theme toggle in the navbar. On first load, checks `localStorage` for a saved preference, falls back to `prefers-color-scheme`. Toggles the `dark` class on `document.documentElement` for Tailwind's class-based dark mode strategy. Every component, page, and layout element has explicit `dark:` variants.

**Files:** `src/contexts/ThemeContext.tsx`, `src/index.css`

#### Toast Notifications

Lightweight toast system with no library dependency. Supports `success`, `error`, `info`, and `warning` types with corresponding icons and colors. Auto-dismisses after 4 seconds. Renders as a fixed overlay in the top-right corner. Replaces all `alert()` calls.

**Files:** `src/contexts/ToastContext.tsx`

#### Scroll-Triggered Animations

`Reveal` component uses `IntersectionObserver` to trigger fade-in animations when elements enter the viewport. Accepts a configurable `delay` prop for staggered entrance effects. Used across the home page, package listings, and result pages.

**Files:** `src/components/Reveal.tsx`

#### SEO

Per-page `<Helmet>` with unique title, meta description, Open Graph tags, and Twitter Card tags across all 13 pages.

---

### Performance

| Technique | Implementation |
|---|---|
| **Code splitting** | `React.lazy()` + `Suspense` for all 13 page components |
| **Image lazy loading** | `OptimizedImage` component with blur-up placeholder and error fallback |
| **API response caching** | Dual-level: in-memory `Map` + `sessionStorage` (30-minute TTL) |
| **Map marker clustering** | `react-leaflet-cluster` groups nearby markers to avoid rendering 100+ DOM nodes |
| **PWA runtime caching** | CacheFirst for Pexels images (30-day expiry), NetworkFirst for Supabase API (1-hour expiry) |
| **Skeleton loading** | Shimmer placeholders (`animate-pulse`) during data fetches |
| **Dependency optimization** | Vite excludes lucide-react from pre-bundling |

---

## Architecture

### Project Structure

```
src/
  pages/                           # Route-level page components (13 pages)
    Home.tsx                       # Landing: hero, packages, testimonials, FAQ
    SmartPlanner.tsx                # 10-step AI itinerary wizard
    ItineraryResults.tsx            # AI-generated itinerary display (3 tiers)
    Packages.tsx                   # Package catalog with AI search
    PackageDetails.tsx             # Single package detail view
    BookPackage.tsx                # Booking flow for pre-made packages
    BookCustomItinerary.tsx        # Booking flow for AI itineraries
    BookingConfirmation.tsx        # Post-booking confirmation
    MyBookings.tsx                 # User booking dashboard
    Login.tsx                      # Sign in / sign up
    About.tsx                      # Company info
    Contact.tsx                    # Contact form
    ExploreMap.tsx                 # Full-screen interactive map explorer

  components/                      # Reusable UI components (13)
    Navbar.tsx                     # Frosted glass nav, mobile slide-in, Framer Motion
    Footer.tsx                     # Full footer (home page)
    FooterMinimal.tsx              # Minimal footer (other pages)
    SupportChatbot.tsx             # Floating AI chat widget
    PackageMapWidget.tsx           # Floating map toggle
    ItineraryMapView.tsx           # Day-by-day route map
    Reveal.tsx                     # IntersectionObserver fade-in wrapper
    CountUp.tsx                    # Animated number counter
    ShareButton.tsx                # Social share / copy link
    PageLoader.tsx                 # Suspense fallback loader
    Skeleton.tsx                   # Shimmer loading placeholders
    OptimizedImage.tsx             # Lazy image with blur-up
    ErrorBoundary.tsx              # React error boundary

  contexts/                        # React Context providers
    AuthContext.tsx                 # Supabase auth state
    ThemeContext.tsx                # Dark/light mode toggle
    ToastContext.tsx                # Toast notification system

  services/                        # External API integrations
    geminiApi.ts                   # Gemini client, model config, caching utils
    geminiItineraryService.ts      # Itinerary generation prompts & validation
    geminiChatService.ts           # Chatbot conversation management
    geminiSearchService.ts         # NL search query parsing

  utils/                           # Data & helpers
    itineraryGenerator.ts          # Fallback itinerary logic, destination database
    coordinates.ts                 # 140+ city/state lat/lng coordinates

  hooks/                           # Custom React hooks
    useSpeechToText.ts             # MediaRecorder + Gemini audio transcription

  lib/
    supabase.ts                    # Supabase client + TypeScript interfaces

  App.tsx                          # Root: providers, routing, conditional footer
  main.tsx                         # Entry point
  index.css                        # Tailwind base + dark mode overrides + animations

supabase/
  setup_complete.sql               # Full schema, RLS policies, seed data (22 packages)
  seed_indian_states.sql           # Additional Indian state package seeds
  update_package_images.sql        # Image URL updates
```

### Pages & Workflows

#### Workflow 1: AI Itinerary Generation

```
SmartPlanner (10 steps) -> ItineraryResults (3 tiers) -> BookCustomItinerary -> BookingConfirmation
```

1. User fills 10-step preference wizard (destination, month, duration, budget, interests, accommodation, special needs, cultural preferences)
2. Preferences passed to `generateItinerariesWithGemini()` which calls Gemini with a structured prompt
3. Response validated and parsed into 3 tiers with day-by-day activities, meals, hotels, transport
4. Results rendered with tab navigation and interactive route map
5. User can book a tier, which creates a booking record with the itinerary JSON

#### Workflow 2: Package Browsing & Booking

```
Packages (search/filter) -> PackageDetails -> BookPackage -> BookingConfirmation
```

1. Browse packages fetched from Supabase, filter by theme/budget/duration/category
2. Smart search sends NL queries to Gemini for structured filter parsing
3. Click package for detail view with gallery, itinerary, inclusions
4. Book: enter dates, travelers, contact info, payment method
5. Booking persisted to Supabase with unique reference

#### Workflow 3: Authentication

```
Login (sign up or sign in) -> redirect to return URL or home
```

1. Email/password auth via Supabase
2. On signup, profile row created in `profiles` table
3. Auth state managed reactively via `onAuthStateChange`
4. Protected pages redirect to `/login?returnUrl=...`

#### Workflow 4: Support Chatbot

1. User clicks floating chat button -> chat window expands
2. Types message or uses voice input
3. Message sent to Gemini ChatSession with conversation history
4. Response displayed with 2-3 suggested follow-up questions
5. Multi-turn conversation supported until reset

### AI Service Architecture

```
geminiApi.ts                       # Shared singleton client
  |                                # - GoogleGenerativeAI initialization
  |                                # - Model config (temp: 0.85, 30k tokens for itineraries)
  |                                # - parseJsonResponse(): strips markdown code fences
  |                                # - getCached() / setCache(): sessionStorage with 30-min TTL
  |                                # - isGeminiAvailable(): config check
  |
  +-- geminiItineraryService.ts    # Itinerary generation
  |     - Persona-based prompt with strict constraints
  |     - Validates response structure (3 tiers, correct schema)
  |     - formatGeminiItineraries(): converts API response to display format
  |     - Pre-defined Pexels image URLs for 15+ destinations
  |
  +-- geminiChatService.ts         # Chatbot
  |     - Stateful ChatSession (multi-turn)
  |     - System prompt with platform knowledge
  |     - Parses response + suggested follow-ups
  |     - Fallback keyword matching for common queries
  |
  +-- geminiSearchService.ts       # Smart search
        - Detects NL queries (3+ words or budget/duration terms)
        - Parses into: destination, theme, price range, duration, category
        - Dual-level caching: in-memory Map + sessionStorage
        - formatParsedFilters(): converts to display chips
```

### Component System

#### Navbar (`Navbar.tsx`)

Three visual states driven by `isHome` and `scrolled` flags:
- Transparent on home hero (white text, no background)
- Frosted glass when scrolled or on non-home pages (`bg-white/80 backdrop-blur-2xl` light, `bg-gray-950/80` dark)

Nav links are grouped inside a tinted pill container. The "AI Planner" link is visually separated with a `Sparkles` icon and lilac accent. The theme toggle uses Framer Motion `AnimatePresence` with rotate + scale animation. The user dropdown uses spring-based slide + fade. The mobile menu is a full-height slide-in panel from the right with backdrop blur, body scroll lock, and staggered link animations.

#### Footer System (`Footer.tsx`, `FooterMinimal.tsx`)

Conditional rendering in `App.tsx` via an `AppFooter` component:
```tsx
function AppFooter() {
  const location = useLocation();
  return location.pathname === "/" ? <Footer /> : <FooterMinimal />;
}
```

The full footer has a CTA banner, 4-column link grid, destination tags, and contact info. The minimal footer is a single flex row with brand, links, and copyright. Both have complete dark/light mode class sets.

#### Feature Cards (Home Page)

Replaced emoji with Lucide icons in gradient containers. Each card has unique accent colors and Framer Motion interactions:

```tsx
<motion.div
  whileHover={{ y: -4, scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 400, damping: 20 }}
>
```

Icon containers have `group-hover:scale-110 group-hover:rotate-3` for a tilt effect. Borders and shadows are color-matched per card (lilac, amber, teal, blue).

### State Management

#### AuthContext

Wraps Supabase auth. Provides `user`, `signIn()`, `signUp()`, `signOut()`, and `loading` state. Listens to `onAuthStateChange` for reactive UI updates. Creates a `profiles` row on signup.

#### ThemeContext

Manages dark/light toggle. Checks `localStorage` first, falls back to `prefers-color-scheme`. Toggles `dark` class on `document.documentElement`. Persists preference to `localStorage`.

#### ToastContext

Provides `showToast(message, type)`. Four types: `success`, `error`, `info`, `warning`. Auto-dismiss after 4 seconds. Fixed overlay in top-right corner.

### Database Schema

Powered by Supabase (PostgreSQL + Row-Level Security).

#### Tables

**profiles**

| Column | Type | Description |
|---|---|---|
| id | uuid (PK, FK -> auth.users) | User ID |
| full_name | text | Display name |
| phone | text | Phone number |
| city | text | Home city |
| created_at / updated_at | timestamptz | Timestamps |

**packages**

| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | Package ID |
| title | text | Package name |
| destination | text | Destination name |
| duration_days / duration_nights | int | Trip length |
| description | text | Short description |
| detailed_itinerary | jsonb | Day-by-day breakdown |
| inclusions / exclusions | text[] | What's included/excluded |
| price_per_person | numeric | Price in INR |
| theme | text | Adventure, Honeymoon, etc. |
| images | text[] | Image URLs |
| rating / total_ratings | numeric, int | Rating data |
| category | text | domestic / international |
| is_active | boolean | Listing visibility |

**bookings**

| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | Booking ID |
| user_id | uuid (FK -> profiles) | Booker |
| package_id | uuid (FK, nullable) | For package bookings |
| itinerary_data | jsonb (nullable) | For custom itinerary bookings |
| booking_type | text | "package" or "custom" |
| travel_dates | jsonb | Start/end dates |
| num_travelers | int | Party size |
| total_price | numeric | Total in INR |
| payment_method | text | UPI, Card, etc. |
| payment_status | text | pending / completed / failed |
| booking_status | text | confirmed / pending / cancelled |
| booking_reference | text (unique) | Human-readable reference |

**contact_messages**

| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | Message ID |
| name / email / phone | text | Sender info |
| message | text | Message body |
| created_at | timestamptz | Submission time |

#### Row-Level Security

- `profiles` -- users can only read/write their own row
- `bookings` -- users can only access their own bookings
- `packages` -- public read access
- `contact_messages` -- authenticated users can insert

### Maps & Geolocation

#### Interactive Map Explorer (`ExploreMap.tsx`)

Full-screen Leaflet map with marker clustering via `react-leaflet-cluster`. Features: filter sidebar (theme, category, price, rating, search), hover tooltips, image slideshows in sidebar cards, dark/light map tile switching, and optional 3D globe (lazy-loaded `react-globe.gl`).

#### Itinerary Route Map (`ItineraryMapView.tsx`)

Renders day-by-day route with numbered circle markers and polylines connecting sequential cities. Auto-fits bounds to show the full route.

#### Coordinate Database (`coordinates.ts`)

140+ lat/lng entries covering all Indian states, major cities, and 20+ international destinations. `getCoordinates(name)` helper with fuzzy matching (exact -> substring -> first-word).

### Styling & Theming

#### Tailwind Configuration

```js
colors: {
  lilac: {
    50: "#fbf7fb",    // Lightest
    500: "#b566b5",   // Primary
    600: "#964996",   // Primary dark
    950: "#361436",   // Deepest
  }
}
fontFamily: {
  sans: ["Helvetica", "Arial", "sans-serif"],
  kugile: ["Playfair Display", "serif"],  // Display/brand font
}
darkMode: "class"
```

#### Design Patterns

- **Glass morphism** -- navbar and overlays use `backdrop-blur-2xl` with transparent backgrounds and subtle borders
- **Gradient accents** -- icon containers, CTAs, and decorative elements use `bg-gradient-to-br` fills
- **Spring animations** -- Framer Motion `type: "spring"` for natural-feeling hover, press, and menu interactions
- **Color-matched interactions** -- feature cards, sections, and CTAs use contextually appropriate accent colors rather than uniform brand color

---

## Destination Coverage

**Domestic (17):** Maharashtra, Tamil Nadu, West Bengal, Gujarat, Rajasthan, Kerala, Uttarakhand, Varanasi, Goa, Ladakh, Himachal Pradesh, Karnataka, Jammu & Kashmir, Sikkim, Assam, Meghalaya, North East India

**International (14):** Maldives, Dubai, Thailand, Singapore, Bali, Malaysia, Sri Lanka, Nepal, Bhutan, Vietnam, Turkey, Switzerland, Paris, London

**Themes:** Adventure, Honeymoon, Family, Cultural, Religious, Beach, Heritage

**Budget Tiers:**
- Economic: Budget-friendly (approx 2-5k/day domestic, 5-10k international)
- Mid-Luxury: Comfortable (approx 5-12k/day domestic, 10-25k international)
- Luxury: Premium (approx 15-40k/day domestic, 30-80k international)

---

## License

This project is proprietary. All rights reserved.
