# ProjectX — System Architecture & Engineering Standards
> **This file is the SINGLE SOURCE OF TRUTH for the entire ProjectX monorepo.**
> **Every AI agent, developer, and contributor MUST read this file before writing ANY code.**

---

## 1. PROJECT IDENTITY

ProjectX is a **modular AI platform** that combines local-first LLM inference with a premium SaaS frontend. It is NOT a chatbot wrapper. It is NOT a generic AI dashboard. It is a unified workspace containing multiple flagship tools (Foundry, Lens, Multiplier, Scout, Architect) built on a swappable adapter engine.

**The backend is a Python FastAPI application.** The frontend is a **Next.js App Router application.**

---

## 2. MONOREPO STRUCTURE (Current Truth)

```
projectx/
├── AGENTS.md                    ← THIS FILE (root policy)
├── PROJECTX.md                  ← Backend compact context
├── pyproject.toml               ← Python project config (uv)
├── config/
│   └── providers.yaml           ← Adapter configuration
├── src/projectx/                ← Python backend
│   ├── core/                    ← Registry, EventBus, Config
│   ├── interfaces/              ← Abstract adapter contracts
│   ├── adapters/                ← Concrete adapters (Ollama)
│   ├── services/                ← Business logic (TextGen)
│   └── api/                     ← FastAPI routes
├── tests/                       ← pytest suite
├── stories/                     ← Implementation stories
│   └── AGENT_INSTRUCTIONS.md    ← Backend agent rules
└── web/                         ← Next.js frontend
    ├── AGENTS.md                ← Frontend-specific rules (STRICT)
    ├── FRONTEND_ARCHITECTURE.md ← Architecture rationale
    └── src/                     ← Source code
```

### The Two-Layer Rule
- **Backend agents** read `stories/AGENT_INSTRUCTIONS.md` + `PROJECTX.md`.
- **Frontend agents** read `web/AGENTS.md` (which is the authoritative design and code policy for the UI).
- **All agents** read THIS file first for cross-cutting concerns.

---

## 3. CROSS-CUTTING ENGINEERING STANDARDS

### 3.1 Feature Isolation (The Cardinal Rule)

> **Every feature is a self-contained capsule. If you cannot delete the feature's directory and have the rest of the app compile, your architecture is wrong.**

This applies equally to backend (Python modules) and frontend (React feature slices).

### 3.2 No Shared Mutable State

- Backend: Services receive adapters via dependency injection (the `AdapterRegistry`). They never import adapters directly.
- Frontend: Features have their own Zustand stores. Global state (theme, auth) lives in `components/layout/` or a `stores/ui-store.ts`. **A feature store must NEVER import another feature's store.**

### 3.3 Cross-Feature Communication

If Feature A needs data from Feature B:
- **Backend:** Use the `EventBus` (publish/subscribe). Never import Feature B's internals.
- **Frontend:** If unavoidable, lift the shared data to a global store. Prefer this pattern: Feature A dispatches an action → global store updates → Feature B reads global store.

### 3.4 Dependency Hygiene

- **Backend:** Only `uv` for package management. Only `pytest` for testing. Only `ruff` for linting.
- **Frontend:** Only `npm`. Dependencies must be approved (see `web/AGENTS.md` Section 11). Adding a new npm package requires explicit justification.

### 3.5 API Contract

The Python backend serves JSON via FastAPI. The Next.js frontend consumes it via `fetch`.
- **All API types** are defined in `web/src/types/api.ts` and MUST mirror Python `Pydantic` schemas exactly.
- Backend Pydantic schema changes MUST be accompanied by matching TypeScript type changes.

### 3.6 Testing & Quality (TDD Policy)

> **The backend follows strict TDD. The frontend follows Visual QA + E2E testing.**

#### Backend (Python) — STRICT TDD

Test-Driven Development is **mandatory** for all backend code. The workflow is:

1. **Write the test FIRST.** Define what the function/adapter/service should do.
2. **Run the test — it MUST fail.** (Red)
3. **Write the minimum code to make it pass.** (Green)
4. **Refactor** while keeping tests green. (Refactor)

**Rules:**
- Every new Python module MUST have a corresponding test file in `tests/`.
- Every new adapter MUST have tests for: initialization, capability reporting, happy path, error handling.
- Every new service MUST have tests for: dependency injection, event publishing, fallback behavior.
- Every new API route MUST have tests for: valid request, invalid request, error response shape.
- **Pull requests with untested backend code will be rejected.**
- Test runner: `uv run pytest -v`. Linter: `uv run ruff check src/ tests/`.
- Minimum coverage target: **90%** for `core/`, `services/`, `adapters/`. No target for `api/` (tested via integration).

**Why strict TDD on backend:** The adapter pattern means dozens of implementations will share the same interface. A single broken contract silently corrupts every downstream consumer. Tests are the ONLY safety net.

#### Frontend (Next.js/React) — Visual QA + E2E

Strict unit-level TDD is **NOT enforced** for frontend components. The rationale:
- 80% of frontend code is visual (glassmorphism, animations, theme variables). Unit tests like "does this div have the correct CSS variable" are brittle, expensive to maintain, and catch zero real bugs.
- The real quality gate is **does it look correct across all 4 themes?**

**What IS required:**
1. **Visual QA Checklist** (see `web/AGENTS.md` Section 7): Every new component must be manually verified against Cosmic, Emerald, Nordic, and Monochrome themes.
2. **E2E tests for critical user flows** (when Playwright/Cypress is integrated):
   - Can the user navigate between all routes via the dock?
   - Can the user send a chat message and see a response?
   - Can the user add items to the Foundry Hopper and trigger synthesis?
   - Does theme switching persist across page refreshes?
3. **Zustand store tests** (unit tests ARE appropriate here): Test that actions correctly mutate state.

**What is explicitly NOT required:**
- Unit tests for individual React component rendering.
- Snapshot tests (they break on every CSS change and provide zero value).
- Testing that CSS variables resolve to specific hex values.

---

## 4. NAMING CONVENTIONS

| Thing | Convention | Example |
|---|---|---|
| Python module | `snake_case` | `text_gen_service.py` |
| Python class | `PascalCase` | `OllamaAdapter` |
| TypeScript file | `kebab-case` | `chat-container.tsx` |
| React component | `PascalCase` | `ChatContainer` |
| Zustand store file | `store.ts` (inside feature dir) | `features/chat/store.ts` |
| CSS class | `kebab-case` | `bento-tile`, `floating-dock` |
| Route directory | `kebab-case` | `app/chat/`, `app/foundry/` |
| Feature directory | `kebab-case` | `features/shopping/` |

---

## 5. GIT & WORKFLOW

- Commit messages: `feat(scope): description`, `fix(scope): description`, `refactor(scope): description`
- One feature per branch. One PR per feature.
- Tests must pass before merge: `uv run pytest` (backend), visual verification (frontend).

---

**END OF ROOT POLICY. For frontend-specific rules, see `web/AGENTS.md`. For backend-specific rules, see `stories/AGENT_INSTRUCTIONS.md`.**
