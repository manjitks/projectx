/**
 * Type definitions mirroring ProjectX Python backend schemas.
 */

export type Capability =
  | "text_generation"
  | "vision"
  | "speech_to_text"
  | "text_to_speech"
  | "image_generation"
  | "image_to_3d"
  | "code_generation"
  | "embeddings"
  | "rag"
  | "agent";

export interface TokenUsage {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
}

export interface ModelInfo {
  name: string;
  provider: string;
  capability: Capability;
  context_window?: number;
  max_output_tokens?: number;
  supports_streaming: boolean;
  supports_vision: boolean;
  cost_per_input_token: number;
  cost_per_output_token: number;
}

export interface AdapterManifest {
  name: string;
  capabilities: Capability[];
  description?: string;
  version?: string;
  supports_streaming: boolean;
  supports_local: boolean;
  requires_api_key: boolean;
  default_models: Record<string, string>;
}

export interface TextGenRequest {
  prompt: string;
  system_prompt?: string;
  model?: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  stop_sequences?: string[];
  response_format?: string;
  provider?: string;
}

export interface TextGenResponse {
  content: string;
  model: string;
  usage?: TokenUsage;
  finish_reason?: string;
}

export interface TextChunk {
  content: string;
  finish_reason?: string | null;
  usage?: TokenUsage;
}

export interface HealthResponse {
  status: string;
  version: string;
}

export interface ProductData {
  id?: string;
  url: string;
  title: string;
  current_price: number;
  original_price?: number;
  currency: string;
  rating?: number;
  review_count?: number;
  seller?: string;
  availability?: string;
  images: string[];
  specifications: Record<string, string | undefined>;
  source: string; // "amazon_in" | "flipkart" | etc.
  scraped_at: string;
}


export interface PricePoint {
  id: number;
  price: number;
  original_price?: number;
  scraped_at: string;
}

export interface ProductReview {
  title: string;
  body: string;
  rating: number;
  author: string;
  date: string;
  verified: boolean;
}
