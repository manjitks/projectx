"""Ollama adapter configuration."""

from __future__ import annotations

from pydantic import BaseModel


class OllamaConfig(BaseModel):
    """Configuration options for Ollama adapter."""

    base_url: str = "http://localhost:11434"
    default_model: str = "llama3.2"
    timeout: int | float = 120.0
