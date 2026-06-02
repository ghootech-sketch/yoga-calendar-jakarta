'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, Search, User, Mail, MessageSquare, Clock, 
  HelpCircle, CheckCircle, AlertOctagon, Undo, XCircle
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DataTable from '@/components/dashboard/DataTable';
import { BookingService } from '@/lib/bookings/booking-store';
import { Booking, BookingStatus } from '@/lib/bookings/booking-types';
import { EventService, ExtendedEvent } from '@/lib/events/event-service';
import { formatPrice, formatDate } from '@/lib/utils';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<ExtendedEvent[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
      setBookings(BookingService.getAllBookings());
      setEvents(EventService.getAllEvents());
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleStatusChange = (bookingCode: string, newStatus: BookingStatus) => {
    BookingService.updateBookingStatus(bookingCode, newStatus);
    setBookings(BookingService.getAllBookings());
  };

  // Perform multi-dimensional filters prior to rendering
  const activeBookings = bookings.filter(b => {
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchEvent = eventFilter === 'all' || b.eventId === eventFilter;
    return matchStatus && matchEvent;
  });

  const searchFilter = (item: Booking, query: string): boolean => {
    const q = query.toLowerCase();
    return (
      item.customerName.toLowerCase().includes(q) ||
      item.customerEmail.toLowerCase().includes(q) ||
      item.customerPhone.includes(q) ||
      item.bookingCode.toLowerCase().includes(q) ||
      item.eventSlug.toLowerCase().includes(q)
    );
  };

  if (!isHydrated) {
    return (
      <DashboardLayout activeRole="ADMIN">
        <div className="flex h-64 items-center justify-center">
          <p className="text-brand-brown animate-pulse font-semibold">Memuat rekaman bookings...</p>
        </div>
      </DashboardLayout>
    );
  }

  const tableHeaders = [
    'Kode Booking', 'Pemesan / Kontak', 'Sesi Yoga', 'Jumlah Tiket', 
    'Total Pembayaran', 'Tanggal Daftar', 'Status Sesi', 'Tindakan'
  ];

  return (
    <DashboardLayout activeRole="ADMIN">
      <div className="space-y-6">
        
        {/* Banner */}
        <div>
          <h1 className="font-sans font-extrabold text-2xl text-brand-brown tracking-tight">
            Daftar Booking & Kehadiran Peserta
          </h1>
          <p className="text-xs text-brand-brown/60 font-light">
            Eksplorasi dan validasi detail kehadiran, total nominal pesanan, dan status pelunasan tiket seluruh peserta Yoga Calendar Jakarta.
          </p>
        </div>

        {/* Dynamic Filters Controls block */}
        <DataTable<Booking>
          data={activeBookings}
          headers={tableHeaders}
          searchPlaceholder="Cari nama, email, nomor WA, kode booking..."
          searchFilter={searchFilter}
          emptyMessage="Tidak ada pemesanan tiket yang cocok dengan filter aktif."
          actions={
            <div className="flex flex-wrap items-center gap-2">
              {/* Event selection */}
              <select
                className="px-3.5 py-2 bg-white border border-brand-beige rounded-2xl text-[11px] font-semibold text-brand-brown focus:outline-none"
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
              >
                <option value="all">Semua Sesi Kelas</option>
                {events.map(e => (
                  <option key={e.id} value={e.id}>{e.title}</option>
                ))}
              </select>

              {/* Status selection */}
              <select
                className="px-3.5 py-2 bg-white border border-brand-beige rounded-2xl text-[11px] font-semibold text-brand-brown focus:outline-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Semua Status</option>
                <option value="pending_payment">Pending</option>
                <option value="paid">Paid (Lunas)</option>
                <option value="failed">Failed (Gagal)</option>
                <option value="cancelled">Cancelled</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          }
          renderDesktopRow={(b, idx) => {
            const associatedEventName = events.find(e => e.id === b.eventId)?.title || b.eventSlug;
            return (
              <tr key={b.id} className="hover:bg-brand-cream/10 transition-colors text-xs text-brand-brown">
                <td className="px-6 py-4 font-mono font-bold text-brand-sage">
                  <Link href={`/booking/${b.bookingCode}`} target="_blank" className="hover:underline flex items-center gap-1">
                    {b.bookingCode}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-0.5">
                    <p className="font-bold text-brand-brown">{b.customerName}</p>
                    <p className="text-[10px] text-brand-brown/50 font-mono flex items-center gap-1 select-all">{b.customerEmail}</p>
                    <p className="text-[10px] text-brand-brown/50 flex items-center gap-1">WA: <span className="font-bold select-all">{b.customerPhone}</span></p>
                  </div>
                </td>
                <td className="px-6 py-4 max-w-xs font-medium truncate" title={associatedEventName}>
                  {associatedEventName}
                </td>
                <td className="px-6 py-4 text-center font-bold">
                  {b.ticketQuantity} Tiket
                </td>
                <td className="px-6 py-4 font-extrabold">
                  {formatPrice(b.totalPrice)}
                </td>
                <td className="px-6 py-4 text-[10px] text-brand-brown/50">
                  {formatDate(b.createdAt)}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${
                    b.status === 'paid' 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-250' 
                      : b.status === 'failed' || b.status === 'expired'
                      ? 'bg-rose-50 text-rose-850 border-rose-250'
                      : 'bg-amber-50 text-amber-800 border-amber-250 animate-pulse'
                  }`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    className="px-2 py-1 text-[10px] font-semibold bg-brand-cream border border-brand-beige rounded-lg focus:outline-none focus:ring-1"
                    value={b.status}
                    onChange={(e) => handleStatusChange(b.bookingCode, e.target.value as BookingStatus)}
                  >
                    <option value="pending_payment">Set Pending</option>
                    <option value="paid">Set Paid (Lunas)</option>
                    <option value="failed">Set Failed</option>
                    <option value="cancelled">Set Cancelled</option>
                    <option value="expired">Set Expired</option>
                  </select>
                </td>
              </tr>
            );
          }}
          renderMobileCard={(b, idx) => {
            const assocEvent = events.find(e => e.id === b.eventId)?.title || b.eventSlug;
            return (
              <div key={b.id} className="bg-white border border-brand-beige/50 rounded-2xl p-4.5 space-y-3.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono font-bold text-brand-sage">{b.bookingCode}</span>
                  <span className={`inline-block px-2 py-0.5 text-[8px] font-extrabold uppercase rounded ${
                    b.status === 'paid' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                  }`}>
                    {b.status}
                  </span>
                </div>

                <div className="space-y-1.5 pt-1 border-t border-brand-beige/10">
                  <p className="text-xs font-bold text-brand-brown">{b.customerName}</p>
                  <p className="text-[10px] text-brand-brown/60 leading-tight">WA: {b.customerPhone} | Email: {b.customerEmail}</p>
                  <p className="text-[10px] text-brand-brown/70 italic font-medium">Sesi: {assocEvent}</p>
                </div>

                <div className="flex justify-between items-end pt-2 border-t border-brand-beige/10 text-xs">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-brand-brown/40 block">Tiket x Total</span>
                    <p className="font-bold text-brand-brown">{b.ticketQuantity} Tiket / <span className="font-extrabold text-brand-sage">{formatPrice(b.totalPrice)}</span></p>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-bold text-brand-brown/45">Ubah:</span>
                    <select
                      className="px-2 py-1 text-[9px] font-semibold bg-brand-cream border border-brand-beige rounded-lg text-brand-brown focus:outline-none"
                      value={b.status}
                      onChange={(e) => handleStatusChange(b.bookingCode, e.target.value as BookingStatus)}
                    >
                      <option value="pending_payment">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="expired">Expired</option>
                    </select>
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
