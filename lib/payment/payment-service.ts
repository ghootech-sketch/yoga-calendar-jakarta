import { Booking } from '../bookings/booking-types';
import { MockPaymentProvider } from './mock-payment-provider';
import { PaymentTransaction, PaymentStatus } from './payment-types';

/**
 * Service orchestrating payment operations.
 * Swapping from Mock to a production gateway like Midtrans / Xendit is done here
 * by replacing the delegated provider.
 */
export const PaymentService = {
  async createPaymentTransaction(booking: Booking): Promise<PaymentTransaction> {
    return MockPaymentProvider.createPayment(booking);
  },

  async confirmPaymentSuccess(bookingCode: string): Promise<boolean> {
    const updated = await MockPaymentProvider.handlePaymentSuccess(bookingCode);
    return updated !== null;
  },

  async confirmPaymentFailure(bookingCode: string): Promise<boolean> {
    const updated = await MockPaymentProvider.handlePaymentFailed(bookingCode);
    return updated !== null;
  }
};
