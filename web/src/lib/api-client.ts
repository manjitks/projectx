import {
  AdapterManifest,
  HealthResponse,
  TextChunk,
  TextGenRequest,
  TextGenResponse,
} from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export class ProjectXApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async getHealth(): Promise<HealthResponse> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/health`);
      if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
      return await res.json();
    } catch {
      return { status: "offline", version: "0.1.0" };
    }
  }

  async getAdapters(): Promise<AdapterManifest[]> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/system/adapters`);
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  }


  async generateText(req: TextGenRequest): Promise<TextGenResponse> {
    const res = await fetch(`${this.baseUrl}/api/v1/text/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || `Request failed with status ${res.status}`);
    }

    return await res.json();
  }

  async *generateTextStream(
    req: TextGenRequest
  ): AsyncGenerator<TextChunk, void, unknown> {
    const res = await fetch(`${this.baseUrl}/api/v1/text/generate/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || `Stream failed with status ${res.status}`);
    }

    if (!res.body) {
      throw new Error("No response body received from server");
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith(":")) continue;

          if (trimmed.startsWith("data: ")) {
            const dataStr = trimmed.slice(6);
            if (dataStr === "[DONE]") {
              return;
            }
            try {
              const chunk: TextChunk = JSON.parse(dataStr);
              yield chunk;
            } catch {
              // ignore malformed SSE line
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}

export const apiClient = new ProjectXApiClient();
