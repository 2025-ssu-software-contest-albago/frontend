import { create } from 'zustand'

export const useCalTypeStore = create((set) => ({
  type: "월",
  setCalType: (type) => set({ type : type }),
}))