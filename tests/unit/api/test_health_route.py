"""Tests for health route."""

from httpx import ASGITransport, AsyncClient

from projectx.api.app import create_app


class TestHealth:
    async def test_returns_200(self):
        app = create_app()
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as c:
            r = await c.get("/health")
        assert r.status_code == 200
        assert r.json()["status"] == "healthy"
