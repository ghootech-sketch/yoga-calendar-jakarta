'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Ticket, ShieldCheck, Mail, MessageCircle, ArrowLeft, Loader2, Info, Receipt, User, HelpCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';
import { BookingService } from '@/lib/bookings/booking-store';
import { Booking } from '@/lib/bookings/booking-types';
import { DUMMY_EVENTS, Event } from '@/lib/dummy-events';
import { formatPrice, formatDate } from '@/lib/utils';

export default function BookingStatusPage() {
  const { bookingCode } = useParams();
  const router = useRouter();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

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
        <div className="flex-1 flex flex-col items-center justify-center py-32 px-4 animate-pulse">
          <Loader2 className="w-8 h-8 text-brand-sage animate-spin mb-3" />
          <p className="text-sm font-medium text-brand-brown/60">Membaca file status booking...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Booking Not Found
  if (!booking || !event) {
    return (
      <div className="min-h-screen flex flex-col bg-brand-cream text-brand-charcoal">
        <Header />
        <main className="flex-1 max-w-lg mx-auto px-4 flex flex-col items-center justify-center text-center py-32 space-y-6">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 border border-red-100 shadow-sm">
            <HelpCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="font-sans font-bold text-2xl text-brand-brown tracking-tight">Booking Tidak Ditemukan</h1>
            <p className="text-sm text-brand-brown/70 leading-relaxed font-light">
              Maaf, kode koordinat/id tiket <strong>&ldquo;{bookingCode}&rdquo;</strong> tidak cocok dengan arsip data di peramban ini.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/events">
              <Button variant="primary">Eksplorasi Kelas Yoga</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getBadgeConfig = () => {
    switch (booking.status) {
      case 'paid':
        return {
          label: 'PAID - LUNAS',
          styles: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          desc: 'Tiket berhasil dibayar. Silakan tunjukkan lembar status ini pasca tiba di studio.'
        };
      case 'failed':
        return {
          label: 'FAILED - GAGAL',
          styles: 'bg-red-50 text-red-800 border-red-200',
          desc: 'Transaksi gagal diproses oleh virtual banking server.'
        };
      case 'cancelled':
        return {
          label: 'CANCELLED - DIBATALKAN',
          styles: 'bg-gray-50 text-gray-500 border-gray-200',
          desc: 'Pemesanan ini dibatalkan secara manual guna penulisan ulang jadwal baru.'
        };
      case 'expired':
        return {
          label: 'EXPIRED - KADALUARSA',
          styles: 'bg-yellow-50 text-yellow-800 border-yellow-200',
          desc: 'Waktu tunggu pembayaran 15 menit habis. Silakan bikin pemesanan ulang.'
        };
      default:
        return {
          label: 'TEMPORARY / PENDING PAYMENT',
          styles: 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse',
          desc: 'Tiket diamankan sementara. Silakan selesaikan pembayaran agar kursi latihan Anda tidak hangus.'
        };
    }
  };

  const badge = getBadgeConfig();
  const waText = `Halo Yoga Calendar Jakarta, saya ingin bertanya mengenai status booking dengan kode: ${booking.bookingCode}`;
  const waLink = `https://wa.me/6281342531331?text=${encodeURIComponent(waText)}`;

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream text-brand-charcoal overflow-x-hidden">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 w-full">
        {/* Header Breadcrumb navigation */}
        <div className="mb-8 flex justify-between items-center">
          <Link href="/events" className="inline-flex items-center gap-2 text-xs font-semibold text-brand-brown/70 hover:text-brand-sage transition-all focus:outline-none uppercase tracking-wider">
            <ArrowLeft className="w-3.5 h-3.5" /> Ke Daftar Jadwal
          </Link>
          
          <span className="text-[10px] font-mono text-brand-brown/50">
            Dibuat Pada: {new Date(booking.createdAt).toLocaleString('id-ID')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Main Card (8 columns) */}
          <div className="md:col-span-8 space-y-6">
            
            <div className="bg-white rounded-3xl border border-brand-beige p-6 sm:p-8 md:p-10 shadow-lg space-y-8">
              
              {/* STATUS HEADER BANNER */}
              <div className="border-b border-brand-beige pb-6 flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-brand-sage uppercase tracking-widest">Lembar Tiket Elektronik</span>
                  <p className="text-xs text-brand-brown/60 font-semibold font-mono uppercase">ID: {booking.bookingCode}</p>
                  <h1 className="font-sans font-bold text-2xl text-brand-brown mt-1">Status Kehadiran Kelas</h1>
                </div>
                
                <div className="text-left md:text-right shrink-0 space-y-1.5">
                  <span className={`inline-block px-3 py-1 border rounded-full text-xs font-bold uppercase tracking-wider ${badge.styles}`}>
                    {badge.label}
                  </span>
                  <p className="text-[10px] text-brand-brown/65 leading-tight max-w-[200px]">{badge.desc}</p>
                </div>
              </div>

              {/* EVENT CARD BLOCK */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-brand-brown uppercase tracking-wider flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-brand-sage" /> Sesi Kelas Terpilih
                </h3>
                
                <div className="p-4 sm:p-5 bg-brand-cream/30 rounded-2xl border border-brand-beige/50 flex gap-4 text-sm">
                  <div className="space-y-3 flex-1">
                    <span className="inline-block px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase text-brand-sage bg-brand-sage/10 rounded-full">
                      {event.category}
                    </span>
                    <h4 className="font-sans font-bold text-base text-brand-brown leading-snug">{event.title}</h4>
                    
                    <div className="space-y-2 text-xs text-brand-brown/85 font-light">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-brand-sage shrink-0" />
                        <span>Tanggal: {formatDate(event.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-brand-sage shrink-0" />
                        <span>Waktu: {event.startTime} - {event.endTime} WIB</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-brand-sage shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">{event.locationName}</p>
                          <p className="text-[10px] text-brand-brown/60 mt-0.5">{event.locationAddress}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ATTENDEE INFO GRID */}
              <div className="space-y-4 border-t border-brand-beige/50 pt-6">
                <h3 className="text-xs font-bold text-brand-brown uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-sage" /> Profil Peserta Terdaftar
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-brand-cream/10 rounded-2xl border border-brand-beige/40 p-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-brand-brown/50 tracking-wider">Nama Peserta</span>
                    <p className="font-semibold text-brand-charcoal mt-0.5">{booking.customerName}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-brand-brown/50 tracking-wider font-mono">Nomor WhatsApp</span>
                    <p className="font-semibold text-brand-charcoal mt-0.5">{booking.customerPhone}</p>
                  </div>
                  <div className="sm:col-span-2 border-t border-brand-beige/30 pt-3">
                    <span className="text-[10px] uppercase font-bold text-brand-brown/50 tracking-wider">Alamat Email</span>
                    <p className="font-semibold text-brand-charcoal mt-0.5">{booking.customerEmail}</p>
                  </div>
                  {booking.notes && (
                    <div className="sm:col-span-2 border-t border-brand-beige/30 pt-3">
                      <span className="text-[10px] uppercase font-bold text-brand-brown/50 tracking-wider">Catatan Cedera/Fisik</span>
                      <p className="text-xs text-brand-brown/85 font-light mt-1 bg-white p-3 rounded-xl border border-brand-beige/40 italic leading-relaxed">
                        &ldquo;{booking.notes}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* COST SUMMARY PANEL */}
              <div className="space-y-3.5 border-t border-brand-beige/50 pt-6">
                <h3 className="text-xs font-bold text-brand-brown uppercase tracking-wider">Kalkulasi Tagihan</h3>
                
                <div className="flex justify-between text-sm text-brand-brown/70 font-light">
                  <span>Sesi Biaya: {formatPrice(event.price)} x {booking.ticketQuantity} Tiket</span>
                  <span className="font-medium text-brand-charcoal">{formatPrice(booking.totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm text-brand-brown/70 font-light">
                  <span>Administrasi & Pajak Layanan</span>
                  <span className="font-semibold text-brand-sage">Rp 0 (LUNAS)</span>
                </div>
                <div className="pt-3 border-t border-brand-beige flex justify-between items-center text-brand-brown">
                  <span className="text-sm font-bold uppercase">Total Pembayaran</span>
                  <span className="text-lg sm:text-xl font-extrabold">{formatPrice(booking.totalPrice)}</span>
                </div>
              </div>

            </div>

          </div>

          {/* Action Sidebar Controls (4 columns) */}
          <div className="md:col-span-4 space-y-6">
            
            {/* Quick Action Buttons */}
            <div className="bg-white rounded-3xl border border-brand-beige p-6 space-y-4 shadow-sm">
              <h3 className="font-sans font-bold text-sm text-brand-brown mb-2 pl-0.5">Panduan Tindakan</h3>
              
              {booking.status === 'pending_payment' && (
                <Link href={`/checkout/${booking.bookingCode}`} className="block focus:outline-none w-full">
                  <Button variant="accent" className="w-full py-3.5 font-bold uppercase tracking-wider text-xs">
                    Lanjut Bayar Sekarang
                  </Button>
                </Link>
              )}

              <a href={waLink} target="_blank" rel="noopener noreferrer" className="block focus:outline-none w-full">
                <Button variant="outline" className="w-full py-3 gap-2 text-xs font-bold uppercase tracking-wide border-brand-sage/40 hover:bg-brand-sage/5 hover:text-brand-sage text-brand-sage bg-white">
                  <MessageCircle className="w-4 h-4 fill-current shrink-0" />
                  Hubungi Admin WA
                </Button>
              </a>

              <Link href="/events" className="block focus:outline-none w-full">
                <Button variant="secondary" className="w-full py-3 text-xs font-bold uppercase tracking-wider">
                  Cari Kelas Lainnya
                </Button>
              </Link>
            </div>

            {/* Information Warning Widget */}
            <div className="p-5.5 bg-brand-cream border border-brand-beige rounded-3xl space-y-3 shadow-sm select-none">
              <div className="flex items-center gap-1.5 text-xs font-bold text-brand-brown uppercase">
                <ShieldCheck className="w-4.5 h-4.5 text-brand-sage shrink-0" />
                VERIFIKASI MEJA REGISTRASI
              </div>
              <p className="text-xs text-brand-brown/75 leading-relaxed font-light">
                Sebagai bentuk verifikasi kedatangan di studio, silakan buka halaman link ini dari handphone Anda dan tunjukkan Kode Booking <strong>{booking.bookingCode}</strong> kepada resepsionis yang bertugas di lobi masuk.
              </p>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
