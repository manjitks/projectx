"""Tests for projectx.core.errors."""

import pytest

from projectx.core.errors import (
    AdapterConnectionError,
    AdapterError,
    AdapterNotFoundError,
    AdapterResponseError,
    CapabilityError,
    CapabilityExecutionError,
    CapabilityNotAvailableError,
    ConfigError,
    PipelineError,
    ProjectXError,
    ValidationError,
)


class TestErrorHierarchy:
    """Verify inheritance chain is correct."""

    def test_all_errors_inherit_from_projectx_error(self):
        error_classes = [
            ConfigError,
            AdapterError,
            AdapterNotFoundError,
            AdapterConnectionError,
            AdapterResponseError,
            CapabilityError,
            CapabilityNotAvailableError,
            CapabilityExecutionError,
            PipelineError,
            ValidationError,
        ]
        for cls in error_classes:
            assert issubclass(cls, ProjectXError)

    def test_adapter_errors_inherit_from_adapter_error(self):
        assert issubclass(AdapterNotFoundError, AdapterError)
        assert issubclass(AdapterConnectionError, AdapterError)
        assert issubclass(AdapterResponseError, AdapterError)

    def test_capability_errors_inherit_from_capability_error(self):
        assert issubclass(CapabilityNotAvailableError, CapabilityError)
        assert issubclass(CapabilityExecutionError, CapabilityError)


class TestErrorDetails:
    """Verify error instances carry correct data."""

    def test_base_error_has_message_and_details(self):
        err = ProjectXError("something broke", details={"key": "val"})
        assert err.message == "something broke"
        assert err.details == {"key": "val"}
        assert str(err) == "something broke"

    def test_base_error_defaults_empty_details(self):
        err = ProjectXError("oops")
        assert err.details == {}

    def test_adapter_not_found_formats_message(self):
        err = AdapterNotFoundError(adapter_name="ollama", capability="text_generation")
        assert "ollama" in err.message
        assert "text_generation" in err.message
        assert err.details["adapter"] == "ollama"
        assert err.details["capability"] == "text_generation"

    def test_capability_not_available_formats_message(self):
        err = CapabilityNotAvailableError(capability="speech_to_text")
        assert "speech_to_text" in err.message
        assert err.details["capability"] == "speech_to_text"

    def test_errors_are_catchable_by_parent(self):
        with pytest.raises(ProjectXError):
            raise AdapterNotFoundError("x", "y")

        with pytest.raises(AdapterError):
            raise AdapterConnectionError("connection refused")
