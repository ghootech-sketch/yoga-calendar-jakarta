import { Booking } from '../bookings/booking-types';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'expired' | 'cancelled';

export interface PaymentTransaction {
  id: string;
  bookingCode: string;
  provider: 'mock' | 'midtrans' | 'xendit' | string;
  amount: number;
  status: PaymentStatus;
  paymentUrl: string;
  paidAt?: string;
  createdAt: string;
}

export interface PaymentProvider {
  createPayment(booking: Booking): Promise<PaymentTransaction>;
  getPaymentStatus(transactionId: string): Promise<PaymentStatus>;
  handlePaymentSuccess(bookingCode: string): Promise<Booking | null>;
  handlePaymentFailed(bookingCode: string): Promise<Booking | null>;
}
