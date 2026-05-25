# Requirements Document

## Introduction
Build a pixel-perfect clone of https://notegpt.io — an AI-powered learning assistant SaaS with 80M+ users. The clone must replicate the exact UI/UX, feature set, and functionality using Nuxt 4 + Tailwind CSS v4 + Nuxt UI, backed by Supabase, ElevenLabs, OpenRouter, and Stripe.

## Glossary
- **NoteGPT**: The target application being cloned (https://notegpt.io)
- **Basic Quotas**: Free-tier usage credits for standard AI tools
- **Premium Credits**: Paid-tier usage credits for advanced AI models and features
- **OpenRouter**: API gateway providing access to multiple AI models (GPT-5, Gemini, Claude, DeepSeek)
- **ElevenLabs**: AI voice synthesis platform used for Text-to-Speech features
- **RLS**: Row Level Security — Supabase/Postgres feature ensuring users can only access their own data

## Requirements

### Design System
- REQ-1: Primary color `#2E83FB` for buttons, links, and brand accent
- REQ-2: Font family Inter (sans-serif) for all text
- REQ-3: H1 at 48px Bold, body at 18px Normal
- REQ-4: Border radius 10px for cards, 8px for inputs
- REQ-5: Input background `#F7F7F7`, text color `#0F172A`
- REQ-6: Container max-width 80rem (1280px)
- REQ-7: Base spacing unit 4px (Tailwind default)

### Layouts
- REQ-8: Public layout with sticky header (logo, nav, login) and footer (links, social)
- REQ-9: Dashboard layout with collapsible left sidebar (56px collapsed / 268px open)
- REQ-10: Tool page layout with sub-navigation bar (category, sub-tabs, quota display)

### Authentication
- REQ-11: Google OAuth sign-in via Supabase Auth
- REQ-12: Email/password signup and login
- REQ-13: Auto-create user profile on signup (trigger on auth.users insert)
- REQ-14: Session persistence across page reloads
- REQ-15: Protected routes redirect unauthenticated users to /login

### Pages
- REQ-16: Homepage (logged out) with hero, tool tabs, testimonials, pricing preview, FAQ
- REQ-17: Dashboard (logged in) with greeting, search, tool tabs, carousel banners
- REQ-18: Pricing page with 4 billing tabs (Annually, Monthly, Education, SaveTogether)
- REQ-19: YouTube Video Summarizer with URL input, input type tabs, results area
- REQ-20: AI Chat with multi-model selector, message bubbles, conversation history
- REQ-21: Text-to-Speech with voice selector, settings sliders, audio player
- REQ-22: My Notes with folder management, search, type filter, sort, CRUD
- REQ-23: Login and Signup pages with Google OAuth and email form
- REQ-24: At least 15 AI tool pages (summarizers, transcribers, voices, images, study)

### AI Features
- REQ-25: YouTube transcript extraction via YouTube Data API
- REQ-26: AI summarization via OpenRouter (multi-model)
- REQ-27: AI chat with model switching (GPT-5, Gemini, Claude, DeepSeek)
- REQ-28: Text-to-Speech via ElevenLabs with voice selection and settings
- REQ-29: AI content detection
- REQ-30: AI image generation

### Quota System
- REQ-31: Free tier: 15 basic quotas, 0 premium credits
- REQ-32: Basic plan: 200 basic quotas, 0 premium credits
- REQ-33: Pro plan: 1,000 basic quotas, 100 premium credits
- REQ-34: Unlimited plan: unlimited basic, 2,800 premium credits
- REQ-35: Display remaining quota in tool pages
- REQ-36: Block tool usage when quota exhausted (show upgrade prompt)
- REQ-37: Monthly quota reset

### Payments
- REQ-38: Stripe Checkout integration for plan purchases
- REQ-39: Webhook handling for subscription lifecycle events
- REQ-40: Plan upgrade updates user quotas immediately
- REQ-41: Subscription management page (view plan, cancel)

### Database
- REQ-42: Profiles table with quota tracking fields
- REQ-43: Notes table with source types (youtube, pdf, audio, video, image, webpage, text)
- REQ-44: Folders table for note organization
- REQ-45: Conversations and messages tables for AI chat history
- REQ-46: Subscriptions table linked to Stripe
- REQ-47: Usage logs table for per-tool tracking
- REQ-48: All tables have RLS policies (users access only their own data)

### Sidebar Navigation
- REQ-49: Collapsible sidebar with smooth transition
- REQ-50: Tool icons with labels (hidden when collapsed)
- REQ-51: Active state highlighting for current route
- REQ-52: My Notes shortcut at bottom
- REQ-53: Pricing badge (30% Off) with link
- REQ-54: User avatar with initial letter
