# Graph Report - notegpt  (2026-05-25)

## Corpus Check
- 28 files · ~57,449 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 47 nodes · 16 edges · 3 communities detected
- Extraction: 62% EXTRACTED · 38% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `af317f6d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]

## God Nodes (most connected - your core abstractions)
1. `Notes Management` - 4 edges
2. `AI Chat Feature` - 3 edges
3. `Nuxt 3 Framework` - 2 edges
4. `YouTube Video Summarizer` - 2 edges
5. `Text-to-Speech Feature` - 2 edges
6. `Pricing & Subscription` - 2 edges
7. `Nuxt Minimal Starter` - 1 edges
8. `Supabase Authentication` - 1 edges
9. `Dashboard Layout System` - 1 edges
10. `AI Chat Live Screenshot` - 1 edges

## Surprising Connections (you probably didn't know these)
- `Homepage Screenshot` --references--> `Nuxt 3 Framework`  [INFERRED]
  notegpt-homepage-screenshot.png → README.md
- `YouTube Summarizer Screenshot` --references--> `YouTube Video Summarizer`  [EXTRACTED]
  notegpt-youtube-summarizer.png → app/pages/youtube-video-summarizer.vue
- `AI Chat Live Screenshot` --references--> `AI Chat Feature`  [EXTRACTED]
  notegpt-ai-chat-live.png → app/pages/ai-chat.vue
- `Text-to-Speech Screenshot` --references--> `Text-to-Speech Feature`  [EXTRACTED]
  notegpt-tts-live.png → app/pages/text-to-speech.vue
- `Notes Page Screenshot` --references--> `Notes Management`  [EXTRACTED]
  notegpt-my-notes.png → app/pages/notes.vue

## Hyperedges (group relationships)
- **AI-Powered Features** — concept_youtube_summarizer, concept_ai_chat, concept_text_to_speech [INFERRED 0.85]
- **Authentication Flow** — concept_supabase_auth, concept_dashboard_layout, concept_notes_management [INFERRED 0.80]

## Communities (31 total, 0 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.33
Nodes (6): AI Chat Feature, Text-to-Speech Feature, YouTube Video Summarizer, AI Chat Live Screenshot, Text-to-Speech Screenshot, YouTube Summarizer Screenshot

### Community 1 - "Community 1"
Cohesion: 0.33
Nodes (6): Dashboard Layout System, Notes Management, Pricing & Subscription, Supabase Authentication, Notes Page Screenshot, Pricing Page Screenshot

### Community 2 - "Community 2"
Cohesion: 0.67
Nodes (3): Nuxt 3 Framework, Homepage Screenshot, Nuxt Minimal Starter

## Knowledge Gaps
- **9 isolated node(s):** `Nuxt Minimal Starter`, `Supabase Authentication`, `Dashboard Layout System`, `AI Chat Live Screenshot`, `Homepage Screenshot` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 3 inferred relationships involving `Notes Management` (e.g. with `Supabase Authentication` and `Pricing & Subscription`) actually correct?**
  _`Notes Management` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `AI Chat Feature` (e.g. with `YouTube Video Summarizer` and `Text-to-Speech Feature`) actually correct?**
  _`AI Chat Feature` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Nuxt Minimal Starter`, `Supabase Authentication`, `Dashboard Layout System` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._