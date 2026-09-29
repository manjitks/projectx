"""Text generation API routes."""

from __future__ import annotations

import json
from collections.abc import AsyncIterator
from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from projectx.api.dependencies import get_text_gen_service
from projectx.capabilities.text_gen.service import TextGenService
from projectx.interfaces.text_generation import TextGenRequest, TextGenResponse

router = APIRouter(prefix="/api/v1/text", tags=["text"])


@router.post("/generate", response_model=TextGenResponse)
async def generate_text(
    request: TextGenRequest,
    service: Annotated[TextGenService, Depends(get_text_gen_service)],
) -> TextGenResponse:
    """Generate text from prompt."""
    return await service.generate(request)


@router.post("/generate/stream")
async def generate_text_stream(
    request: TextGenRequest,
    service: Annotated[TextGenService, Depends(get_text_gen_service)],
) -> StreamingResponse:
    """Stream generated text chunks via SSE."""

    async def sse_generator() -> AsyncIterator[str]:
        async for chunk in service.generate_stream(request):
            data = json.dumps(chunk.model_dump())
            yield f"data: {data}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(sse_generator(), media_type="text/event-stream")
