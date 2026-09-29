# ProjectX Frontend Architecture Standard

> **Status: IMPLEMENTED** — This document describes the current architecture as of 2026-09-29.

---

## 1. Architecture: Feature-Sliced Design + Next.js App Router

The app uses the **Next.js App Router** for real file-based routing. Every major feature has its own route AND its own feature slice directory. The Floating Dock and Theme Selector persist in the root `layout.tsx` across all routes.

### Route ↔ Feature Mapping

| Route | Feature Slice | Status |
|---|---|---|
| `/` | `app/page.tsx` (Hub) | ✅ Live |
| `/foundry` | `features/foundry/` | ✅ Live (MVP) |
| `/chat` | `features/chat/` | ✅ Live |
| `/voice` | `features/voice/` | ✅ Live |
| `/shopping` | `features/shopping/` | ✅ Live |
| `/dashboard` | `features/dashboard/` | ✅ Live |
| `/lens` | `features/lens/` | 🟡 Stub |
| `/multiplier` | `features/multiplier/` | 🟡 Stub |
| `/scout` | `features/scout/` | 🟡 Stub |
| `/architect` | `features/architect/` | 🟡 Stub |

### Key Decisions

1. **App Router over SPA state routing.** We migrated away from `page.tsx` using `activeView` state to switch between features. Each feature now has a real URL, enabling browser back/forward, deep-linking, and code splitting.

2. **Lazy loading via `next/dynamic`.** Every feature route uses `dynamic()` with `ssr: false` to ensure the Hub loads instantly without carrying the weight of all feature modules.

3. **Global layout components** (FloatingDock, ThemeSelector) live in `components/layout/` and are rendered once in `layout.tsx`.

---

## 2. Feature Slice Anatomy

A fully-developed feature slice looks like this:

```
features/<name>/
├── components/           # All React components for this feature
│   ├── <name>-workspace.tsx   # Main container component
│   └── <sub-component>.tsx    # Specialized sub-components
├── store.ts              # Zustand store (feature-isolated state)
├── api.ts                # Feature-specific API calls
└── README.md             # Optional: PRD, design decisions
```

### Rules

- **Self-containment:** You MUST be able to delete `features/<name>/` and `app/<name>/` without breaking any other feature.
- **No cross-feature store imports.** If Feature A needs Feature B's data, lift the shared data into a global store or use event-driven patterns.
- **Each feature with persistent state MUST have its own `store.ts`.** Don't scatter `useState` across multiple components.

---

## 3. Shared Code

| Location | What goes here | What does NOT go here |
|---|---|---|
| `components/layout/` | Dock, ThemeSelector, future global modals | Feature-specific components |
| `lib/api-client.ts` | Health check, model listing (cross-cutting) | Chat-specific, Shopping-specific API calls |
| `lib/utils.ts` | Generic utilities (`cn()`) | Feature-specific helpers |
| `types/api.ts` | TypeScript types mirroring Python Pydantic schemas | UI-only types (those go in the feature's `store.ts`) |

---

## 4. State Management

| Scope | Tool | Location |
|---|---|---|
| Theme | `useState` in `ThemeSelector` + `data-theme` attribute | `components/layout/theme-selector.tsx` |
| Navigation | `usePathname()` from Next.js | `components/layout/floating-dock.tsx` |
| Feature state | Zustand | `features/<name>/store.ts` |

---

## 5. Performance Strategy

1. **Hub loads only:** Hub markup + Dock + ThemeSelector. Zero feature code.
2. **On navigation:** Browser fetches the specific JS chunk for that feature route.
3. **Heavy deps isolated:** `recharts` only loads on `/shopping`. `react-markdown` only loads on `/chat` and `/foundry`.

---

## 6. Adding a New Feature

See `web/AGENTS.md` Section 7 for the complete step-by-step checklist.

---

*This architecture scales from 4 features to 40 features without collapsing.*
