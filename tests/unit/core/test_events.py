"""Tests for projectx.core.events."""

import pytest

from projectx.core.events import Event, EventBus


@pytest.fixture
def bus():
    return EventBus()


class TestEvent:
    def test_event_has_name_and_data(self):
        event = Event(name="test.event", data={"key": "value"})
        assert event.name == "test.event"
        assert event.data["key"] == "value"
        assert event.timestamp is not None

    def test_event_defaults_empty_data(self):
        event = Event(name="empty")
        assert event.data == {}


class TestEventBus:
    async def test_handler_receives_event(self, bus):
        received = []

        async def handler(event: Event):
            received.append(event)

        bus.on("test", handler)
        await bus.emit(Event(name="test", data={"x": 1}))
        assert len(received) == 1
        assert received[0].data["x"] == 1

    async def test_multiple_handlers(self, bus):
        calls = []

        async def handler_a(event):
            calls.append("a")

        async def handler_b(event):
            calls.append("b")

        bus.on("multi", handler_a)
        bus.on("multi", handler_b)
        await bus.emit(Event(name="multi"))
        assert set(calls) == {"a", "b"}

    async def test_wildcard_handler(self, bus):
        received = []

        async def handler(event):
            received.append(event.name)

        bus.on("*", handler)
        await bus.emit(Event(name="foo"))
        await bus.emit(Event(name="bar"))
        assert received == ["foo", "bar"]

    async def test_off_removes_handler(self, bus):
        calls = []

        async def handler(event):
            calls.append(1)

        bus.on("test", handler)
        bus.off("test", handler)
        await bus.emit(Event(name="test"))
        assert calls == []

    async def test_handler_error_does_not_break_others(self, bus):
        results = []

        async def bad_handler(event):
            raise ValueError("boom")

        async def good_handler(event):
            results.append("ok")

        bus.on("test", bad_handler)
        bus.on("test", good_handler)
        await bus.emit(Event(name="test"))
        assert results == ["ok"]

    async def test_no_handlers_does_not_error(self, bus):
        await bus.emit(Event(name="nobody.listens"))

    async def test_event_history(self, bus):
        await bus.emit(Event(name="a"))
        await bus.emit(Event(name="b"))
        await bus.emit(Event(name="a"))
        assert len(bus.get_history()) == 3
        assert len(bus.get_history("a")) == 2

    async def test_clear_removes_everything(self, bus):
        async def handler(event):
            pass

        bus.on("test", handler)
        await bus.emit(Event(name="test"))
        bus.clear()
        assert bus.get_history() == []
