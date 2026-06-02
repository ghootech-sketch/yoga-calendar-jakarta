'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/image';
import { 
  Sparkles, Compass, Check, ArrowUpDown, HelpCircle, 
  Eye, EyeOff, LayoutTemplate, Star
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DataTable from '@/components/dashboard/DataTable';
import { EventService, ExtendedEvent } from '@/lib/events/event-service';
import { formatPrice, formatDate } from '@/lib/utils';

export default function AdminHighlightsPage() {
  const [events, setEvents] = useState<ExtendedEvent[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [savedOrderIds, setSavedOrderIds] = useState<Record<string, number>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
      const list = EventService.getAllEvents().filter(e => e.status === 'published');
      setEvents(list);
      
      // Seed locally modified highlight orders
      const initialOrders: Record<string, number> = {};
      list.forEach(e => {
        initialOrders[e.id] = e.highlightOrder || 99;
      });
      setSavedOrderIds(initialOrders);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleHighlight = (id: string) => {
    EventService.toggleHighlight(id);
    const refreshed = EventService.getAllEvents().filter(e => e.status === 'published');
    setEvents(refreshed);
    
    // Re-seed order IDs mapping
    const nextOrders: Record<string, number> = {};
    refreshed.forEach(e => {
      nextOrders[e.id] = e.highlightOrder || 99;
    });
    setSavedOrderIds(nextOrders);
  };

  const handleOrderChange = (id: string, val: string) => {
    const num = val === '' ? 99 : Number(val);
    setSavedOrderIds(prev => ({
      ...prev,
      [id]: num
    }));
  };

  const handleOrderSave = (id: string) => {
    const desiredOrder = savedOrderIds[id] !== undefined ? savedOrderIds[id] : 99;
    EventService.updateHighlightOrder(id, desiredOrder);
    
    // Refresh records
    const refreshed = EventService.getAllEvents().filter(e => e.status === 'published');
    setEvents(refreshed);
    alert('Urutan rujukan highlight berhasil disimpan.');
  };

  const searchFilter = (item: ExtendedEvent, query: string): boolean => {
    return item.title.toLowerCase().includes(query.toLowerCase());
  };

  if (!isHydrated) {
    return (
      <DashboardLayout activeRole="ADMIN">
        <div className="flex h-64 items-center justify-center">
          <p className="text-brand-brown animate-pulse font-semibold">Memuat data highlights...</p>
        </div>
      </DashboardLayout>
    );
  }

  const tableHeaders = ['Keterpilihan / Prioritas', 'Detail Sesi Latihan', 'Biaya Tiket', 'Peringkat Urut', 'Aksi'];

  return (
    <DashboardLayout activeRole="ADMIN">
      <div className="space-y-6">
        
        {/* Title area */}
        <div className="flex items-center gap-3 bg-white border border-brand-beige/50 p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden">
          <div className="space-y-1.5 z-10">
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-sage flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" /> Landing Curation
            </span>
            <h1 className="font-sans font-extrabold text-2xl text-brand-brown tracking-tight">
              Highlight Pekan Ini (Rekomendasi Beranda)
            </h1>
            <p className="text-xs text-brand-brown/60 max-w-xl font-light leading-relaxed">
              Pilih kelas-kelas spiritual dan asana unggulan untuk dipasang pada bagian 3 promo teratas beranda depan. Homepage menyaring event berstatus Published dan mengurutkannya berdasarkan input peringkat di bawah.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 opacity-[0.03] scale-150 pointer-events-none">
            <Compass className="w-64 h-64 text-brand-sage" />
          </div>
        </div>

        {/* Data list */}
        <DataTable<ExtendedEvent>
          data={events}
          headers={tableHeaders}
          searchPlaceholder="Cari kelas yang ingin di-highlight..."
          searchFilter={searchFilter}
          emptyMessage="Tidak ada kelas Published yang tersedia untuk di-highlight."
          renderDesktopRow={(evt, idx) => {
            const currentOrder = savedOrderIds[evt.id] !== undefined ? savedOrderIds[evt.id] : 99;
            return (
              <tr key={evt.id} className="hover:bg-brand-cream/10 transition-colors text-xs text-brand-brown">
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleHighlight(evt.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all focus:outline-none ${
                      evt.isHighlighted
                        ? 'bg-yellow-50 text-yellow-750 border border-yellow-200'
                        : 'bg-brand-cream text-brand-brown/40 border border-brand-beige'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${evt.isHighlighted ? 'fill-current text-yellow-500' : ''}`} />
                    {evt.isHighlighted ? 'Highlighted' : 'Regular'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3 max-w-xs">
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
                      <p className="font-bold truncate">{evt.title}</p>
                      <p className="text-[10px] text-brand-brown/50">{evt.organizerName} • {formatDate(evt.startDate)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold">
                  {formatPrice(evt.price)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 w-24">
                    <input
                      type="number"
                      min={1}
                      disabled={!evt.isHighlighted}
                      className="w-12 px-2 py-1 text-center bg-brand-cream border border-brand-beige rounded-lg focus:outline-none disabled:opacity-50 text-xs font-mono font-bold"
                      value={currentOrder}
                      onChange={(e) => handleOrderChange(evt.id, e.target.value)}
                    />
                    {evt.isHighlighted && (
                      <button
                        onClick={() => handleOrderSave(evt.id)}
                        className="p-1 px-1.5 bg-brand-sage hover:bg-brand-sagedark text-white rounded-lg transition-all text-[10px]"
                        title="Simpan Urutan"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <a href={`/events/${evt.slug}`} target="_blank" className="text-brand-sage hover:underline hover:text-brand-sagedark font-bold flex items-center gap-1">
                    Pratinjau <Star className="w-3 h-3" />
                  </a>
                </td>
              </tr>
            );
          }}
          renderMobileCard={(evt, idx) => {
            const currentOrder = savedOrderIds[evt.id] !== undefined ? savedOrderIds[evt.id] : 99;
            return (
              <div key={evt.id} className="bg-white border border-brand-beige/50 rounded-2xl p-4.5 space-y-3.5">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-xs font-bold text-brand-brown">{evt.title}</h3>
                  <button
                    onClick={() => handleToggleHighlight(evt.id)}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase transition-all ${
                      evt.isHighlighted
                        ? 'bg-yellow-50 text-yellow-750'
                        : 'bg-brand-cream text-brand-charcoal/40'
                    }`}
                  >
                    ⭐ {evt.isHighlighted ? 'Highlighted' : 'Regular'}
                  </button>
                </div>

                {evt.isHighlighted && (
                  <div className="flex items-center justify-between text-xs bg-brand-cream/40 p-2.5 rounded-xl border border-brand-beige/20">
                    <span className="text-[10px] uppercase font-bold text-brand-brown/50">Urutan Prioritas:</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="w-12 py-1 text-center bg-white border border-brand-beige rounded-lg focus:outline-none text-xs font-bold"
                        value={currentOrder}
                        onChange={(e) => handleOrderChange(evt.id, e.target.value)}
                      />
                      <button
                        onClick={() => handleOrderSave(evt.id)}
                        className="px-2 py-1.5 bg-brand-sage text-white font-bold rounded-lg text-[9px]"
                      >
                        Simpan Urutan
                      </button>
                    </div>
                  </div>
                )}
                
                <p className="text-[10px] text-brand-brown/50 pl-0.5">{evt.organizerName} • {formatDate(evt.startDate)}</p>
              </div>
            );
          }}
        />

      </div>
    </DashboardLayout>
  );
}
