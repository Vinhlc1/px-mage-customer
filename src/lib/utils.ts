import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as Vietnamese Dong, e.g. 250000 → "250.000 ₫" */
export function formatVND(amount: number): string {
  return amount.toLocaleString("vi-VN") + " ₫";
}
