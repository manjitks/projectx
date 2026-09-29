# ProjectX Frontend — Mandatory Design, Architecture & Code Policy
> **VERSION 2.0 — Last updated: 2026-09-29**
> **READ THIS ENTIRE FILE BEFORE WRITING ANY FRONTEND CODE.**
> **VIOLATION OF ANY RULE MEANS YOUR CODE WILL BE REJECTED.**

---

## 0. PREAMBLE — WHAT THIS APP IS NOT

**ProjectX is NOT a generic AI dashboard.** If your output looks like "yet another dark-mode SaaS sidebar app with cards," you have FAILED.

We draw inspiration from: **Arc Browser, Linear, Raycast, Supabase Studio, Vercel v0.**
We reject: Material Design, Bootstrap aesthetic, generic Tailwind starter kits, ChatGPT clones.

### BANNED VISUAL PATTERNS — Automatic Rejection

| ❌ BANNED | Why |
|---|---|
| Traditional sidebar + content layout | Every AI tool uses this. We use a floating bottom dock. |
| Card grids with icon + title + description (and nothing else) | Generic dashboard energy. Our tiles have LIVE PREVIEWS. |
| `bg-gray-900`, `bg-slate-800`, `text-gray-400` (Tailwind color classes) | Use CSS variables: `var(--text-primary)`, `var(--tile-bg)`, etc. |
| Hardcoded hex colors in components (e.g., `color: "#7c5cfc"`) | Use `var(--accent)`. The app has 4 dynamic themes. Hardcoded hex breaks all themes except one. |
| Fixed left sidebar with nav icons | We use `FloatingDock` at the bottom. |
| Placeholder images from Unsplash/stock | Use CSS gradients, SVG patterns, or generated assets. |
| Generic hero sections with gradient text | We are a tool, not a marketing landing page. |

---

## 1. ARCHITECTURE — Feature-Sliced Design + App Router

### 1.1 The Golden Rule

> **Every feature is a self-contained capsule inside `src/features/<name>/`.
> If you cannot delete that directory (and its `app/<name>/` route) and have the rest of the app compile, your code is wrong.**

### 1.2 Directory Structure (Current Truth — Follow Exactly)

```
web/src/
├── app/                              # ROUTES ONLY — thin wrappers
│   ├── globals.css                   # THE design system. All styles live here.
│   ├── layout.tsx                    # Root: ThemeSelector + FloatingDock + aurora-bg
│   ├── page.tsx                      # Hub — Bento Grid (ONLY route with feature tiles)
│   ├── <feature>/page.tsx            # One per feature. Uses dynamic() import.
│   └── ...
├── components/
│   └── layout/                       # GLOBAL persistent components ONLY
│       ├── floating-dock.tsx          # Bottom dock nav
│       └── theme-selector.tsx         # Theme picker
├── features/                         # FEATURE SLICES — the core of the app
│   ├── chat/
│   │   ├── components/               # Chat-specific UI components
│   │   │   └── chat-container.tsx
│   │   └── store.ts                  # Chat Zustand store
│   ├── foundry/
│   │   ├── components/
│   │   │   └── foundry-workspace.tsx
│   │   ├── store.ts
│   │   └── README.md                 # Feature PRD
│   ├── shopping/
│   │   ├── components/
│   │   │   └── shopping-helper.tsx
│   │   └── store.ts
│   ├── voice/
│   │   └── components/
│   │       └── voice-assistant.tsx
│   ├── dashboard/
│   │   └── components/
│   │       └── system-dashboard.tsx
│   ├── lens/components/              # Stub — ready for development
│   ├── multiplier/components/        # Stub — ready for development
│   ├── scout/components/             # Stub — ready for development
│   └── architect/components/         # Stub — ready for development
├── lib/
│   ├── api-client.ts                 # Shared base API client (health, models)
│   └── utils.ts                      # cn() utility
└── types/
    └── api.ts                        # TypeScript types mirroring Python schemas
```

### 1.3 Rules for the Directory Structure

1. **`app/<feature>/page.tsx`** files are **THIN WRAPPERS**. They contain ONLY a dynamic import and a loading spinner. No business logic. No state. No styling beyond the `feature-page` wrapper class.

   ```tsx
   // CORRECT — app/chat/page.tsx
   "use client";
   import dynamic from "next/dynamic";
   const ChatContainer = dynamic(
     () => import("@/features/chat/components/chat-container").then(m => m.ChatContainer),
     { ssr: false, loading: () => <LoadingSpinner label="Loading Chat" /> }
   );
   export default function ChatPage() {
     return <div className="feature-page pt-8"><ChatContainer /></div>;
   }
   ```

2. **NEVER put component code directly in `app/<feature>/page.tsx`**. Always import from `features/<name>/components/`.

3. **NEVER create a new CSS file.** ALL styles live in `globals.css`.

4. **NEVER put feature-specific components in `src/components/`.** That directory is ONLY for globally persistent layout components (Dock, ThemeSelector). Feature components go in `features/<name>/components/`.

5. **Each feature that manages state MUST have a `store.ts`** inside its feature directory. Use Zustand. Do not use component-level `useState` for anything that persists across renders or could be needed by sibling components.

6. **Feature-specific API functions** should be placed in `features/<name>/api.ts`, NOT in the shared `lib/api-client.ts`. The shared client is only for cross-cutting endpoints (health check, model listing).

---

## 2. DYNAMIC THEMING — CSS Variables (MANDATORY)

### 2.1 The System

ProjectX uses a **CSS custom property theme system** with 4 hand-crafted palettes. Themes are toggled by setting `data-theme` on the `<html>` element. All variables are defined in `globals.css`.

**Active themes:** `cosmic` (default), `emerald`, `nordic`, `monochrome`.

### 2.2 Available Tokens — Use ONLY These

| Token | Purpose | Example (Cosmic) |
|---|---|---|
| `var(--bg-base)` | Page background | `#0f0c29` |
| `var(--text-primary)` | Main text, headings | `#f8f8ff` |
| `var(--text-muted)` | Labels, secondary text | `#a0a0b0` |
| `var(--accent)` | Primary brand color, CTAs | `#c33764` |
| `var(--accent-glow)` | Glow shadows, subtle backgrounds | `rgba(195,55,100,0.4)` |
| `var(--tile-bg)` | Card/tile background | `rgba(20,15,40,0.6)` |
| `var(--tile-border)` | Card/tile border | `rgba(255,255,255,0.08)` |
| `var(--tile-hover-bg)` | Card hover background | `rgba(30,20,50,0.8)` |
| `var(--dock-bg)` | Floating dock background | `rgba(15,10,30,0.8)` |
| `var(--blob-1)`, `var(--blob-2)`, `var(--blob-3)` | Aurora background blobs | Various |

### 2.3 The Hard Rules

1. **NEVER use hardcoded hex/rgb colors for text, backgrounds, borders, or accents in component code.** Always use `var(--token-name)`. The ONLY place hex values appear is inside `globals.css` theme definitions.

2. **NEVER use Tailwind color utility classes** (`bg-slate-800`, `text-gray-400`, `border-zinc-700`). These bypass the theme system entirely. Use `style={{ color: "var(--text-primary)" }}` or the `.bento-tile` CSS class.

3. **Exceptions** (hardcoded colors are OK for):
   - Semantic status colors inside a single component (e.g., `text-emerald-500` for a "success" indicator).
   - One-off decorative elements that intentionally do NOT change with themes.

4. **Test every new component against the `nordic` theme** (the only LIGHT theme). If text is invisible or backgrounds clash, you have hardcoded a dark-theme-only value. Fix it.

---

## 3. LAYOUT — Navigation & Page Structure

### 3.1 Floating Bottom Dock

- The dock is rendered by `components/layout/floating-dock.tsx` inside `layout.tsx`.
- It uses Next.js `<Link>` for navigation (NOT React state).
- Active state is determined by `usePathname()`.
- **NEVER replace the dock with a sidebar, top nav bar, or hamburger menu.**
- Dock uses CSS class `.floating-dock`. Items use `.dock-item`. Tooltips use `.dock-tooltip`.

### 3.2 Hub (Home Page — `/`)

- The root page is a **Bento Grid Hub** showing tiles for every feature.
- Each tile uses the CSS class `.bento-tile`.
- Each tile navigates to its feature's route via `<Link>`.
- **When you add a new feature, you MUST add a Bento tile for it in `page.tsx`.**

### 3.3 Feature Pages

- Feature pages use CSS class `.feature-page` (provides min-height, bottom padding for dock clearance).
- Feature pages do NOT have their own navigation or sidebar.
- Feature pages MUST use `next/dynamic` with `ssr: false` for lazy loading.

---

## 4. COMPONENT PATTERNS

### 4.1 Glass Tiles (Bento)

Use the `.bento-tile` CSS class from `globals.css`. Never build card containers from scratch.

```tsx
<div className="bento-tile p-6">
  <div className="relative z-10">
    {/* content */}
  </div>
</div>
```

### 4.2 Input Fields

```tsx
<input
  className="w-full px-4 py-3 rounded-xl text-[13px] font-medium outline-none"
  style={{
    color: "var(--text-primary)",
    background: "var(--tile-bg)",
    border: "1px solid var(--tile-border)",
  }}
/>
```

### 4.3 Primary Buttons

```tsx
<button
  className="px-5 py-2.5 rounded-xl text-[13px] font-bold hover:opacity-90 transition-all"
  style={{ background: "var(--accent)", color: "var(--bg-base)" }}
>
  Action
</button>
```

### 4.4 Section Labels

```tsx
<span
  className="text-[11px] font-bold uppercase tracking-widest"
  style={{ color: "var(--text-muted)" }}
>
  Section Label
</span>
```

---

## 5. AURORA BACKGROUND

The app has an animated gradient mesh in the background. It is defined in `globals.css` and rendered in `layout.tsx` via two divs: `.aurora-bg` and `.aurora-blob`.

**Rules:**
- NEVER remove the aurora background.
- NEVER increase blob opacity above 0.4.
- NEVER speed up the float animation below 15 seconds.
- All page content sits above it via `position: relative; z-index: 1+`.

---

## 6. TYPOGRAPHY

- **Primary font:** `var(--font-geist-sans)` — loaded in `layout.tsx`.
- **Mono font:** `var(--font-geist-mono)` — for code blocks.
- **NEVER use system-only fonts.**

| Use case | Size | Weight |
|---|---|---|
| Hero title | `text-5xl`–`text-6xl` | 800 (extrabold) |
| Section title | `text-2xl` | 700 (bold) |
| Body | `text-[14px]`–`text-[15px]` | 500 (medium) |
| Label | `text-[12px]` | 600 (semibold) |
| Caption | `text-[10px]`–`text-[11px]` | 700 (bold), uppercase, tracking-widest |

---

## 7. ADDING A NEW FEATURE — COMPLETE CHECKLIST

When adding ANY new feature (e.g., "The Lens"):

### Step 1: Feature Slice
```bash
mkdir -p src/features/lens/components
touch src/features/lens/store.ts
touch src/features/lens/api.ts
```

### Step 2: Build the Component
Create `src/features/lens/components/lens-workspace.tsx`.
- Use ONLY CSS variable tokens for all colors.
- Use `.bento-tile` for any card-like elements.
- Test against ALL 4 themes.

### Step 3: Create the Route
Create `src/app/lens/page.tsx`:
```tsx
"use client";
import dynamic from "next/dynamic";
const LensWorkspace = dynamic(() => import("@/features/lens/components/lens-workspace").then(m => m.LensWorkspace), { ssr: false });
export default function LensPage() {
  return <div className="feature-page pt-8"><LensWorkspace /></div>;
}
```

### Step 4: Add Hub Tile
Add a `<Link href="/lens">` Bento tile in `app/page.tsx`.

### Step 5: Add Dock Item
Add an entry to the `dockItems` array in `components/layout/floating-dock.tsx`.

### Step 6: Visual QA Checklist
- [ ] Does it look premium and unique, NOT like a generic dashboard?
- [ ] Does ALL text remain visible in EVERY theme (Cosmic, Emerald, Nordic, Monochrome)?
- [ ] Are ALL colors coming from CSS variables (no hardcoded hex)?
- [ ] Does the aurora gradient show through behind the page?
- [ ] Is the component lazy-loaded via `next/dynamic`?
- [ ] Is state managed in a Zustand store (not scattered `useState`)?

---

## 8. DEPENDENCIES

### Approved
`next`, `react`, `react-dom`, `tailwindcss`, `lucide-react`, `zustand`, `recharts`, `react-markdown`, `remark-gfm`, `clsx`, `tailwind-merge`

### BANNED
`@shadcn/ui`, `radix-ui`, `@heroicons/*`, `react-icons`, `styled-components`, `emotion`, `axios`, `react-query`, `swr`, `next-themes` (we use our own CSS variable system), Bootstrap, Chakra, Mantine

---

## 9. PERFORMANCE

1. **All feature routes use `next/dynamic` with `ssr: false`.** The Hub loads instantly; features load on-demand.
2. **Never import a feature component at the top level of `layout.tsx` or `page.tsx` (Hub).** Only `FloatingDock` and `ThemeSelector` are allowed in the layout.
3. **Heavy libraries** (Recharts, ReactMarkdown) are only loaded when their feature route is visited.

---

## 10. PROSE & MARKDOWN RENDERING

Chat and Foundry render markdown via `react-markdown` + `remark-gfm`. Use the CSS class `.prose-chat` (defined in `globals.css`) for all rendered markdown content. This class ensures code blocks, links, and paragraphs respect the theme system.

---

**END OF FRONTEND POLICY. FOLLOW EVERY RULE. NO EXCEPTIONS.**
