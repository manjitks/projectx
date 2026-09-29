"""Configuration management for ProjectX."""

from __future__ import annotations

import copy
import os
import re
from pathlib import Path
from typing import Any

import yaml
from pydantic import BaseModel, ConfigDict, Field

from projectx.core.errors import ConfigError


class AppConfig(BaseModel):
    name: str = "projectx"
    version: str = "0.1.0"
    log_level: str = "INFO"
    data_dir: str = "~/.projectx"


class LocalStorageConfig(BaseModel):
    base_path: str = "~/.projectx/storage"


class StorageConfig(BaseModel):
    backend: str = "local"
    local: LocalStorageConfig = Field(default_factory=LocalStorageConfig)


class CacheConfig(BaseModel):
    backend: str = "memory"
    ttl_seconds: int = 3600


class ProviderAdapterConfig(BaseModel):
    model_config = ConfigDict(extra="allow")

    base_url: str | None = None
    api_key: str | None = None
    default_model: str | None = None
    timeout: int | float = 120
    extra: dict[str, Any] = Field(default_factory=dict)


class ProviderCapabilityConfig(BaseModel):
    default: str | None = None
    fallback: str | None = None
    adapters: dict[str, ProviderAdapterConfig] = Field(default_factory=dict)


class ProjectXConfig(BaseModel):
    app: AppConfig = Field(default_factory=AppConfig)
    storage: StorageConfig = Field(default_factory=StorageConfig)
    cache: CacheConfig = Field(default_factory=CacheConfig)
    providers: dict[str, ProviderCapabilityConfig] = Field(default_factory=dict)


_config_instance: ProjectXConfig | None = None
_ENV_VAR_PATTERN = re.compile(r"\$\{([A-Za-z0-9_]+)\}")


def _substitute_env_vars(data: Any) -> Any:
    """Substitute ${VAR} patterns with environment variables."""
    if isinstance(data, dict):
        return {k: _substitute_env_vars(v) for k, v in data.items()}
    if isinstance(data, list):
        return [_substitute_env_vars(item) for item in data]
    if isinstance(data, str):

        def _replace(match: re.Match[str]) -> str:
            var_name = match.group(1)
            return os.environ.get(var_name, match.group(0))

        return _ENV_VAR_PATTERN.sub(_replace, data)
    return data


def _deep_merge(base: dict[str, Any], override: dict[str, Any]) -> dict[str, Any]:
    """Deep merge two dictionaries without mutating either."""
    result = copy.deepcopy(base)
    for key, value in override.items():
        if key in result and isinstance(result[key], dict) and isinstance(value, dict):
            result[key] = _deep_merge(result[key], value)
        else:
            result[key] = copy.deepcopy(value)
    return result


def load_config(
    config_dir: str | Path | None = None,
    overrides: dict[str, Any] | None = None,
) -> ProjectXConfig:
    """Load and validate configuration from YAML files."""
    global _config_instance

    if config_dir is None:
        env_dir = os.environ.get("PROJECTX_CONFIG_DIR")
        target_dir = Path(env_dir) if env_dir else Path("config")
    else:
        target_dir = Path(config_dir)

    merged: dict[str, Any] = {}

    default_file = target_dir / "default.yaml"
    if default_file.exists():
        try:
            content = default_file.read_text(encoding="utf-8")
            parsed = yaml.safe_load(content)
            if isinstance(parsed, dict):
                merged = _deep_merge(merged, parsed)
        except yaml.YAMLError as exc:
            raise ConfigError(f"Failed to parse {default_file}: {exc}") from exc

    providers_file = target_dir / "providers.yaml"
    if providers_file.exists():
        try:
            content = providers_file.read_text(encoding="utf-8")
            parsed = yaml.safe_load(content)
            if isinstance(parsed, dict):
                merged = _deep_merge(merged, parsed)
        except yaml.YAMLError as exc:
            raise ConfigError(f"Failed to parse {providers_file}: {exc}") from exc

    if overrides:
        merged = _deep_merge(merged, overrides)

    substituted = _substitute_env_vars(merged)

    try:
        config = ProjectXConfig.model_validate(substituted)
    except Exception as exc:
        raise ConfigError(f"Configuration validation failed: {exc}") from exc

    _config_instance = config
    return config


def get_config() -> ProjectXConfig:
    """Get the current configuration singleton, loading default if needed."""
    global _config_instance
    if _config_instance is None:
        _config_instance = load_config()
    return _config_instance


def reload_config(config_dir: str | Path | None = None) -> ProjectXConfig:
    """Reload configuration."""
    reset_config()
    return load_config(config_dir=config_dir)


def reset_config() -> None:
    """Reset configuration singleton for testing."""
    global _config_instance
    _config_instance = None
