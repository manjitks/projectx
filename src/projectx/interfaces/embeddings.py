"""Embeddings capability interface."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any

from pydantic import BaseModel, Field

from projectx.core.schemas import TokenUsage


class EmbeddingRequest(BaseModel):
    """Request model for generating vector embeddings."""

    texts: list[str]
    model: str | None = None
    extra: dict[str, Any] = Field(default_factory=dict)


class EmbeddingResponse(BaseModel):
    """Response model containing vector embeddings."""

    embeddings: list[list[float]]
    dimensions: int
    usage: TokenUsage = Field(default_factory=TokenUsage)


class EmbeddingsInterface(ABC):
    """Abstract interface for embeddings adapters."""

    @abstractmethod
    async def embed(self, request: EmbeddingRequest) -> EmbeddingResponse:
        """Generate vector embeddings for input texts."""
        ...
