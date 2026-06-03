'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { Calendar, Clock, MapPin, Users, Ticket, Check, ShieldAlert, ArrowLeft, MessageCircle, Info } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';
import { BookingForm } from '@/components/BookingForm';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { DUMMY_EVENTS } from '@/lib/dummy-events';
import { EventService } from '@/lib/events/event-service';
import { formatPrice, formatDate } from '@/lib/utils';
import { getEventAvailableSlots } from '@/lib/bookings/booking-store';
import Head from 'next/head';

export default function EventDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [event, setEvent] = useState<any>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [liveAvailableSlots, setLiveAvailableSlots] = useState<number>(0);

  useEffect(() => {
    if (!slug) return;
    const init = () => {
      const found = EventService.getEventBySlug(slug) || DUMMY_EVENTS.find(e => e.slug === slug);
      setEvent(found || null);
      if (found) {
        setLiveAvailableSlots(getEventAvailableSlots(found));
      }
      setIsHydrated(true);
    };
    const handle = setTimeout(init, 0);
    return () => clearTimeout(handle);
  }, [slug]);

  // Fallback to static dummy events for SSR/pre-hydrate
  const fallbackEvent = DUMMY_EVENTS.find(e => e.slug === slug);
  const currentEvent = event || fallbackEvent;

  if (!currentEvent) {
    if (isHydrated) {
      notFound();
    }
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <p className="text-brand-brown font-semibold animate-pulse">Loading...</p>
      </div>
    );
  }

  const actAvailable = isHydrated ? liveAvailableSlots : currentEvent.availableSlot;
  const isSoldOut = actAvailable === 0;
  const isFewSlotsLeft = actAvailable > 0 && actAvailable <= 5;

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream text-brand-charcoal overflow-x-hidden pb-16 md:pb-0">
      <Header />

      {/* Hero Breadcrumb Area */}
      <div className="pt-28 md:pt-36 bg-brand-beige/20 border-b border-brand-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-brown/70 hover:text-brand-sage transition-colors focus:outline-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Semua Kelas
          </Link>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT PANEL - Primary Content (8 Columns) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Event Title & Header */}
            <div className="space-y-4">
              <span className="inline-block px-3.5 py-1 text-xs font-semibold tracking-wider text-brand-sage bg-brand-sage/10 rounded-full">
                {currentEvent.category}
              </span>
              <h1 className="font-sans font-bold text-3xl sm:text-4xl md:text-5xl text-brand-brown tracking-tight leading-tight">
                {currentEvent.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-brand-brown/65">
                <span className="flex items-center gap-2">
                  <span className="font-bold text-brand-sage">Organizer:</span> {currentEvent.organizerName}
                </span>
                <span className="hidden sm:inline text-brand-beige">•</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-sage shrink-0" />
                  {currentEvent.city}
                </span>
                {isHydrated && event?.status && event.status !== 'published' && (
                  <>
                    <span className="hidden sm:inline text-brand-beige">•</span>
                    <span className="px-2 py-0.5 text-xs font-bold uppercase rounded-md bg-amber-100 text-amber-800">
                      {event.status}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Main Visual Frame */}
            <div className="relative aspect-[16/10] w-full bg-brand-beige rounded-3xl overflow-hidden shadow-md border border-brand-beige/40">
              <Image
                src={currentEvent.imageUrl}
                alt={currentEvent.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 70vw"
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Mobile-Only Key Info Strip (Collapses on desktop) */}
            <div className="lg:hidden bg-white rounded-3xl border border-brand-beige/50 p-5 space-y-4.5">
              <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-brand-brown border-b border-brand-beige pb-2">
                Informasi Singkat
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-brand-brown/50 tracking-wider flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-sage" /> Tanggal
                  </span>
                  <p className="text-xs font-semibold text-brand-brown/90">{formatDate(currentEvent.startDate)}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-brand-brown/50 tracking-wider flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-brand-sage" /> Waktu
                  </span>
                  <p className="text-xs font-semibold text-brand-brown/90">{currentEvent.startTime} - {currentEvent.endTime} WIB</p>
                </div>
                <div className="col-span-2 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-brand-brown/50 tracking-wider flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-sage" /> Tempat Latihan
                  </span>
                  <p className="text-xs text-brand-brown/90 font-semibold">{currentEvent.locationName}</p>
                  <p className="text-[10px] text-brand-brown/60">{currentEvent.locationAddress}</p>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-4 pt-4 border-t border-brand-beige/40">
              <h2 className="font-sans font-bold text-xl sm:text-2xl text-brand-brown">
                Deskripsi Sesi Kelas
              </h2>
              <p className="text-sm sm:text-base text-brand-brown/80 leading-relaxed font-light whitespace-pre-line text-justify">
                {currentEvent.description}
              </p>
            </div>

            {/* Benefits & Amenities Section */}
            {currentEvent.benefits && currentEvent.benefits.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-brand-beige/40">
                <h2 className="font-sans font-bold text-xl sm:text-2xl text-brand-brown">
                  Fasilitas & Keuntungan Peserta
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentEvent.benefits.map((benefit: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 bg-brand-cream p-3 rounded-2xl border border-brand-beige/40">
                      <div className="p-1 rounded-full bg-brand-sage/10 text-brand-sage shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm text-brand-brown/80 leading-relaxed">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements & Safety Warnings */}
            {currentEvent.requirements && currentEvent.requirements.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-brand-beige/40">
                <h2 className="font-sans font-bold text-xl sm:text-2xl text-brand-brown">
                  Syarat & Persiapan Mengikuti Kelas
                </h2>
                <div className="bg-amber-50/50 rounded-2xl border border-amber-100 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wide">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-amber-700" />
                    PENTING UNTUK DIKETAHUI
                  </div>
                  <ul className="space-y-2.5 text-sm">
                    {currentEvent.requirements.map((req: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5 text-brand-brown/80">
                        <span className="text-brand-sage font-bold shrink-0 mt-0.5">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Organizer Profile */}
            <div className="pt-8 border-t border-brand-beige/40">
              <div className="p-6 bg-white rounded-3xl border border-brand-beige/50 flex flex-col sm:flex-row items-center gap-5">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-brand-beige shrink-0 border border-brand-beige">
                  <Image
                    src="https://picsum.photos/seed/organizer-1/120/120"
                    alt={currentEvent.organizerName}
                    fill
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <p className="text-[10px] font-bold text-brand-sage uppercase tracking-widest">Kreator & Pengajar</p>
                  <h4 className="font-sans font-bold text-base text-brand-brown">{currentEvent.organizerName}</h4>
                  <p className="text-xs text-brand-brown/70 font-light leading-relaxed">
                    Sertifikasi internasional terakreditasi oleh Yoga Alliance USA. Berfokus menyalurkan asana restoratif batin yang ramah bagi tubuh perkotaan.
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Form Section */}
            <div className="pt-8 border-t border-brand-beige/40">
              <BookingForm event={currentEvent} />
            </div>

          </div>

          {/* RIGHT PANEL - Sticky Reservation Card (4 Columns) */}
          <div className="lg:col-span-4 lg:relative">
            <div className="lg:sticky lg:top-28 space-y-6">
              
              {/* Main Ticket Box */}
              <div className="bg-white rounded-3xl border border-brand-beige p-6 sm:p-8 shadow-md space-y-6">
                
                {/* Price Display */}
                <div>
                  <span className="text-[10px] font-bold text-brand-brown/50 uppercase tracking-widest">Biaya Investasi</span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-brand-brown mt-1">
                    {formatPrice(currentEvent.price)}
                  </div>
                </div>

                {/* Grid Info Details */}
                <div className="space-y-4 py-4 border-t border-b border-brand-beige/50">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-brand-sage shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] font-bold text-brand-brown/50 uppercase tracking-wider">Tanggal Latihan</div>
                      <div className="text-sm font-semibold text-brand-brown/90">{formatDate(currentEvent.startDate)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-brand-sage shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] font-bold text-brand-brown/50 uppercase tracking-wider">Jam Mulai - Selesai</div>
                      <div className="text-sm font-semibold text-brand-brown/90">{currentEvent.startTime} - {currentEvent.endTime} WIB</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-brand-sage shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] font-bold text-brand-brown/50 uppercase tracking-wider">Alamat Lengkap</div>
                      <div className="text-sm font-semibold text-brand-brown/90 leading-tight">{currentEvent.locationName}</div>
                      <p className="text-xs text-brand-brown/60 font-light mt-0.5">{currentEvent.locationAddress}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-brand-sage shrink-0 mt-0.5" />
                    <div className="w-full">
                      <div className="flex justify-between items-center text-[10px] font-bold text-brand-brown/50 uppercase tracking-wider">
                        <span>Ketersediaan Slot</span>
                        <span>{actAvailable} / {currentEvent.quota} Kursi</span>
                      </div>
                      
                      {/* Visual progress bar */}
                      <div className="w-full h-1.5 bg-brand-cream border border-brand-beige/60 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${isFewSlotsLeft ? 'bg-amber-500' : 'bg-brand-sage'}`}
                          style={{ width: `${(actAvailable / currentEvent.quota) * 100}%` }}
                        ></div>
                      </div>
                      
                      {isSoldOut ? (
                        <p className="text-[10px] font-bold text-red-600 mt-1 uppercase tracking-wide">Maaf, Kuota Sesi Ini Telah Terisi Penuh</p>
                      ) : isFewSlotsLeft ? (
                        <p className="text-[10px] font-bold text-amber-600 mt-1 animate-pulse uppercase tracking-wide">Sisa {actAvailable} Slot Saja! Amankan Segera</p>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="space-y-3.5">
                  {/* Primary booking simulator button */}
                  {isSoldOut ? (
                    <button
                      disabled
                      className="w-full py-4 bg-gray-200 text-gray-500 font-bold text-sm tracking-wide rounded-full text-center cursor-not-allowed"
                    >
                      Tiket Habis
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <Link href="#booking-form" className="block focus:outline-none w-full">
                        <Button variant="accent" className="w-full py-4 shadow-sm">
                          Booking Tiket Sekarang
                        </Button>
                      </Link>
                    </div>
                  )}

                  {/* Secondary WhatsApp question button */}
                  <a
                    href={`https://wa.me/6281342531331?text=${encodeURIComponent(`Halo Yoga Calendar Jakarta, saya ingin bertanya mengenai sesi: ${currentEvent.title}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block focus:outline-none w-full"
                  >
                    <Button variant="outline" className="w-full py-3 gap-2 border-brand-sage/40">
                      <MessageCircle className="w-4 h-4 fill-current text-brand-sage" />
                      Tanya Admin via WA
                    </Button>
                  </a>
                </div>

              </div>

              {/* Booking system unavailable Phase 1 Box alert */}
              <div
                id="sticky-booking-note"
                className="p-5 bg-brand-cream rounded-3xl border border-brand-beige flex gap-3.5 text-xs text-brand-brown/70 leading-relaxed shadow-sm scroll-mt-24"
              >
                <div className="p-2 rounded-full bg-brand-brown/10 text-brand-brown shrink-0 self-start">
                  <Info className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-brand-brown">Sistem Reservasi Otomatis</p>
                  <p>
                    Gunakan formulir pemesanan di bagian bawah halaman ini untuk melakukan simulasi checkout instan dan pembayaran tiruan. 
                    <br />
                    Untuk pertanyaan mengenai asana khusus, silakan tekan tombol <strong>&ldquo;Tanya Admin via WA&rdquo;</strong> di atas.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* MOBILE STICKY CTA BAR (Only visible under lg breakpoint at screen bottom) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-brand-beige px-4 py-3.5 flex items-center justify-between gap-4.5 shadow-lg">
        <div>
          <span className="text-[9px] uppercase font-bold text-brand-brown/50 tracking-wider">Investasi</span>
          <div className="text-sm font-extrabold text-brand-brown leading-tight">
            {formatPrice(currentEvent.price)}
          </div>
          <span className="text-[9px] text-brand-sage/90 block mt-0.5">{actAvailable} slot tersedia</span>
        </div>
        
        {isSoldOut ? (
          <button
            disabled
            className="px-6 py-3 bg-gray-200 text-gray-500 font-bold text-xs rounded-full cursor-not-allowed"
          >
            Habis
          </button>
        ) : (
          <div className="flex gap-2">
            <a
              href={`https://wa.me/6281342531331?text=${encodeURIComponent(`Halo Yoga Calendar Jakarta, saya ingin bertanya mengenai sesi: ${currentEvent.title}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 bg-brand-cream hover:bg-brand-beige text-brand-brown rounded-full border border-brand-beige transition-colors flex items-center justify-center shrink-0"
              aria-label="Tanya WA"
            >
              <MessageCircle className="w-4 h-4 text-brand-sage fill-current" />
            </a>
            <a
              href="#booking-form"
              className="px-6 py-3 bg-brand-sage hover:bg-brand-sagedark text-white font-bold text-xs tracking-wider uppercase rounded-full transition-colors flex items-center justify-center"
            >
              Booking Tiket
            </a>
          </div>
        )}
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
