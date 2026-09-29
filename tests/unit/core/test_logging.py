"""Tests for projectx.core.logging."""

import projectx.core.logging as log_module
from projectx.core.logging import (
    bind_context,
    clear_context,
    configure_logging,
    get_logger,
)


class TestGetLogger:
    def test_returns_bound_logger(self):
        log_module._configured = False
        logger = get_logger("test.module")
        assert logger is not None
        assert callable(getattr(logger, "info", None))
        assert callable(getattr(logger, "error", None))
        assert callable(getattr(logger, "debug", None))

    def test_logger_does_not_crash_on_log(self):
        log_module._configured = False
        logger = get_logger("test.safe")
        logger.info("test message", key="value")
        logger.debug("debug message")
        logger.warning("warning message")


class TestConfigureLogging:
    def test_configure_is_idempotent(self):
        log_module._configured = False
        configure_logging("DEBUG")
        configure_logging("DEBUG")
        assert log_module._configured is True

    def test_configure_json_mode(self):
        log_module._configured = False
        configure_logging("INFO", json_output=True)
        logger = get_logger("json.test")
        logger.info("json test")


class TestContext:
    def test_bind_and_clear(self):
        clear_context()
        bind_context(request_id="abc-123")
        clear_context()
