"""FastAPI route dependencies."""

from __future__ import annotations

from projectx.capabilities.text_gen.service import TextGenService
from projectx.core.bootstrap import get_application


def get_text_gen_service() -> TextGenService:
    """Dependency provider for TextGenService."""
    return get_application().text_gen_service
