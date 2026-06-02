'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import EventForm from '@/components/dashboard/EventForm';
import { EventService } from '@/lib/events/event-service';
import { OrganizerService } from '@/lib/organizers/organizer-service';
import { MockAuthService } from '@/lib/auth/mock-auth';

export default function EOEventsCreatePage() {
  const router = useRouter();
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
      if (org) {
        setOrganizer(org);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [router]);

  const handleSubmit = (data: any) => {
    if (!organizer) return;
    try {
      // OVERRIDE & LOCK: Force the organizer ID and name to be the active logged-in partner's ID/Name!
      const securedData = {
        ...data,
        organizerId: organizer.id,
        organizerName: organizer.organizerName
      };

      EventService.createEvent(securedData);
      router.push('/eo/events');
    } catch (e) {
      console.error(e);
      alert('Gagal meregistrasikan sesi latihan baru. Cek isian formulir.');
    }
  };

  if (!isHydrated || !organizer) {
    return (
      <DashboardLayout activeRole="EO">
        <div className="flex h-64 items-center justify-center">
          <p className="text-brand-brown animate-pulse font-semibold font-mono">Memvalidasi sertifikat partner studio...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeRole="EO">
      <div className="space-y-6">
        <div>
          <h1 className="font-sans font-extrabold text-2xl text-brand-brown tracking-tight">
            Publikasikan Kelas Studio Baru
          </h1>
          <p className="text-xs text-brand-brown/60 font-light">
            Daftarkan asana restoratif batin baru untuk didistribusikan kepada masyarakat Jakarta. Kelas baru akan terpasang di bawah profil <strong>{organizer.organizerName}</strong> secara otomatis.
          </p>
        </div>

        <EventForm
          onSubmit={handleSubmit}
          titleLabel={`${organizer.organizerName} - Formulir Sesi Baru`}
          onCancelHref="/eo/events"
          // We can prefill organizerId in the form to render correctly, but our handleSubmit secures the lock
          initialData={{
            organizerId: organizer.id,
            organizerName: organizer.organizerName
          } as any}
        />
      </div>
    </DashboardLayout>
  );
}
