"""Health check routes."""

from __future__ import annotations

from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check() -> dict[str, str]:
    """Return application health status."""
    return {"status": "healthy", "version": "0.1.0"}
