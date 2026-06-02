'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Calendar, Layers, MapPin, Sparkles, Plus, Edit3, Trash2, 
  ExternalLink, Eye, EyeOff, AlertCircle, RefreshCw
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DataTable from '@/components/dashboard/DataTable';
import { EventService, ExtendedEvent, EventStatus } from '@/lib/events/event-service';
import { formatPrice, formatDate } from '@/lib/utils';
import { getEventAvailableSlots } from '@/lib/bookings/booking-store';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<ExtendedEvent[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
      setEvents(EventService.getAllEvents());
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleStatusChange = (id: string, newStatus: EventStatus) => {
    EventService.updateEvent(id, { status: newStatus });
    setEvents(EventService.getAllEvents());
  };

  const handleToggleHighlight = (id: string) => {
    EventService.toggleHighlight(id);
    setEvents(EventService.getAllEvents());
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus kelas yoga ini secara permanen? Sesi yang terhapus tidak dapat dipulihkan.')) {
      EventService.deleteEvent(id);
      setEvents(EventService.getAllEvents());
    }
  };

  const searchFilter = (item: ExtendedEvent, query: string): boolean => {
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.organizerName.toLowerCase().includes(q) ||
      item.city.toLowerCase().includes(q)
    );
  };

  if (!isHydrated) {
    return (
      <DashboardLayout activeRole="ADMIN">
        <div className="flex items-center justify-center h-64">
          <p className="text-brand-brown animate-pulse font-semibold">Memuat database event...</p>
        </div>
      </DashboardLayout>
    );
  }

  const tableHeaders = ['Sesi / Detail', 'Kategori', 'Penyelenggara (EO)', 'Biaya', 'Slot Terisi', 'Status', 'Opsi'];

  return (
    <DashboardLayout activeRole="ADMIN">
      <div className="space-y-6">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-sans font-extrabold text-2xl text-brand-brown tracking-tight">
              Manajemen Kelas Yoga & Spiritual
            </h1>
            <p className="text-xs text-brand-brown/60 font-light">
              Pusat kurasi seluruh asana, meditasi, penyembuhan suara yang dipublikasikan bagi masyarakat Jakarta.
            </p>
          </div>
          <Link href="/admin/events/create" className="shrink-0">
            <button className="px-5 py-3 bg-brand-sage hover:bg-brand-sagedark text-white text-xs font-bold rounded-2xl shadow-sm flex items-center gap-2 transition-all">
              <Plus className="w-4 h-4" /> Tambah Sesi Baru
            </button>
          </Link>
        </div>

        {/* Dynamic Responsive DataTable list */}
        <DataTable<ExtendedEvent>
          data={events}
          headers={tableHeaders}
          searchPlaceholder="Cari nama kelas, kategori, EO partner..."
          searchFilter={searchFilter}
          emptyMessage="Belum ada sesi latihan yang didaftarkan."
          renderDesktopRow={(evt, idx) => {
            const tempAvailable = getEventAvailableSlots(evt);
            const occupied = evt.quota - tempAvailable;
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
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-brand-brown/50 leading-none">
                        <span className="flex items-center gap-0.5 shrink-0">
                          <MapPin className="w-3 h-3 text-brand-sage" /> {evt.city}
                        </span>
                        <span>•</span>
                        <span className="truncate">{formatDate(evt.startDate)}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 text-[10px] font-semibold text-brand-sage bg-brand-sage/10 rounded-full">
                    {evt.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="font-semibold">{evt.organizerName}</p>
                  <span className="text-[9px] text-brand-brown/40 font-mono">ID: {evt.organizerId || 'org-1'}</span>
                </td>
                <td className="px-6 py-4 font-semibold">
                  {evt.price === 0 ? 'Gratis' : formatPrice(evt.price)}
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <p className="font-bold text-brand-brown/80">{occupied} / {evt.quota} Tiket</p>
                    <span className="text-[10px] text-brand-sage block leading-none">Sisa: {tempAvailable} slot</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select
                    className={`px-2 py-1 text-[10px] font-bold uppercase tracking-tight rounded-md border focus:outline-none transition-all ${
                      evt.status === 'published'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : evt.status === 'draft'
                        ? 'bg-gray-150 text-gray-700 border-gray-200'
                        : evt.status === 'cancelled'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : 'bg-indigo-50 text-indigo-800 border-indigo-200'
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
                      <button className="p-2 text-brand-brown/60 hover:text-brand-sage hover:bg-brand-cream/40 rounded-xl transition-all" title="Lihat Halaman Publik">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleToggleHighlight(evt.id)}
                      className={`p-2 rounded-xl transition-all ${
                        evt.isHighlighted
                          ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
                          : 'text-brand-brown/40 hover:text-yellow-600 hover:bg-brand-cream/30'
                      }`}
                      title={evt.isHighlighted ? "Lepas Rekomendasi Pekan Ini" : "Jadikan Rekomendasi Pekan Ini (Highlight)"}
                    >
                      <Sparkles className="w-4 h-4 fill-current" />
                    </button>
                    <Link href={`/admin/events/${evt.id}/edit`}>
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Edit Rincian">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(evt.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Hapus Sesi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          }}
          renderMobileCard={(evt, idx) => {
            const tempAvailable = getEventAvailableSlots(evt);
            const occupied = evt.quota - tempAvailable;
            return (
              <div key={evt.id} className="bg-white border border-brand-beige/50 rounded-2xl p-4.5 space-y-4 hover:shadow-md transition-shadow">
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
                    <h3 className="text-xs font-bold text-brand-brown leading-tight mt-1 truncate">{evt.title}</h3>
                    <p className="text-[10px] text-brand-brown/50 leading-none mt-1">{evt.organizerName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5 bg-brand-cream/30 rounded-xl p-3 border border-brand-beige/25 text-[11px] list-none">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-brand-brown/40 block">Biaya Investasi</span>
                    <p className="font-extrabold text-brand-brown">{evt.price === 0 ? 'Gratis' : formatPrice(evt.price)}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-brand-brown/40 block">Kursi Terisi</span>
                    <p className="font-bold text-brand-brown">{occupied} / {evt.quota} <span className="text-[10px] font-normal text-brand-brown/60">(Sisa {tempAvailable})</span></p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-brand-brown/40 block">Waktu Sesi</span>
                    <p className="font-medium text-brand-brown truncate">{formatDate(evt.startDate)}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-brand-brown/40 block">Homepage Highlight</span>
                    <p className="font-bold text-yellow-600 flex items-center gap-1">
                      {evt.isHighlighted ? 'Ya ⭐' : 'Tidak ❌'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1 border-t border-brand-beige/20 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold text-brand-brown/40 uppercase">Status:</span>
                    <select
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border focus:outline-none transition-all ${
                        evt.status === 'published'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                      value={evt.status}
                      onChange={(e) => handleStatusChange(evt.id, e.target.value as EventStatus)}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleHighlight(evt.id)}
                      className={`p-1.5 border rounded-lg transition-all ${
                        evt.isHighlighted ? 'bg-yellow-50 text-yellow-600 border-yellow-250' : 'bg-transparent text-brand-brown/40 border-brand-beige'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <Link href={`/admin/events/${evt.id}/edit`}>
                      <button className="p-1.5 border border-brand-beige rounded-lg text-blue-600 hover:bg-blue-50" title="Edit">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(evt.id)}
                      className="p-1.5 border border-brand-beige rounded-lg text-red-650 hover:bg-red-55"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
