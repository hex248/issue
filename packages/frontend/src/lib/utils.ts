import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function issueID(blob: string, num: number) {
    return `${blob}-${num.toString().padStart(3, "0")}`;
}
