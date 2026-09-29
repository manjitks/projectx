import { create } from "zustand";

export interface HopperItem {
  id: string;
  type: "text" | "url" | "voice";
  content: string;
  metadata?: string;
  timestamp: number;
}

interface FoundryState {
  goal: string;
  setGoal: (goal: string) => void;

  hopperItems: HopperItem[];
  addHopperItem: (item: Omit<HopperItem, "id" | "timestamp">) => void;
  removeHopperItem: (id: string) => void;

  canvasContent: string;
  setCanvasContent: (content: string) => void;

  isSynthesizing: boolean;
  setIsSynthesizing: (status: boolean) => void;
}

export const useFoundryStore = create<FoundryState>((set) => ({
  goal: "",
  setGoal: (goal) => set({ goal }),

  hopperItems: [],
  addHopperItem: (item) =>
    set((state) => ({
      hopperItems: [
        { ...item, id: `item-${Date.now()}`, timestamp: Date.now() },
        ...state.hopperItems
      ]
    })),
  removeHopperItem: (id) =>
    set((state) => ({ hopperItems: state.hopperItems.filter((i) => i.id !== id) })),

  canvasContent: "# Untitled Document\n\nSet a goal and drop items into the Hopper to begin synthesis.",
  setCanvasContent: (content) => set({ canvasContent: content }),

  isSynthesizing: false,
  setIsSynthesizing: (status) => set({ isSynthesizing: status }),
}));
