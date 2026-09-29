"""Unit tests for Application bootstrap and lifecycle management."""

import pytest

from projectx.core.bootstrap import Application, get_application, reset_application
from projectx.core.config import (
    ProjectXConfig,
    ProviderAdapterConfig,
    ProviderCapabilityConfig,
)
from projectx.core.schemas import Capability


@pytest.fixture(autouse=True)
def cleanup_application():
    reset_application()
    yield
    reset_application()


@pytest.mark.asyncio
class TestApplicationBootstrap:
    async def test_bootstrap_creates_registry(self):
        app = Application(config=ProjectXConfig())
        assert app.is_started is False
        await app.startup()
        assert app.is_started is True
        assert app.registry is not None
        assert app.event_bus is not None
        assert app.text_gen_service is not None
        await app.shutdown()
        assert app.is_started is False

    async def test_bootstrap_registers_ollama_from_config(self):
        config = ProjectXConfig(
            providers={
                "text_generation": ProviderCapabilityConfig(
                    default="ollama",
                    adapters={
                        "ollama": ProviderAdapterConfig(
                            base_url="http://localhost:11434",
                            default_model="llama3.2",
                        )
                    },
                )
            }
        )
        app = Application(config=config)
        await app.startup()

        manifests = app.registry.list_adapters()
        assert len(manifests) == 1
        assert manifests[0].name == "ollama"

        adapter = app.registry.get_adapter(Capability.TEXT_GENERATION)
        assert adapter is not None
        assert adapter.config.default_model == "llama3.2"

        await app.shutdown()

    async def test_bootstrap_sets_defaults_and_fallbacks(self):
        config = ProjectXConfig(
            providers={
                "text_generation": ProviderCapabilityConfig(
                    default="ollama",
                    fallback="ollama",
                    adapters={
                        "ollama": ProviderAdapterConfig(
                            base_url="http://localhost:11434",
                        )
                    },
                )
            }
        )
        app = Application(config=config)
        await app.startup()

        adapter = app.registry.get_adapter(Capability.TEXT_GENERATION)
        fallback = app.registry.get_fallback_adapter(Capability.TEXT_GENERATION)
        assert adapter is not None
        assert fallback is not None
        await app.shutdown()

    async def test_bootstrap_emits_lifecycle_events(self):
        app = Application(config=ProjectXConfig())
        events_received = []

        async def handler(event):
            events_received.append(event.name)

        app.event_bus.on("*", handler)

        await app.startup()
        assert "application.started" in events_received

        await app.shutdown()
        assert "application.shutdown" in events_received

    async def test_bootstrap_idempotent_startup(self):
        app = Application(config=ProjectXConfig())
        await app.startup()
        first_started = app.is_started
        await app.startup()  # Should not duplicate or fail
        assert first_started is True
        assert app.is_started is True
        await app.shutdown()

    async def test_get_and_reset_application(self):
        app1 = get_application()
        app2 = get_application()
        assert app1 is app2

        reset_application()
        app3 = get_application()
        assert app3 is not app1
