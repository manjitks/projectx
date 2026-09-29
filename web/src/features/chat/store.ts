import { create } from "zustand";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  model?: string;
  isStreaming?: boolean;
}

interface ChatState {
  messages: ChatMessage[];
  selectedModel: string;
  selectedProvider: string;
  isGenerating: boolean;
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => string;
  updateMessageContent: (id: string, content: string, isStreaming?: boolean) => void;
  setSelectedModel: (model: string) => void;
  setSelectedProvider: (provider: string) => void;
  setIsGenerating: (generating: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [
    {
      id: "welcome-1",
      role: "assistant",
      content:
        "Welcome to **ProjectX**! I'm connected to your modular AI platform.\n\nYou can chat with local models (via Ollama) or cloud providers, use voice-to-text, compare e-commerce prices with the shopping helper, or inspect platform health in the dashboard.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ],
  selectedModel: "llama3.2",
  selectedProvider: "ollama",
  isGenerating: false,
  addMessage: (message) => {
    const id = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newMessage: ChatMessage = {
      ...message,
      id,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    set((state) => ({ messages: [...state.messages, newMessage] }));
    return id;
  },
  updateMessageContent: (id, content, isStreaming = false) => {
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, content, isStreaming } : m
      ),
    }));
  },
  setSelectedModel: (selectedModel) => set({ selectedModel }),
  setSelectedProvider: (selectedProvider) => set({ selectedProvider }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  clearMessages: () => set({ messages: [] }),
}));
