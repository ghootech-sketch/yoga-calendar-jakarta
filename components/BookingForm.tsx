'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Ticket, User, Mail, MessageCircle, FileText, Loader2, Info, AlertCircle, Check } from 'lucide-react';
import { Event } from '@/lib/dummy-events';
import { BookingService, getEventAvailableSlots } from '@/lib/bookings/booking-store';
import { formatPrice } from '@/lib/utils';
import { Button } from './Button';

interface BookingFormProps {
  event: Event;
}

export const BookingForm: React.FC<BookingFormProps> = ({ event }) => {
  const router = useRouter();

  // Handle client-side hydrated variables to prevent SSR mismatch
  const [availableSlots, setAvailableSlots] = useState<number>(event.availableSlot);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const init = () => {
      // Correctly load current client-side state of slot ketersediaan including successful payments
      setAvailableSlots(getEventAvailableSlots(event));
      setIsHydrated(true);
    };

    const handle = setTimeout(init, 0);
    return () => clearTimeout(handle);
  }, [event]);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    ticketQuantity: 1,
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Quick inputs validator
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name Validation
    if (!formData.name.trim()) {
      newErrors.name = 'Nama lengkap wajib diisi';
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Alamat email wajib diisi';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Format email tidak valid (contoh: budi@gmail.com)';
    }

    // WhatsApp Phone Validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor WhatsApp wajib diisi';
    } else {
      const genericClean = formData.phone.replace(/[^0-9]/g, '');
      if (genericClean.length < 8) {
        newErrors.phone = 'Nomor WhatsApp minimal 8 digit angka';
      }
    }

    // Ticket Quantity Validation
    if (formData.ticketQuantity < 1) {
      newErrors.ticketQuantity = 'Jumlah tiket minimal 1 lembar';
    } else if (formData.ticketQuantity > availableSlots) {
      newErrors.ticketQuantity = `Jumlah tiket tidak boleh melebihi slot tersedia (${availableSlots} slot)`;
    }

    // Event Availability & Expired Checks
    const eventTime = new Date(`${event.startDate}T${event.startTime}`);
    const now = new Date();
    if (eventTime < now) {
      newErrors.global = 'Maaf, pendaftaran kelas ini sudah ditutup (event telah lewat).';
    }

    if (availableSlots <= 0) {
      newErrors.global = 'Maaf, semua kursi latihan untuk sesi kelas ini telah terisi penuh.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Remove individual error as user types
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleQtyChange = (delta: number) => {
    const newQty = Math.max(1, Math.min(availableSlots, formData.ticketQuantity + delta));
    setFormData((prev) => ({
      ...prev,
      ticketQuantity: newQty,
    }));
    if (errors.ticketQuantity) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.ticketQuantity;
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to error if any
      const errorEl = document.getElementById('booking-form-errors');
      if (errorEl) {
        errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API submit delay
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const totalPrice = event.price * formData.ticketQuantity;

      // Call Service to persist local booking
      const newBooking = BookingService.createBooking({
        eventId: event.id,
        eventSlug: event.slug,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        ticketQuantity: formData.ticketQuantity,
        totalPrice: totalPrice,
        notes: formData.notes,
      });

      setIsSuccess(true);
      
      // Redirect to Checkout page with generated Booking Code
      router.push(`/checkout/${newBooking.bookingCode}`);
    } catch (err) {
      console.error('Booking submission failed', err);
      setErrors({ global: 'Ada kendala teknis saat memproses reservasi Anda. Coba lagi dalam beberapa saat.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSoldOut = availableSlots <= 0;
  const totalPrice = event.price * formData.ticketQuantity;

  return (
    <div
      id="booking-form"
      className="bg-white rounded-3xl border border-brand-beige p-6 sm:p-8 md:p-10 shadow-lg scroll-mt-28"
    >
      <div className="border-b border-brand-beige/50 pb-5 mb-6">
        <h2 className="font-sans font-bold text-2xl text-brand-brown tracking-tight">
          Formulir Buku Kursi Latihan
        </h2>
        <p className="text-xs sm:text-sm text-brand-brown/75 mt-1 font-light">
          Silakan isi kelengkapan data diri peserta di bawah secara akurat untuk mempermudah penerbitan e-ticket resmi.
        </p>
      </div>

      {errors.global && (
        <div id="booking-form-errors" className="mb-6 p-4.5 bg-red-50 border border-red-100 rounded-2xl flex gap-3 text-sm text-red-800">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600 self-start" />
          <div className="font-medium">{errors.global}</div>
        </div>
      )}

      {isSoldOut && isHydrated ? (
        <div className="p-8 bg-red-50/40 border border-red-100 rounded-3xl text-center space-y-4">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <Ticket className="w-6 h-6" />
          </div>
          <h3 className="font-sans font-bold text-lg text-brand-brown">Mohon Maaf, Kuota Habis</h3>
          <p className="text-sm text-brand-brown/70 max-w-md mx-auto leading-relaxed">
            Seluruh slot latihan untuk kelas <strong>{event.title}</strong> telah dipesan oleh Yogi lainnya. Cari kelas sejenis yang masih memiliki sisa ketersediaan kursi di halaman daftar jadwal.
          </p>
          <div className="pt-2">
            <Button variant="outline" size="sm" onClick={() => router.push('/events')}>
              Cari Kelas Lainnya
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Input Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-xs font-bold text-brand-brown uppercase tracking-wider">
                Nama Lengkap Peserta <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-2xl shadow-sm">
                <span className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-brand-brown/40">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  placeholder="Contoh: Budi Susanto"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full text-sm pl-11 pr-4.5 py-3.5 bg-brand-cream/35 border ${
                    errors.name ? 'border-red-400 focus:ring-red-200' : 'border-brand-beige/80 focus:ring-brand-sage/20'
                  } rounded-2xl focus:outline-none focus:ring-2 transition-all placeholder:text-brand-brown/30 text-brand-brown`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-600 font-semibold">{errors.name}</p>
              )}
            </div>

            {/* Input Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-bold text-brand-brown uppercase tracking-wider">
                Alamat Email Aktif <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-2xl shadow-sm">
                <span className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-brand-brown/40">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  placeholder="Contoh: budi@gmail.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full text-sm pl-11 pr-4.5 py-3.5 bg-brand-cream/35 border ${
                    errors.email ? 'border-red-400 focus:ring-red-200' : 'border-brand-beige/80 focus:ring-brand-sage/20'
                  } rounded-2xl focus:outline-none focus:ring-2 transition-all placeholder:text-brand-brown/30 text-brand-brown`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 font-semibold">{errors.email}</p>
              )}
            </div>

            {/* Input WhatsApp Link */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-xs font-bold text-brand-brown uppercase tracking-wider">
                Nomor WhatsApp <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-2xl shadow-sm">
                <span className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-brand-brown/40">
                  <MessageCircle className="w-4 h-4" />
                </span>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  placeholder="Contoh: 081234567890"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full text-sm pl-11 pr-4.5 py-3.5 bg-brand-cream/35 border ${
                    errors.phone ? 'border-red-400 focus:ring-red-200' : 'border-brand-beige/80 focus:ring-brand-sage/20'
                  } rounded-2xl focus:outline-none focus:ring-2 transition-all placeholder:text-brand-brown/30 text-brand-brown`}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-600 font-semibold">{errors.phone}</p>
              )}
            </div>

            {/* Ticket Selector Quantity COUNTER */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-brand-brown uppercase tracking-wider">
                Jumlah Tiket Peserta <span className="text-red-500">*</span>
              </label>
              
              <div className="flex items-center gap-4 py-1.5 px-2.5 bg-brand-cream/45 border border-brand-beige rounded-2xl w-full sm:w-56">
                <button
                  type="button"
                  disabled={formData.ticketQuantity <= 1}
                  onClick={() => handleQtyChange(-1)}
                  className="w-10 h-10 bg-white border border-brand-beige hover:bg-brand-cream text-brand-brown font-bold rounded-xl transition-all duration-200 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                  aria-label="Kurangkan tiket"
                >
                  -
                </button>
                <div className="flex-1 text-center font-sans font-bold text-brand-charcoal">
                  {formData.ticketQuantity} <span className="text-[10px] text-brand-brown/55 font-normal">Pack</span>
                </div>
                <button
                  type="button"
                  disabled={formData.ticketQuantity >= availableSlots}
                  onClick={() => handleQtyChange(1)}
                  className="w-10 h-10 bg-white border border-brand-beige hover:bg-brand-cream text-brand-brown font-bold rounded-xl transition-all duration-200 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                  aria-label="Tambahkan tiket"
                >
                  +
                </button>
              </div>
              <p className="text-[10px] text-brand-sage font-medium block">
                Maksimal pembelian untuk sesi saat ini adalah {availableSlots} tiket.
              </p>
              {errors.ticketQuantity && (
                <p className="text-xs text-red-600 font-semibold">{errors.ticketQuantity}</p>
              )}
            </div>

            {/* Optional Additional Notes Textbox */}
            <div className="col-span-1 md:col-span-2 space-y-2">
              <label htmlFor="notes" className="block text-xs font-bold text-brand-brown uppercase tracking-wider">
                Catatan Khusus Keadaan Fisik (Optional)
              </label>
              <div className="relative rounded-2xl shadow-sm">
                <span className="absolute top-3.5 left-4.5 pointer-events-none text-brand-brown/40">
                  <FileText className="w-4 h-4" />
                </span>
                <textarea
                  name="notes"
                  id="notes"
                  rows={3}
                  placeholder="Contoh: Memiliki riwayat cedera sendi lutut, asma ringan, atau sedang hamil 4 bulan..."
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full text-sm pl-11 pr-4.5 py-3.5 bg-brand-cream/35 border border-brand-beige/80 rounded-2xl focus:ring-2 focus:ring-brand-sage/20 focus:border-brand-sage focus:outline-none transition-all placeholder:text-brand-brown/30 text-brand-brown"
                />
              </div>
            </div>

          </div>

          {/* Pricing Summary Widget */}
          <div className="p-5 bg-brand-cream/30 border border-brand-beige border-dashed rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4.5">
            <div>
              <span className="text-[10px] font-bold text-brand-brown/55 uppercase tracking-wide">Rincian Estimasi Biaya</span>
              <p className="text-xs text-brand-brown/70 font-light mt-0.5">
                {formatPrice(event.price)} x {formData.ticketQuantity} Tiket
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-brand-sage/85 uppercase tracking-wide">Total Pembayaran</span>
              <p className="text-xl sm:text-2xl font-extrabold text-brand-brown">
                {formatPrice(totalPrice)}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || isSuccess}
              className="w-full py-4 bg-brand-sage hover:bg-brand-sagedark text-white font-bold tracking-brand tracking-widest text-sm uppercase rounded-2xl transition-colors flex items-center justify-center gap-3 shadow-md"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  Mengamankan Tiket Anda...
                </>
              ) : isSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  Pemesanan Tersimpan! Mengarahkan...
                </>
              ) : (
                'Proses Lanjut ke Checkout'
              )}
            </Button>
          </div>

          <div className="flex gap-2 text-[10px] text-brand-brown/60 leading-relaxed justify-center max-w-md mx-auto text-center mt-3">
            <Info className="w-3.5 h-3.5 shrink-0 text-brand-sage mt-0.5" />
            <p>
              Dengan memproses formulir ini, Anda mengamankan kuota reservasi sementara selama 15 menit agar tidak diambil pendaftar lainnya.
            </p>
          </div>
        </form>
      )}
    </div>
  );
};
