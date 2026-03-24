# Travellah - AI-Powered Travel Planning Platform

A production-grade travel booking platform that uses Google Gemini AI to generate personalized itineraries, browse curated travel packages, process real payments via Razorpay, and manage everything through a full admin dashboard. Built with React, TypeScript, Vite, Supabase, and shadcn/ui.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
  - [AI-Powered Features](#ai-powered-features)
  - [Payment Processing (Razorpay)](#payment-processing-razorpay)
  - [User Reviews & Ratings](#user-reviews--ratings)
  - [Wishlist / Save Feature](#wishlist--save-feature)
  - [Admin Dashboard](#admin-dashboard)
  - [Email Notifications](#email-notifications)
  - [Core Features](#core-features)
  - [UI/UX & Design](#uiux--design)
  - [Performance](#performance)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Edge Function Deployment](#edge-function-deployment)
  - [Edge Function Secrets](#edge-function-secrets)
  - [Running the Dev Server](#running-the-dev-server)
  - [Test Payments](#test-payments)
  - [Production Build](#production-build)
- [Architecture](#architecture)
  - [Project Structure](#project-structure)
  - [Database Schema](#database-schema)
  - [Pages & Workflows](#pages--workflows)
  - [AI Service Architecture](#ai-service-architecture)
- [Destination Coverage](#destination-coverage)
- [License](#license)

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 + TypeScript 5.5 |
| **Build Tool** | Vite 5 |
| **Routing** | React Router DOM 7 |
| **UI Components** | shadcn/ui (24 components, nova preset) |
| **Styling** | Tailwind CSS 3.4 (oklch CSS variables, lilac/purple theme) |
| **Animations** | Framer Motion 12 |
| **Icons** | Lucide React |
| **AI / LLM** | Google Generative AI (Gemini 2.0 Flash) |
| **Backend** | Supabase (PostgreSQL, Auth, Edge Functions, RLS) |
| **Payments** | Razorpay (checkout.js, server-side order creation & verification) |
| **Email** | Resend (transactional booking confirmation emails) |
| **Maps** | Leaflet + React Leaflet + Marker Clustering |
| **3D Globe** | React Globe.gl |
| **SEO** | React Helmet Async |
| **PWA** | Vite PWA Plugin |

---

## Features

### AI-Powered Features

#### Smart Itinerary Generation

A 10-step wizard collects user preferences (destination, month, duration, budget, interests, accommodation, special needs, cultural preferences) and calls Gemini to generate **3 genuinely different itinerary tiers**: Economic, Mid-Luxury, and Luxury.

Each tier includes:
- Day-by-day breakdown with time-slotted activities
- Real restaurant recommendations with specific dishes and costs
- Named hotels with descriptions per tier
- Transport details, inclusions, and exclusions
- Weather notes and packing tips based on the travel month
- Estimated cost per activity and total pricing in INR

**Fallback:** If Gemini is unavailable, a comprehensive rule-based fallback with 31 destinations, 800+ hotel name mappings, and tier-differentiated activity generation kicks in.

#### AI-Powered Natural Language Search

On the Packages page, queries like "beach trip under 20k for 5 days" are detected as natural language and sent to Gemini, which parses them into structured filters: destination, theme, price range, duration, and category. Parsed filters appear as removable chips.

#### AI Support Chatbot

A floating chat widget powered by a Gemini `ChatSession` with a system prompt trained on Travellah's policies, features, pricing, and contact info. Supports multi-turn conversation with history, typing indicators, and dynamic follow-up suggestions.

#### Voice-to-Text Input

Microphone button on search bar and chatbot. Uses the browser's MediaRecorder API to capture audio, then sends the audio blob to Gemini for transcription.

---

### Payment Processing (Razorpay)

Full real payment integration with server-side order creation and signature verification.

**Architecture:**
1. User fills booking form and clicks "Pay Now"
2. `create-razorpay-order` Supabase Edge Function creates an order on Razorpay's servers
3. Razorpay checkout modal opens in the browser
4. After payment, `verify-razorpay-payment` Edge Function verifies the cryptographic signature
5. On success, booking is updated with payment details and confirmation email is sent

**Components:**
- `useRazorpay` hook -- dynamically loads Razorpay `checkout.js` script
- `paymentService.ts` -- frontend API calls to Edge Functions
- `create-razorpay-order` Edge Function -- creates Razorpay order with amount, currency, receipt
- `verify-razorpay-payment` Edge Function -- HMAC-SHA256 signature verification
- SQL migration adds `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature` to bookings table

---

### User Reviews & Ratings

- `reviews` table with Row-Level Security and auto-update trigger that recalculates package ratings
- `StarRating` component for interactive star input and display
- `ReviewCard` component showing user name, rating, date, and review text
- `ReviewForm` with validation (must be logged in, one review per package per user)
- `ReviewsSection` aggregating all reviews on the package details page
- **Verified purchase badge** -- checks if the reviewer has a completed booking for the package
- Unique constraint enforces one review per user per package

---

### Wishlist / Save Feature

- `wishlists` table with RLS (users can only access their own wishlist)
- `useWishlist` hook with optimistic updates for instant UI feedback
- `WishlistButton` (heart icon) on package cards and detail pages
- Dedicated `/wishlist` page showing all saved packages
- Navbar heart icon with live count badge

---

### Admin Dashboard

A full admin panel for managing the platform.

**Access control:**
- `profiles.role` column (`user` or `admin`)
- `is_admin()` PostgreSQL function for RLS policies
- `AdminRoute` protected wrapper redirects non-admins
- `useAdmin` hook checks admin status

**Admin pages:**
| Page | Functionality |
|---|---|
| **Dashboard** | Stats overview (total bookings, revenue, users, packages) |
| **Bookings** | View and manage all bookings, update status |
| **Packages** | Full CRUD for travel packages |
| **Reviews** | Moderate user reviews (approve, delete) |
| **Contacts** | View contact form submissions |

**Layout:** `AdminLayout` with sidebar navigation, separate from the main site layout.

---

### Email Notifications (Resend)

We use the [Resend API](https://resend.com/docs/introduction) for fast and reliable transactional emails.

- **Edge Function:** Uses the `send-email` Supabase Edge Function to securely process the email sending.
- **Template:** High-quality, branded HTML booking confirmation template including booking details, travel dates, and reference number.
- **Trigger:** Automatically dispatched immediately after a successful Razorpay payment signature verification.
- **Resilience:** The notification is logically non-blocking — meaning if the email fails to send, it still successfully finalizes the payment/booking flow and displays the confirmation page.
- **Testing & Verification:** When testing the payment flow locally (e.g., using `success@razorpay`), the confirmation email will be triggered. Ensure your `RESEND_API_KEY` is configured as a Secret within your Supabase project. You can monitor the email delivery status directly in the [Resend Dashboard logs](https://resend.com/emails). *Note: On Resend's free tier, you can only send emails to domains/emails you have explicitly verified.*

---

### Core Features

#### Package Browsing

22 seeded packages (12 domestic, 10 international) stored in Supabase. Browsable with a filter panel (destination, theme, price range, duration, category) and searchable via text or AI-powered natural language queries.

#### Booking System

End-to-end booking for both pre-made packages and AI-generated custom itineraries. Booking form collects start date, number of travelers, pickup city, contact info. Payment is processed through Razorpay. Generates a unique booking reference and persists to Supabase.

#### User Authentication

Email/password auth via Supabase. On signup, a profile row is created in the `profiles` table. Auth state is reactive via `onAuthStateChange`. Protected routes redirect to `/login` with a return URL.

#### My Bookings Dashboard

Authenticated users can view all their bookings with status, dates, traveler count, total price, and package/itinerary images.

#### Contact Form

Saves submissions to Supabase's `contact_messages` table with toast feedback. Viewable by admins in the admin dashboard.

#### Interactive Map Explorer

Full-screen Leaflet map showing all packages as clustered markers. Features a filter sidebar, hover tooltips with price preview, image slideshows, dark mode tile switching, and an optional lazy-loaded 3D globe.

---

### UI/UX & Design

#### shadcn/ui Component Library

Initialized with the **nova preset** providing 24 components:

`accordion` `alert-dialog` `avatar` `badge` `button` `card` `checkbox` `dialog` `dropdown-menu` `input` `label` `popover` `progress` `radio-group` `scroll-area` `select` `separator` `sheet` `skeleton` `switch` `table` `tabs` `textarea` `tooltip`

All 13+ pages and shared components migrated from custom Tailwind to shadcn/ui. Custom lilac/purple primary color theme via oklch CSS variables. Card borders (ring-1) removed for a cleaner look.

#### Typography

Font changed from Playfair Display to **Instrument Serif** for display/brand typography. Clean `text-primary` replaces purple-to-pink text gradients.

#### Dark / Light Mode

Handled by shadcn's semantic color tokens. Theme toggle in the navbar with Framer Motion animation. Checks `localStorage` first, falls back to `prefers-color-scheme`. Dark mode uses purple-tinted backgrounds for visual cohesion.

#### Navbar

Three visual states: transparent on home hero, frosted glass when scrolled, frosted glass on non-home pages. Features a pill container for nav links, featured AI Planner link with Sparkles icon, animated theme toggle, spring-animated user dropdown, and full-height mobile slide-in menu with staggered animations. Includes admin link for admin users and wishlist heart icon with count badge.

#### Footer System

Two footer variants rendered conditionally:
- **Full footer** (home page) -- CTA section, 4-column link grid, brand description, contact info, destination tags
- **Minimal footer** (all other pages) -- single-row with brand, nav links, copyright

#### Expand-on-Hover Destination Showcase

Homepage destination cards expand on hover for an interactive browsing experience.

#### Toast Notifications

Lightweight custom toast system (no library). Supports `success`, `error`, `info`, `warning` types. Auto-dismisses after 4 seconds.

#### SEO

Per-page `<Helmet>` with unique title, meta description, Open Graph tags, and Twitter Card tags.

---

### Performance

| Technique | Implementation |
|---|---|
| **Code splitting** | `React.lazy()` + `Suspense` for all page components |
| **Image lazy loading** | `OptimizedImage` component with blur-up placeholder and error fallback |
| **API response caching** | Dual-level: in-memory `Map` + `sessionStorage` (30-minute TTL) |
| **Map marker clustering** | `react-leaflet-cluster` groups nearby markers |
| **PWA runtime caching** | CacheFirst for images, NetworkFirst for API calls |
| **Skeleton loading** | Shimmer placeholders during data fetches |

---

## Getting Started

### Prerequisites

- Node.js 18+ (or Bun)
- A [Supabase](https://supabase.com) project
- A [Google AI Studio](https://aistudio.google.com/) API key (Gemini)
- A [Razorpay](https://razorpay.com) account (test mode works for development)
- A [Resend](https://resend.com) account (for email notifications)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (for deploying Edge Functions)

### Installation

```bash
# Clone the repository
git clone https://github.com/souravvrc/smart-travel-website.git
cd smart-travel-website

# Install dependencies
npm install
# or
bun install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id_here
```

| Variable | Required | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anonymous/public key |
| `VITE_GEMINI_API_KEY` | Yes | Google AI Studio API key for Gemini |
| `VITE_RAZORPAY_KEY_ID` | Yes | Razorpay Key ID (starts with `rzp_test_` in test mode) |

### Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Go to **Authentication > Providers > Email** and disable "Confirm email" (for development)
3. Go to **SQL Editor** and run the contents of `supabase/setup_complete.sql` -- this creates all base tables, RLS policies, indexes, and seeds 22 travel packages
4. Run the migration files in `supabase/migrations/` in order:
   - `20260324000000_add_razorpay_fields.sql` -- adds Razorpay columns to bookings
   - `20260324000001_create_reviews.sql` -- creates reviews table with rating triggers
   - `20260324000002_create_wishlists.sql` -- creates wishlists table
   - `20260324000003_add_admin_role.sql` -- adds role column to profiles and `is_admin()` function
5. To make yourself an admin, run in SQL Editor:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE id = 'your-user-uuid-here';
   ```

### Edge Function Deployment

Deploy the three Supabase Edge Functions using the CLI:

```bash
# Link your project (if not already linked)
supabase link --project-ref your-project-ref

# Deploy all Edge Functions
supabase functions deploy create-razorpay-order
supabase functions deploy verify-razorpay-payment
supabase functions deploy send-email
```

### Edge Function Secrets

Set the required secrets for Edge Functions:

```bash
supabase secrets set RAZORPAY_KEY_ID=your_razorpay_key_id_here
supabase secrets set RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
supabase secrets set RESEND_API_KEY=your_resend_api_key_here
```

| Secret | Used By | Purpose |
|---|---|---|
| `RAZORPAY_KEY_ID` | `create-razorpay-order`, `verify-razorpay-payment` | Razorpay API authentication |
| `RAZORPAY_KEY_SECRET` | `create-razorpay-order`, `verify-razorpay-payment` | Razorpay API authentication + signature verification |
| `RESEND_API_KEY` | `send-email` | Resend email delivery API |

### Running the Dev Server

```bash
npm run dev
# or
bun dev
```

The app runs at `http://localhost:5173`.

### Test Payments

Razorpay provides convenient test credentials for development without capturing actual charges. Here's a quick walkthrough on how to comprehensively test a successful payment:

1. Go to any package → click **Book** → fill the form → click **Pay**
2. The Razorpay checkout modal opens natively in the browser
3. Select **UPI** as the payment method
4. In the "Pay with UPI ID / Number" field, type: `success@razorpay`
5. Click **Verify and Pay**

Razorpay's test mode treats `success@razorpay` as a magic UPI ID that always succeeds. The system will then automatically:
- Simulate a successful payment processing event
- Return a valid `razorpay_payment_id` and `razorpay_signature`
- Trigger our `verify-razorpay-payment` Edge Function to securely verify the transaction's cryptographic signature
- Update the booking status to `confirmed` inside the Supabase database
- Dispatch a confirmation email to the user via Resend
- Redirect the user seamlessly to the clean Booking Confirmation page

**Other test instruments to try:**
- **Success UPI:** `success@razorpay` — payment successfully confirms
- **Failure UPI:** `failure@razorpay` — payment triggers a simulated failure
- **Test Card:** `4111 1111 1111 1111`, any future expiry, any CVV
- **Test Netbanking:** Select any bank, credentials are auto-filled

For more extensive test card numbers and testing scenarios, refer to the [Razorpay Web Integration Test Steps](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps#2-test-integration).

### Production Build

```bash
npm run build   # Output in dist/
```

---

## Architecture

### Project Structure

```
src/
  pages/                               # Route-level page components
    Home.tsx                           # Landing: hero, packages, testimonials, FAQ
    SmartPlanner.tsx                    # 10-step AI itinerary wizard
    ItineraryResults.tsx               # AI-generated itinerary display (3 tiers)
    Packages.tsx                       # Package catalog with AI search
    PackageDetails.tsx                 # Single package detail + reviews
    BookPackage.tsx                    # Booking flow with Razorpay payment
    BookCustomItinerary.tsx            # Custom itinerary booking with Razorpay
    BookingConfirmation.tsx            # Post-payment confirmation
    MyBookings.tsx                     # User booking dashboard
    Wishlist.tsx                       # Saved packages page
    Login.tsx                          # Sign in / sign up
    About.tsx                          # Company info
    Contact.tsx                        # Contact form
    ExploreMap.tsx                     # Full-screen interactive map explorer
    admin/
      AdminDashboard.tsx               # Stats overview (bookings, revenue, users)
      AdminBookings.tsx                # Manage all bookings
      AdminPackages.tsx                # CRUD for travel packages
      AdminReviews.tsx                 # Moderate user reviews
      AdminContacts.tsx                # View contact submissions

  components/                          # Reusable UI components
    Navbar.tsx                         # Frosted glass nav, mobile slide-in
    Footer.tsx                         # Full footer (home page)
    FooterMinimal.tsx                  # Minimal footer (other pages)
    SupportChatbot.tsx                 # Floating AI chat widget
    PackageMapWidget.tsx               # Floating map toggle
    ItineraryMapView.tsx               # Day-by-day route map
    ExpandCards.tsx                     # Expand-on-hover destination showcase
    ReviewCard.tsx                     # Single review display
    ReviewForm.tsx                     # Review submission form
    ReviewsSection.tsx                 # Reviews list for a package
    StarRating.tsx                     # Interactive star rating component
    WishlistButton.tsx                 # Heart icon toggle for wishlists
    Reveal.tsx                         # IntersectionObserver fade-in wrapper
    CountUp.tsx                        # Animated number counter
    ShareButton.tsx                    # Social share / copy link
    PageLoader.tsx                     # Suspense fallback loader
    Skeleton.tsx                       # Shimmer loading placeholders
    OptimizedImage.tsx                 # Lazy image with blur-up
    ErrorBoundary.tsx                  # React error boundary
    admin/
      AdminLayout.tsx                  # Admin sidebar layout
      AdminRoute.tsx                   # Admin-only route guard

  components/ui/                       # shadcn/ui components (24)
    accordion.tsx                      button.tsx
    alert-dialog.tsx                   card.tsx
    avatar.tsx                         checkbox.tsx
    badge.tsx                          dialog.tsx
    dropdown-menu.tsx                  input.tsx
    label.tsx                          popover.tsx
    progress.tsx                       radio-group.tsx
    scroll-area.tsx                    select.tsx
    separator.tsx                      sheet.tsx
    skeleton.tsx                       switch.tsx
    table.tsx                          tabs.tsx
    textarea.tsx                       tooltip.tsx

  contexts/                            # React Context providers
    AuthContext.tsx                     # Supabase auth state
    ThemeContext.tsx                    # Dark/light mode toggle
    ToastContext.tsx                    # Toast notification system

  services/                            # External API integrations
    geminiApi.ts                       # Gemini client, model config, caching
    geminiItineraryService.ts          # Itinerary generation prompts & validation
    geminiChatService.ts               # Chatbot conversation management
    geminiSearchService.ts             # NL search query parsing
    paymentService.ts                  # Razorpay frontend API calls
    placesApi.ts                       # Places/location API

  hooks/                               # Custom React hooks
    useRazorpay.ts                     # Dynamic Razorpay checkout.js loader
    useWishlist.ts                     # Wishlist state with optimistic updates
    useAdmin.ts                        # Admin role check
    useSpeechToText.ts                 # MediaRecorder + Gemini transcription

  utils/                               # Data & helpers
    itineraryGenerator.ts              # Fallback itinerary logic
    coordinates.ts                     # 140+ city/state lat/lng coordinates

  lib/
    supabase.ts                        # Supabase client + TypeScript interfaces

  App.tsx                              # Root: providers, routing, conditional footer
  main.tsx                             # Entry point
  index.css                            # Tailwind base + oklch theme variables

supabase/
  setup_complete.sql                   # Full base schema, RLS, seed data (22 packages)
  migrations/
    20260324000000_add_razorpay_fields.sql
    20260324000001_create_reviews.sql
    20260324000002_create_wishlists.sql
    20260324000003_add_admin_role.sql
  functions/
    create-razorpay-order/             # Edge Function: Razorpay order creation
    verify-razorpay-payment/           # Edge Function: payment signature verification
    send-email/                        # Edge Function: Resend email delivery
  seed_indian_states.sql               # Additional Indian state package seeds
  update_package_images.sql            # Image URL updates
```

### Serverless Architecture (Edge Functions)

To securely orchestrate external APIs and hide sensitive platform credentials from the browser, we utilize [Supabase Edge Functions](https://supabase.com/docs/guides/functions) run globally on Deno:

1. **`create-razorpay-order`**: Keeps the `RAZORPAY_KEY_SECRET` securely out of client-side code. This function interacts with Razorpay's API to construct and securely bind the necessary `order_id` immediately upon a user initiating a booking. 
2. **`verify-razorpay-payment`**: Our critical financial security layer. It captures the payment response signature from Razorpay checkout, executes a rigorous **HMAC SHA-256 validity check**, and only stamps the booking as `confirmed` in PostgreSQL if the signature is proven authentic.
3. **`send-email`**: Interfaces directly with the Resend API to safely dispatch our branded HTML emails. This allows the process to be fully non-blocking (so users instantly hit their final success screen) whilst guarding the `RESEND_API_KEY`.

### Database Schema

Powered by Supabase (PostgreSQL + Row-Level Security). Seven tables total.

#### profiles

| Column | Type | Description |
|---|---|---|
| id | uuid (PK, FK -> auth.users) | User ID |
| full_name | text | Display name |
| phone | text | Phone number |
| city | text | Home city |
| role | text | `user` (default) or `admin` |
| created_at / updated_at | timestamptz | Timestamps |

#### packages

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
| rating / total_ratings | numeric, int | Average rating and count (auto-updated by trigger) |
| category | text | domestic / international |
| is_active | boolean | Listing visibility |

#### bookings

| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | Booking ID |
| user_id | uuid (FK -> profiles) | Booker |
| package_id | uuid (FK, nullable) | For package bookings |
| itinerary_data | jsonb (nullable) | For custom itinerary bookings |
| booking_type | text | `package` or `custom` |
| travel_dates | jsonb | Start/end dates |
| num_travelers | int | Party size |
| total_price | numeric | Total in INR |
| payment_method | text | UPI, Card, etc. |
| payment_status | text | pending / completed / failed |
| booking_status | text | confirmed / pending / cancelled |
| booking_reference | text (unique) | Human-readable reference |
| razorpay_order_id | text | Razorpay order ID |
| razorpay_payment_id | text | Razorpay payment ID |
| razorpay_signature | text | Razorpay signature (for verification audit) |

#### reviews

| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | Review ID |
| user_id | uuid (FK -> profiles) | Reviewer |
| package_id | uuid (FK -> packages) | Reviewed package |
| rating | int | 1-5 star rating |
| review_text | text | Review content |
| created_at | timestamptz | Submission time |

Unique constraint on `(user_id, package_id)`. Database trigger auto-updates `packages.rating` and `packages.total_ratings` on insert/update/delete.

#### wishlists

| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | Wishlist entry ID |
| user_id | uuid (FK -> profiles) | User |
| package_id | uuid (FK -> packages) | Saved package |
| created_at | timestamptz | Save time |

Unique constraint on `(user_id, package_id)`.

#### saved_itineraries

| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | Saved itinerary ID |
| user_id | uuid (FK -> profiles) | User |
| itinerary_data | jsonb | Full itinerary JSON |
| created_at | timestamptz | Save time |

#### contact_messages

| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | Message ID |
| name / email / phone | text | Sender info |
| message | text | Message body |
| created_at | timestamptz | Submission time |

#### Row-Level Security

| Table | Policy |
|---|---|
| profiles | Users read/write their own row. Admins can read all. |
| packages | Public read access. Admins can insert/update/delete. |
| bookings | Users access their own bookings. Admins can read/update all. |
| reviews | Public read. Authenticated users can insert their own. Users can update/delete their own. |
| wishlists | Users access only their own wishlist entries. |
| contact_messages | Authenticated users can insert. Admins can read all. |

### Pages & Workflows

#### Workflow 1: AI Itinerary Generation

```
SmartPlanner (10 steps) -> ItineraryResults (3 tiers) -> BookCustomItinerary -> Razorpay Payment -> BookingConfirmation
```

#### Workflow 2: Package Browsing & Booking

```
Packages (search/filter) -> PackageDetails (reviews, wishlist) -> BookPackage -> Razorpay Payment -> BookingConfirmation
```

#### Workflow 3: Authentication

```
Login (sign up or sign in) -> redirect to return URL or home
```

#### Workflow 4: Admin Management

```
Admin Dashboard -> Bookings / Packages / Reviews / Contacts management
```

### AI Service Architecture

```
geminiApi.ts                           # Shared singleton client
  |                                    # GoogleGenerativeAI initialization
  |                                    # Model config, JSON parsing, caching utils
  |
  +-- geminiItineraryService.ts        # Itinerary generation
  |     Persona-based prompt, response validation, tier formatting
  |
  +-- geminiChatService.ts             # Chatbot
  |     Stateful ChatSession, system prompt, follow-up parsing
  |
  +-- geminiSearchService.ts           # Smart search
        NL detection, structured filter parsing, dual-level cache
```

---

## Destination Coverage

**Domestic (17):** Maharashtra, Tamil Nadu, West Bengal, Gujarat, Rajasthan, Kerala, Uttarakhand, Varanasi, Goa, Ladakh, Himachal Pradesh, Karnataka, Jammu & Kashmir, Sikkim, Assam, Meghalaya, North East India

**International (14):** Maldives, Dubai, Thailand, Singapore, Bali, Malaysia, Sri Lanka, Nepal, Bhutan, Vietnam, Turkey, Switzerland, Paris, London

**Themes:** Adventure, Honeymoon, Family, Cultural, Religious, Beach, Heritage

**Budget Tiers:**
- **Economic** -- Budget-friendly (approx 2-5k/day domestic, 5-10k international)
- **Mid-Luxury** -- Comfortable (approx 5-12k/day domestic, 10-25k international)
- **Luxury** -- Premium (approx 15-40k/day domestic, 30-80k international)

---

## License

This project is proprietary. All rights reserved.
