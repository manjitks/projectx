"""Tests for Ollama adapter. Uses httpx mock transport — NO running Ollama needed."""

import httpx
import pytest

from projectx.adapters.ollama.adapter import OllamaAdapter
from projectx.adapters.ollama.config import OllamaConfig
from projectx.core.errors import AdapterConnectionError, AdapterResponseError
from projectx.core.schemas import Capability
from projectx.interfaces.text_generation import TextGenRequest


def make_mock_transport(response_data: dict, status_code: int = 200):
    async def mock_handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(status_code=status_code, json=response_data)

    return httpx.MockTransport(mock_handler)


class TestManifest:
    def test_manifest_has_text_generation(self):
        adapter = OllamaAdapter()
        manifest = adapter.get_manifest()
        assert Capability.TEXT_GENERATION in manifest.capabilities
        assert manifest.name == "ollama"
        assert manifest.supports_local is True


class TestGenerate:
    async def test_returns_response(self):
        mock_data = {
            "response": "Hello!",
            "model": "llama3.2",
            "done": True,
            "prompt_eval_count": 10,
            "eval_count": 8,
        }
        adapter = OllamaAdapter(OllamaConfig(base_url="http://test"))
        adapter._client = httpx.AsyncClient(transport=make_mock_transport(mock_data))
        result = await adapter.generate(TextGenRequest(prompt="Hi"))
        assert result.content == "Hello!"
        assert result.usage.input_tokens == 10
        assert result.usage.output_tokens == 8
        assert result.finish_reason == "stop"
        await adapter.shutdown()

    async def test_connection_error(self):
        adapter = OllamaAdapter(OllamaConfig(base_url="http://nonexistent:99999"))
        with pytest.raises(AdapterConnectionError):
            await adapter.generate(TextGenRequest(prompt="Hi"))

    async def test_http_error(self):
        adapter = OllamaAdapter(OllamaConfig(base_url="http://test"))
        adapter._client = httpx.AsyncClient(
            transport=make_mock_transport({"error": "not found"}, 404)
        )
        with pytest.raises(AdapterResponseError):
            await adapter.generate(TextGenRequest(prompt="Hi"))
        await adapter.shutdown()


class TestHealthCheck:
    async def test_healthy(self):
        adapter = OllamaAdapter(OllamaConfig(base_url="http://test"))
        adapter._client = httpx.AsyncClient(
            transport=make_mock_transport({"status": "ok"})
        )
        assert await adapter.health_check() is True
        await adapter.shutdown()

    async def test_unhealthy(self):
        adapter = OllamaAdapter(OllamaConfig(base_url="http://nonexistent:99999"))
        assert await adapter.health_check() is False
