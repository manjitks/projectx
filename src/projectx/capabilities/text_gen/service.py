"""Text generation capability service."""

from __future__ import annotations

from collections.abc import AsyncIterator

from projectx.core.errors import AdapterConnectionError
from projectx.core.events import Event, EventBus
from projectx.core.logging import get_logger
from projectx.core.registry import AdapterRegistry
from projectx.core.schemas import Capability
from projectx.interfaces.text_generation import (
    TextChunk,
    TextGenRequest,
    TextGenResponse,
)

logger = get_logger(__name__)


class TextGenService:
    """Service that coordinates text generation requests across adapters."""

    def __init__(
        self,
        registry: AdapterRegistry,
        event_bus: EventBus | None = None,
    ) -> None:
        self.registry = registry
        self.event_bus = event_bus or EventBus()

    async def generate(
        self, request: TextGenRequest, provider: str | None = None
    ) -> TextGenResponse:
        """Route generation request to adapter with fallback on connection failure."""
        adapter = self.registry.get_adapter(
            Capability.TEXT_GENERATION, provider=provider
        )

        try:
            response = await adapter.generate(request)
        except AdapterConnectionError as exc:
            fallback = self.registry.get_fallback_adapter(Capability.TEXT_GENERATION)
            if fallback is not None and fallback is not adapter:
                logger.warning(
                    "Primary adapter failed, trying fallback",
                    error=str(exc),
                )
                response = await fallback.generate(request)
            else:
                raise

        await self.event_bus.emit(
            Event(
                name="text_generation.complete",
                data={
                    "response": response.model_dump(),
                    "model": response.model,
                },
            )
        )
        return response

    async def generate_stream(
        self, request: TextGenRequest, provider: str | None = None
    ) -> AsyncIterator[TextChunk]:
        """Stream chunks from the matching text generation adapter."""
        adapter = self.registry.get_adapter(
            Capability.TEXT_GENERATION, provider=provider
        )
        async for chunk in adapter.generate_stream(request):
            yield chunk
