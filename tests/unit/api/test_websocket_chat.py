"""Unit tests for WebSocket chat streaming endpoint."""

import pytest
from starlette.testclient import TestClient

from projectx.api.app import create_app
from projectx.api.dependencies import get_text_gen_service
from projectx.capabilities.text_gen.service import TextGenService
from projectx.core.registry import AdapterRegistry
from projectx.core.schemas import AdapterManifest, Capability
from projectx.interfaces.base import BaseAdapter
from projectx.interfaces.text_generation import (
    TextChunk,
    TextGenerationInterface,
    TextGenResponse,
)


class MockWebSocketAdapter(BaseAdapter, TextGenerationInterface):
    def get_manifest(self):
        return AdapterManifest(
            name="mock_ws", capabilities=[Capability.TEXT_GENERATION]
        )

    async def health_check(self):
        return True

    async def generate(self, request):
        return TextGenResponse(content=f"Echo: {request.prompt}", model="mock_ws")

    async def generate_stream(self, request):
        yield TextChunk(content="Hello ")
        yield TextChunk(content="from ")
        yield TextChunk(content="ProjectX!", finish_reason="stop")

    def get_supported_models(self):
        return []


@pytest.fixture
def app():
    app = create_app()
    reg = AdapterRegistry()
    m = MockWebSocketAdapter()
    reg.register(m, m.get_manifest())
    reg.set_default(Capability.TEXT_GENERATION, "mock_ws")
    svc = TextGenService(registry=reg)
    app.dependency_overrides[get_text_gen_service] = lambda: svc
    return app


class TestWebSocketChat:
    def test_websocket_chat_streaming(self, app):
        client = TestClient(app)
        with client.websocket_connect("/ws/chat") as ws:
            ws.send_json({"prompt": "Tell me a joke"})

            msg1 = ws.receive_json()
            assert msg1 == {"type": "chunk", "content": "Hello ", "finish_reason": None}

            msg2 = ws.receive_json()
            assert msg2 == {"type": "chunk", "content": "from ", "finish_reason": None}

            msg3 = ws.receive_json()
            assert msg3 == {
                "type": "chunk",
                "content": "ProjectX!",
                "finish_reason": "stop",
            }

            done = ws.receive_json()
            assert done == {"type": "done"}

    def test_websocket_invalid_json(self, app):
        client = TestClient(app)
        with client.websocket_connect("/ws/chat") as ws:
            ws.send_text("not a valid json")
            msg = ws.receive_json()
            assert msg["type"] == "error"
            assert "Invalid JSON" in msg["message"]

    def test_websocket_missing_prompt(self, app):
        client = TestClient(app)
        with client.websocket_connect("/ws/chat") as ws:
            ws.send_json({"model": "test"})
            msg = ws.receive_json()
            assert msg["type"] == "error"
            assert "prompt" in msg["message"]
