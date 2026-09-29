# Product Requirements Document (PRD): The Foundry (Synthesis Canvas)

## 1. Executive Summary
"The Foundry" is a flagship, standalone feature for the ProjectX modular AI platform. It fundamentally shifts the user-AI interaction model from a **transactional, linear chat** to a **spatial, continuous synthesis workspace**. It acts as an "operating system for thought," aimed at professionals, researchers, and founders who need to convert messy, multimodal inputs into structured, professional outputs.

## 2. The Business Case & Market Gap
* **Current Landscape:** The SaaS AI market is oversaturated with Chatbots (ChatGPT clones) and simple RAG wrappers. These tools force users into a linear workflow: copy-paste context -> prompt -> get response -> repeat.
* **The Gap:** Knowledge workers (PMs, marketers, founders, researchers) don't want to chat; they want to *produce documents*. They have fragmented inputs (a voice memo from a drive, a competitor's pricing page, a PDF report) and need a cohesive output (a PRD, a strategy brief).
* **The Solution:** A dual-pane workspace where the user dumps raw materials into a "Hopper" (left), and the AI autonomously organizes and writes a live "Canvas" (right) based on a defined goal.
* **Monetization/Retention:** Because this tool acts as a primary workspace for complex tasks, session lengths will be measured in hours, not minutes. This enables high-ticket B2B pricing and extreme user stickiness.

## 3. Core Capabilities & Mechanics

### 3.1 The Hopper (Input Pane)
The left side of the UI. This is the unstructured "brain dump" zone.
* **Multimodal Ingestion:** Users can drop text snippets, URLs, or Voice Notes.
* *Integration:* Leverages ProjectX's existing Voice-to-Text and Web Scraping (Shopping) modules.
* **Live Parsing:** As items are dropped, the backend immediately extracts the text/metadata and creates semantic embeddings.

### 3.2 The Canvas (Output Pane)
The right side of the UI. This is the structured output zone.
* **Block-based Editor:** A clean, Notion-style text area.
* **Continuous Synthesis:** When the Hopper updates, the backend triggers an event to the Text Generation service. The AI intelligently updates or appends to the Canvas without overwriting user-locked sections.

### 3.3 The Engine (ProjectX Backend)
* Leverages our Swappable Adapters (Ollama for fast, private local summarization of Hopper items; Cloud models for heavy drafting of the Canvas).
* Requires a new asynchronous event loop to monitor Hopper changes and stream updates to the Canvas via Server-Sent Events (SSE).

## 4. Initial MVP Scope (Phase 1)
To build this systematically, we will start with a focused MVP:
1. **Frontend Architecture:**
   - Route: `/foundry`
   - UI: A dual-pane split-screen layout adhering to the Aurora Glass design system.
   - Store: A local Zustand store (`features/foundry/store.ts`) holding `hopperItems[]` and `canvasText`.
2. **Input Mechanics:**
   - Text snippets and URL dropping (simulated scraping for the frontend MVP).
3. **Synthesis Trigger:**
   - A manual "Synthesize" button to take Hopper items and generate a markdown document in the Canvas (to test the UI before building full autonomous continuous-sync).

## 5. Success Metrics
- **Engagement:** Time spent in the `/foundry` route vs `/chat`.
- **Modularity:** The feature must exist entirely within `web/src/features/foundry/` without breaking other routes.
- **Aesthetic:** The dual-pane UI must feel native to the premium Aurora Glass theme (frosted glass, fluid animations).
