"""Ollama text generation adapter."""

from __future__ import annotations

import json
from collections.abc import AsyncIterator

import httpx

from projectx.adapters.ollama.config import OllamaConfig
from projectx.core.errors import AdapterConnectionError, AdapterResponseError
from projectx.core.schemas import AdapterManifest, Capability, ModelInfo, TokenUsage
from projectx.interfaces.base import BaseAdapter
from projectx.interfaces.text_generation import (
    TextChunk,
    TextGenerationInterface,
    TextGenRequest,
    TextGenResponse,
)


class OllamaAdapter(BaseAdapter, TextGenerationInterface):
    """Adapter for interacting with local Ollama models."""

    def __init__(self, config: OllamaConfig | None = None) -> None:
        self.config = config or OllamaConfig()
        self._client: httpx.AsyncClient | None = None

    def _get_client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(
                base_url=self.config.base_url,
                timeout=self.config.timeout,
            )
        return self._client

    def get_manifest(self) -> AdapterManifest:
        """Return Ollama adapter manifest."""
        return AdapterManifest(
            name="ollama",
            capabilities=[Capability.TEXT_GENERATION, Capability.EMBEDDINGS],
            supports_streaming=True,
            supports_local=True,
            requires_api_key=False,
            default_models={Capability.TEXT_GENERATION: self.config.default_model},
        )

    async def health_check(self) -> bool:
        """Check if Ollama server is reachable."""
        client = self._get_client()
        try:
            url = f"{self.config.base_url.rstrip('/')}/"
            resp = await client.get(url)
            return resp.is_success
        except Exception:
            return False

    async def generate(self, request: TextGenRequest) -> TextGenResponse:
        """Generate text using Ollama REST API."""
        model = request.model or self.config.default_model
        payload: dict = {
            "model": model,
            "prompt": request.prompt,
            "stream": False,
            "options": {
                "temperature": request.temperature,
                "top_p": request.top_p,
                "num_predict": request.max_tokens,
            },
        }
        if request.system_prompt:
            payload["system"] = request.system_prompt
        if request.stop_sequences:
            payload["options"]["stop"] = request.stop_sequences

        client = self._get_client()
        url = f"{self.config.base_url.rstrip('/')}/api/generate"
        try:
            resp = await client.post(url, json=payload)
            resp.raise_for_status()
        except httpx.ConnectError as exc:
            raise AdapterConnectionError(
                f"Cannot connect to Ollama at {self.config.base_url}: {exc}"
            ) from exc
        except httpx.HTTPStatusError as exc:
            raise AdapterResponseError(
                f"Ollama returned HTTP error {exc.response.status_code}: {exc}"
            ) from exc
        except Exception as exc:
            raise AdapterResponseError(
                f"Unexpected error communicating with Ollama: {exc}"
            ) from exc

        data = resp.json()
        content = data.get("response", "")
        prompt_eval_count = data.get("prompt_eval_count", 0) or 0
        eval_count = data.get("eval_count", 0) or 0
        finish_reason = "stop" if data.get("done") else None
        usage = TokenUsage(
            input_tokens=prompt_eval_count,
            output_tokens=eval_count,
            total_tokens=prompt_eval_count + eval_count,
        )

        return TextGenResponse(
            content=content,
            model=data.get("model", model),
            usage=usage,
            finish_reason=finish_reason,
        )

    async def generate_stream(
        self, request: TextGenRequest
    ) -> AsyncIterator[TextChunk]:
        """Stream text generation chunks from Ollama."""
        model = request.model or self.config.default_model
        payload: dict = {
            "model": model,
            "prompt": request.prompt,
            "stream": True,
            "options": {
                "temperature": request.temperature,
                "top_p": request.top_p,
                "num_predict": request.max_tokens,
            },
        }
        if request.system_prompt:
            payload["system"] = request.system_prompt
        if request.stop_sequences:
            payload["options"]["stop"] = request.stop_sequences

        client = self._get_client()
        url = f"{self.config.base_url.rstrip('/')}/api/generate"
        try:
            async with client.stream("POST", url, json=payload) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if not line:
                        continue
                    chunk_data = json.loads(line)
                    content = chunk_data.get("response", "")
                    done = chunk_data.get("done", False)
                    prompt_eval_count = chunk_data.get("prompt_eval_count", 0) or 0
                    eval_count = chunk_data.get("eval_count", 0) or 0
                    usage = TokenUsage(
                        input_tokens=prompt_eval_count,
                        output_tokens=eval_count,
                        total_tokens=prompt_eval_count + eval_count,
                    )
                    yield TextChunk(
                        content=content,
                        finish_reason="stop" if done else None,
                        usage=usage,
                    )
        except httpx.ConnectError as exc:
            raise AdapterConnectionError(
                f"Cannot connect to Ollama at {self.config.base_url}: {exc}"
            ) from exc
        except httpx.HTTPStatusError as exc:
            raise AdapterResponseError(
                f"Ollama stream error {exc.response.status_code}: {exc}"
            ) from exc
        except Exception as exc:
            raise AdapterResponseError(
                f"Unexpected error in Ollama stream: {exc}"
            ) from exc

    def get_supported_models(self) -> list[ModelInfo]:
        """Return supported models list."""
        return [
            ModelInfo(
                name=self.config.default_model,
                provider="ollama",
                capability=Capability.TEXT_GENERATION,
                supports_streaming=True,
            )
        ]

    async def shutdown(self) -> None:
        """Close HTTP client on shutdown."""
        if self._client is not None and not self._client.is_closed:
            await self._client.aclose()
            self._client = None
