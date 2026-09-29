"""Text generation interface contracts and models."""

from __future__ import annotations

from abc import ABC, abstractmethod
from collections.abc import AsyncIterator

from pydantic import BaseModel, Field

from projectx.core.schemas import ModelInfo, TokenUsage


class TextGenRequest(BaseModel):
    """Request model for text generation."""

    prompt: str
    system_prompt: str | None = None
    model: str | None = None
    max_tokens: int = 4096
    temperature: float = 0.7
    top_p: float = 1.0
    stop_sequences: list[str] = Field(default_factory=list)
    response_format: str | None = None


class TextGenResponse(BaseModel):
    """Response model for text generation."""

    content: str
    model: str
    usage: TokenUsage = Field(default_factory=TokenUsage)
    finish_reason: str | None = None


class TextChunk(BaseModel):
    """Streaming chunk of generated text."""

    content: str
    finish_reason: str | None = None
    usage: TokenUsage = Field(default_factory=TokenUsage)


class TextGenerationInterface(ABC):
    """Abstract interface for text generation adapters."""

    @abstractmethod
    async def generate(self, request: TextGenRequest) -> TextGenResponse:
        """Generate text response for a given request."""
        ...

    @abstractmethod
    def generate_stream(self, request: TextGenRequest) -> AsyncIterator[TextChunk]:
        """Stream generated text chunks for a given request."""
        ...

    @abstractmethod
    def get_supported_models(self) -> list[ModelInfo]:
        """Return list of models supported by this adapter."""
        ...
