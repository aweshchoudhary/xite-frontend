import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(image?: string | null) {
  if (!image) return "";
  return image.startsWith("http") ? image : "/api/file/" + image;
}
