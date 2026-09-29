import { create } from "zustand";

interface UiState {
  isSidebarOpen: boolean;
  activeTab: "chat" | "voice" | "shopping" | "dashboard";
  isVoiceActive: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveTab: (tab: "chat" | "voice" | "shopping" | "dashboard") => void;
  setVoiceActive: (active: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isSidebarOpen: true,
  activeTab: "chat",
  isVoiceActive: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setVoiceActive: (active) => set({ isVoiceActive: active }),
}));
