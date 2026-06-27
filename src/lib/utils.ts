import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `${price.toFixed(price % 1 === 0 ? 0 : 1)} ر.س`;
}

export function generateCartId(): string {
  return Math.random().toString(36).substring(2, 9);
}
