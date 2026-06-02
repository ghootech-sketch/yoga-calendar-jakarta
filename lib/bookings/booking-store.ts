import { Booking, BookingStatus, generateBookingCode } from './booking-types';
import { DUMMY_EVENTS, Event } from '../dummy-events';

// Isomorphic LocalStorage helper
const IS_SERVER = typeof window === 'undefined';

const BOOKINGS_KEY = 'ycj_bookings_v1';
const SLOTS_OVERRIDE_KEY = 'ycj_slots_override_v1';

export function getStoredBookings(): Booking[] {
  if (IS_SERVER) return [];
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse bookings from localStorage', e);
    return [];
  }
}

export function saveStoredBookings(bookings: Booking[]): void {
  if (IS_SERVER) return;
  try {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  } catch (e) {
    console.error('Failed to save bookings to localStorage', e);
  }
}

/**
 * Dynamically calculates the current available slots of an event.
 * Real available slots = Event's initial available slots - total quantity of all 'paid' bookings.
 */
export function getEventAvailableSlots(event: Event): number {
  if (IS_SERVER) return event.availableSlot;
  
  // Calculate from local bookings with 'paid' status
  const bookings = getStoredBookings();
  const paidTicketsCount = bookings
    .filter(b => b.eventId === event.id && b.status === 'paid')
    .reduce((sum, b) => sum + b.ticketQuantity, 0);

  return Math.max(0, event.availableSlot - paidTicketsCount);
}

/**
 * Checks if an event is sold out based on local paid bookings.
 */
export function isEventSoldOut(event: Event): boolean {
  return getEventAvailableSlots(event) <= 0;
}

export const BookingService = {
  getAllBookings(): Booking[] {
    return getStoredBookings();
  },

  getBookingByCode(bookingCode: string): Booking | null {
    const bookings = getStoredBookings();
    const found = bookings.find(b => b.bookingCode.toUpperCase() === bookingCode.toUpperCase());
    return found || null;
  },

  createBooking(payload: {
    eventId: string;
    eventSlug: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    ticketQuantity: number;
    totalPrice: number;
    notes?: string;
  }): Booking {
    const bookings = getStoredBookings();
    
    const newBooking: Booking = {
      id: Math.random().toString(36).substring(2, 9),
      bookingCode: generateBookingCode(),
      eventId: payload.eventId,
      eventSlug: payload.eventSlug,
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerPhone: payload.customerPhone,
      ticketQuantity: payload.ticketQuantity,
      totalPrice: payload.totalPrice,
      status: 'pending_payment',
      notes: payload.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    bookings.push(newBooking);
    saveStoredBookings(bookings);
    return newBooking;
  },

  updateBookingStatus(bookingCode: string, status: BookingStatus): Booking | null {
    const bookings = getStoredBookings();
    const idx = bookings.findIndex(b => b.bookingCode.toUpperCase() === bookingCode.toUpperCase());
    
    if (idx === -1) return null;

    bookings[idx] = {
      ...bookings[idx],
      status,
      updatedAt: new Date().toISOString()
    };

    saveStoredBookings(bookings);
    return bookings[idx];
  }
};
