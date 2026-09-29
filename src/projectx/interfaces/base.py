"""Base adapter abstract class."""

from __future__ import annotations

from abc import ABC, abstractmethod

from projectx.core.schemas import AdapterManifest


class BaseAdapter(ABC):
    """Base class that all ProjectX adapters must inherit from."""

    @abstractmethod
    def get_manifest(self) -> AdapterManifest:
        """Return the adapter's manifest declaring its capabilities."""
        ...

    @abstractmethod
    async def health_check(self) -> bool:
        """Check if the adapter's backend is reachable and healthy."""
        ...

    async def initialize(self) -> None:
        """Perform asynchronous initialization."""
        return None

    async def shutdown(self) -> None:
        """Perform asynchronous cleanup/teardown."""
        return None
