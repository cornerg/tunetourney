import { create } from "zustand";

type LoadScreenState = {
  text: string;
  visible: boolean;
  opacity: number;
  show: (text: string) => void;
  hide: () => void;
  changeText: (text: string) => void;
}

export const useLoadScreen = create<LoadScreenState>()(set => ({
  text: "Loading",
  visible: false,
  opacity: 0,
  show: async (text: string) => {
    set(() => ({ text, opacity: 0 }));
    set(() => ({ visible: true }));
    await new Promise(res => setTimeout(res, 10));
    set(() => ({ opacity: 1 }));
  },
  hide: async () => {
    set(() => ({ opacity: 0, visible: true }));
    await new Promise(res => setTimeout(res, 300));
    set(() => ({ visible: false }));
  },
  changeText: (text: string) => set({ text }),
}));
