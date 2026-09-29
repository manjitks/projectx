# Agent Instructions — READ THIS FIRST

> **You are a coding agent executing ONE story from `stories/implementation_stories.md`.**
> This file tells you how to work. Keep it short. Save tokens.

## Before You Start

1. Read `PROJECTX.md` in the project root (compact context ~100 lines)
2. Find your assigned story by ID (e.g., `CORE-001`) in `stories/implementation_stories.md`
3. Read ONLY that story section — skip all others

## Rules

1. **Create only the files listed** in your story's "Files to create" section
2. **Do not modify** files outside your story's scope
3. **Match interfaces exactly** — other stories depend on your function signatures
4. **Copy test code verbatim** — tests are the acceptance criteria
5. **Use absolute imports** from `projectx.` — never relative imports
6. **All functions async** unless they can't be (e.g., `__init__`, properties)
7. **Pydantic v2** — use `BaseModel`, `Field`, `model_validator` (not `validator`)

## TDD Workflow (MANDATORY)

> **You MUST follow Red → Green → Refactor for every piece of code you write.**

1. **RED:** Write (or read) the test first. Run `uv run pytest <test-file> -v`. Confirm it FAILS.
2. **GREEN:** Write the minimum implementation to make the test pass. Run tests again. Confirm PASS.
3. **REFACTOR:** Clean up the code while keeping all tests green.

**Non-negotiable rules:**
- **Never write implementation code without a corresponding test.** If a test doesn't exist for your function, write one before writing the function.
- Every new adapter requires tests for: `__init__`, `capabilities()`, happy-path operation, error handling (network down, bad model name, timeout).
- Every new service requires tests for: constructor injection, successful operation, fallback/error event publishing.
- Every new API route requires tests for: 200 response shape, 422 validation error, 500 error handling.
- Coverage target: **90%** for `core/`, `services/`, `adapters/`.

## Done When

```bash
uv run pytest <your-test-path> -v    # All tests pass
uv run ruff check src/ tests/       # No lint errors
uv run ruff format --check src/ tests/  # Properly formatted
```

## If You're Stuck

- Check `PROJECTX.md` "Key Patterns" section for the adapter pattern
- Check `PROJECTX.md` "Error Hierarchy" for which errors to use
- Check `PROJECTX.md` "Coding Conventions" for style rules
- Only import from modules that are dependencies of your story (see "Depends on")

## Mark Story Complete

After all tests pass, update the story status from `⬜` to `✅` in `stories/implementation_stories.md`.
