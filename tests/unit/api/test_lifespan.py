"""Unit tests for FastAPI application lifespan integration."""

import pytest
from starlette.testclient import TestClient

from projectx.api.app import create_app
from projectx.core.bootstrap import get_application, reset_application


@pytest.fixture(autouse=True)
def clean_app():
    reset_application()
    yield
    reset_application()


class TestLifespan:
    def test_lifespan_triggers_startup_and_shutdown(self):
        app = create_app()
        application = get_application()
        assert application.is_started is False

        with TestClient(app) as client:
            resp = client.get("/health")
            assert resp.status_code == 200
            assert application.is_started is True

        assert application.is_started is False
