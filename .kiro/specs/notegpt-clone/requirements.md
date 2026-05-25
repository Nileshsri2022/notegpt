# NoteGPT Clone — Requirements Specification

## Overview
Build a pixel-perfect clone of https://notegpt.io — an AI-powered learning assistant SaaS with 80M+ users. The clone must replicate the exact UI/UX, feature set, and functionality using Nuxt 4 + Tailwind CSS v4 + Nuxt UI.

## Design System (Verified via Firecrawl Branding Extraction)

### Colors
- Primary: `#2E83FB` (buttons, links, brand accent)
- Secondary: `#64748B` (muted text)
- Text Primary: `#111827` (headings, body)
- Background: `#FFFFFF`
- Theme Color: `#2E83FB`
- Input Background: `#F7F7F7`
- Input Text: `#0F172A`

### Typography
- Font Family: Inter, sans-serif
- H1: 48px, Bold
- Body: 18px, Normal (400)
- Mono: ui-monospace, SFMono-Regular

### Spacing & Borders
- Base unit: 4px
- Border radius (cards): 10px
- Border radius (inputs): 8px
- Container max-width: 80rem (1280px)

### Logo
- URL: `https://cdn.notegpt.io/notegpt/static/tario_image/home/logo_with_notegpt.webp`
- Favicon: `https://cdn.notegpt.io/notegpt/static/logo/NoteGPT_logo_blue.png`

---

## Layouts (Verified via Playwright Screenshots)

### Layout 1: Public (Logged Out)
- Sticky header: Logo + Nav (Products dropdown, Pricing) + Language selector + Login button
- Full-width content area
- Footer: Logo + tagline + social links + 4-column link grid

### Layout 2: Dashboard (Logged In)
- Left sidebar (collapsible, 56px collapsed / 268px open)
  - Tool navigation buttons (Home, AI YouTube, AI Transcriber, etc.)
  - My Notes button
  - Pricing badge (30% Off)
  - User avatar (initial letter)
- Top bar: Hamburger (mobile) + Logo + Settings icon
- Main content area

### Layout 3: Tool Page (Logged In)
- Same sidebar as Dashboard
- Tool sub-navigation bar:
  - Category label (e.g., "AI YouTube")
  - Sub-tabs (YouTube Summarizer, Transcript, Subtitle, Subscriptions, More)
  - YouTube Extension link (external)
  - Separator
  - My Notes button
- Quota display: "15" basic | "0" premium | 🚀 Upgrade
- Main tool content

---

## Pages Required

### Core Pages
1. `/` — Homepage (logged out: hero + tabs + testimonials + pricing + FAQ)
2. `/` — Dashboard (logged in: greeting + search + tool tabs + carousel)
3. `/pricing` — Pricing plans (4 tabs: Annually/Monthly/Education/SaveTogether)
4. `/login` — Login (Google OAuth + email/password)
5. `/signup` — Signup
6. `/notes` — My Notes (folders, search, filter, sort, CRUD)
7. `/settings` — Account settings

### AI Tool Pages (15 core tools)
8. `/youtube-video-summarizer` — YouTube Video Summarizer
9. `/youtube-transcript-generator` — Transcript Generator
10. `/youtube-subtitle-downloader` — Subtitle Downloader
11. `/pdf-summary` — PDF Summarizer
12. `/ai-chat` — AI Chat (multi-model)
13. `/text-to-speech` — Text to Speech (ElevenLabs)
14. `/ai-voice-generator` — AI Voice Generator
15. `/ai-image-generator` — AI Image Generator
16. `/ai-background-remover` — Background Remover
17. `/ai-detector` — AI Detector
18. `/ai-flashcard-maker` — Flashcard Maker
19. `/ai-quiz-generator` — Quiz Generator
20. `/ai-presentation-maker` — Presentation Maker
21. `/ai-mind-map-generator` — Mind Map Generator
22. `/ai-math-solver` — Math Solver

### Static Pages
23. `/about-us`
24. `/contact-us`
25. `/privacy`
26. `/terms`
27. `/faq`
28. `/blog`
29. `/free-tools`

---

## Feature Requirements

### F1: Authentication
- Google OAuth (Supabase Auth)
- Email/password signup & login
- Auto-create profile on signup
- Session persistence
- Protected routes (dashboard, notes, tools)

### F2: YouTube Video Summarizer
- URL input (single + batch "Add More Link")
- Input type tabs: YouTube | Video | Audio | PDF/Image | Webpage | Long Text
- Sub-tabs: YouTube Video | YouTube Playlist
- "Generate Summary" button
- Results tabs: My Notes | Batch Tasks
- Recent video thumbnails
- Related tools section
- Quota consumption tracking

### F3: AI Chat
- Multi-model selector (GPT-5, Gemini, Claude, DeepSeek)
- Chat interface with message bubbles
- Typing indicator
- Quick tools: Upload, DeepThink, Guided Learning
- Conversation history (saved to Supabase)
- Quick action buttons: AI Humanizer, AI Detector, AI Podcast, TTS, AI Image

### F4: Text-to-Speech (ElevenLabs)
- Voice selection dropdown
- Model selection (Multilingual v2, Turbo, Flash)
- Voice settings sliders: Stability, Clarity, Style, Speed
- Text input (max 5000 chars)
- Audio player with play/pause, progress bar, download
- Quota tracking

### F5: My Notes
- Folder management (create, rename, delete)
- Note list with search, type filter, sort
- Note types: YouTube, PDF, Audio, Video, Image, Webpage, Text
- CRUD operations
- Empty state with CTA

### F6: Pricing & Subscriptions (Stripe)
- 4 billing tabs: Annually (Save 50%), Monthly, Education, SaveTogether
- 3 plan cards per tab with features list
- Stripe Checkout integration
- Subscription management
- Quota limits per plan:
  - Free: 15 basic, 0 premium
  - Basic: 200 basic, 0 premium
  - Pro: 1,000 basic, 100 premium
  - Unlimited: ∞ basic, 2,800 premium

### F7: Quota System
- Track basic_quotas_used vs basic_quotas_limit
- Track premium_credits_used vs premium_credits_limit
- Display in tool pages: "15 basic | 0 premium | 🚀 Upgrade"
- Monthly reset
- Usage logging per tool

### F8: Sidebar Navigation
- Collapsible (56px / 268px)
- Tool icons with labels
- Active state highlighting
- My Notes shortcut
- Pricing badge (30% Off)
- User avatar

---

## Tech Stack
- **Framework**: Nuxt 4 (Vue 3)
- **Styling**: Tailwind CSS v4 + Nuxt UI
- **Auth**: Supabase Auth (Google OAuth + email)
- **Database**: Supabase PostgreSQL
- **AI**: OpenRouter (multi-model chat, summarization)
- **TTS**: ElevenLabs SDK
- **Payments**: Stripe
- **Deployment**: Vercel

---

## Database Schema (Already Created in Supabase)
- `profiles` — user profiles with quota tracking
- `folders` — note organization
- `notes` — with source types and metadata
- `conversations` + `messages` — AI chat history
- `subscriptions` — Stripe integration
- `usage_logs` — per-tool usage tracking

All tables have RLS policies (users can only access their own data).

---

## API Routes Required
- `POST /api/tts` — ElevenLabs text-to-speech (done)
- `POST /api/chat` — OpenRouter AI chat (done)
- `POST /api/summarize` — OpenRouter summarization (done)
- `POST /api/youtube/transcript` — YouTube transcript extraction
- `POST /api/stripe/checkout` — Create Stripe checkout session
- `POST /api/stripe/webhook` — Handle Stripe webhooks
- `POST /api/detect` — AI content detection
- `POST /api/image/generate` — AI image generation
