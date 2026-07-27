import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(text: string | null | undefined): string {
  const letterRegex = new RegExp(/(?<=^| |_|-)\w/, "g");
  const letters = (text?.match(letterRegex)?.join("") ?? "-").toUpperCase();
  return letters.length <= 1
    ? letters
    : letters.slice(0, 1) + letters.slice(-1);
}
