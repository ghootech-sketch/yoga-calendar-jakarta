'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import EventForm from '@/components/dashboard/EventForm';
import { EventService } from '@/lib/events/event-service';

export default function AdminEventsCreatePage() {
  const router = useRouter();

  const handleSubmit = (data: any) => {
    try {
      EventService.createEvent(data);
      router.push('/admin/events');
    } catch (e) {
      console.error(e);
      alert('Gagal membuat event baru. Silakan cek formulir.');
    }
  };

  return (
    <DashboardLayout activeRole="ADMIN">
      <div className="space-y-6">
        <div>
          <h1 className="font-sans font-extrabold text-2xl text-brand-brown tracking-tight">
            Daftarkan Sesi Baru
          </h1>
          <p className="text-xs text-brand-brown/60 font-light">
            Publikasikan atau simpan rancangan kelas yoga baru ke dalam database platform.
          </p>
        </div>

        <EventForm
          onSubmit={handleSubmit}
          titleLabel="Formulir Kelas Baru (Admin)"
          onCancelHref="/admin/events"
        />
      </div>
    </DashboardLayout>
  );
}
