'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Calendar, Layers, MapPin, Sparkles, Plus, Edit3, Trash2, 
  ExternalLink, Eye, EyeOff, AlertCircle
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DataTable from '@/components/dashboard/DataTable';
import { EventService, ExtendedEvent, EventStatus } from '@/lib/events/event-service';
import { OrganizerService } from '@/lib/organizers/organizer-service';
import { MockAuthService } from '@/lib/auth/mock-auth';
import { formatPrice, formatDate } from '@/lib/utils';
import { getEventAvailableSlots } from '@/lib/bookings/booking-store';

export default function EOEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<ExtendedEvent[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [organizerId, setOrganizerId] = useState<string>('');

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
        setOrganizerId(org.id);
        // Filter sessions belonging ONLY to this particular studio partner ID
        const filtered = EventService.getAllEvents().filter(e => e.organizerId === org.id);
        setEvents(filtered);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [router]);

  const handleStatusChange = (id: string, newStatus: EventStatus) => {
    EventService.updateEvent(id, { status: newStatus });
    // Refresh
    if (organizerId) {
      setEvents(EventService.getAllEvents().filter(e => e.organizerId === organizerId));
    }
  };

  const searchFilter = (item: ExtendedEvent, query: string): boolean => {
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.city.toLowerCase().includes(q)
    );
  };

  if (!isHydrated) {
    return (
      <DashboardLayout activeRole="EO">
        <div className="flex items-center justify-center h-64">
          <p className="text-brand-brown animate-pulse font-semibold">Memuat event studio...</p>
        </div>
      </DashboardLayout>
    );
  }

  const tableHeaders = ['Detail Kelas Yoga', 'Kategori', 'Kota / Lokasi', 'Biaya Tiket', 'Kapasitas Slot', 'Status Teroritis', 'Aksi'];

  return (
    <DashboardLayout activeRole="EO">
      <div className="space-y-6">
        
        {/* Header Title block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-sans font-extrabold text-2xl text-brand-brown tracking-tight">
              Koleksi Sesi Latihan Studio Anda
            </h1>
            <p className="text-xs text-brand-brown/60 font-light">
              Manajemen komprehensif atas rincian matras, ketersediaan slot kosong, status reservasi, dan pratinjau halaman kelas milik studio Anda.
            </p>
          </div>
          <Link href="/eo/events/create" className="shrink-0">
            <button className="px-5 py-3 bg-brand-sage hover:bg-brand-sagedark text-white text-xs font-bold rounded-2xl shadow-sm flex items-center gap-2 transition-all">
              <Plus className="w-4 h-4" /> Pasang Sesi Baru
            </button>
          </Link>
        </div>

        {/* Database grid listing */}
        <DataTable<ExtendedEvent>
          data={events}
          headers={tableHeaders}
          searchPlaceholder="Cari kelas Anda berdasarkan nama, kategori..."
          searchFilter={searchFilter}
          emptyMessage="Studio Anda belum mendaftarkan sesi latihan apa pun."
          renderDesktopRow={(evt, idx) => {
            const avail = getEventAvailableSlots(evt);
            const occupied = evt.quota - avail;
            return (
              <tr key={evt.id} className="hover:bg-brand-cream/10 transition-colors text-xs text-brand-brown">
                <td className="px-6 py-4 max-w-xs">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-10 rounded-lg overflow-hidden border border-brand-beige shrink-0">
                      <Image
                        src={evt.imageUrl}
                        alt="Event cover"
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-brand-brown truncate">{evt.title}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-brand-brown/50">
                        <span>{formatDate(evt.startDate)}</span>
                        <span>•</span>
                        <span className="truncate">{evt.locationName}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 text-[10px] font-semibold text-brand-sage bg-brand-sage/10 rounded-full">
                    {evt.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold">
                  {evt.city}
                </td>
                <td className="px-6 py-4 font-bold text-brand-brown">
                  {evt.price === 0 ? 'Gratis' : formatPrice(evt.price)}
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <p className="font-bold">{occupied} / {evt.quota} Slot Terisi</p>
                    <span className="text-[10px] text-brand-sage block leading-none">Sisa: {avail} matras</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select
                    className={`px-2 py-1 text-[10px] font-bold uppercase tracking-tight rounded-md border focus:outline-none transition-all ${
                      evt.status === 'published'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
                        : evt.status === 'draft'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-rose-50 text-rose-800 border-rose-100'
                    }`}
                    value={evt.status}
                    onChange={(e) => handleStatusChange(evt.id, e.target.value as EventStatus)}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <Link href={`/events/${evt.slug}`} target="_blank">
                      <button className="p-2 text-brand-brown/60 hover:text-brand-sage hover:bg-brand-cream/40 rounded-xl transition-all" title="Lihat Layar Publik">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </Link>
                    <Link href={`/eo/events/${evt.id}/edit`}>
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Edit Rincian Kelas">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </td>
              </tr>
            );
          }}
          renderMobileCard={(evt, idx) => {
            const avail = getEventAvailableSlots(evt);
            const occupied = evt.quota - avail;
            return (
              <div key={evt.id} className="bg-white border border-brand-beige/50 rounded-2xl p-4.5 space-y-4 shadow-sm text-xs text-brand-brown">
                <div className="flex items-start gap-3">
                  <div className="relative w-14 h-11 rounded-lg overflow-hidden border border-brand-beige shrink-0">
                    <Image
                      src={evt.imageUrl}
                      alt="Event cover"
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="inline-block px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-brand-sage bg-brand-sage/10 rounded">
                      {evt.category}
                    </span>
                    <h3 className="text-xs font-bold mt-1 truncate">{evt.title}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-brand-cream/40 p-2.5 rounded-xl border border-brand-beige/20 text-[11px] list-none">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-brand-brown/40 block">Tiket Investasi</span>
                    <p className="font-bold">{formatPrice(evt.price)}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-brand-brown/40 block">Total Quota</span>
                    <p className="font-bold">{evt.quota} matras <span className="text-[10px] font-normal text-brand-brown/50">({avail} sisa)</span></p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-brand-beige/15">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold text-brand-brown/40 uppercase">Status:</span>
                    <select
                      className="px-2 py-0.5 text-[10px] font-bold uppercase rounded border focus:outline-none"
                      value={evt.status}
                      onChange={(e) => handleStatusChange(evt.id, e.target.value as EventStatus)}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Link href={`/events/${evt.slug}`} target="_blank">
                      <button className="p-1 px-2 border border-brand-beige rounded-lg text-brand-brown/60 hover:text-brand-sage">
                        Pratinjau
                      </button>
                    </Link>
                    <Link href={`/eo/events/${evt.id}/edit`}>
                      <button className="p-1.5 border border-brand-beige rounded-lg text-blue-600 hover:bg-blue-50" title="Edit">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                  </div>
                </div>

              </div>
            );
          }}
        />

      </div>
    </DashboardLayout>
  );
}
