# Travellah - Smart Travel & Cultural Tourism Platform

A React + TypeScript travel booking platform with **AI-powered itinerary generation**, smart search, and a full booking system. Built with Supabase backend, Gemini AI, and modern UI/UX.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 |
| Backend | Supabase (PostgreSQL + Auth) |
| AI | Google Gemini 3 Flash Preview |
| Maps | Leaflet + React Leaflet, React Globe.gl |
| Animations | Framer Motion |
| Icons | Lucide React |
| SEO | react-helmet-async |
| PWA | vite-plugin-pwa |

## Setup

### 1. Install dependencies
```bash
bun install
# or
npm install
```

### 2. Configure environment
Create a `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 3. Set up database
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to **Authentication > Providers > Email** and turn OFF "Confirm email" (for dev)
3. Go to **SQL Editor** and paste the contents of `supabase/setup_complete.sql`
4. Click **Run** - this creates all tables, policies, indexes, and seeds 22 travel packages

### 4. Run
```bash
bun dev
# or
npm run dev
```

---

## Features

### AI-Powered (Gemini)

#### Smart Itinerary Generation
- 10-step preference wizard collects: destination, travel month, duration, budget, interests, accommodation, special needs, cultural preferences
- Gemini generates **3 genuinely different itinerary tiers** (Economic, Mid-Luxury, Luxury)
- Each day includes:
  - **Time-slotted activities** (e.g. "9:00 AM - 11:30 AM")
  - **Real restaurant recommendations** with specific dishes and costs
  - **Insider travel tips** per day
  - **Estimated cost per activity**
  - **Travel time between locations**
- Weather notes and packing tips based on travel month
- Error state with retry if generation fails
- **Files:** `src/services/geminiItineraryService.ts`, `src/pages/ItineraryResults.tsx`

#### AI Chatbot
- Conversational travel assistant powered by Gemini
- System prompt with full platform knowledge (packages, policies, contact info)
- Multi-turn conversation with history
- Typing indicator (animated dots) while waiting
- Dynamic follow-up suggestions after each response
- "New conversation" reset button
- Falls back to keyword matching if Gemini unavailable
- **Files:** `src/services/geminiChatService.ts`, `src/components/SupportChatbot.tsx`

#### Smart Natural Language Search
- Type queries like "beach vacation under 30k" on the Packages page
- Gemini parses into structured filters (theme, price, duration, category)
- Shows "Understood as:" chips with interpreted filters
- Debounced (600ms) with session caching
- Falls back to text matching if Gemini unavailable
- **Files:** `src/services/geminiSearchService.ts`, `src/pages/Packages.tsx`

#### Voice-to-Text
- Microphone button on search bar and chatbot
- Uses Web Speech API (Chrome/Edge)
- Speaks query, fills input automatically
- **File:** `src/hooks/useSpeechToText.ts`

### Core Features

#### Package Browsing
- 22 seeded packages (12 domestic, 10 international)
- Filter by: theme, budget range, duration, category (domestic/international)
- Search with text or AI-powered natural language
- Package detail pages with image gallery, day-wise itinerary, inclusions/exclusions

#### Booking System
- Book pre-built packages or AI-generated custom itineraries
- Payment method selection (UPI, Credit Card, Debit Card, Net Banking, Wallet)
- Unique booking reference generation
- Booking confirmation page
- "My Bookings" dashboard with status tracking

#### Authentication
- Email/password auth via Supabase
- Sign up creates a user profile
- Protected routes (My Bookings, booking flows)
- User greeting in navbar with dropdown menu

#### Interactive Maps
- Package map widget with Leaflet (150+ city coordinates)
- 3D globe visualization with React Globe.gl

### UX & Performance

#### Route-Level Code Splitting
- All 12 pages lazy-loaded with `React.lazy` + `Suspense`
- Page loader component while chunks load
- **Files:** `src/App.tsx`, `src/components/PageLoader.tsx`

#### Error Boundary
- Global error boundary prevents white-screen crashes
- Friendly error page with "Refresh" and "Go Home" buttons
- **File:** `src/components/ErrorBoundary.tsx`

#### Toast Notifications
- Lightweight toast system (no library dependency)
- Supports success, error, info, warning types
- Auto-dismiss after 4 seconds
- Replaces all `alert()` calls
- **File:** `src/contexts/ToastContext.tsx`

#### Dark Mode
- Theme toggle (sun/moon) in navbar
- Persists to localStorage
- Respects system preference on first visit
- CSS-based overrides for page backgrounds, cards, inputs, nav
- **Files:** `src/contexts/ThemeContext.tsx`, `src/index.css`

#### Image Optimization
- `loading="lazy"` on all below-fold images
- OptimizedImage component with blur placeholder and error fallback
- **File:** `src/components/OptimizedImage.tsx`

#### Loading Skeletons
- Package card, itinerary card, and booking card skeletons
- Tailwind `animate-pulse` with realistic layouts
- **File:** `src/components/Skeleton.tsx`

### Polish

#### SEO
- Per-page `<Helmet>` with unique title and meta description (all 11 pages)
- Open Graph and Twitter Card tags
- Proper meta description, keywords, author, robots
- **Files:** `index.html`, all page components

#### Social Sharing
- Share button on itinerary results (WhatsApp, Twitter/X, copy link)
- Uses Web Share API on mobile with fallback
- **File:** `src/components/ShareButton.tsx`

#### PWA
- Service worker with workbox (auto-update)
- Cache-first for Pexels images (30 day TTL)
- Network-first for Supabase API calls
- App manifest with theme color and icons
- **Files:** `vite.config.ts`, `public/manifest.json`

#### Redesigned Navbar
- Fixed position with frosted glass effect on scroll
- Centered nav links with active page pill highlight
- User avatar dropdown with email, My Bookings, Sign Out
- Dark mode toggle integrated
- Mobile hamburger menu with clean card-style layout

---

## Project Structure

```
src/
├── components/
│   ├── ErrorBoundary.tsx       # Global error boundary
│   ├── Footer.tsx              # Site footer
│   ├── Navbar.tsx              # Redesigned navigation
│   ├── OptimizedImage.tsx      # Lazy image with fallback
│   ├── PackageMapWidget.tsx    # Interactive Leaflet map
│   ├── PageLoader.tsx          # Suspense fallback loader
│   ├── Reveal.tsx              # Scroll-triggered animation
│   ├── CountUp.tsx             # Number counter animation
│   ├── ShareButton.tsx         # Social sharing (WhatsApp, X, copy)
│   ├── Skeleton.tsx            # Loading skeleton components
│   └── SupportChatbot.tsx      # AI chatbot widget
├── contexts/
│   ├── AuthContext.tsx          # Supabase auth state
│   ├── ThemeContext.tsx         # Dark mode toggle
│   └── ToastContext.tsx         # Toast notification system
├── hooks/
│   └── useSpeechToText.ts      # Web Speech API hook
├── services/
│   ├── geminiApi.ts            # Gemini SDK wrapper + caching
│   ├── geminiChatService.ts    # AI chatbot conversations
│   ├── geminiItineraryService.ts # AI itinerary generation
│   ├── geminiSearchService.ts  # AI natural language search
│   └── placesApi.ts            # OpenTripMap API (legacy, unused)
├── pages/
│   ├── Home.tsx                # Landing page
│   ├── Packages.tsx            # Browse packages + smart search
│   ├── PackageDetails.tsx      # Package detail view
│   ├── SmartPlanner.tsx        # 10-step preference wizard
│   ├── ItineraryResults.tsx    # AI-generated itineraries display
│   ├── BookPackage.tsx         # Package booking form
│   ├── BookCustomItinerary.tsx # Custom itinerary booking
│   ├── BookingConfirmation.tsx # Post-booking confirmation
│   ├── MyBookings.tsx          # User booking history
│   ├── Login.tsx               # Auth page
│   ├── About.tsx               # About page
│   └── Contact.tsx             # Contact form
├── utils/                      # Legacy generators (kept for reference, unused)
├── lib/
│   └── supabase.ts             # Supabase client + TypeScript types
├── App.tsx                     # Root with providers, routing, code splitting
├── main.tsx                    # Entry point
└── index.css                   # Tailwind + dark mode overrides
```

## Database Schema

| Table | Purpose |
|-------|---------|
| `profiles` | User info (name, phone, city) linked to auth.users |
| `packages` | 22 travel packages with itineraries, pricing, images |
| `bookings` | User bookings (package or custom) with payment status |
| `saved_itineraries` | AI-generated itineraries stored for later |
| `contact_messages` | Contact form submissions |

All tables have Row-Level Security (RLS) policies. See `supabase/setup_complete.sql` for the complete schema.

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `VITE_GEMINI_API_KEY` | Yes | Google Gemini API key (for AI features) |

## What Was Added

### New Files
- `src/services/geminiApi.ts` - Centralized Gemini SDK wrapper with caching
- `src/services/geminiItineraryService.ts` - AI itinerary generation with detailed prompts
- `src/services/geminiChatService.ts` - Multi-turn AI chatbot
- `src/services/geminiSearchService.ts` - Natural language search parser
- `src/hooks/useSpeechToText.ts` - Voice input hook (Web Speech API)
- `src/contexts/ThemeContext.tsx` - Dark mode state management
- `src/contexts/ToastContext.tsx` - Toast notification system
- `src/components/ErrorBoundary.tsx` - Crash protection
- `src/components/PageLoader.tsx` - Code splitting fallback
- `src/components/ShareButton.tsx` - Social sharing
- `src/components/Skeleton.tsx` - Loading skeletons
- `src/components/OptimizedImage.tsx` - Optimized image component
- `public/manifest.json` - PWA manifest
- `supabase/setup_complete.sql` - Single-file database setup with seed data

### New Dependencies
- `@google/generative-ai` - Gemini SDK
- `react-helmet-async` - Per-page SEO
- `vite-plugin-pwa` - Progressive Web App support

## What Was Removed

- **Rule-based itinerary fallback** - Replaced entirely by Gemini AI. Old generators in `src/utils/` kept for reference but no longer called
- **OpenTripMap API dependency** - Was used by old fallback, produced `apikey=undefined` errors. No longer called
- **Keyword-matching chatbot** - Replaced by Gemini conversational AI (keyword matching still serves as silent fallback)
- **`alert()` calls** - Replaced by toast notification system
- **Eager page imports** - Replaced by `React.lazy` code splitting
- **Playwright test suite** - Removed after initial validation
- **bolt.new OG image** - Replaced with proper Travellah branding in index.html
