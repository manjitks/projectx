"""Tests for text generation service."""

import pytest

from projectx.capabilities.text_gen.service import TextGenService
from projectx.core.errors import (
    AdapterConnectionError,
    CapabilityNotAvailableError,
)
from projectx.core.events import EventBus
from projectx.core.registry import AdapterRegistry
from projectx.core.schemas import AdapterManifest, Capability, TokenUsage
from projectx.interfaces.base import BaseAdapter
from projectx.interfaces.text_generation import (
    TextChunk,
    TextGenerationInterface,
    TextGenRequest,
    TextGenResponse,
)


class FakeAdapter(BaseAdapter, TextGenerationInterface):
    def __init__(self, name="fake", content="Hello!"):
        self._name, self._content = name, content

    def get_manifest(self):
        return AdapterManifest(
            name=self._name, capabilities=[Capability.TEXT_GENERATION]
        )

    async def health_check(self):
        return True

    async def generate(self, request):
        return TextGenResponse(
            content=self._content,
            model="fake",
            usage=TokenUsage(input_tokens=5, output_tokens=3, total_tokens=8),
        )

    async def generate_stream(self, request):
        for w in self._content.split():
            yield TextChunk(content=w + " ")
        yield TextChunk(content="", finish_reason="stop")

    def get_supported_models(self):
        return []


class FailingAdapter(FakeAdapter):
    async def generate(self, request):
        raise AdapterConnectionError("refused")


@pytest.fixture
def service():
    reg = AdapterRegistry()
    a = FakeAdapter("primary", "Primary")
    reg.register(a, a.get_manifest())
    reg.set_default(Capability.TEXT_GENERATION, "primary")
    return TextGenService(registry=reg, event_bus=EventBus())


class TestGenerate:
    async def test_generates_text(self, service):
        resp = await service.generate(TextGenRequest(prompt="Hi"))
        assert resp.content == "Primary"

    async def test_fallback_on_error(self):
        reg = AdapterRegistry()
        f = FailingAdapter("primary")
        fb = FakeAdapter("fallback", "Fallback")
        reg.register(f, f.get_manifest())
        reg.register(fb, fb.get_manifest())
        reg.set_default(Capability.TEXT_GENERATION, "primary")
        reg.set_fallback(Capability.TEXT_GENERATION, "fallback")
        svc = TextGenService(registry=reg)
        resp = await svc.generate(TextGenRequest(prompt="Hi"))
        assert resp.content == "Fallback"

    async def test_no_adapter_raises(self):
        svc = TextGenService(registry=AdapterRegistry())
        with pytest.raises(CapabilityNotAvailableError):
            await svc.generate(TextGenRequest(prompt="Hi"))


class TestStream:
    async def test_streams_chunks(self, service):
        chunks = [c async for c in service.generate_stream(TextGenRequest(prompt="Hi"))]
        assert len(chunks) > 0
        assert chunks[-1].finish_reason == "stop"


class TestEvents:
    async def test_emits_event(self):
        reg = AdapterRegistry()
        a = FakeAdapter("t")
        reg.register(a, a.get_manifest())
        events = []
        bus = EventBus()

        async def h(e):
            events.append(e)

        bus.on("text_generation.complete", h)
        svc = TextGenService(registry=reg, event_bus=bus)
        await svc.generate(TextGenRequest(prompt="Hi"))
        assert len(events) == 1
