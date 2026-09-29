"""Typed error hierarchy for ProjectX.

All errors inherit from ProjectXError. Each layer has specific error types.
Never raise bare Exception — always use these.
"""


class ProjectXError(Exception):
    """Base error for all ProjectX errors."""

    def __init__(self, message: str, details: dict | None = None):
        self.message = message
        self.details = details or {}
        super().__init__(self.message)


class ConfigError(ProjectXError):
    """Error loading or validating configuration."""


class AdapterError(ProjectXError):
    """Base error for adapter-layer issues."""


class AdapterNotFoundError(AdapterError):
    """Requested adapter is not registered."""

    def __init__(self, adapter_name: str, capability: str):
        super().__init__(
            f"Adapter '{adapter_name}' not found for capability '{capability}'",
            details={"adapter": adapter_name, "capability": capability},
        )


class AdapterConnectionError(AdapterError):
    """Cannot connect to the adapter's backend (API, local model, etc.)."""


class AdapterResponseError(AdapterError):
    """Adapter returned an unexpected or invalid response."""


class CapabilityError(ProjectXError):
    """Base error for capability-layer issues."""


class CapabilityNotAvailableError(CapabilityError):
    """Requested capability has no registered adapter."""

    def __init__(self, capability: str):
        super().__init__(
            f"No adapter registered for capability '{capability}'",
            details={"capability": capability},
        )


class CapabilityExecutionError(CapabilityError):
    """Error during capability execution."""


class PipelineError(ProjectXError):
    """Error in pipeline definition or execution."""


class ValidationError(ProjectXError):
    """Data validation error."""
