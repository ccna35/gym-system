import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Format a date value to YYYY-MM-DD for <input type="date">
export function toInputDate(date?: string | Date | null): string {
  if (!date) return "";
  if (typeof date === "string") {
    // Already in YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    // Extract from ISO-like string
    const match = date.match(/^\d{4}-\d{2}-\d{2}/);
    if (match) return match[0];
  }
  const d = typeof date === "string" ? new Date(date) : new Date(date);
  if (isNaN(d.getTime())) return "";
  // Adjust to local date to avoid timezone shifting to previous/next day
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().split("T")[0];
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function calculateEndDate(
  startDate: string,
  durationMonths: number
): string {
  const date = new Date(startDate);
  date.setMonth(date.getMonth() + durationMonths);
  return date.toISOString().split("T")[0];
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-800";
    case "EXPIRED":
      return "bg-red-100 text-red-800";
    case "EXPIRING_SOON":
      return "bg-yellow-100 text-yellow-800";
    case "SUSPENDED":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getMembershipStatusColor(status: string): string {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-800";
    case "EXPIRING_SOON":
      return "bg-yellow-100 text-yellow-800";
    case "EXPIRED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
