import { Booking } from '../bookings/booking-types';
import { DUMMY_EVENTS } from '../dummy-events';
import { formatPrice, formatDate } from '../utils';

/**
 * Service to simulate email confirmations.
 * This is a mock service for prototype purposes.
 * It can be easily upgraded to Resend or SMTP/SES in production.
 */
export const EmailService = {
  sendBookingConfirmationEmail(booking: Booking): { success: boolean; message: string } {
    const event = DUMMY_EVENTS.find(e => e.id === booking.eventId);
    const eventTitle = event ? event.title : 'Kelas Yoga Pilihan';
    const eventDate = event ? formatDate(event.startDate) : formatDate(booking.createdAt);
    const eventTime = event ? `${event.startTime} - ${event.endTime} WIB` : '';
    const eventLocation = event ? `${event.locationName}, ${event.locationAddress}` : '';

    const subject = `Konfirmasi Booking - ${eventTitle}`;
    
    const emailBody = `
==================================================
YOGA CALENDAR JAKARTA - INBOX SIMULATION
==================================================
To: ${booking.customerEmail}
Subject: ${subject}

Halo ${booking.customerName},

Terima kasih telah melakukan pemesanan tiket kelas yoga di Yoga Calendar Jakarta.
Pembayaran Anda telah sukses kami verifikasi. Berikut rincian resmi booking Anda:

--------------------------------------------------
[RINCIAN TIKET RESMI]
--------------------------------------------------
Kode Booking   : ${booking.bookingCode}
Nama Kelas     : ${eventTitle}
Waktu Sesi     : ${eventDate}, ${eventTime}
Tempat/Studio  : ${eventLocation}
Jumlah Peserta : ${booking.ticketQuantity} Tiket
Total Investasi: ${formatPrice(booking.totalPrice)} (LUNAS)
--------------------------------------------------

Silakan tunjukkan Kode Booking di atas kepada asisten di meja registrasi studio saat kedatangan Anda. Kami menyarankan Anda tiba 15 menit sebelum kelas dimulai untuk kenyamanan persiapan perlengkapan matras Anda.

Jika ada pertanyaan darurat atau koordinasi keterlambatan, Anda dapat langsung menghubungi Admin kami via WhatsApp di link berikut:
https://wa.me/6281342531331?text=Halo%2520Yoga%2520Calendar%2520Jakarta%252C%2520saya%2520ingin%2520konfirmasi%2520grup%2520booking%2520${booking.bookingCode}

Semoga latihan Anda membawa kesegaran jasmani dan ketenangan batin!

Salam hangat,
Team Yoga Calendar Jakarta
==================================================
    `;

    // Output to server/dev console
    console.log(emailBody);

    // Also return a visual alert payload for checkout/success screen
    return {
      success: true,
      message: `Mock email confirmation successfully simulated and sent to ${booking.customerEmail}`
    };
  }
};
