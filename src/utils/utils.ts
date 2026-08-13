import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const MINUTE = 1000 * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

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

export function toTitleCase(text: string | null | undefined) {
  const firstLetter = new RegExp(/(?<=^|[ _-])\w/, "g");
  return (text ?? "").replace(firstLetter, (match) => match.toUpperCase());
}

export function getFormattedDate(value: string | number | null | undefined) {
  const date = new Date(value || Date.now());
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getRelativeTime(time: number = Date.now()) {
  const now = Date.now();
  const difference = now - time;
  if (difference <= MINUTE) {
    return "Just now"
  } else if (difference < HOUR) {
    const minutes = Math.floor(difference / MINUTE);
    return `${minutes} minutes ago`;
  } else if (difference < DAY) {
    const hours = Math.floor(difference / HOUR);
    return `${hours} hours ago`;
  } else {
    return getFormattedDate(time);
  }
}