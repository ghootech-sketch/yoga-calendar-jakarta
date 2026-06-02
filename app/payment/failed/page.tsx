'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { AlertOctagon, Calendar, Clock, MapPin, MessageCircle, ChevronRight, RotateCcw, Loader2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';
import { BookingService } from '@/lib/bookings/booking-store';
import { Booking } from '@/lib/bookings/booking-types';
import { DUMMY_EVENTS, Event } from '@/lib/dummy-events';
import { formatPrice, formatDate } from '@/lib/utils';

function FailedPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingCode = searchParams.get('bookingCode') || '';

  const [booking, setBooking] = useState<Booking | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const init = () => {
      setIsHydrated(true);
      if (!bookingCode) return;

      const foundBooking = BookingService.getBookingByCode(bookingCode);
      if (foundBooking) {
        setBooking(foundBooking);
        const foundEvent = DUMMY_EVENTS.find(e => e.id === foundBooking.eventId);
        if (foundEvent) {
          setEvent(foundEvent);
        }
      }
    };

    const handle = setTimeout(init, 0);
    return () => clearTimeout(handle);
  }, [bookingCode]);

  if (!isHydrated) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Loader2 className="w-8 h-8 text-brand-sage animate-spin mb-3" />
        <p className="text-xs text-brand-brown/60 font-semibold">Memuat data penolakan pembayaran...</p>
      </div>
    );
  }

  if (!booking || !event) {
    return (
      <div className="text-center py-16 space-y-6 max-w-md mx-auto">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 border border-red-100 mx-auto">
          <AlertOctagon className="w-8 h-8" />
        </div>
        <div>
          <h2 className="font-sans font-bold text-xl text-brand-brown">Detail Pemesanan Tidak Diketahui</h2>
          <p className="text-xs text-brand-brown/70 font-light mt-1">
            Sistem tidak dapat memvalidasi kode pemesanan ini. Silakan kunjungi halaman events untuk melakukan pendaftaran baru.
          </p>
        </div>
        <div>
          <Link href="/events">
            <Button variant="primary">Lihat Jadwal Kelas</Button>
          </Link>
        </div>
      </div>
    );
  }

  const waText = `Halo Yoga Calendar Jakarta, saya menerima kendala pembayaran gagal untuk registrasi dengan kode ${bookingCode}.`;
  const waLink = `https://wa.me/6281342531331?text=${encodeURIComponent(waText)}`;

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      
      {/* Alert Top Banner */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-3xl border border-red-100 p-8 sm:p-10 shadow-lg text-center space-y-5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none"></div>
        
        {/* Red warning octagonal indicator */}
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border-2 border-red-500/10 shadow-inner">
          <AlertOctagon className="w-8 h-8 stroke-[2.2]" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-800 border border-red-100">
            TRANSACTION FAILED / GAGAL
          </span>
          <h1 className="font-sans font-bold text-2xl sm:text-3xl text-brand-brown tracking-tight">
            Maaf, Verifikasi Pembayaran Gagal!
          </h1>
          <p className="text-xs sm:text-sm text-brand-brown/70 leading-relaxed font-light max-w-sm mx-auto">
            Gagal saat mendebit saldo virtual bank Anda. Transaksi ini dibatalkan secara otomatis dan kursi latihan Anda belum berkurang.
          </p>
        </div>

        <div className="p-4.5 bg-brand-cream/50 rounded-2xl border border-brand-beige text-left text-xs text-brand-brown/75 max-w-md mx-auto">
          <p className="font-bold text-center text-brand-brown">Kenapa pembayaran digagalkan?</p>
          <ul className="list-disc pl-5 mt-2 space-y-1 font-light leading-relaxed">
            <li>Kanal virtual account/kartu kredit bank mengalami timeout.</li>
            <li>Sisa saldo rekening tidak mencukupi untuk nominal total.</li>
            <li>Token transaksi kadaluarsa oleh pembatasan waktu simulasi.</li>
          </ul>
        </div>
      </motion.div>

      {/* Booking Details Card */}
      <div className="bg-white rounded-3xl border border-brand-beige p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-brand-brown border-b border-brand-beige/50 pb-3">Informasi Pemesanan Terkait</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5 text-sm">
          <div>
            <span className="text-[10px] uppercase font-bold text-brand-brown/50 tracking-wider">Nama Lengkap</span>
            <p className="font-bold text-brand-charcoal mt-0.5">{booking.customerName}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-brand-brown/50 tracking-wider">Kode Registrasi</span>
            <p className="font-mono font-bold text-red-700 tracking-wide mt-0.5">{booking.bookingCode}</p>
          </div>
          <div className="sm:col-span-2 border-t border-brand-beige/40 pt-4">
            <span className="text-[10px] uppercase font-bold text-brand-brown/50 tracking-wider">Sesi Kelas Yoga</span>
            <p className="font-semibold text-brand-brown leading-snug mt-0.5">{event.title}</p>
          </div>
          
          <div className="border-t border-brand-beige/40 pt-4 flex gap-3">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-brand-brown/50 tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-brand-sage" /> Tanggal Sesi
              </span>
              <p className="font-medium text-brand-charcoal">{formatDate(event.startDate)}</p>
            </div>
          </div>
          <div className="border-t border-brand-beige/40 pt-4">
            <span className="text-[10px] uppercase font-bold text-brand-brown/50 tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-brand-sage" /> Waktu Sesi
            </span>
            <p className="font-medium text-brand-charcoal mt-1">{event.startTime} - {event.endTime} WIB</p>
          </div>

          <div className="sm:col-span-2 border-t border-brand-beige/40 pt-4">
            <span className="text-[10px] uppercase font-bold text-brand-brown/50 tracking-wider flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-sage" /> Studio
            </span>
            <p className="font-semibold text-brand-charcoal mt-0.5">{event.locationName}</p>
            <p className="text-xs text-brand-brown/65 mt-0.5">{event.locationAddress}</p>
          </div>
          
          <div className="border-t border-brand-beige/40 pt-4">
            <span className="text-[10px] uppercase font-bold text-brand-brown/50 tracking-wider">Jumlah Tiket</span>
            <p className="font-bold text-brand-charcoal mt-0.5">{booking.ticketQuantity} Tiket</p>
          </div>
          <div className="border-t border-brand-beige/40 pt-4">
            <span className="text-[10px] uppercase font-bold text-brand-brown/50 tracking-wider">Total Nilai Tagihan</span>
            <p className="font-extrabold text-brand-brown mt-0.5">{formatPrice(booking.totalPrice)}</p>
          </div>
        </div>
      </div>

      {/* Button CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link href={`/checkout/${booking.bookingCode}`} className="w-full sm:flex-1 focus:outline-none">
          <Button variant="primary" className="w-full py-4 bg-brand-brown hover:bg-brand-charcoal text-white font-bold tracking-wider text-xs uppercase rounded-2xl flex items-center justify-center gap-2 shadow-sm">
            <RotateCcw className="w-4 h-4" />
            Coba Bayar Lagi
          </Button>
        </Link>
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="w-full sm:flex-1 focus:outline-none">
          <Button variant="outline" className="w-full py-4 text-brand-sage border-brand-sage/35 text-xs font-bold tracking-wide uppercase rounded-2xl flex items-center justify-center gap-2 bg-white">
            <MessageCircle className="w-4 border-none shrink-0" />
            Hubungi Bantuan WA
          </Button>
        </a>
      </div>

    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-cream text-brand-charcoal overflow-x-hidden">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 w-full">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Loader2 className="w-10 h-10 text-brand-sage animate-spin mb-4" />
            <p className="text-sm text-brand-brown/60 font-medium">Memuat halaman kegagalan transaksi...</p>
          </div>
        }>
          <FailedPageContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
