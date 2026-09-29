"""Base Pydantic models shared across all layers."""

from __future__ import annotations

from datetime import UTC, datetime
from enum import StrEnum
from typing import Any
from uuid import UUID, uuid4

from pydantic import BaseModel, Field


class Capability(StrEnum):
    """All supported AI capabilities."""

    TEXT_GENERATION = "text_generation"
    VISION = "vision"
    SPEECH_TO_TEXT = "speech_to_text"
    TEXT_TO_SPEECH = "text_to_speech"
    IMAGE_GENERATION = "image_generation"
    IMAGE_TO_3D = "image_to_3d"
    CODE_GENERATION = "code_generation"
    EMBEDDINGS = "embeddings"
    RAG = "rag"
    AGENT = "agent"


class ModelInfo(BaseModel):
    """Metadata about a model available through an adapter."""

    name: str
    provider: str
    capability: Capability
    context_window: int | None = None
    max_output_tokens: int | None = None
    supports_streaming: bool = False
    supports_vision: bool = False
    cost_per_input_token: float = 0.0
    cost_per_output_token: float = 0.0


class TokenUsage(BaseModel):
    """Token usage for a single request."""

    input_tokens: int = 0
    output_tokens: int = 0
    total_tokens: int = 0

    def __add__(self, other: TokenUsage) -> TokenUsage:
        return TokenUsage(
            input_tokens=self.input_tokens + other.input_tokens,
            output_tokens=self.output_tokens + other.output_tokens,
            total_tokens=self.total_tokens + other.total_tokens,
        )


class RequestMetadata(BaseModel):
    """Metadata attached to every request flowing through the system."""

    request_id: UUID = Field(default_factory=uuid4)
    timestamp: datetime = Field(default_factory=lambda: datetime.now(UTC))
    provider: str | None = None
    model: str | None = None
    capability: Capability | None = None
    extra: dict[str, Any] = Field(default_factory=dict)


class AdapterManifest(BaseModel):
    """Declares what an adapter supports. Every adapter must expose one."""

    name: str
    version: str = "0.1.0"
    capabilities: list[Capability]
    supports_streaming: bool = False
    supports_local: bool = False
    requires_api_key: bool = False
    default_models: dict[Capability, str] = Field(default_factory=dict)
