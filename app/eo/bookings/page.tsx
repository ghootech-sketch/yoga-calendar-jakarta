'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FileText, Search, User, Mail, MessageSquare, Clock, 
  HelpCircle, CheckCircle, AlertOctagon, Phone
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DataTable from '@/components/dashboard/DataTable';
import { BookingService } from '@/lib/bookings/booking-store';
import { Booking, BookingStatus } from '@/lib/bookings/booking-types';
import { EventService, ExtendedEvent } from '@/lib/events/event-service';
import { OrganizerService } from '@/lib/organizers/organizer-service';
import { MockAuthService } from '@/lib/auth/mock-auth';
import { formatPrice, formatDate } from '@/lib/utils';

export default function EOBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [myEvents, setMyEvents] = useState<ExtendedEvent[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [eventFilter, setEventFilter] = useState<string>('all');
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

      // Load active studio events & their respective IDs
      const eventsList = EventService.getAllEvents().filter(e => e.organizerId === org.id);
      setMyEvents(eventsList);
      const eventIds = eventsList.map(e => e.id);

      // Filter global bookings list down to only bookings belonging to this studio's sessions
      const rawBookings = BookingService.getAllBookings().filter(b => eventIds.includes(b.eventId));
      setBookings(rawBookings);
    }, 0);
    return () => clearTimeout(timer);
  }, [router]);

  const handleStatusChange = (bookingCode: string, newStatus: BookingStatus) => {
    BookingService.updateBookingStatus(bookingCode, newStatus);
    // Refresh bookings in view
    const updatedRaw = BookingService.getAllBookings().filter(b => 
      myEvents.map(e => e.id).includes(b.eventId)
    );
    setBookings(updatedRaw);
  };

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
      item.bookingCode.toLowerCase().includes(q)
    );
  };

  if (!isHydrated) {
    return (
      <DashboardLayout activeRole="EO">
        <div className="flex bg-transparent h-64 items-center justify-center">
          <p className="text-brand-brown animate-pulse font-semibold">Memuat rekapitulasi kehadiran...</p>
        </div>
      </DashboardLayout>
    );
  }

  const tableHeaders = [
    'Kode Booking', 'Nama Pemesan', 'Kontak WhatsApp / Email', 'Sesi Yoga Anda', 
    'Jumlah Tiket', 'Total Dana Masuk', 'Tanggal Reservasi', 'Status Bayar', 'Ubah Status'
  ];

  return (
    <DashboardLayout activeRole="EO">
      <div className="space-y-6">
        
        {/* Banner */}
        <div>
          <h1 className="font-sans font-extrabold text-2xl text-brand-brown tracking-tight">
            Pendaftaran Peserta & Kehadiran Kelas
          </h1>
          <p className="text-xs text-brand-brown/60 font-light">
            Pantau rincian peserta yang menghadiri sesi yoga Anda, kelola konfirmasi kehadiran, dan verifikasi pelunasan tiket masuk Anda.
          </p>
        </div>

        {/* List Grid controller */}
        <DataTable<Booking>
          data={activeBookings}
          headers={tableHeaders}
          searchPlaceholder="Cari berdasarkan nama, email, nomor Whatsapp, atau kode booking..."
          searchFilter={searchFilter}
          emptyMessage="Belum menemukan pendaftaran peserta yang cocok dengan filter aktif."
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <select
                className="px-3.5 py-2 bg-white border border-brand-beige rounded-2xl text-[11px] font-semibold text-brand-brown focus:outline-none"
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
              >
                <option value="all">Semua Sesi Studio</option>
                {myEvents.map(e => (
                  <option key={e.id} value={e.id}>{e.title}</option>
                ))}
              </select>

              <select
                className="px-3.5 py-2 bg-white border border-brand-beige rounded-2xl text-[11px] font-semibold text-brand-brown focus:outline-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Semua Status</option>
                <option value="pending_payment">Pending</option>
                <option value="paid">Paid (Lunas)</option>
                <option value="failed">Failed / Gagal</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          }
          renderDesktopRow={(b, idx) => {
            const associatedEventName = myEvents.find(e => e.id === b.eventId)?.title || b.eventSlug;
            return (
              <tr key={b.id} className="hover:bg-brand-cream/10 transition-colors text-xs text-brand-brown">
                <td className="px-6 py-4 font-mono font-bold text-brand-sage">
                  <Link href={`/booking/${b.bookingCode}`} target="_blank" className="hover:underline flex items-center gap-0.5">
                    {b.bookingCode}
                  </Link>
                </td>
                <td className="px-6 py-4 font-bold text-brand-brown">
                  {b.customerName}
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-0.5 text-[10px] text-brand-brown/65">
                    <span className="flex items-center gap-1 font-mono select-all"><Mail className="w-3.5 h-3.5 text-brand-sage" /> {b.customerEmail}</span>
                    <span className="flex items-center gap-1">WA Contacts: <span className="font-bold select-all">{b.customerPhone}</span></span>
                  </div>
                </td>
                <td className="px-6 py-4 max-w-xs font-semibold truncate" title={associatedEventName}>
                  {associatedEventName}
                </td>
                <td className="px-6 py-4 text-center font-bold">
                  {b.ticketQuantity} Tiket
                </td>
                <td className="px-6 py-4 font-extrabold text-brand-brown">
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
                    className="px-2 py-1 text-[10px] font-semibold bg-brand-cream border border-brand-beige rounded-lg focus:outline-none"
                    value={b.status}
                    onChange={(e) => handleStatusChange(b.bookingCode, e.target.value as BookingStatus)}
                  >
                    <option value="pending_payment">Pending</option>
                    <option value="paid">Paid (Lunas)</option>
                    <option value="failed">Failed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="expired">Expired</option>
                  </select>
                </td>
              </tr>
            );
          }}
          renderMobileCard={(b, idx) => {
            const assocEvent = myEvents.find(e => e.id === b.eventId)?.title || b.eventSlug;
            return (
              <div key={b.id} className="bg-white border border-brand-beige/50 rounded-2xl p-4.5 space-y-3.5 shadow-sm text-xs text-brand-brown">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-brand-sage">{b.bookingCode}</span>
                  <span className={`inline-block px-2.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wide rounded ${
                    b.status === 'paid' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                  }`}>
                    {b.status}
                  </span>
                </div>

                <div className="space-y-1 pt-1 border-t border-brand-beige/10">
                  <p className="font-bold">{b.customerName}</p>
                  <p className="text-[10px] text-brand-brown/65">WA: {b.customerPhone} | Email: {b.customerEmail}</p>
                  <p className="text-[10px] text-brand-brown/70 font-semibold italic mt-1 leading-tight">Sesi Anda: {assocEvent}</p>
                </div>

                <div className="flex justify-between items-end pt-2 border-t border-brand-beige/10">
                  <div>
                    <span className="text-[8px] uppercase font-bold text-brand-brown/40 block">Tiket x Dana</span>
                    <p className="font-bold">{b.ticketQuantity} Tiket / <span className="font-extrabold text-brand-sage">{formatPrice(b.totalPrice)}</span></p>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="text-[9px] font-bold text-brand-brown/40">Ubah:</span>
                    <select
                      className="px-2 py-1 text-[9px] font-semibold bg-brand-cream border border-brand-beige rounded-lg focus:outline-none"
                      value={b.status}
                      onChange={(e) => handleStatusChange(b.bookingCode, e.target.value as BookingStatus)}
                    >
                      <option value="pending_payment">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
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
