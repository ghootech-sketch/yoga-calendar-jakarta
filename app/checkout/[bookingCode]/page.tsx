'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Ticket, Calendar, Clock, MapPin, CreditCard, ChevronRight, CheckCircle2, XCircle, ShieldAlert, ArrowLeft, Loader2, Info } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';
import { BookingService } from '@/lib/bookings/booking-store';
import { Booking } from '@/lib/bookings/booking-types';
import { DUMMY_EVENTS, Event } from '@/lib/dummy-events';
import { PaymentService } from '@/lib/payment/payment-service';
import { formatPrice, formatDate } from '@/lib/utils';

export default function CheckoutPage() {
  const { bookingCode } = useParams();
  const router = useRouter();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulationChoice, setSimulationChoice] = useState<'success' | 'failed' | null>(null);

  useEffect(() => {
    const init = () => {
      setIsHydrated(true);
      if (!bookingCode) return;

      const codeStr = Array.isArray(bookingCode) ? bookingCode[0] : bookingCode;
      const foundBooking = BookingService.getBookingByCode(codeStr);
      
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
      <div className="min-h-screen flex flex-col bg-brand-cream text-brand-charcoal">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center py-32 px-4">
          <Loader2 className="w-8 h-8 text-brand-sage animate-spin mb-3" />
          <p className="text-sm font-medium text-brand-brown/60">Menyiapkan detail pesanan...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Not found state
  if (!booking || !event) {
    return (
      <div className="min-h-screen flex flex-col bg-brand-cream text-brand-charcoal">
        <Header />
        <main className="flex-1 max-w-lg mx-auto px-4 flex flex-col items-center justify-center text-center py-32 space-y-6">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 border border-amber-100 shadow-sm">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="font-sans font-bold text-2xl text-brand-brown tracking-tight">Pesanan Tidak Ditemukan</h1>
            <p className="text-sm text-brand-brown/70 leading-relaxed font-light">
              Maaf, kode transaksi <strong>&ldquo;{bookingCode}&rdquo;</strong> tidak terdaftar dalam sistem lokal kami atau sesi booking Anda telah usai.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/events">
              <Button variant="primary">Lihat Daftar Kelas</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSimulatePayment = async (status: 'success' | 'failed') => {
    setIsProcessing(true);
    setSimulationChoice(status);

    try {
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (status === 'success') {
        // Orchestrate payment success operations
        await PaymentService.confirmPaymentSuccess(booking.bookingCode);
        router.push(`/payment/success?bookingCode=${booking.bookingCode}`);
      } else {
        // Orchestrate payment failure operations
        await PaymentService.confirmPaymentFailure(booking.bookingCode);
        router.push(`/payment/failed?bookingCode=${booking.bookingCode}`);
      }
    } catch (err) {
      console.error('Simulation payment error', err);
      setIsProcessing(false);
    }
  };

  const getStatusBadge = () => {
    switch (booking.status) {
      case 'paid':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-100">Lunas</span>;
      case 'failed':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-50 text-red-800 border border-red-100">Gagal</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-50 text-gray-500 border border-gray-200">Batal</span>;
      case 'expired':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-yellow-50 text-yellow-800 border border-yellow-100">Kadaluarsa</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-100 animate-pulse">Menunggu Pembayaran</span>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream text-brand-charcoal overflow-x-hidden">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 w-full">
        {/* Breadcrumb path navigation */}
        <div className="mb-8">
          <Link href={`/events/${event.slug}`} className="inline-flex items-center gap-2 text-xs font-semibold text-brand-brown/70 hover:text-brand-sage transition-all focus:outline-none uppercase tracking-wider">
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali Ke Sesi Kelas
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Checkout Summary (8 columns) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-white rounded-3xl border border-brand-beige p-6 sm:p-8 shadow-sm space-y-6">
              
              {/* Header Box */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-5 border-b border-brand-beige/50">
                <div>
                  <span className="text-[10px] font-bold text-brand-sage uppercase tracking-widest block">Transaksi Pembayaran</span>
                  <h1 className="font-sans font-bold text-xl sm:text-2xl text-brand-brown mt-1">Selesaikan Sesi Registrasi Anda</h1>
                </div>
                <div>{getStatusBadge()}</div>
              </div>

              {/* Booking Metadata Field */}
              <div className="grid grid-cols-2 gap-4 pb-1 pl-1">
                <div>
                  <span className="text-[10px] font-bold text-brand-brown/55 uppercase tracking-wide">Nomor Registrasi</span>
                  <p className="text-sm font-bold text-brand-charcoal mt-0.5">{booking.bookingCode}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-brand-brown/55 uppercase tracking-wide">Nama Peserta Utama</span>
                  <p className="text-sm font-semibold text-brand-charcoal mt-0.5">{booking.customerName}</p>
                </div>
              </div>

              {/* Selected Event details card */}
              <div className="p-4 bg-brand-cream/40 rounded-2xl border border-brand-beige/50 flex gap-4">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 hidden sm:block border border-brand-beige/40">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    sizes="100px"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-1.5 flex-1">
                  <span className="inline-block px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase text-brand-sage bg-brand-sage/10 rounded-full">
                    {event.category}
                  </span>
                  <h3 className="font-sans font-bold text-base text-brand-brown leading-snug">{event.title}</h3>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-brand-brown/70 font-light">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-brand-sage shrink-0" />
                      {formatDate(event.startDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-sage shrink-0" />
                      {event.startTime} WIB
                    </span>
                    <span className="flex items-center gap-1 max-w-[200px] truncate">
                      <MapPin className="w-3.5 h-3.5 text-brand-sage shrink-0" />
                      {event.locationName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order pricing breakdown calculation table */}
              <div className="space-y-3.5 pt-2">
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-brand-brown border-b border-brand-beige/40 pb-2">Rincian Perhitungan Biaya</h4>
                
                <div className="flex justify-between text-sm text-brand-brown/75">
                  <span>Harga Investasi Satuan</span>
                  <span className="font-medium text-brand-charcoal">{formatPrice(event.price)}</span>
                </div>
                
                <div className="flex justify-between text-sm text-brand-brown/75">
                  <span>Jumlah Tiket Yang Dipesan</span>
                  <span className="font-bold text-brand-charcoal">{booking.ticketQuantity} Tiket</span>
                </div>
                
                <div className="flex justify-between text-sm text-brand-brown/75">
                  <span>Biaya Administrasi Transaksi</span>
                  <span className="font-medium text-brand-sage/90">Rp 0 (GRATIS)</span>
                </div>

                <div className="pt-3 border-t border-brand-beige flex justify-between items-center">
                  <span className="text-sm font-bold text-brand-brown uppercase">Total Pembayaran Akhir</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-brand-brown">{formatPrice(booking.totalPrice)}</span>
                </div>
              </div>

            </div>

            {/* Refund & Cancellation Disclaimers */}
            <div className="p-5 bg-brand-cream rounded-3xl border border-brand-beige flex gap-3 text-xs text-brand-brown/70 leading-relaxed shadow-sm">
              <Info className="w-4 h-4 shrink-0 text-brand-sage mt-0.5" />
              <div className="space-y-1 font-light">
                <p className="font-bold text-brand-brown">Kebijakan Sesi Latihan</p>
                <p>
                  Tiket yang telah dilunasi tidak dapat dilakukan refund (pengembalian uang tunai), tetapi slot kehadiran dapat didelegasikan ke orang lain dengan mengonfirmasi data peserta pengganti minimal 6 jam sebelum kelas dimulai kepada asisten Admin via WhatsApp.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Payments Simulation Block (5 columns) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            
            <div className="bg-white rounded-3xl border border-brand-beige p-6 sm:p-8 shadow-lg space-y-6">
              
              <div className="border-b border-brand-beige/50 pb-4">
                <div className="flex items-center gap-2.5 text-brand-sage font-bold text-xs uppercase tracking-wider">
                  <CreditCard className="w-4.5 h-4.5" />
                  MOCKUP TRANSAKSI VIRTUAL
                </div>
                <h3 className="font-sans font-bold text-lg text-brand-brown mt-1.5">Simulasi Gerbang Pembayaran</h3>
                <p className="text-xs text-brand-brown/70 leading-relaxed font-light mt-1">
                  Gerbang pembayaran ini bertindak sebagai simulator API Midtrans/Xendit untuk Phase 2. Silakan pilih hasil pengujian transaksi yang diinginkan di bawah.
                </p>
              </div>

              {isProcessing ? (
                <div className="py-10 text-center space-y-4">
                  <Loader2 className="w-10 h-10 text-brand-sage animate-spin mx-auto" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-brand-brown">Menghubungi Virtual Bank Server...</p>
                    <p className="text-xs text-brand-brown/55 font-light">
                      Mengecek kecukupan saldo dan memvalidasi token booking {booking.bookingCode}
                    </p>
                  </div>
                  {simulationChoice && (
                    <div className="inline-block px-3 py-1 bg-brand-cream border border-brand-beige rounded-full text-[10px] uppercase font-bold text-brand-brown/70">
                      Mencoba Skenario: {simulationChoice === 'success' ? 'LUNAS (SUCCESS)' : 'DITOLAK (FAILED)'}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4 pt-1">
                  
                  {booking.status !== 'pending_payment' ? (
                    <div className="p-5 bg-brand-cream/50 rounded-2xl border border-brand-beige text-center space-y-3.5">
                      <CheckCircle2 className="w-10 h-10 text-brand-sage mx-auto" />
                      <div className="space-y-1">
                        <h4 className="font-sans font-bold text-sm text-brand-brown">Reservasi Telah Diproses</h4>
                        <p className="text-xs text-brand-brown/70 leading-relaxed max-w-xs mx-auto">
                          Status reservasi ini sudah tidak lagi dalam status menggantung (pending). Silakan lihat update status Anda.
                        </p>
                      </div>
                      <Link href={`/booking/${booking.bookingCode}`} className="block focus:outline-none">
                        <Button variant="outline" size="sm" className="w-full">Lihat Lembar Status Booking</Button>
                      </Link>
                    </div>
                  ) : (
                    <>
                      {/* Skenario 1 - Berhasil */}
                      <button
                        type="button"
                        onClick={() => handleSimulatePayment('success')}
                        className="w-full p-4.5 bg-brand-cream/40 hover:bg-emerald-50 rounded-2xl border border-brand-beige/70 hover:border-emerald-300 text-left transition-all duration-200 cursor-pointer shadow-sm hover:shadow group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-sans font-bold text-sm text-brand-brown group-hover:text-emerald-900 transition-colors">Skenario: Lunas Berhasil</h4>
                              <p className="text-[10px] text-brand-brown/60 leading-relaxed mt-0.5">
                                Mengonfirmasi pembayaran, mengurangi kuota slot kelas, dan mengirim e-mail konfirmasi.
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-brand-brown/40 group-hover:translate-x-1 group-hover:text-emerald-700 transition-all" />
                        </div>
                      </button>

                      {/* Skenario 2 - Gagal */}
                      <button
                        type="button"
                        onClick={() => handleSimulatePayment('failed')}
                        className="w-full p-4.5 bg-brand-cream/40 hover:bg-red-50 rounded-2xl border border-brand-beige/70 hover:border-red-300 text-left transition-all duration-200 cursor-pointer shadow-sm hover:shadow group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                              <XCircle className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-sans font-bold text-sm text-brand-brown group-hover:text-red-900 transition-colors">Skenario: Pembayaran Gagal</h4>
                              <p className="text-[10px] text-brand-brown/60 leading-relaxed mt-0.5">
                                Gagal memverifikasi kartu kredit/saldo virtual account. Slot tetap utuh tidak didebit.
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-brand-brown/40 group-hover:translate-x-1 group-hover:text-red-700 transition-all" />
                        </div>
                      </button>

                      <div className="pt-2 text-[10px] font-semibold text-brand-sage tracking-widest text-center uppercase">
                        ♥ Tanpa Resiko Keamanan Kartu Kredit Real
                      </div>
                    </>
                  )}

                </div>
              )}

            </div>

            {/* Step Explanation for Prototype */}
            <div className="p-6 bg-brand-brown text-brand-cream rounded-3xl shadow-md border border-brand-brown/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-sage/10 rounded-full blur-xl pointer-events-none"></div>
              <h4 className="font-sans font-bold text-sm">Catatan Pengembang (Phase 2):</h4>
              <p className="text-xs text-brand-cream/80 leading-relaxed font-light mt-1.5 whitespace-pre-line">
                Provider ini hanya mock untuk prototype. Nanti pada Phase 3 dapat diganti ke integrator API gerbang pembayaran resmi seperti <strong>Midtrans atau Xendit</strong> tanpa melukai atau mengubah komponen visual UI checkout ini.
              </p>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
