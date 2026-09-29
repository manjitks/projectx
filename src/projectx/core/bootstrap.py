"""Application bootstrap and lifecycle management."""

from __future__ import annotations

import inspect
from typing import Any

from projectx.adapters.ollama.adapter import OllamaAdapter
from projectx.adapters.ollama.config import OllamaConfig
from projectx.capabilities.text_gen.service import TextGenService
from projectx.core.config import ProjectXConfig, get_config
from projectx.core.events import Event, EventBus
from projectx.core.logging import get_logger
from projectx.core.registry import AdapterRegistry
from projectx.core.schemas import Capability

logger = get_logger(__name__)


class Application:
    """Central application container managing components and lifecycle."""

    def __init__(self, config: ProjectXConfig | None = None) -> None:
        self.config: ProjectXConfig = config or get_config()
        self.registry: AdapterRegistry = AdapterRegistry()
        self.event_bus: EventBus = EventBus()
        self.text_gen_service: TextGenService = TextGenService(
            registry=self.registry,
            event_bus=self.event_bus,
        )
        self.is_started: bool = False

    async def startup(self) -> None:
        """Initialize and wire all configured adapters and services."""
        if self.is_started:
            return

        logger.info("Starting ProjectX application bootstrap")

        # Discover and register adapters from configuration
        for cap_name, cap_conf in self.config.providers.items():
            try:
                cap_enum = Capability(cap_name)
            except ValueError:
                logger.warning(
                    "Unknown capability in providers config",
                    capability=cap_name,
                )
                continue

            for adapter_name, adapter_conf in cap_conf.adapters.items():
                adapter_instance = self._create_adapter(adapter_name, adapter_conf)
                if adapter_instance is not None:
                    manifest = adapter_instance.get_manifest()
                    self.registry.register(adapter_instance, manifest)
                    logger.info(
                        "Registered adapter",
                        adapter=adapter_name,
                        capabilities=manifest.capabilities,
                    )

            if cap_conf.default:
                try:
                    self.registry.set_default(cap_enum, cap_conf.default)
                except Exception as exc:
                    logger.warning(
                        "Failed to set default provider",
                        capability=cap_name,
                        provider=cap_conf.default,
                        error=str(exc),
                    )

            if cap_conf.fallback:
                try:
                    self.registry.set_fallback(cap_enum, cap_conf.fallback)
                except Exception as exc:
                    logger.warning(
                        "Failed to set fallback provider",
                        capability=cap_name,
                        provider=cap_conf.fallback,
                        error=str(exc),
                    )

        # Refresh service with populated registry
        self.text_gen_service = TextGenService(
            registry=self.registry,
            event_bus=self.event_bus,
        )
        self.is_started = True

        await self.event_bus.emit(
            Event(
                name="application.started",
                data={
                    "adapters": [m.name for m in self.registry.list_adapters()],
                },
            )
        )
        logger.info("ProjectX application bootstrap complete")

    def _create_adapter(self, name: str, conf: Any) -> Any:
        """Create adapter instance based on name and configuration."""
        if name == "ollama":
            ollama_conf = OllamaConfig(
                base_url=conf.base_url or "http://localhost:11434",
                default_model=conf.default_model or "llama3.2",
                timeout=conf.timeout,
            )
            return OllamaAdapter(config=ollama_conf)

        logger.warning(
            "No adapter implementation available for provider",
            provider=name,
        )
        return None

    async def shutdown(self) -> None:
        """Gracefully shut down all registered adapters and application resources."""
        if not self.is_started:
            return

        logger.info("Shutting down ProjectX application")

        for manifest in self.registry.list_adapters():
            try:
                for capability in manifest.capabilities:
                    adapter = self.registry.get_adapter(
                        capability, provider=manifest.name
                    )
                    if hasattr(adapter, "shutdown") and callable(adapter.shutdown):
                        res = adapter.shutdown()
                        if inspect.isawaitable(res):
                            await res
                    break
            except Exception as exc:
                logger.error(
                    "Error shutting down adapter",
                    adapter=manifest.name,
                    error=str(exc),
                )

        await self.event_bus.emit(
            Event(
                name="application.shutdown",
                data={},
            )
        )
        self.is_started = False
        logger.info("ProjectX shutdown complete")


_app_instance: Application | None = None


def get_application() -> Application:
    """Return the global Application instance."""
    global _app_instance
    if _app_instance is None:
        _app_instance = Application()
    return _app_instance


def reset_application() -> None:
    """Reset the global Application instance (useful in tests)."""
    global _app_instance
    _app_instance = None
