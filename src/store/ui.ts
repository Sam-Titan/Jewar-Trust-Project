import { create } from "zustand";

type UiState = {
  modelReady: boolean;
  setModelReady: (ready: boolean) => void;
  /** Model download progress, 0–100. Written from inside the lazy 3D chunk. */
  progress: number;
  setProgress: (progress: number) => void;
  /** Story scroll progress, 0–1. Read with getState() in useFrame (no re-render). */
  storyProgress: number;
  setStoryProgress: (progress: number) => void;
  /** Product card. `cardRequested` flips once on first open so the lazy chunk stays mounted. */
  cardOpen: boolean;
  cardRequested: boolean;
  openCard: () => void;
  closeCard: () => void;
};

export const useUi = create<UiState>((set) => ({
  modelReady: false,
  setModelReady: (modelReady) => set({ modelReady }),
  progress: 0,
  setProgress: (progress) => set({ progress }),
  storyProgress: 0,
  setStoryProgress: (storyProgress) => set({ storyProgress }),
  cardOpen: false,
  cardRequested: false,
  openCard: () => set({ cardOpen: true, cardRequested: true }),
  closeCard: () => set({ cardOpen: false }),
}));
