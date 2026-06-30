import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, type FormatOptions } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: Date | string | number,
  formatStr: string = "MMM d, yyyy",
  options?: FormatOptions
): string {
  return format(new Date(date), formatStr, options);
}

export function formatRelativeTime(date: Date | string | number): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatNumber(
  number: number,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat("en-US", options).format(number);
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "")
    .trim()
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trimEnd() + "...";
}

export function parseUserAgent(ua: string | null | undefined): {
  browser: string;
  os: string;
  device: string;
} {
  if (!ua) return { browser: "Unknown", os: "Unknown", device: "Desktop" };

  const browserMatch = ua.match(
    /(firefox|chrome|safari|edge|opera|msie|trident)\/?\s*(\d+)/i
  );
  const osMatch = ua.match(
    /(windows nt|mac os x|android|linux|cros|iphone os|ipados)/i
  );
  const isMobile = /mobile|android|iphone|ipad|ipod/i.test(ua);
  const isTablet = /ipad|tablet/i.test(ua);

  let browser = "Unknown";
  if (browserMatch) {
    const name = browserMatch[1].toLowerCase();
    if (name === "trident" || name === "msie") browser = "Internet Explorer";
    else if (name === "firefox") browser = "Firefox";
    else if (name === "chrome") browser = "Chrome";
    else if (name === "safari") browser = "Safari";
    else if (name === "edge") browser = "Edge";
    else if (name === "opera") browser = "Opera";
    else browser = name.charAt(0).toUpperCase() + name.slice(1);
  }

  let os = "Unknown";
  if (osMatch) {
    const name = osMatch[1].toLowerCase();
    if (name.includes("windows")) os = "Windows";
    else if (name.includes("mac os x")) os = "macOS";
    else if (name === "android") os = "Android";
    else if (name === "linux") os = "Linux";
    else if (name === "cros") os = "Chrome OS";
    else if (name.includes("iphone")) os = "iOS";
    else if (name.includes("ipados")) os = "iPadOS";
  }

  let device = "Desktop";
  if (isTablet) device = "Tablet";
  else if (isMobile) device = "Mobile";

  return { browser, os, device };
}
