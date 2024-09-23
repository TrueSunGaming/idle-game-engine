import { largeNumberName } from "./largeNumberName.js";

export function formatNumber(num: number, format: "long" | "short"): string {
    if (num < 1000) return num.toFixed(0);
    if (num < 1e6) return Math.floor(num).toLocaleString();

    const index: number = Math.floor(Math.floor(Math.log10(num)) / 3) - 1;
    return (num / 10 ** (index * 3 + 3)).toFixed(3) + (format == "long" ? " " : "") + largeNumberName(index, format);
}