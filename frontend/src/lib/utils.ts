import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for merging tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Shared utility functions for SanMaHot Frontend
 */

/**
 * Format a number as Vietnamese Dong (VND)
 */
export const formatPrice = (price: number | string | null | undefined): string => {
  if (price === null || price === undefined) return 'Liên hệ';

  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numericPrice)) return 'Liên hệ';

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(numericPrice);
};

/**
 * Format a date string to a localized Vietnamese date
 */
export const formatDate = (
  dateString: string | null | undefined,
  options?: Intl.DateTimeFormatOptions,
): string => {
  if (!dateString) return 'Vĩnh viễn';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Vĩnh viễn';

  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    ...options,
  };

  return date.toLocaleDateString('vi-VN', defaultOptions);
};

/**
 * Calculate time remaining from now until a given date
 */
export const formatTimeRemaining = (dateString: string | null | undefined): string | null => {
  if (!dateString) return null;
  const now = new Date();
  const end = new Date(dateString);
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Đã hết hạn';
  if (diffDays === 0) return 'Hết hạn hôm nay';
  return `Còn ${diffDays} ngày`;
};
