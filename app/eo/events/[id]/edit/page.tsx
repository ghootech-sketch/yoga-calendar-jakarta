'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import EventForm from '@/components/dashboard/EventForm';
import { EventService, ExtendedEvent } from '@/lib/events/event-service';
import { OrganizerService } from '@/lib/organizers/organizer-service';
import { MockAuthService } from '@/lib/auth/mock-auth';

export default function EOEventsEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [eventData, setEventData] = useState<ExtendedEvent | null>(null);
  const [organizer, setOrganizer] = useState<any>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
      const session = MockAuthService.getCurrentSession();
      if (!session) {
        router.replace('/login');
        return;
      }

      const org = OrganizerService.getOrganizerByEmail(session.email);
      if (!org) {
        router.replace('/unauthorized');
        return;
      }
      setOrganizer(org);

      if (id) {
        const found = EventService.getEventById(id);
        if (found) {
          // OWNERSHIP ENFORCEMENT SIMULATION:
          // Validate if this event's organizerId matches the logged-in studio's organizerId!
          if (found.organizerId !== org.id) {
            router.replace('/unauthorized');
            return;
          }
          setEventData(found);
        } else {
          setEventData(null);
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [router, id]);

  const handleSubmit = (data: any) => {
    if (!id || !organizer) return;
    try {
      // SECURITY ENFORCEMENT: Override and secure organizer details
      const securedUpdate = {
        ...data,
        organizerId: organizer.id,
        organizerName: organizer.organizerName
      };

      EventService.updateEvent(id, securedUpdate);
      router.push('/eo/events');
    } catch (e) {
      console.error(e);
      alert('Gagal merekam perubahan asana kelas. Cek isian formulir.');
    }
  };

  if (!isHydrated) {
    return (
      <DashboardLayout activeRole="EO">
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm font-semibold animate-pulse text-brand-brown">Menyelaraskan profil keamanan...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!eventData) {
    return (
      <DashboardLayout activeRole="EO">
        <div className="bg-white rounded-3xl border border-brand-beige/50 p-12 text-center max-w-xl mx-auto space-y-4">
          <h2 className="text-lg font-bold text-brand-brown">Sesi Yoga Tidak Ditemukan</h2>
          <p className="text-xs text-brand-brown/65 font-light">Maaf, kelas ini tidak tersedia atau Anda tidak memiliki akses kepemilikan.</p>
          <div className="pt-2">
            <button
              onClick={() => router.push('/eo/events')}
              className="px-5 py-2.5 bg-brand-sage text-white text-xs font-bold rounded-full"
            >
              Kembali ke Event Saya
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeRole="EO">
      <div className="space-y-6">
        <div>
          <h1 className="font-sans font-extrabold text-2xl text-brand-brown tracking-tight">
            Perbarui Materi Kelas Anda
          </h1>
          <p className="text-xs text-brand-brown/60 font-light">
            Edit target asana, rincian biaya investasi matras, atau deskripsi pendaftaran khusus kelas studio Anda.
          </p>
        </div>

        <EventForm
          initialData={eventData}
          onSubmit={handleSubmit}
          titleLabel={`${organizer.organizerName} - Ubah Sesi (#${eventData.id})`}
          onCancelHref="/eo/events"
        />
      </div>
    </DashboardLayout>
  );
}
