"""Adapter registry for capability-based discovery and routing."""

from __future__ import annotations

from typing import Any

from projectx.core.errors import AdapterNotFoundError, CapabilityNotAvailableError
from projectx.core.schemas import AdapterManifest, Capability


class AdapterRegistry:
    """Registry that discovers, stores, and retrieves adapter instances."""

    def __init__(self) -> None:
        self._adapters: dict[str, Any] = {}
        self._manifests: dict[str, AdapterManifest] = {}
        self._defaults: dict[Capability, str] = {}
        self._fallbacks: dict[Capability, str] = {}

    def register(self, adapter: Any, manifest: AdapterManifest) -> None:
        """Register an adapter and its manifest."""
        self._adapters[manifest.name] = adapter
        self._manifests[manifest.name] = manifest

    def unregister(self, name: str) -> None:
        """Unregister an adapter by name and clean up configured defaults."""
        self._adapters.pop(name, None)
        self._manifests.pop(name, None)

        self._defaults = {
            cap: prov for cap, prov in self._defaults.items() if prov != name
        }
        self._fallbacks = {
            cap: prov for cap, prov in self._fallbacks.items() if prov != name
        }

    def set_default(self, capability: Capability, provider: str) -> None:
        """Set the default provider for a capability."""
        if provider not in self._adapters:
            raise AdapterNotFoundError(provider, str(capability))
        if capability not in self._manifests[provider].capabilities:
            raise AdapterNotFoundError(provider, str(capability))
        self._defaults[capability] = provider

    def set_fallback(self, capability: Capability, provider: str) -> None:
        """Set the fallback provider for a capability."""
        if provider not in self._adapters:
            raise AdapterNotFoundError(provider, str(capability))
        if capability not in self._manifests[provider].capabilities:
            raise AdapterNotFoundError(provider, str(capability))
        self._fallbacks[capability] = provider

    def get_adapter(self, capability: Capability, provider: str | None = None) -> Any:
        """Retrieve an adapter for capability via explicit/default/first resolution."""
        if provider is not None:
            if provider not in self._adapters:
                raise AdapterNotFoundError(provider, str(capability))
            if capability not in self._manifests[provider].capabilities:
                raise AdapterNotFoundError(provider, str(capability))
            return self._adapters[provider]

        if capability in self._defaults:
            default_prov = self._defaults[capability]
            if (
                default_prov in self._adapters
                and capability in self._manifests[default_prov].capabilities
            ):
                return self._adapters[default_prov]

        for name, manifest in self._manifests.items():
            if capability in manifest.capabilities:
                return self._adapters[name]

        raise CapabilityNotAvailableError(str(capability))

    def get_fallback_adapter(self, capability: Capability) -> Any | None:
        """Return the fallback adapter for a capability, or None if none configured."""
        if capability in self._fallbacks:
            fallback_prov = self._fallbacks[capability]
            if fallback_prov in self._adapters:
                return self._adapters[fallback_prov]
        return None

    def list_adapters(self) -> list[AdapterManifest]:
        """Return all registered adapter manifests."""
        return list(self._manifests.values())

    def list_adapters_for_capability(self, capability: Capability) -> list[str]:
        """Return names of all adapters supporting a capability."""
        return [
            name
            for name, manifest in self._manifests.items()
            if capability in manifest.capabilities
        ]

    def has_capability(self, capability: Capability) -> bool:
        """Return True if at least one adapter supports the capability."""
        return any(
            capability in manifest.capabilities for manifest in self._manifests.values()
        )
