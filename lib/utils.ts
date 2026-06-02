import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format number to IDR (Indonesian Rupiah)
export function formatPrice(price: number): string {
  if (price === 0) return 'Gratis / Free';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Format ISO date string into Indonesian readable format (e.g., Sabtu, 06 Jun 2026)
export function formatDate(dateStr: string): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return new Date(dateStr).toLocaleDateString('id-ID', options);
}

// Get day and month parts separately
export function getDateParts(dateStr: string) {
  const dateObj = new Date(dateStr);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];
  const month = monthNames[dateObj.getMonth()];
  const weekday = dateObj.toLocaleDateString('id-ID', { weekday: 'short' }).toUpperCase();
  return { day, month, weekday };
}

