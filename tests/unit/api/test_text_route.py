"""Tests for text generation API routes."""

import pytest
from httpx import ASGITransport, AsyncClient

from projectx.api.app import create_app
from projectx.api.dependencies import get_text_gen_service
from projectx.capabilities.text_gen.service import TextGenService
from projectx.core.registry import AdapterRegistry
from projectx.core.schemas import AdapterManifest, Capability, TokenUsage
from projectx.interfaces.base import BaseAdapter
from projectx.interfaces.text_generation import (
    TextChunk,
    TextGenerationInterface,
    TextGenResponse,
)


class MockAdapter(BaseAdapter, TextGenerationInterface):
    def get_manifest(self):
        return AdapterManifest(name="mock", capabilities=[Capability.TEXT_GENERATION])

    async def health_check(self):
        return True

    async def generate(self, request):
        return TextGenResponse(
            content=f"Re: {request.prompt}",
            model="mock",
            usage=TokenUsage(input_tokens=5, output_tokens=10, total_tokens=15),
        )

    async def generate_stream(self, request):
        yield TextChunk(content="Hello ")
        yield TextChunk(content="world", finish_reason="stop")

    def get_supported_models(self):
        return []


@pytest.fixture
def app():
    app = create_app()
    reg = AdapterRegistry()
    m = MockAdapter()
    reg.register(m, m.get_manifest())
    svc = TextGenService(registry=reg)
    app.dependency_overrides[get_text_gen_service] = lambda: svc
    return app


class TestGenerate:
    async def test_returns_response(self, app):
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as c:
            r = await c.post("/api/v1/text/generate", json={"prompt": "Hello"})
        assert r.status_code == 200
        assert "Re: Hello" in r.json()["content"]

    async def test_validates_input(self, app):
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as c:
            r = await c.post("/api/v1/text/generate", json={})
        assert r.status_code == 422


class TestStream:
    async def test_returns_sse(self, app):
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as c:
            r = await c.post("/api/v1/text/generate/stream", json={"prompt": "Hello"})
        assert r.status_code == 200
        assert "text/event-stream" in r.headers["content-type"]
        assert "[DONE]" in r.text
