"""Tests for text generation interface contracts."""

import pytest

from projectx.core.schemas import TokenUsage
from projectx.interfaces.text_generation import (
    TextChunk,
    TextGenerationInterface,
    TextGenRequest,
    TextGenResponse,
)


class TestTextGenRequest:
    def test_minimal_request(self):
        req = TextGenRequest(prompt="Hello")
        assert req.prompt == "Hello"
        assert req.max_tokens == 4096
        assert req.temperature == 0.7
        assert req.system_prompt is None
        assert req.stop_sequences == []

    def test_full_request(self):
        req = TextGenRequest(
            prompt="Hello",
            system_prompt="You are helpful.",
            model="gpt-4o",
            max_tokens=100,
            temperature=0.0,
            stop_sequences=["END"],
            response_format="json",
        )
        assert req.model == "gpt-4o"
        assert req.response_format == "json"


class TestTextGenResponse:
    def test_minimal_response(self):
        resp = TextGenResponse(content="Hi there", model="llama3.2")
        assert resp.content == "Hi there"
        assert resp.usage.total_tokens == 0

    def test_response_with_usage(self):
        resp = TextGenResponse(
            content="Hi",
            model="gpt-4o",
            usage=TokenUsage(input_tokens=10, output_tokens=5, total_tokens=15),
            finish_reason="stop",
        )
        assert resp.usage.total_tokens == 15


class TestInterfaceIsAbstract:
    def test_cannot_instantiate_directly(self):
        with pytest.raises(TypeError):
            TextGenerationInterface()

    def test_incomplete_implementation_raises(self):
        class Incomplete(TextGenerationInterface):
            pass

        with pytest.raises(TypeError):
            Incomplete()

    def test_complete_implementation_works(self):
        class Complete(TextGenerationInterface):
            async def generate(self, request):
                return TextGenResponse(content="ok", model="test")

            async def generate_stream(self, request):
                yield TextChunk(content="ok")

            def get_supported_models(self):
                return []

        assert Complete() is not None
