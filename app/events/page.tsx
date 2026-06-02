import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { Loader2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import EventsListingContent from './events-content';

export const metadata: Metadata = {
  title: 'Jadwal Kelas Yoga & Meditasi Jakarta | Yoga Calendar Jakarta',
  description: 'Jelajahi jadwal lengkap kelas spiritual, yoga dinamis, pranayama/pernapasan, sound healing singing bowl, dan meditasi terkurasi di penjuru wilayah Jakarta.',
  openGraph: {
    title: 'Jadwal Kelas Yoga & Meditasi Jakarta - Yoga Calendar Jakarta',
    description: 'Pilih jadwal kelas yoga terbaik di Jakarta Pusat, Selatan, Barat, dan Utara. Filter berdasarkan lokasi, tanggal, kategori, dan harga.',
  },
};

// Suspense fallback for Loading states
function EventsListingFallback() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Loader2 className="w-10 h-10 text-brand-sage animate-spin mb-4" />
      <p className="text-sm text-brand-brown/60 font-medium">Memuat jadwal kalender kelas...</p>
    </div>
  );
}

export default function EventsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-cream text-brand-charcoal overflow-x-hidden">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 w-full">
        <Suspense fallback={<EventsListingFallback />}>
          <EventsListingContent />
        </Suspense>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
