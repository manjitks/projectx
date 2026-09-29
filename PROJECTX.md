# PROJECTX — Agent Context File

> **Purpose**: This file is read by coding agents at the start of each session.
> Keep it compact. Every line saves tokens.

## What Is This

A modular, provider-agnostic AI platform. All AI capabilities (text gen, STT, TTS, image gen, image→STL, vision, embeddings, RAG, agents) are behind swappable adapter interfaces. No vendor lock-in.

## Tech Stack

- **Backend**: Python 3.12+, FastAPI (async), uv package manager
- **Frontend**: Next.js 16/15 (App Router), TypeScript, Tailwind CSS, Lucide, Recharts, Zustand
- **CLI TUI**: Textual + Rich + Typer
- **Task queue**: ARQ (Redis)
- **Cache**: Redis
- **Vector DB**: ChromaDB
- **Storage**: Local filesystem (S3 later)
- **DB**: SQLite via aiosqlite
- **Testing**: pytest + pytest-asyncio
- **Linting**: ruff (Python), eslint (Next.js)

## Directory Layout

```
projectx/
├── src/projectx/          # Layered Python backend
│   ├── core/              # Layer 0: bootstrap, config, registry, events, logging, errors, schemas
│   ├── interfaces/        # Capability ABCs — text_gen, vision, stt, tts, image_gen, image_to_3d, etc.
│   ├── adapters/          # Layer 1: ollama/, openai/, anthropic/, etc.
│   ├── capabilities/      # Layer 2: text_gen/, speech_to_text/, shopping/
│   ├── orchestration/     # Layer 3: pipeline engine, task queue, cache, fallback
│   ├── api/               # Layer 4: FastAPI routes, lifespan, websocket (/ws/chat)
│   └── cli/               # Layer 5: REPL, TUI, slash commands, ask command
├── web/                   # Next.js 15 App Router frontend
│   ├── src/app/           # Layout, routing, design system
│   ├── src/components/    # chat/, voice/, shopping/, dashboard/, layout/
│   ├── src/stores/        # Zustand state stores
│   ├── src/lib/           # Typed API client, SSE stream reader
│   └── src/types/         # Mirrored TypeScript schemas
├── tests/                 # Unit & integration test suites
├── config/                # YAML configuration files
└── pyproject.toml
```


## Coding Conventions

1. **All functions async** unless impossible
2. **Pydantic v2** for all data models — use `model_validator`, not `validator`
3. **ABC + Protocol** for interfaces — ABC for adapters, Protocol for duck-typed
4. **Type hints everywhere** — no `Any` unless unavoidable
5. **Docstrings**: Google style, one-line summary + args/returns
6. **Imports**: absolute from `projectx.` — never relative
7. **Errors**: raise typed errors from `projectx.core.errors`, never bare Exception
8. **Logging**: use `structlog` via `projectx.core.logging.get_logger(__name__)`
9. **Config access**: via `projectx.core.config.get_config()` — never read env vars directly
10. **Tests**: one test file per source file, `test_<module>.py`

## Key Patterns

### Adapter Pattern (CRITICAL — everything depends on this)

```python
# 1. Interface defines the contract (interfaces/)
class TextGenerationInterface(ABC):
    @abstractmethod
    async def generate(self, request: TextGenRequest) -> TextGenResponse: ...
    @abstractmethod
    async def generate_stream(self, request: TextGenRequest) -> AsyncIterator[TextChunk]: ...

# 2. Adapter implements it (adapters/ollama/)
class OllamaTextGeneration(TextGenerationInterface):
    async def generate(self, request: TextGenRequest) -> TextGenResponse: ...

# 3. Capability service uses it via registry (capabilities/text_gen/)
class TextGenService:
    def __init__(self, registry: AdapterRegistry):
        self.registry = registry
    async def generate(self, request, provider=None):
        adapter = self.registry.get_adapter("text_generation", provider)
        return await adapter.generate(request)

# 4. API route uses the service (api/routes/)
@router.post("/generate")
async def generate(req: TextGenRequest, service: TextGenService = Depends()):
    return await service.generate(req)
```

### Config Shape (providers.yaml)

```yaml
providers:
  text_generation:
    default: ollama
    fallback: openai
    adapters:
      ollama:
        base_url: http://localhost:11434
        default_model: llama3.2
      openai:
        api_key: ${OPENAI_API_KEY}
        default_model: gpt-4o
```

### Error Hierarchy

```
ProjectXError
├── ConfigError
├── AdapterError
│   ├── AdapterNotFoundError
│   ├── AdapterConnectionError
│   └── AdapterResponseError
├── CapabilityError
│   ├── CapabilityNotAvailableError
│   └── CapabilityExecutionError
├── PipelineError
└── ValidationError
```

## Running
 
```bash
# Backend (Python / FastAPI)
uv run pytest                    # Run Python tests (103 passing)
uv run ruff check src/ tests/   # Lint Python code
uv run ruff format src/ tests/  # Format Python code
uv run uvicorn projectx.api.app:create_app --factory --reload # Start FastAPI gateway
uv run projectx ask "Hello"      # CLI generation command
uv run projectx                  # Interactive CLI REPL

# Frontend (Next.js 15)
cd web
npm run dev                      # Start Next.js dev server on http://localhost:3000
npm run build                    # Build production bundle
npm run lint                     # Check TypeScript & ESLint
```

## Current Status

Phase 2: Full-Stack Web Platform active.
- WIRE-001 (Application Bootstrap & Lifecycle): ✅ Done
- WIRE-002 (FastAPI Lifespan + WebSocket Streaming): ✅ Done
- WEB-001 (Next.js 15 Setup & Styling System): ✅ Done
- WEB-002 (API Client & TypeScript Schemas): ✅ Done
- WEB-003 (Shell Layout & Responsive Glassmorphism Navigation): ✅ Done
- CHAT-001 & CHAT-002 (AI Chat with SSE Streaming & Model Selector): ✅ Done
- VOICE-001 (Real-time Speech Recognition & Transcription): ✅ Done
- DASH-001 (Multi-Layer Architecture Health & Diagnostics Dashboard): ✅ Done
- SHOP-001 & SHOP-004 (E-Commerce Multi-Site Comparison, Price Trajectory Charts & AI Reviews): ✅ Done

