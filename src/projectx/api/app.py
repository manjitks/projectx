"""FastAPI application factory."""

from __future__ import annotations

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from projectx.api.routes.health import router as health_router
from projectx.api.routes.text import router as text_router
from projectx.api.websocket.chat import router as websocket_router
from projectx.core.bootstrap import get_application


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Manage application startup and shutdown lifecycle."""
    application = get_application()
    await application.startup()
    yield
    await application.shutdown()


def create_app() -> FastAPI:
    """Create and configure the ProjectX FastAPI application."""
    app = FastAPI(title="ProjectX API", version="0.1.0", lifespan=lifespan)
    app.include_router(health_router)
    app.include_router(text_router)
    app.include_router(websocket_router)
    return app
