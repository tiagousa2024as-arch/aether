/**
 * Shared utilities - cn() for classnames (Tailwind + CVA), formatters, etc.
 * Used across components and app.
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
