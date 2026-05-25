# Implementation Plan

## Overview
This plan covers the full implementation of the NoteGPT clone — a pixel-perfect replica of https://notegpt.io built with Nuxt 4, Tailwind CSS v4, Nuxt UI, Supabase, ElevenLabs, OpenRouter, and Stripe. The work is divided into 6 phases across 52 tasks.

## Tasks

- [x] 1. Scaffold Nuxt 4 project
- [x] 2. Install dependencies (Nuxt UI, Tailwind v4, Supabase, ElevenLabs, VueUse)
- [x] 3. Configure design system (colors, fonts, spacing)
- [x] 4. Build layouts (default, dashboard)
- [x] 5. Build shared components (Header, Footer, Sidebar, TopBar, SidebarItem)
- [x] 6. Create homepage (hero, tool tabs, testimonials, pricing preview, FAQ)
- [x] 7. Create pricing page (4 tabs, 3 plans each)
- [x] 8. Create login/signup pages with Supabase Auth
- [x] 9. Set up Supabase database (profiles, notes, folders, conversations, messages, subscriptions, usage_logs)
- [x] 10. Create composables (useProfile, useNotes)
- [x] 11. Create server API routes (tts, chat, summarize)
- [x] 12. Match sidebar exactly to live site (icons, spacing, active states, collapse behavior)
- [x] 13. Match tool sub-navigation bar (category label, sub-tabs, quota display)
- [x] 14. Build CarouselBanner component (4 slides with auto-rotation)
- [x] 15. Match homepage logged-in view (greeting, search, tool tabs, carousel)
- [x] 16. Build QuotaDisplay component (basic | premium | upgrade)
- [x] 17. Match YouTube Summarizer page exactly (input types, sub-tabs, URL input, results area)
- [x] 18. Match AI Chat page exactly (model selector, chat bubbles, input area, quick tools)
- [x] 19. Match Text-to-Speech page exactly (voice selector, settings, audio player)
- [x] 20. Match My Notes page exactly (folder tree, note cards, filters, empty state)
- [x] 21. Match Pricing page exactly (tabs, cards, badges, countdown timer)
- [x] 22. Wire up YouTube transcript extraction (YouTube Data API)
- [x] 23. Wire up AI summarization with real OpenRouter calls
- [x] 24. Wire up AI Chat with conversation persistence
- [x] 25. Wire up Text-to-Speech with ElevenLabs (real audio generation)
- [x] 26. Wire up Notes CRUD with Supabase (create, read, update, delete, folders)
- [x] 27. Implement quota system (check before use, increment after use, display remaining)
- [x] 28. Add auth middleware (protect dashboard/tool routes)
- [x] 29. Build Save to Notes flow from tool results
- [x] 30. Build tool page template (reusable for all tools)
- [x] 31. PDF Summarizer page (file upload + summarize)
- [x] 32. AI Voice Generator page (voice selection + generation)
- [x] 33. AI Image Generator page (prompt input + image display)
- [x] 34. AI Detector page (text input + detection results)
- [x] 35. AI Flashcard Maker page (content input + flashcard display)
- [x] 36. AI Quiz Generator page (content input + quiz display)
- [x] 37. AI Presentation Maker page
- [x] 38. AI Mind Map Generator page
- [x] 39. AI Math Solver page
- [x] 40. Audio and Video Summarizer pages
- [x] 41. Create Stripe products and prices (Basic, Pro, Unlimited)
- [x] 42. Build checkout flow (pricing page to Stripe Checkout to success)
- [x] 43. Handle Stripe webhooks (subscription created/updated/canceled)
- [x] 44. Update user plan and quotas on successful payment
- [x] 45. Build subscription management page
- [x] 46. Add loading states and skeleton screens
- [x] 47. Add error handling and toast notifications
- [x] 48. SEO optimization (meta tags, OG images, structured data)
- [x] 49. Mobile responsive refinement
- [ ] 50. Deploy to Vercel
- [ ] 51. Configure custom domain
- [ ] 52. Final visual comparison with live site

## Task Dependency Graph
```json
{
  "waves": [
    [1, 2, 3],
    [4, 5, 6, 7, 8],
    [9, 10, 11],
    [12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
    [22, 23, 24, 25, 26, 27, 28, 29],
    [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
    [41, 42, 43, 44, 45],
    [46, 47, 48, 49, 50, 51, 52]
  ]
}
```

## Notes
- Waves 1-3 (Phase 1) are complete.
- Wave 4 (UI refinement) and Wave 5 (core functionality) can run in parallel.
- Wave 6 (additional tool pages) depends on Task 30 (tool page template).
- Wave 7 (Stripe payments) is independent of Waves 4-6.
- Wave 8 (polish and deploy) depends on all previous waves.
- YouTube Data API key is not yet configured — needed for Task 22.
- ElevenLabs and OpenRouter keys are already in .env and working.
- Supabase database schema is fully set up with RLS policies.
- Screenshots of the live site are saved in the project root for visual reference.
