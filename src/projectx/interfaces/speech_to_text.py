"""Speech-to-text (transcription) capability interface."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any

from pydantic import BaseModel, Field


class TranscriptionSegment(BaseModel):
    """Segment of transcribed speech."""

    id: int
    start: float
    end: float
    text: str


class TranscriptionRequest(BaseModel):
    """Request model for speech-to-text transcription."""

    audio: str | bytes
    language: str | None = None
    output_format: str = "text"
    temperature: float = 0.0
    extra: dict[str, Any] = Field(default_factory=dict)


class TranscriptionResponse(BaseModel):
    """Response model for speech-to-text transcription."""

    text: str
    segments: list[TranscriptionSegment] = Field(default_factory=list)
    duration: float | None = None
    language: str | None = None


class SpeechToTextInterface(ABC):
    """Abstract interface for speech-to-text adapters."""

    @abstractmethod
    async def transcribe(self, request: TranscriptionRequest) -> TranscriptionResponse:
        """Transcribe speech audio into text."""
        ...
