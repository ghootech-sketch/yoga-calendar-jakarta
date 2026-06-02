export type BookingStatus = 'pending_payment' | 'paid' | 'failed' | 'cancelled' | 'expired';

export interface Booking {
  id: string;
  bookingCode: string;
  eventId: string;
  eventSlug: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  ticketQuantity: number;
  totalPrice: number;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Generate a unique booking code.
 * Format: YCJ-YYYYMMDD-RANDOM
 * Example: YCJ-20260602-A8K2
 */
export function generateBookingCode(): string {
  const date = new Date();
  
  // Format as YYYYMMDD in WIB (GMT+7) or local time
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;

  // Generate 4 characters alphanumeric uppercase
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomStr = '';
  for (let i = 0; i < 4; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `YCJ-${dateStr}-${randomStr}`;
}
