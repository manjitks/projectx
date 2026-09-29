"""Vision capability interface."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any

from pydantic import BaseModel, Field

from projectx.core.schemas import TokenUsage


class VisionRequest(BaseModel):
    """Request for vision processing."""

    image: str | bytes
    prompt: str = "Describe this image."
    detail: str = "auto"
    max_tokens: int = 4096
    extra: dict[str, Any] = Field(default_factory=dict)


class VisionResponse(BaseModel):
    """Response from vision processing."""

    content: str
    model: str
    usage: TokenUsage = Field(default_factory=TokenUsage)


class VisionInterface(ABC):
    """Abstract interface for vision adapters."""

    @abstractmethod
    async def process_vision(self, request: VisionRequest) -> VisionResponse:
        """Process image and prompt to produce a text response."""
        ...
