"""WebSocket endpoint for real-time interactive chat streaming."""

from __future__ import annotations

import json
from typing import Annotated, Any

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect

from projectx.api.dependencies import get_text_gen_service
from projectx.capabilities.text_gen.service import TextGenService
from projectx.core.logging import get_logger
from projectx.interfaces.text_generation import TextGenRequest

logger = get_logger(__name__)

router = APIRouter(tags=["websocket"])


@router.websocket("/ws/chat")
async def websocket_chat_endpoint(
    websocket: WebSocket,
    service: Annotated[TextGenService, Depends(get_text_gen_service)],
) -> None:
    """Stream bidirectional chat messages over WebSocket."""
    await websocket.accept()

    try:
        while True:
            raw_text = await websocket.receive_text()
            try:
                payload = json.loads(raw_text)
            except json.JSONDecodeError:
                await websocket.send_json(
                    {"type": "error", "message": "Invalid JSON format"}
                )
                continue

            prompt = payload.get("prompt")
            if not prompt or not isinstance(prompt, str):
                await websocket.send_json(
                    {
                        "type": "error",
                        "message": "Field 'prompt' is required and must be a string",
                    }
                )
                continue

            model = payload.get("model")
            provider = payload.get("provider")
            system_prompt = payload.get("system_prompt")

            req_kwargs: dict[str, Any] = {
                "prompt": prompt,
                "model": model,
                "system_prompt": system_prompt,
            }
            if "temperature" in payload and payload["temperature"] is not None:
                req_kwargs["temperature"] = float(payload["temperature"])
            if "max_tokens" in payload and payload["max_tokens"] is not None:
                req_kwargs["max_tokens"] = int(payload["max_tokens"])

            request = TextGenRequest(**req_kwargs)

            try:
                async for chunk in service.generate_stream(request, provider=provider):
                    await websocket.send_json(
                        {
                            "type": "chunk",
                            "content": chunk.content,
                            "finish_reason": chunk.finish_reason,
                        }
                    )
                await websocket.send_json({"type": "done"})
            except Exception as exc:
                logger.error("Error during WebSocket streaming", error=str(exc))
                await websocket.send_json({"type": "error", "message": str(exc)})

    except WebSocketDisconnect:
        logger.info("WebSocket chat client disconnected")
