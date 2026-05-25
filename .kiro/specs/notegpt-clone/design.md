# Technical Design

## Overview
The NoteGPT clone is a full-stack Nuxt 4 application with SSR, using Supabase for auth/database/storage, OpenRouter for AI capabilities, ElevenLabs for voice synthesis, and Stripe for payments. The frontend uses Tailwind CSS v4 + Nuxt UI for styling, with composables managing state and server routes proxying external API calls.

## Architecture
The application follows a layered architecture: Nuxt 4 frontend (pages, components, composables) communicates with Nitro server routes, which proxy requests to external services (Supabase, OpenRouter, ElevenLabs, Stripe). Supabase handles auth, database, and storage. All data access is protected by Row Level Security policies.

## Components and Interfaces

### Layouts
- `default.vue` — Public pages (header + content + footer)
- `dashboard.vue` — Authenticated pages (sidebar + topbar + content)

### Shared Components
| Component | Props | Purpose |
|-----------|-------|---------|
| `AppHeader` | none | Sticky header with logo, nav, login button |
| `AppFooter` | none | Footer with links and social icons |
| `AppSidebar` | none | Collapsible sidebar with tool navigation |
| `DashboardTopBar` | none | Top bar with menu toggle and user avatar |
| `SidebarItem` | icon, label, to, collapsed | Individual sidebar nav link |
| `QuotaDisplay` | none | Shows remaining basic/premium quotas |
| `CarouselBanner` | slides | Auto-rotating promotional banner |
| `ToolCard` | name, icon, to, description | Tool grid card |
| `PricingCard` | plan, price, features, popular | Pricing plan card |

### Composables
| Composable | Returns | Purpose |
|-----------|---------|---------|
| `useProfile()` | profile, hasQuota, remainingQuota, useQuota | User profile and quota management |
| `useNotes()` | notes, folders, fetchNotes, createNote, updateNote, deleteNote | Notes CRUD |
| `useChat()` | messages, conversations, sendMessage | AI chat with persistence |

### Server Routes
| Route | Method | External API | Input | Output |
|-------|--------|-------------|-------|--------|
| `/api/tts` | POST | ElevenLabs | text, voiceId, modelId, settings | audio/mpeg stream |
| `/api/chat` | POST | OpenRouter | messages[], model | chat completion response |
| `/api/summarize` | POST | OpenRouter | content, type | { summary: string } |
| `/api/youtube/transcript` | POST | YouTube API | videoUrl | { transcript: string } |
| `/api/stripe/checkout` | POST | Stripe | priceId, userId | { url: string } |
| `/api/stripe/webhook` | POST | Stripe | event payload | 200 OK |

### Middleware
- `auth.ts` — Redirects unauthenticated users from protected routes to /login
- `quota.ts` — Checks quota availability before tool usage

## Data Models

### profiles
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK, FK → auth.users) | User ID |
| email | text | User email |
| full_name | text | Display name |
| avatar_url | text | Profile picture URL |
| plan | text | free, basic, pro, unlimited |
| basic_quotas_used | integer | Current month usage |
| basic_quotas_limit | integer | Monthly limit |
| premium_credits_used | integer | Current month premium usage |
| premium_credits_limit | integer | Monthly premium limit |
| quota_reset_at | timestamptz | Next reset date |

### notes
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Note ID |
| user_id | uuid (FK → profiles) | Owner |
| folder_id | uuid (FK → folders, nullable) | Parent folder |
| title | text | Note title |
| content | text | Full content |
| source_type | text | youtube, pdf, audio, video, image, webpage, text |
| source_url | text | Original source URL |
| summary | text | AI-generated summary |
| metadata | jsonb | Additional data (timestamps, thumbnails) |

### conversations
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Conversation ID |
| user_id | uuid (FK → profiles) | Owner |
| title | text | Conversation title |
| model | text | AI model used |

### messages
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Message ID |
| conversation_id | uuid (FK → conversations) | Parent conversation |
| role | text | user, assistant, system |
| content | text | Message content |

### subscriptions
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Subscription ID |
| user_id | uuid (FK → profiles, unique) | Owner |
| stripe_customer_id | text | Stripe customer ID |
| stripe_subscription_id | text | Stripe subscription ID |
| plan | text | Current plan |
| status | text | active, canceled, past_due, expired |

### usage_logs
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Log ID |
| user_id | uuid (FK → profiles) | User |
| tool | text | Tool name used |
| credits_used | integer | Credits consumed |
| is_premium | boolean | Whether premium credits were used |

## Correctness Properties

### Property 1: Data Isolation
Users can only access their own data, enforced by RLS policies on all tables.

### Property 2: Quota Integrity
Quota cannot go negative — tool usage is blocked when quota is exhausted.

### Property 3: Profile Consistency
Profile is always created on signup via database trigger (no orphan auth users).

### Property 4: Payment Idempotency
Stripe webhook events are idempotent — duplicate events don't double-update plans or quotas.

### Property 5: Message Ordering
Chat messages are ordered by created_at within a conversation.

### Property 6: Ownership Constraint
Notes belong to exactly one user and optionally one folder.

## Error Handling
- **Auth errors**: Display inline error message on login/signup forms, redirect to /login on 401
- **API rate limits**: Show toast notification with retry suggestion
- **Quota exhausted**: Show upgrade prompt modal instead of error
- **Network failures**: Retry with exponential backoff (max 3 attempts) for API calls
- **Stripe webhook failures**: Return 200 to prevent retries, log error for investigation
- **Invalid input**: Client-side validation before API calls, server-side validation in route handlers
- **ElevenLabs errors**: Graceful fallback message with suggestion to try different voice/model

## Testing Strategy
- **Component tests**: Vitest + Vue Test Utils for shared components (SidebarItem, QuotaDisplay, PricingCard)
- **Composable tests**: Vitest for useProfile, useNotes, useChat logic
- **API route tests**: Vitest for server routes with mocked external APIs
- **E2E tests**: Playwright for critical flows (signup → login → use tool → save note)
- **Visual regression**: Playwright screenshots compared against live site screenshots
- **Manual testing**: Side-by-side comparison with notegpt.io on desktop and mobile
