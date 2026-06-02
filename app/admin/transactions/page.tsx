'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CreditCard, Landmark, CreditCard as CardIcon, Receipt, Search, ArrowLeftRight } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DataTable from '@/components/dashboard/DataTable';
import { BookingService } from '@/lib/bookings/booking-store';
import { Booking } from '@/lib/bookings/booking-types';
import { formatPrice, formatDate } from '@/lib/utils';

interface DerivedTransaction {
  id: string;
  bookingCode: string;
  customerName: string;
  provider: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed' | 'cancelled' | 'expired';
  createdAt: string;
  paidAt?: string;
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<DerivedTransaction[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
      // Derive transactions elegantly from bookings
      const bookingsList = BookingService.getAllBookings();
      const mapped: DerivedTransaction[] = bookingsList.map(b => {
        // Create readable mock payments details
        const suffix = b.bookingCode.substring(b.bookingCode.lastIndexOf('-') + 1);
        const isPaid = b.status === 'paid';
        return {
          id: `TX-MOCK-${suffix}`,
          bookingCode: b.bookingCode,
          customerName: b.customerName,
          provider: b.totalPrice > 150000 ? 'Midtrans Bank Transfer (Mock)' : 'GOPAY Wallet (Mock)',
          amount: b.totalPrice,
          status: b.status as any,
          createdAt: b.createdAt,
          paidAt: isPaid ? b.createdAt : undefined
        };
      });
      setTransactions(mapped);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const activeTransactions = transactions.filter(t => {
    return statusFilter === 'all' || t.status === statusFilter;
  });

  const searchFilter = (item: DerivedTransaction, query: string): boolean => {
    const q = query.toLowerCase();
    return (
      item.id.toLowerCase().includes(q) ||
      item.bookingCode.toLowerCase().includes(q) ||
      item.customerName.toLowerCase().includes(q) ||
      item.provider.toLowerCase().includes(q)
    );
  };

  if (!isHydrated) {
    return (
      <DashboardLayout activeRole="ADMIN">
        <div className="flex h-64 items-center justify-center">
          <p className="text-brand-brown animate-pulse font-semibold">Memuat log finansial...</p>
        </div>
      </DashboardLayout>
    );
  }

  const tableHeaders = [
    'ID Transaksi', 'Kode Booking', 'Pembayar', 'Provider Gateway', 
    'Nominal Transfer', 'Dibuat Pada', 'Tanggal Bayar', 'Status'
  ];

  return (
    <DashboardLayout activeRole="ADMIN">
      <div className="space-y-6">
        
        {/* Banner header */}
        <div className="flex items-center gap-3 bg-white border border-brand-beige/50 p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden">
          <div className="space-y-1.5 z-10">
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-sage flex items-center gap-1.5">
              <ArrowLeftRight className="w-3.5 h-3.5 animate-pulse" /> Financial Auditing
            </span>
            <h1 className="font-sans font-extrabold text-2xl text-brand-brown tracking-tight">
              Audit Rekaman Transaksi Finansial
            </h1>
            <p className="text-xs text-brand-brown/60 max-w-xl font-light leading-relaxed">
              Jurnal pembukuan digital yang mendokumentasikan log pembayaran dari pelari checkout peserta. Semua transaksi dimitigasi secara instan melalui sandbox simulator.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 opacity-[0.03] scale-150 pointer-events-none">
            <ArrowLeftRight className="w-64 h-64 text-brand-sage" />
          </div>
        </div>

        {/* Action and Search list */}
        <DataTable<DerivedTransaction>
          data={activeTransactions}
          headers={tableHeaders}
          searchPlaceholder="Cari ID transaksi, nama pemesan, kode booking..."
          searchFilter={searchFilter}
          emptyMessage="Belum menemukan transaksi untuk filter ini."
          actions={
            <select
              className="px-3.5 py-2 bg-white border border-brand-beige rounded-2xl text-[11px] font-semibold text-brand-brown focus:outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Semua Pembayaran</option>
              <option value="paid">Paid (Terkonfirmasi)</option>
              <option value="pending">Pending (Menunggu)</option>
              <option value="failed">Failed (Gagal Transfer)</option>
              <option value="cancelled">Cancelled (Dibatalkan)</option>
              <option value="expired">Expired (Kedaluwarsa)</option>
            </select>
          }
          renderDesktopRow={(t, idx) => (
            <tr key={t.id} className="hover:bg-brand-cream/10 transition-colors text-xs text-brand-brown">
              <td className="px-6 py-4 font-mono font-extrabold text-brand-brown">
                {t.id}
              </td>
              <td className="px-6 py-4 font-mono font-bold text-brand-sage">
                <Link href={`/booking/${t.bookingCode}`} target="_blank" className="hover:underline text-brand-sage">
                  {t.bookingCode}
                </Link>
              </td>
              <td className="px-6 py-4 font-bold">
                {t.customerName}
              </td>
              <td className="px-6 py-4">
                <span className="flex items-center gap-1">
                  <Landmark className="w-3.5 h-3.5 text-brand-sage" />
                  {t.provider}
                </span>
              </td>
              <td className="px-6 py-4 font-extrabold text-brand-brown">
                {formatPrice(t.amount)}
              </td>
              <td className="px-6 py-4 text-[10px] text-brand-brown/50">
                {formatDate(t.createdAt)}
              </td>
              <td className="px-6 py-4 text-[10px] text-brand-brown/55 font-semibold">
                {t.paidAt ? formatDate(t.paidAt) : <span className="text-brand-brown/40">-</span>}
              </td>
              <td className="px-6 py-4">
                <span className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${
                  t.status === 'paid' 
                    ? 'bg-emerald-50 text-emerald-850 border-emerald-200' 
                    : t.status === 'pending'
                    ? 'bg-amber-50 text-amber-80 * border-amber-200'
                    : 'bg-rose-50 text-rose-850 border-rose-200'
                }`}>
                  {t.status}
                </span>
              </td>
            </tr>
          )}
          renderMobileCard={(t, idx) => (
            <div key={t.id} className="bg-white border border-brand-beige/50 rounded-2xl p-4.5 space-y-3 shadow-sm text-xs text-brand-brown">
              <div className="flex justify-between items-center">
                <p className="font-mono font-bold text-brand-brown">{t.id}</p>
                <span className={`inline-block px-2 py-0.5 text-[8px] font-extrabold uppercase rounded ${
                  t.status === 'paid' ? 'bg-emerald-50 text-emerald-850' : 'bg-amber-50 text-amber-850'
                }`}>
                  {t.status}
                </span>
              </div>
              <div className="space-y-1 py-2 border-t border-b border-brand-beige/10">
                <p className="font-bold">Pemesan: {t.customerName}</p>
                <p className="text-[10px] text-brand-brown/60">Metode: {t.provider}</p>
                <p className="text-[10px] text-brand-brown/60">Booking Code: <span className="font-mono text-brand-sage font-bold">{t.bookingCode}</span></p>
              </div>
              <div className="flex justify-between items-center pt-1">
                <div>
                  <span className="text-[8px] uppercase tracking-wider text-brand-brown/40 block">Nominal Terbayar</span>
                  <p className="font-extrabold text-brand-brown">{formatPrice(t.amount)}</p>
                </div>
                <span className="text-[10px] text-brand-brown/50">{formatDate(t.createdAt)}</span>
              </div>
            </div>
          )}
        />

      </div>
    </DashboardLayout>
  );
}
