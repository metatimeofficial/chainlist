import create from "zustand";

export const useChain = create((set) => ({
  id: null,
  updateChain: (id) => set(() => ({ id })),
}));

export const useRpcStore = create((set) => ({
  rpcs: [],
  addRpc: (value) => set((state) => ({ rpcs: [...state.rpcs, value] })),
}));
