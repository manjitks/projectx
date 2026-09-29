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
