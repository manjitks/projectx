import pytest


@pytest.fixture
def sample_config():
    return {
        "app": {
            "name": "projectx-test",
            "version": "0.1.0",
            "log_level": "DEBUG",
            "data_dir": "/tmp/projectx-test",
        },
        "storage": {
            "backend": "local",
            "local": {"base_path": "/tmp/projectx-test/storage"},
        },
        "cache": {"backend": "memory", "ttl_seconds": 60},
    }
