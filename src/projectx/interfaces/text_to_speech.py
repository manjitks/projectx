"""Text-to-speech (synthesis) capability interface."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any

from pydantic import BaseModel, Field


class TTSRequest(BaseModel):
    """Request model for text-to-speech synthesis."""

    text: str
    voice: str = "alloy"
    speed: float = 1.0
    output_format: str = "mp3"
    extra: dict[str, Any] = Field(default_factory=dict)


class TTSResponse(BaseModel):
    """Response model for text-to-speech synthesis."""

    audio_data: bytes
    format: str = "mp3"
    duration: float | None = None


class TextToSpeechInterface(ABC):
    """Abstract interface for text-to-speech adapters."""

    @abstractmethod
    async def synthesize(self, request: TTSRequest) -> TTSResponse:
        """Synthesize text into speech audio."""
        ...
