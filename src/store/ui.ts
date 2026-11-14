import { create } from "zustand";

type UiState = {
  modelReady: boolean;
  setModelReady: (ready: boolean) => void;
};

export const useUi = create<UiState>((set) => ({
  modelReady: false,
  setModelReady: (modelReady) => set({ modelReady }),
}));
