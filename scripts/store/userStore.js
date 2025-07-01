import { create } from 'zustand'

export const useUserStore = create((set) => ({
  user: null,
  selected_space: 0,
  setUser: (userData) => set({ user: userData }),
  setSelectedSpace: (num) => set({ selected_space: num }),
}))