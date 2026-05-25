# NoteGPT Clone — Design Document

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Nuxt 4)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │  Pages   │  │Components│  │Composables│  │ Layouts │  │
│  └────┬─────┘  └────┬─────┘  └────┬──────┘  └───┬────┘  │
│       │              │              │             │       │
│       └──────────────┴──────────────┴─────────────┘       │
│                          │                                │
├──────────────────────────┼────────────────────────────────┤
│                   Server (Nitro)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │ /api/tts │  │/api/chat │  │/api/stripe│               │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘               │
│       │              │              │                     │
├───────┼──────────────┼──────────────┼─────────────────────┤
│       │              │              │                     │
│  ┌────▼─────┐  ┌────▼─────┐  ┌────▼─────┐  ┌─────────┐ │
│  │ElevenLabs│  │OpenRouter │  │  Stripe  │  │Supabase │ │
│  │   API    │  │   API     │  │   API    │  │  Auth   │ │
│  └──────────┘  └──────────┘  └──────────┘  │  DB     │ │
│                                             │  Storage│ │
│                                             └─────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Component Hierarchy

### Shared Components
- `AppHeader.vue` — Public header (logo, nav, login)
- `AppFooter.vue` — Public footer (links, social)
- `AppSidebar.vue` — Dashboard sidebar (collapsible)
- `DashboardTopBar.vue` — Dashboard top bar
- `SidebarItem.vue` — Individual sidebar nav item
- `ToolSubNav.vue` — Tool page sub-navigation
- `QuotaDisplay.vue` — Quota indicator (basic | premium | upgrade)
- `PricingCard.vue` — Reusable pricing plan card
- `TestimonialCard.vue` — Testimonial card
- `ToolCard.vue` — Tool grid card (icon + name + description)

### Page-Specific Components
- `ChatMessage.vue` — Chat bubble (user/assistant)
- `ChatInput.vue` — Chat input with actions
- `ModelSelector.vue` — AI model dropdown
- `VoiceSelector.vue` — TTS voice picker
- `AudioPlayer.vue` — Audio playback with progress
- `NoteCard.vue` — Note list item
- `FolderTree.vue` — Folder navigation
- `CarouselBanner.vue` — Homepage carousel

## Composables
- `useProfile()` — User profile + quota management
- `useNotes()` — Notes CRUD + folders
- `useChat()` — Chat conversations + messages
- `useQuota()` — Quota checking + consumption
- `useTools()` — Tool definitions + categories

## Server Routes
| Route | Method | External API | Purpose |
|-------|--------|-------------|---------|
| `/api/tts` | POST | ElevenLabs | Text-to-speech generation |
| `/api/chat` | POST | OpenRouter | AI chat completions |
| `/api/summarize` | POST | OpenRouter | Content summarization |
| `/api/youtube/transcript` | POST | YouTube API | Extract video transcripts |
| `/api/stripe/checkout` | POST | Stripe | Create checkout session |
| `/api/stripe/webhook` | POST | Stripe | Handle payment events |
| `/api/detect` | POST | OpenRouter | AI content detection |

## Middleware
- `auth.ts` — Redirect unauthenticated users from protected routes
- `quota.ts` — Check quota before tool usage

## State Management
- Supabase session (via `@nuxtjs/supabase`)
- `useState()` for profile, notes, conversations
- No Pinia needed — composables handle state

## Deployment
- Vercel (SSR mode)
- Environment variables via Vercel dashboard
- Supabase for all backend services
