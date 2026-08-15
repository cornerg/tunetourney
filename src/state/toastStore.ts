import { create } from "zustand";
import type { ToastItem, ToastType } from "@/models/ToastItem.ts";

type ShowToastParams = {
  title: string;
  message: string;
  type?: ToastType | null | undefined;
  duration?: number | null | undefined;
}

type UseToastState = {
  toastItems: ToastItem[];
  showToast: (params: ShowToastParams) => void;
  hideToast: (toastId: string) => void;
}

export const useToast = create<UseToastState>()((set, getState) => ({
  toastItems: [],
  showToast: ({ title, message, type, duration }: ShowToastParams) => {
    const id = crypto.randomUUID();
    const newDuration = duration || 4000;
    const newItem: ToastItem = {
      created: Date.now(),
      id,
      title,
      message,
      type: type ?? "default",
      duration: newDuration,
    };
    setTimeout(() => getState().hideToast(id), newDuration);
    set(state => ({ toastItems: [...state.toastItems, newItem] }));
  },
  hideToast: (toastId: string) => {
    set(state => ({
      toastItems: state.toastItems.filter(item => item.id !== toastId),
    }));
  },
}));
