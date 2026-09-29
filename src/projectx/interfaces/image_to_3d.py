"""Image-to-3D (mesh generation) capability interface."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any

from pydantic import BaseModel, Field


class Mesh3D(BaseModel):
    """3D mesh data produced from an image."""

    data: bytes
    format: str = "stl"
    vertices: int = 0
    faces: int = 0
    file_size_bytes: int = 0
    has_texture: bool = False


class ImageTo3DRequest(BaseModel):
    """Request model for converting an image to 3D."""

    image: str | bytes
    output_format: str = "stl"
    quality: str = "standard"
    extra: dict[str, Any] = Field(default_factory=dict)


class ImageTo3DInterface(ABC):
    """Abstract interface for image-to-3D adapters."""

    @abstractmethod
    async def convert_to_3d(self, request: ImageTo3DRequest) -> Mesh3D:
        """Convert a 2D image into a 3D mesh model."""
        ...
