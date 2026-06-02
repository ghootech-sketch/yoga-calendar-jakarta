'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import EventForm from '@/components/dashboard/EventForm';
import { EventService, ExtendedEvent } from '@/lib/events/event-service';

export default function AdminEventsEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [eventData, setEventData] = useState<ExtendedEvent | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
      if (id) {
        const found = EventService.getEventById(id);
        setEventData(found);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [id]);

  const handleSubmit = (data: any) => {
    if (!id) return;
    try {
      EventService.updateEvent(id, data);
      router.push('/admin/events');
    } catch (e) {
      console.error(e);
      alert('Gagal memperbarui rincian event. Cek isian rincian formulir.');
    }
  };

  if (!isHydrated) {
    return (
      <DashboardLayout activeRole="ADMIN">
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm font-semibold animate-pulse text-brand-brown">Memroses pemuatan...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!eventData) {
    return (
      <DashboardLayout activeRole="ADMIN">
        <div className="bg-white rounded-3xl border border-brand-beige/50 p-12 text-center max-w-xl mx-auto space-y-4">
          <p className="text-sm text-brand-brown/50 font-medium font-mono">Sesi ID: {id}</p>
          <h2 className="text-lg font-bold text-brand-brown">Kelas Yoga Tidak Ditemukan</h2>
          <p className="text-xs text-brand-brown/65 font-light">Mungkin sesi ini telah dihapus oleh operator lain atau tautan URL yang diberikan salah.</p>
          <div className="pt-2">
            <button
              onClick={() => router.push('/admin/events')}
              className="px-5 py-2.5 bg-brand-sage text-white text-xs font-bold rounded-full"
            >
              Kembali ke Kelola Event
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeRole="ADMIN">
      <div className="space-y-6">
        <div>
          <h1 className="font-sans font-extrabold text-2xl text-brand-brown tracking-tight">
            Perbarui Rincian Kelas
          </h1>
          <p className="text-xs text-brand-brown/60 font-light">
            Ubah rincian, pergerakan kuota ketersediaan kursi, harga tiket masuk, maupun lokasi pelaksanaan kelas.
          </p>
        </div>

        <EventForm
          initialData={eventData}
          onSubmit={handleSubmit}
          titleLabel={`Edit Rincian Sesi (#${eventData.id})`}
          onCancelHref="/admin/events"
        />
      </div>
    </DashboardLayout>
  );
}
