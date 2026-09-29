"""Tests for projectx.core.schemas."""

from projectx.core.schemas import (
    AdapterManifest,
    Capability,
    ModelInfo,
    RequestMetadata,
    TokenUsage,
)


class TestCapabilityEnum:
    def test_all_capabilities_exist(self):
        expected = {
            "text_generation",
            "vision",
            "speech_to_text",
            "text_to_speech",
            "image_generation",
            "image_to_3d",
            "code_generation",
            "embeddings",
            "rag",
            "agent",
        }
        assert {c.value for c in Capability} == expected

    def test_capability_is_string(self):
        assert Capability.TEXT_GENERATION == "text_generation"
        assert isinstance(Capability.VISION, str)


class TestTokenUsage:
    def test_defaults_to_zero(self):
        usage = TokenUsage()
        assert usage.input_tokens == 0
        assert usage.output_tokens == 0

    def test_addition(self):
        a = TokenUsage(input_tokens=10, output_tokens=20, total_tokens=30)
        b = TokenUsage(input_tokens=5, output_tokens=10, total_tokens=15)
        result = a + b
        assert result.input_tokens == 15
        assert result.output_tokens == 30
        assert result.total_tokens == 45


class TestModelInfo:
    def test_create_with_defaults(self):
        info = ModelInfo(
            name="llama3.2",
            provider="ollama",
            capability=Capability.TEXT_GENERATION,
        )
        assert info.name == "llama3.2"
        assert info.cost_per_input_token == 0.0
        assert info.supports_streaming is False

    def test_create_with_all_fields(self):
        info = ModelInfo(
            name="gpt-4o",
            provider="openai",
            capability=Capability.TEXT_GENERATION,
            context_window=128000,
            max_output_tokens=4096,
            supports_streaming=True,
            supports_vision=True,
            cost_per_input_token=0.005,
            cost_per_output_token=0.015,
        )
        assert info.context_window == 128000
        assert info.supports_vision is True


class TestRequestMetadata:
    def test_auto_generates_id_and_timestamp(self):
        meta = RequestMetadata()
        assert meta.request_id is not None
        assert meta.timestamp is not None

    def test_two_requests_have_different_ids(self):
        a = RequestMetadata()
        b = RequestMetadata()
        assert a.request_id != b.request_id


class TestAdapterManifest:
    def test_minimal_manifest(self):
        manifest = AdapterManifest(
            name="ollama",
            capabilities=[Capability.TEXT_GENERATION, Capability.EMBEDDINGS],
        )
        assert manifest.name == "ollama"
        assert len(manifest.capabilities) == 2
        assert manifest.requires_api_key is False

    def test_manifest_with_defaults(self):
        manifest = AdapterManifest(
            name="openai",
            capabilities=[Capability.TEXT_GENERATION],
            requires_api_key=True,
            default_models={Capability.TEXT_GENERATION: "gpt-4o"},
        )
        assert manifest.default_models[Capability.TEXT_GENERATION] == "gpt-4o"
