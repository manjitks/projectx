"""Tests for projectx.core.config."""

import pytest
import yaml

from projectx.core.config import (
    _deep_merge,
    _substitute_env_vars,
    load_config,
    reset_config,
)
from projectx.core.errors import ConfigError


@pytest.fixture(autouse=True)
def _reset():
    reset_config()
    yield
    reset_config()


@pytest.fixture
def config_dir(tmp_path):
    default = tmp_path / "default.yaml"
    default.write_text(
        yaml.dump(
            {
                "app": {
                    "name": "test-app",
                    "version": "0.1.0",
                    "log_level": "DEBUG",
                    "data_dir": "/tmp/test",
                },
                "storage": {
                    "backend": "local",
                    "local": {"base_path": "/tmp/test/storage"},
                },
                "cache": {"backend": "memory", "ttl_seconds": 60},
            }
        )
    )
    providers = tmp_path / "providers.yaml"
    providers.write_text(
        yaml.dump(
            {
                "providers": {
                    "text_generation": {
                        "default": "ollama",
                        "fallback": None,
                        "adapters": {
                            "ollama": {
                                "base_url": "http://localhost:11434",
                                "default_model": "llama3.2",
                                "timeout": 120,
                            }
                        },
                    }
                }
            }
        )
    )
    return tmp_path


class TestEnvVarSubstitution:
    def test_substitutes_existing_var(self, monkeypatch):
        monkeypatch.setenv("MY_KEY", "secret123")
        result = _substitute_env_vars({"api_key": "${MY_KEY}"})
        assert result["api_key"] == "secret123"

    def test_leaves_unresolved_var(self):
        result = _substitute_env_vars({"api_key": "${NONEXISTENT_VAR}"})
        assert result["api_key"] == "${NONEXISTENT_VAR}"

    def test_handles_nested_dicts(self, monkeypatch):
        monkeypatch.setenv("HOST", "localhost")
        result = _substitute_env_vars({"server": {"host": "${HOST}"}})
        assert result["server"]["host"] == "localhost"

    def test_handles_lists(self, monkeypatch):
        monkeypatch.setenv("ITEM", "value")
        result = _substitute_env_vars(["${ITEM}", "static"])
        assert result == ["value", "static"]

    def test_leaves_non_strings_alone(self):
        assert _substitute_env_vars(42) == 42
        assert _substitute_env_vars(True) is True


class TestDeepMerge:
    def test_flat_merge(self):
        assert _deep_merge({"a": 1}, {"b": 2}) == {"a": 1, "b": 2}

    def test_override_wins(self):
        assert _deep_merge({"a": 1}, {"a": 2}) == {"a": 2}

    def test_nested_merge(self):
        base = {"a": {"x": 1, "y": 2}}
        override = {"a": {"y": 3, "z": 4}}
        assert _deep_merge(base, override) == {"a": {"x": 1, "y": 3, "z": 4}}

    def test_does_not_mutate_base(self):
        base = {"a": 1}
        _deep_merge(base, {"b": 2})
        assert base == {"a": 1}


class TestLoadConfig:
    def test_loads_from_directory(self, config_dir):
        config = load_config(config_dir)
        assert config.app.name == "test-app"
        assert config.app.log_level == "DEBUG"

    def test_merges_providers(self, config_dir):
        config = load_config(config_dir)
        assert "text_generation" in config.providers
        tg = config.providers["text_generation"]
        assert tg.default == "ollama"
        assert "ollama" in tg.adapters
        assert tg.adapters["ollama"].base_url == "http://localhost:11434"

    def test_overrides_applied(self, config_dir):
        config = load_config(config_dir, overrides={"app": {"log_level": "WARNING"}})
        assert config.app.log_level == "WARNING"

    def test_env_var_substitution_in_providers(self, config_dir, monkeypatch):
        monkeypatch.setenv("TEST_API_KEY", "sk-test-123")
        providers_path = config_dir / "providers.yaml"
        providers_path.write_text(
            yaml.dump(
                {
                    "providers": {
                        "text_generation": {
                            "default": "openai",
                            "adapters": {
                                "openai": {
                                    "api_key": "${TEST_API_KEY}",
                                    "default_model": "gpt-4o",
                                }
                            },
                        }
                    }
                }
            )
        )
        config = load_config(config_dir)
        openai_adapter = config.providers["text_generation"].adapters["openai"]
        assert openai_adapter.api_key == "sk-test-123"

    def test_empty_config_dir_returns_defaults(self, tmp_path):
        config = load_config(tmp_path)
        assert config.app.name == "projectx"

    def test_invalid_yaml_raises_config_error(self, tmp_path):
        bad_file = tmp_path / "default.yaml"
        bad_file.write_text("{{invalid yaml: [")
        with pytest.raises(ConfigError):
            load_config(tmp_path)
