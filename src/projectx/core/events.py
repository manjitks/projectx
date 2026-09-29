"""In-process async event bus for decoupled communication."""

from __future__ import annotations

import asyncio
import inspect
from collections import deque
from collections.abc import Awaitable, Callable
from dataclasses import dataclass, field
from datetime import UTC, datetime
from typing import Any

from projectx.core.logging import get_logger

logger = get_logger(__name__)


@dataclass
class Event:
    """An event emitted across the event bus."""

    name: str
    data: dict[str, Any] = field(default_factory=dict)
    timestamp: datetime = field(default_factory=lambda: datetime.now(UTC))


EventHandler = Callable[[Event], Awaitable[None] | None]


class EventBus:
    """Async event bus supporting wildcard listeners and history tracking."""

    def __init__(self, max_history: int = 1000) -> None:
        self._handlers: dict[str, list[EventHandler]] = {}
        self._history: deque[Event] = deque(maxlen=max_history)

    def on(self, event_name: str, handler: EventHandler) -> None:
        """Register a handler for an event name or '*' for all events."""
        if event_name not in self._handlers:
            self._handlers[event_name] = []
        if handler not in self._handlers[event_name]:
            self._handlers[event_name].append(handler)

    def off(self, event_name: str, handler: EventHandler) -> None:
        """Unregister a handler for an event."""
        if event_name in self._handlers and handler in self._handlers[event_name]:
            self._handlers[event_name].remove(handler)

    async def _safe_call(self, handler: EventHandler, event: Event) -> None:
        try:
            res = handler(event)
            if inspect.isawaitable(res):
                await res
        except Exception as exc:
            logger.warning(
                "Event handler failed",
                event_name=event.name,
                error=str(exc),
            )

    async def emit(self, event: Event) -> None:
        """Emit an event to matching handlers concurrently."""
        self._history.append(event)

        handlers: list[EventHandler] = []
        if event.name in self._handlers:
            handlers.extend(self._handlers[event.name])
        if "*" in self._handlers:
            handlers.extend(self._handlers["*"])

        if handlers:
            await asyncio.gather(*(self._safe_call(h, event) for h in handlers))

    def get_history(self, event_name: str | None = None) -> list[Event]:
        """Return history of emitted events, optionally filtered by event name."""
        if event_name is not None:
            return [e for e in self._history if e.name == event_name]
        return list(self._history)

    def clear(self) -> None:
        """Clear all handlers and event history."""
        self._handlers.clear()
        self._history.clear()
