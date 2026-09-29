"""Tests for projectx.core.registry."""

import pytest

from projectx.core.errors import AdapterNotFoundError, CapabilityNotAvailableError
from projectx.core.registry import AdapterRegistry
from projectx.core.schemas import AdapterManifest, Capability


class FakeAdapter:
    def __init__(self, name: str):
        self.name = name


@pytest.fixture
def registry():
    return AdapterRegistry()


@pytest.fixture
def ollama_adapter():
    return FakeAdapter("ollama")


@pytest.fixture
def ollama_manifest():
    return AdapterManifest(
        name="ollama",
        capabilities=[Capability.TEXT_GENERATION, Capability.EMBEDDINGS],
        supports_streaming=True,
        supports_local=True,
    )


@pytest.fixture
def openai_adapter():
    return FakeAdapter("openai")


@pytest.fixture
def openai_manifest():
    return AdapterManifest(
        name="openai",
        capabilities=[
            Capability.TEXT_GENERATION,
            Capability.VISION,
            Capability.IMAGE_GENERATION,
        ],
        requires_api_key=True,
    )


class TestRegister:
    def test_register_adapter(self, registry, ollama_adapter, ollama_manifest):
        registry.register(ollama_adapter, ollama_manifest)
        assert len(registry.list_adapters()) == 1

    def test_register_multiple(
        self,
        registry,
        ollama_adapter,
        ollama_manifest,
        openai_adapter,
        openai_manifest,
    ):
        registry.register(ollama_adapter, ollama_manifest)
        registry.register(openai_adapter, openai_manifest)
        assert len(registry.list_adapters()) == 2

    def test_unregister(self, registry, ollama_adapter, ollama_manifest):
        registry.register(ollama_adapter, ollama_manifest)
        registry.unregister("ollama")
        assert len(registry.list_adapters()) == 0


class TestGetAdapter:
    def test_get_by_capability(self, registry, ollama_adapter, ollama_manifest):
        registry.register(ollama_adapter, ollama_manifest)
        result = registry.get_adapter(Capability.TEXT_GENERATION)
        assert result is ollama_adapter

    def test_get_by_explicit_provider(
        self,
        registry,
        ollama_adapter,
        ollama_manifest,
        openai_adapter,
        openai_manifest,
    ):
        registry.register(ollama_adapter, ollama_manifest)
        registry.register(openai_adapter, openai_manifest)
        result = registry.get_adapter(Capability.TEXT_GENERATION, provider="openai")
        assert result is openai_adapter

    def test_get_default_preferred(
        self,
        registry,
        ollama_adapter,
        ollama_manifest,
        openai_adapter,
        openai_manifest,
    ):
        registry.register(ollama_adapter, ollama_manifest)
        registry.register(openai_adapter, openai_manifest)
        registry.set_default(Capability.TEXT_GENERATION, "openai")
        result = registry.get_adapter(Capability.TEXT_GENERATION)
        assert result is openai_adapter

    def test_explicit_provider_not_found_raises(self, registry):
        with pytest.raises(AdapterNotFoundError):
            registry.get_adapter(Capability.TEXT_GENERATION, provider="nonexistent")

    def test_no_adapter_for_capability_raises(
        self, registry, ollama_adapter, ollama_manifest
    ):
        registry.register(ollama_adapter, ollama_manifest)
        with pytest.raises(CapabilityNotAvailableError):
            registry.get_adapter(Capability.IMAGE_GENERATION)

    def test_provider_missing_capability_raises(
        self, registry, ollama_adapter, ollama_manifest
    ):
        registry.register(ollama_adapter, ollama_manifest)
        with pytest.raises(AdapterNotFoundError):
            registry.get_adapter(Capability.VISION, provider="ollama")


class TestDefaults:
    def test_set_default_nonexistent_raises(self, registry):
        with pytest.raises(AdapterNotFoundError):
            registry.set_default(Capability.TEXT_GENERATION, "ghost")

    def test_unregister_cleans_defaults(
        self, registry, ollama_adapter, ollama_manifest
    ):
        registry.register(ollama_adapter, ollama_manifest)
        registry.set_default(Capability.TEXT_GENERATION, "ollama")
        registry.unregister("ollama")
        with pytest.raises(CapabilityNotAvailableError):
            registry.get_adapter(Capability.TEXT_GENERATION)


class TestFallback:
    def test_get_fallback(self, registry, ollama_adapter, ollama_manifest):
        registry.register(ollama_adapter, ollama_manifest)
        registry.set_fallback(Capability.TEXT_GENERATION, "ollama")
        assert (
            registry.get_fallback_adapter(Capability.TEXT_GENERATION) is ollama_adapter
        )

    def test_get_fallback_returns_none(self, registry):
        assert registry.get_fallback_adapter(Capability.TEXT_GENERATION) is None


class TestListAndQuery:
    def test_list_for_capability(
        self,
        registry,
        ollama_adapter,
        ollama_manifest,
        openai_adapter,
        openai_manifest,
    ):
        registry.register(ollama_adapter, ollama_manifest)
        registry.register(openai_adapter, openai_manifest)
        names = registry.list_adapters_for_capability(Capability.TEXT_GENERATION)
        assert set(names) == {"ollama", "openai"}

    def test_has_capability(self, registry, ollama_adapter, ollama_manifest):
        registry.register(ollama_adapter, ollama_manifest)
        assert registry.has_capability(Capability.TEXT_GENERATION) is True
        assert registry.has_capability(Capability.IMAGE_GENERATION) is False
