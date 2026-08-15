export type ToastType = "default" | "success" | "warning" | "error";

export interface ToastItem {
  id: string; // Identifier used for hiding the toast
  created: number; // Toasts are stacked in order of newest first
  title: string; // The heavier text shown at the top of the toast
  message: string; // The body text in the toast
  type: ToastType; // The colour theme for the toast
  duration: number; // The length of time (in milliseconds) before the toast hides itself
}
