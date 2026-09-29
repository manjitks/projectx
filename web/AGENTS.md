# ProjectX Frontend — Mandatory Design System & UX Rules

> **READ THIS ENTIRE FILE BEFORE WRITING ANY FRONTEND CODE.**
> **VIOLATION OF ANY RULE BELOW MEANS YOUR CODE WILL BE REJECTED.**

---

## 1. IDENTITY: What This App Is NOT

**ProjectX is NOT a generic AI dashboard.** If your output looks like "yet another dark-mode SaaS sidebar app," you have FAILED.

### BANNED PATTERNS — Never do these:

| ❌ BANNED | Why |
|---|---|
| Traditional sidebar + content layout | Every AI tool uses this. We killed the sidebar. |
| Card grids with icon + title + description | This is the #1 sign of a generic dashboard. |
| Blue/indigo as primary on dark gray | Default Tailwind palette. Zero personality. |
| "Welcome to [App]! How can I help?" | ChatGPT clone energy. We are not a ChatGPT clone. |
| Stat cards with big numbers in a row | Vercel/Grafana clone. Our stats use `bento-tile` class. |
| Message bubbles (rounded pill shapes, left/right aligned) | WhatsApp/iMessage clone. We use threaded flat messages. |
| Fixed left sidebar with nav icons + labels | Linear/Notion clone. We use a floating bottom dock. |
| Generic hero sections with gradient text | Marketing page energy. We are a tool, not a landing page. |
| Placeholder images from Unsplash/stock | Use CSS gradients, SVG patterns, or generated assets. Never stock photos. |
| `bg-gray-900`, `bg-slate-800`, `text-gray-400` | These are Tailwind defaults. Use our CSS custom properties. |

---

## 2. LAYOUT ARCHITECTURE

### 2.1 Navigation: Floating Bottom Dock (macOS-style)

**The app uses a FLOATING DOCK at the bottom center, NOT a sidebar.**

```
┌──────────────────────────────────────────────┐
│                                              │
│              [Page Content]                  │
│                                              │
│                                              │
│         ┌─────────────────────┐              │
│         │ 🏠  💬  🎤  🛒  📊 │  ← Dock      │
│         └─────────────────────┘              │
└──────────────────────────────────────────────┘
```

**Rules:**
- Dock is `position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%)`
- Dock uses class `floating-dock` from `globals.css`
- Each item uses class `dock-item` — 44×44px, rounded-12px
- Active item gets class `dock-item active` (adds purple dot below)
- Each item has a `dock-tooltip` child (tooltip on hover)
- Dock has glass morphism: `backdrop-filter: blur(24px) saturate(150%)`
- Dock background: `rgba(12, 12, 18, 0.85)`
- Dock border: `1px solid rgba(255, 255, 255, 0.06)`
- **NEVER replace the dock with a sidebar, top nav bar, or hamburger menu**

### 2.2 Default View: Bento Grid Hub

**When the app loads, the user sees a BENTO GRID HUB, not a chat interface.**

```
┌─────────────────┐  ┌──────────────────┐
│                  │  │                  │
│   CHAT (2×2)     │  │   VOICE (2×1)    │
│   with mini      │  │   with waveform  │
│   chat preview   │  │                  │
│                  │  ├──────────────────┤
│                  │  │                  │
├─────────────────┤  │   SHOPPING (2×2)  │
│                  │  │   with mini      │
│  DASHBOARD (2×1) │  │   price compare  │
│                  │  │                  │
└─────────────────┘  └──────────────────┘
```

**Rules:**
- Grid: `grid grid-cols-4 grid-rows-3 gap-4`
- Each tile uses class `bento-tile` from `globals.css`
- Each tile has a LIVE MINI-PREVIEW of its feature inside (not just icon + label)
- Each tile has a unique accent color gradient in one corner (radial-gradient, pointer-events: none)
- Tiles lift on hover: `transform: translateY(-4px) scale(1.01)` with glow shadow
- Clicking a tile navigates to that feature's full-page view
- The hub has a brand header with gradient text title "Your AI, unified."

**If you add a new feature, you MUST add a bento tile for it in the hub grid.**

### 2.3 Feature Pages: Full-Immersive

Each feature (Chat, Voice, Shopping, Dashboard) is a **full-viewport experience**.

**Rules:**
- Feature pages have class `feature-page`
- Feature pages include `padding-bottom: 80px` (space for the dock)
- A "Back" button (class `back-btn`) appears at top-left to return to hub
- Feature pages do NOT have their own sidebar or navigation
- Feature pages center content: `max-w-3xl mx-auto` (chat) or `max-w-5xl mx-auto` (others)

---

## 3. COLOR SYSTEM — EXACT VALUES

### 3.1 Backgrounds

| Token | Value | Usage |
|---|---|---|
| `--bg-base` | `#050507` | Page background. Always this. Never `#000`, `#111`, `#1a1a1a`. |
| `--bg-surface` | `#0a0a0f` | Raised surfaces. |
| Tile/card bg | `rgba(18, 18, 24, 0.8)` blended with `rgba(10, 10, 16, 0.9)` via `linear-gradient(145deg, ...)` | Used in `bento-tile` class. |
| Input bg | `rgba(255, 255, 255, 0.025)` | All input fields, search bars. |
| Hover bg | `rgba(255, 255, 255, 0.03)` to `rgba(255, 255, 255, 0.06)` | Buttons, interactive elements. |

**NEVER use Tailwind's `bg-zinc-*`, `bg-slate-*`, `bg-gray-*` for backgrounds. Always use rgba or CSS variables.**

### 3.2 Text Colors

| Token | Value | Usage |
|---|---|---|
| `--text-primary` | `#e8e8ed` | Main text, headings |
| `--text-muted` | `#6b6b76` | Labels, descriptions, secondary text |
| `--text-dim` | `#3a3a44` | Placeholders, timestamps, disabled text |

**NEVER use `text-white` for body text. Use `#e8e8ed`. Pure white is only for headings and emphasis.**
**NEVER use `text-gray-400` or `text-slate-500`. Use `#6b6b76` or `#3a3a44`.**

### 3.3 Brand Accent

| Token | Value | Usage |
|---|---|---|
| `--accent` | `#7c5cfc` | Primary buttons, active indicators, brand elements |
| Accent hover | `#a78bfa` | Lighter variant for gradients, hover states |
| Accent gradient | `linear-gradient(135deg, #7c5cfc, #a78bfa)` | Send button, mic button, CTA buttons |
| Accent glow | `rgba(124, 92, 252, 0.15)` | Tile hover shadows, focus rings |
| Accent muted bg | `rgba(124, 92, 252, 0.08)` to `rgba(124, 92, 252, 0.12)` | Active nav items, badges |

**NEVER use Tailwind's `bg-indigo-600`, `bg-violet-500`, etc. Always use `#7c5cfc` and its derivatives.**

### 3.4 Semantic Colors

| Color | Hex | Usage |
|---|---|---|
| Success | `#10b981` (emerald) | Health indicators, positive status, "In Stock" |
| Warning | `#f59e0b` (amber) | Amazon brand, warnings |
| Danger | `#f43f5e` (rose) | Errors, cons, destructive actions |
| Info | `#3b82f6` (blue) | Flipkart brand, links |

### 3.5 Borders

| Context | Value |
|---|---|
| Default | `rgba(255, 255, 255, 0.04)` — barely visible |
| Subtle | `rgba(255, 255, 255, 0.05)` — most borders |
| Strong | `rgba(255, 255, 255, 0.08)` — hover state borders |
| Focus | `rgba(124, 92, 252, 0.15)` — input focus |

**NEVER use `border-white/10` or higher. Our borders are intentionally ultra-subtle (0.04–0.08 range).**

---

## 4. ANIMATED GRADIENT MESH BACKDROP

**The app has an animated gradient mesh in the background. This is mandatory and must never be removed.**

The mesh consists of 3 blobs:
1. **Purple blob** (top-left area): `rgba(124, 92, 252, 0.08)`, animates via `mesh-drift-1` (25s)
2. **Blue blob** (bottom-right area): `rgba(59, 130, 246, 0.06)`, animates via `mesh-drift-2` (20s)
3. **Emerald blob** (center-right): `rgba(16, 185, 129, 0.04)`, animates via `mesh-drift-3` (30s)

**Rules:**
- The mesh div has class `gradient-mesh` and is a fixed-position overlay with `z-index: 0`
- All content sits above it with `position: relative; z-index: 1` or higher
- The mesh uses CSS `::before` and `::after` pseudo-elements (defined in `globals.css`)
- A separate `gradient-mesh-accent` div provides the third blob
- Blob opacity is intentionally LOW (0.04–0.08). NEVER increase above 0.12 or it becomes garish.
- Animation timing is SLOW (20–30 seconds). NEVER speed up below 15 seconds.

---

## 5. COMPONENT PATTERNS

### 5.1 Bento Tiles (Feature Cards)

Use the `bento-tile` CSS class. Never build cards from scratch.

```tsx
<div className="bento-tile p-6" onClick={handleClick}>
  {/* Decorative gradient corner — REQUIRED */}
  <div
    className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
    style={{
      background: "radial-gradient(circle at top right, rgba(124,92,252,0.1), transparent 70%)"
    }}
  />

  {/* Content — always wrap in relative z-10 */}
  <div className="relative z-10">
    {/* Icon badge */}
    <div style={{
      width: 32, height: 32, borderRadius: 12,
      background: "rgba(124, 92, 252, 0.1)",
      border: "1px solid rgba(124, 92, 252, 0.2)"
    }}>
      <Icon />
    </div>

    {/* Title + description */}
    <h3 className="text-lg font-bold text-white tracking-tight">Title</h3>
    <p className="text-[12px]" style={{ color: "#6b6b76" }}>Description</p>

    {/* LIVE PREVIEW — mandatory, shows actual feature content */}
    <div>...</div>
  </div>
</div>
```

**Rules:**
- Every bento tile MUST have a decorative gradient corner (unique color per feature)
- Every bento tile MUST have a live mini-preview of its feature
- Content inside tiles MUST be wrapped in `relative z-10` (to sit above the gradient)
- Tiles hover-lift is handled by CSS — do not add custom hover transforms

### 5.2 Chat Messages (Threaded, NOT Bubbles)

```
┌──────────────────────────────────────┐
│ [avatar]  You            10:32 AM    │
│           Message text here...       │
│                                      │
│ ─────────────────────────────────── │ ← subtle 0.03 border
│                                      │
│ [avatar]  llama3.2       10:32 AM    │
│           Response text with         │
│           markdown rendering...      │
│           [Copy]  ← hover-only       │
└──────────────────────────────────────┘
```

**Rules:**
- Messages are FLAT ROWS separated by `border-bottom: 1px solid rgba(255,255,255,0.03)`
- NO bubble shapes. NO rounded pill containers around messages.
- NO left/right alignment based on user/assistant. ALL messages are left-aligned.
- User avatar: `rgba(255,255,255,0.06)` background, User icon in `#6b6b76`
- AI avatar: gradient background `rgba(124,92,252,0.15)` → `rgba(167,139,250,0.08)`, Sparkles icon in `#a78bfa`
- Copy button appears ONLY on hover (`opacity-0 group-hover:opacity-100`)
- Markdown rendering uses class `prose-chat` from `globals.css`
- Empty state shows centered hero with gradient text, model selector, and **suggestion chips**

### 5.3 Input Fields

```tsx
<input
  className="w-full pl-11 pr-4 py-3 rounded-xl text-[13px] focus:outline-none"
  style={{
    color: "#e8e8ed",
    background: "rgba(255, 255, 255, 0.025)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  }}
  placeholder="..."
/>
```

**Rules:**
- Background: `rgba(255, 255, 255, 0.025)` — barely tinted
- Border: `rgba(255, 255, 255, 0.05)` — almost invisible
- On focus, add box-shadow: `0 0 0 1px rgba(124, 92, 252, 0.15)`
- Placeholder color: `#3a3a44`
- Text color: `#e8e8ed`
- Border radius: `rounded-xl` (12px) for inputs, `rounded-2xl` (16px) for chat input
- NEVER use Tailwind `bg-zinc-900`, `border-zinc-700`, etc.

### 5.4 Buttons

**Primary (CTA):**
```tsx
<button style={{
  background: "linear-gradient(135deg, #7c5cfc, #a78bfa)",
  boxShadow: "0 4px 16px -4px rgba(124, 92, 252, 0.3)",
}}>
```

**Secondary/Ghost:**
```tsx
<button style={{
  color: "#6b6b76",
  background: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(255, 255, 255, 0.05)",
}}>
```

**Rules:**
- Primary buttons ALWAYS use the accent gradient, never a flat color
- Primary buttons ALWAYS have a glow shadow
- Ghost buttons use near-invisible backgrounds
- Disabled state: `opacity: 0.3` (not 0.5 — keep it more subtle)
- NEVER use Tailwind `bg-indigo-600 hover:bg-indigo-500`

### 5.5 Badges / Pills

```tsx
<span style={{
  color: "#7c5cfc",
  background: "rgba(124, 92, 252, 0.08)",
  border: "1px solid rgba(124, 92, 252, 0.15)",
}}>
  Badge text
</span>
```

**Rules:**
- Background opacity: 0.06–0.12
- Border opacity: 0.12–0.20
- Text uses the same hue as background but at full saturation
- Font size: `10px–11px`, font-weight: `600` (semibold), uppercase tracking `0.08em–0.15em`

---

## 6. TYPOGRAPHY

### 6.1 Font

- Primary: `var(--font-geist-sans)` (Geist, loaded in `layout.tsx`)
- Mono: `var(--font-geist-mono)` (Geist Mono, for code and shortcuts)
- **NEVER use system-only fonts. Geist is mandatory.**

### 6.2 Size Scale

| Use case | Size | Weight | Color |
|---|---|---|---|
| Page title (hub) | `text-5xl` (48px) | 700 (bold) | Gradient text (`#fafafa` → `#a1a1aa`) |
| Section title | `text-xl` (20px) | 700 (bold) | `#e8e8ed` (white) |
| Card title | `text-lg` (18px) | 700 (bold) | `#e8e8ed` |
| Body text | `14px–14.5px` | 400 (normal) | `#d4d4dc` |
| Labels | `12px–13px` | 500 (medium) | `#6b6b76` |
| Captions | `10px–11px` | 600 (semibold) | `#3a3a44` |
| Section labels | `10px–11px` | 600/700 | `#3a3a44` or `#6b6b76`, `uppercase`, `tracking-[0.1em]` |

### 6.3 Special Text Treatments

**Gradient heading (hub only):**
```tsx
style={{
  background: "linear-gradient(135deg, #fafafa, #a1a1aa)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}}
```

---

## 7. ANIMATIONS & MOTION

### 7.1 Hover Transitions

- Duration: `0.2s` for color changes, `0.4s` for transforms
- Easing: `cubic-bezier(0.2, 0, 0, 1)` for transforms (spring-like)
- Tile hover: translateY(-4px) scale(1.01) — handled by `bento-tile` CSS class
- Dock item hover: translateY(-2px)

### 7.2 Typing Indicator

Three dots using class `typing-dot`:
```tsx
<div className="typing-dot" />
<div className="typing-dot" />
<div className="typing-dot" />
```
The animation is defined in `globals.css`. NEVER use Tailwind's `animate-bounce` for typing indicators.

### 7.3 Voice Waveform

Bars using class `wave-bar`:
```tsx
{Array.from({ length: 20 }, (_, i) => (
  <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.06}s` }} />
))}
```

### 7.4 Pulse Rings (Voice mic)

```tsx
<div className="pulse-ring" style={{
  width: 140, height: 140,
  background: "rgba(124, 92, 252, 0.06)",
}} />
```

---

## 8. SPACING & LAYOUT

| Context | Value |
|---|---|
| Page padding (horizontal) | `px-6` (24px) |
| Page padding (top) | `pt-8` for feature pages, `pt-16` for hub |
| Page padding (bottom) | `pb-24` (96px) — to clear the floating dock |
| Section gap | `space-y-6` (24px) |
| Card internal padding | `p-5` to `p-7` |
| Bento grid gap | `gap-4` (16px) |
| Border radius — tiles | `rounded-[20px]` (20px) via `bento-tile` class |
| Border radius — inputs | `rounded-xl` (12px) |
| Border radius — buttons | `rounded-xl` (12px) |
| Border radius — badges | `rounded-md` (6px) or `rounded-full` for pills |
| Border radius — avatars | `rounded-lg` (8px) |

---

## 9. ADDING NEW FEATURES — CHECKLIST

When adding ANY new feature or page:

1. ☐ **Add a bento tile** in `page.tsx` `HubView` component
   - Assign it a unique accent color (not purple — pick from: emerald, blue, amber, rose, cyan, orange)
   - Add a decorative gradient corner with that color
   - Create a LIVE MINI-PREVIEW inside the tile (not just icon + text)
   - Place it in the grid — decide on span (1×1, 2×1, 2×2, etc.)

2. ☐ **Add a dock item** in `page.tsx` `dockItems` array
   - Icon from `lucide-react`
   - Label for tooltip

3. ☐ **Create the feature component** in `components/<feature>/`
   - Use `max-w-3xl` or `max-w-5xl mx-auto px-6 py-8`
   - Add `padding-bottom: 80px` or use `feature-page` parent class
   - Follow ALL color/typography/spacing rules above
   - Use `bento-tile` class for any card-like elements

4. ☐ **Add the route** in `page.tsx` render logic
   - Add to `View` type union
   - Add conditional render in the feature page section

5. ☐ **Test visually** — Ask yourself:
   - Does it look like a generic AI dashboard? → REDO IT
   - Does it have a unique visual personality? → Good
   - Is the gradient mesh visible behind it? → Good
   - Are all borders under 0.08 opacity? → Good
   - Are all backgrounds using rgba, not Tailwind color classes? → Good

---

## 10. FILE STRUCTURE

```
web/src/
├── app/
│   ├── globals.css          ← Design system (DO NOT create new CSS files)
│   ├── layout.tsx           ← Root layout with Geist font + ThemeProvider
│   └── page.tsx             ← Hub + dock + routing (single-page app)
├── components/
│   ├── chat/
│   │   └── chat-container.tsx
│   ├── voice/
│   │   └── voice-assistant.tsx
│   ├── shopping/
│   │   └── shopping-helper.tsx
│   ├── dashboard/
│   │   └── system-dashboard.tsx
│   └── theme-provider.tsx
├── hooks/                   ← Custom React hooks
├── lib/
│   ├── api-client.ts        ← Typed fetch wrapper for FastAPI
│   └── utils.ts             ← cn() utility
├── stores/
│   ├── ui-store.ts          ← NOT used for navigation anymore (dock manages state in page.tsx)
│   ├── chat-store.ts        ← Chat messages + model selection
│   └── shopping-store.ts    ← Product tracking
└── types/
    └── api.ts               ← TypeScript types mirroring Python schemas
```

**Rules:**
- ALL styles live in `globals.css`. No CSS modules. No styled-components. No inline `<style>` tags.
- Navigation state lives in `page.tsx` (the hub component), not in a store.
- Chat/shopping state lives in Zustand stores.
- API types in `types/api.ts` must mirror Python Pydantic schemas exactly.

---

## 11. DEPENDENCIES — DO NOT ADD WITHOUT REASON

**Approved:**
- `next`, `react`, `react-dom` — framework
- `tailwindcss`, `@tailwindcss/postcss` — utility CSS
- `lucide-react` — icons (ONLY icon library allowed)
- `zustand` — state management
- `framer-motion` — animations (approved but not yet used heavily)
- `recharts` — charts (price history only)
- `react-markdown`, `remark-gfm` — chat markdown rendering
- `next-themes` — dark/light mode
- `clsx`, `tailwind-merge` — className utilities

**BANNED:**
- `@shadcn/ui`, `radix-ui` — We do NOT use component libraries. All components are custom.
- `@heroicons/*`, `react-icons` — Use `lucide-react` only.
- `styled-components`, `emotion` — Use CSS classes from `globals.css`.
- `axios` — Use native `fetch`. The API client already exists.
- `react-query`, `swr` — Not needed yet. Use `useEffect` + Zustand.
- Any CSS framework other than Tailwind (Bootstrap, Chakra, Mantine, etc.)

---

## 12. QUICK REFERENCE — COPY-PASTE PATTERNS

### Style object for a surface container:
```tsx
style={{
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.05)",
}}
```

### Style object for primary action button:
```tsx
style={{
  background: "linear-gradient(135deg, #7c5cfc, #a78bfa)",
  boxShadow: "0 4px 16px -4px rgba(124, 92, 252, 0.3)",
}}
```

### Style object for an icon container:
```tsx
style={{
  width: 32, height: 32, borderRadius: 12,
  display: "flex", alignItems: "center", justifyContent: "center",
  background: "rgba(124, 92, 252, 0.1)",
  border: "1px solid rgba(124, 92, 252, 0.2)",
}}
```

### Muted label text:
```tsx
<span className="text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: "#6b6b76" }}>
  Section Label
</span>
```

### Dim caption text:
```tsx
<span className="text-[10px]" style={{ color: "#3a3a44" }}>
  timestamp or hint
</span>
```

---

**END OF DESIGN SYSTEM. FOLLOW EVERY RULE. NO EXCEPTIONS.**
