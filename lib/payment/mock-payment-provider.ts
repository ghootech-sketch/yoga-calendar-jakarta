import { Booking } from '../bookings/booking-types';
import { BookingService } from '../bookings/booking-store';
import { PaymentProvider, PaymentTransaction, PaymentStatus } from './payment-types';
import { EmailService } from '../email/email-service';

/**
 * Provider ini hanya mock untuk prototype. 
 * Nanti bisa diganti ke Midtrans/Xendit tanpa mengubah UI checkout.
 */
export const MockPaymentProvider: PaymentProvider = {
  async createPayment(booking: Booking): Promise<PaymentTransaction> {
    // Return a mock transaction details
    return {
      id: `PAY-MOCK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      bookingCode: booking.bookingCode,
      provider: 'mock',
      amount: booking.totalPrice,
      status: 'pending',
      paymentUrl: `/checkout/${booking.bookingCode}`,
      createdAt: new Date().toISOString()
    };
  },

  async getPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    // Simple prototype checking - we default to standard checks
    return 'pending';
  },

  async handlePaymentSuccess(bookingCode: string): Promise<Booking | null> {
    // 1. Update Booking status to PAID
    const updatedBooking = BookingService.updateBookingStatus(bookingCode, 'paid');
    
    // 2. Trigger Mock Email Service
    if (updatedBooking) {
      try {
        EmailService.sendBookingConfirmationEmail(updatedBooking);
      } catch (err) {
        console.error('Error in mock booking email sending', err);
      }
    }

    return updatedBooking;
  },

  async handlePaymentFailed(bookingCode: string): Promise<Booking | null> {
    // Update booking status to FAILED
    return BookingService.updateBookingStatus(bookingCode, 'failed');
  }
};
