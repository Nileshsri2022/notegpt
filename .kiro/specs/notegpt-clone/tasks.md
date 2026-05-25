# NoteGPT Clone — Implementation Tasks

## Phase 1: Foundation ✅ (Complete)
- [x] Task 1: Scaffold Nuxt 4 project
- [x] Task 2: Install dependencies (Nuxt UI, Tailwind v4, Supabase, ElevenLabs, VueUse)
- [x] Task 3: Configure design system (colors, fonts, spacing)
- [x] Task 4: Build layouts (default, dashboard)
- [x] Task 5: Build shared components (Header, Footer, Sidebar, TopBar, SidebarItem)
- [x] Task 6: Create homepage (hero, tool tabs, testimonials, pricing preview, FAQ)
- [x] Task 7: Create pricing page (4 tabs, 3 plans each)
- [x] Task 8: Create login/signup pages with Supabase Auth
- [x] Task 9: Set up Supabase database (profiles, notes, folders, conversations, messages, subscriptions, usage_logs)
- [x] Task 10: Create composables (useProfile, useNotes)
- [x] Task 11: Create server API routes (tts, chat, summarize)

## Phase 2: Pixel-Perfect UI Refinement
- [ ] Task 12: Match sidebar exactly to live site (icons, spacing, active states, collapse behavior)
- [ ] Task 13: Match tool sub-navigation bar (category label, sub-tabs, quota display)
- [ ] Task 14: Build CarouselBanner component (4 slides with auto-rotation)
- [ ] Task 15: Match homepage logged-in view (greeting, search, tool tabs, carousel)
- [ ] Task 16: Build QuotaDisplay component ("15 basic | 0 premium | 🚀 Upgrade")
- [ ] Task 17: Match YouTube Summarizer page exactly (input types, sub-tabs, URL input, results area)
- [ ] Task 18: Match AI Chat page exactly (model selector, chat bubbles, input area, quick tools)
- [ ] Task 19: Match Text-to-Speech page exactly (voice selector, settings, audio player)
- [ ] Task 20: Match My Notes page exactly (folder tree, note cards, filters, empty state)
- [ ] Task 21: Match Pricing page exactly (tabs, cards, badges, countdown timer)

## Phase 3: Core Functionality
- [ ] Task 22: Wire up YouTube transcript extraction (YouTube Data API)
- [ ] Task 23: Wire up AI summarization with real OpenRouter calls
- [ ] Task 24: Wire up AI Chat with conversation persistence
- [ ] Task 25: Wire up Text-to-Speech with ElevenLabs (real audio generation)
- [ ] Task 26: Wire up Notes CRUD with Supabase (create, read, update, delete, folders)
- [ ] Task 27: Implement quota system (check before use, increment after use, display remaining)
- [ ] Task 28: Add auth middleware (protect dashboard/tool routes)
- [ ] Task 29: Build "Save to Notes" flow from tool results

## Phase 4: Additional Tool Pages
- [ ] Task 30: Build tool page template (reusable for all tools)
- [ ] Task 31: PDF Summarizer page (file upload + summarize)
- [ ] Task 32: AI Voice Generator page (voice selection + generation)
- [ ] Task 33: AI Image Generator page (prompt input + image display)
- [ ] Task 34: AI Detector page (text input + detection results)
- [ ] Task 35: AI Flashcard Maker page (content input + flashcard display)
- [ ] Task 36: AI Quiz Generator page (content input + quiz display)
- [ ] Task 37: AI Presentation Maker page
- [ ] Task 38: AI Mind Map Generator page
- [ ] Task 39: AI Math Solver page
- [ ] Task 40: Audio/Video Summarizer pages

## Phase 5: Payments & Subscriptions
- [ ] Task 41: Create Stripe products and prices (Basic, Pro, Unlimited)
- [ ] Task 42: Build checkout flow (pricing page → Stripe Checkout → success)
- [ ] Task 43: Handle Stripe webhooks (subscription created/updated/canceled)
- [ ] Task 44: Update user plan + quotas on successful payment
- [ ] Task 45: Build subscription management page

## Phase 6: Polish & Deploy
- [ ] Task 46: Add loading states and skeleton screens
- [ ] Task 47: Add error handling and toast notifications
- [ ] Task 48: SEO optimization (meta tags, OG images, structured data)
- [ ] Task 49: Mobile responsive refinement
- [ ] Task 50: Deploy to Vercel
- [ ] Task 51: Configure custom domain
- [ ] Task 52: Final visual comparison with live site
