'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, FileText, CheckCircle2, TrendingUp, AlertTriangle, Clock, 
  ArrowRight, Users, Sparkles, User, HeartHandshake, Compass, Receipt
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { DashboardService, AdminMetrics } from '@/lib/dashboard/dashboard-service';
import { formatPrice, formatDate } from '@/lib/utils';
import { getEventAvailableSlots } from '@/lib/bookings/booking-store';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
      setMetrics(DashboardService.getAdminMetrics());
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isHydrated || !metrics) {
    return (
      <DashboardLayout activeRole="ADMIN">
        <div className="flex items-center justify-center h-64">
          <p className="text-brand-brown animate-pulse font-semibold">Loading dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeRole="ADMIN">
      <div className="space-y-8 animate-fade-in">
        
        {/* Welcome Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-brand-beige/50 p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden">
          <div className="space-y-1.5 z-10">
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-sage flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Portal Administrator
            </span>
            <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-brand-brown tracking-tight">
              Selamat Datang Kembali!
            </h1>
            <p className="text-xs text-brand-brown/60 max-w-xl font-light leading-relaxed">
              Selamat datang di pusat komando Yoga Calendar Jakarta. Kelola pendaftaran digital, moderasi event partner, konfigurasi banner, dan pantau keuangan dalam satu dashboard.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 z-10">
            <Link href="/admin/events/create">
              <button className="px-5 py-3 bg-brand-sage hover:bg-brand-sagedark text-white text-xs font-bold rounded-2xl shadow-sm hover:translate-y-[-1px] transition-all focus:outline-none">
                + Tambah Event Baru
              </button>
            </Link>
          </div>
          <div className="absolute right-0 bottom-0 opacity-[0.03] scale-150 pointer-events-none">
            <Sparkles className="w-64 h-64 text-brand-sage" />
          </div>
        </div>

        {/* Dashboard Cards Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
          <DashboardCard
            title="Event Publik Aktif"
            value={metrics.totalActiveEvents}
            icon={Calendar}
            subtext="Kelas berstatus Published"
          />
          <DashboardCard
            title="Total Booking"
            value={metrics.totalBookings}
            icon={FileText}
            subtext="Semua tiket (Pending/Paid)"
          />
          <DashboardCard
            title="Transaksi Berhasil"
            value={metrics.totalPaidTransactions}
            icon={Receipt}
            subtext="Pembayaran terkonfirmasi"
          />
          <DashboardCard
            title="Total Pendapatan"
            value={formatPrice(metrics.totalRevenue)}
            icon={TrendingUp}
            subtext="Dari tiket berstatus Paid"
          />
        </div>

        {/* Inner layout split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Recent Bookings Queue (7 columns) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <h2 className="font-sans font-bold text-lg text-brand-brown">
                  Reservasi Terbaru
                </h2>
                <p className="text-[11px] text-brand-brown/50">Peserta pendaftar kelas yoga terbaru</p>
              </div>
              <Link href="/admin/bookings" className="text-xs font-bold text-brand-sage hover:text-brand-sagedark flex items-center gap-1">
                Selengkapnya <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white border border-brand-beige/50 rounded-3xl shadow-sm divide-y divide-brand-beige/10 overflow-hidden">
              {metrics.recentBookings.length === 0 ? (
                <div className="p-10 text-center">
                  <p className="text-xs text-brand-brown/40">Belum ada pendaftaran masuk.</p>
                </div>
              ) : (
                metrics.recentBookings.map((b, idx) => (
                  <div key={idx} className="p-5 flex items-center justify-between gap-4 hover:bg-brand-cream/10 transition-colors">
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-brand-brown truncate">{b.customerName}</span>
                        <span className="text-[10px] font-mono text-brand-brown/40 shrink-0">#{b.bookingCode.substring(b.bookingCode.lastIndexOf('-') + 1)}</span>
                      </div>
                      <p className="text-[10px] text-brand-brown/50 leading-none truncate">
                        Sesi ID: <span className="font-medium text-brand-brown/70">{b.eventSlug}</span>
                      </p>
                      <span className="text-[9px] text-brand-brown/40 font-mono block">{formatDate(b.createdAt)}</span>
                    </div>

                    <div className="text-right shrink-0 space-y-1">
                      <span className="text-xs font-extrabold text-brand-brown block">{formatPrice(b.totalPrice)}</span>
                      <span className={`inline-block px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded ${
                        b.status === 'paid' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : b.status === 'failed' || b.status === 'expired'
                          ? 'bg-rose-50 text-rose-700 border border-rose-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-100 animate-pulse'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Low Limit warning and shortcuts (5 columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Low Limit Seats panel */}
            <div className="space-y-4">
              <div className="space-y-0.5">
                <h3 className="font-sans font-bold text-base text-brand-brown flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" /> Slot Hampir Habis!
                </h3>
                <p className="text-[11px] text-brand-brown/50">Segera promosikan ulang kelas yoga berikut</p>
              </div>

              <div className="bg-white border border-brand-beige/50 rounded-3xl p-5 shadow-sm space-y-3">
                {metrics.lowSlotEvents.length === 0 ? (
                  <p className="text-xs text-brand-brown/40 text-center py-4">Semua kelas memiliki ketersediaan kursi yang longgar.</p>
                ) : (
                  metrics.lowSlotEvents.map((e, idx) => {
                    const remains = getEventAvailableSlots(e);
                    return (
                      <Link 
                        key={idx} 
                        href={`/events/${e.slug}`}
                        target="_blank"
                        className="flex items-center justify-between p-3.5 bg-amber-50/20 hover:bg-amber-50/50 border border-amber-100/60 rounded-2xl transition-all"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="text-xs font-bold text-brand-brown truncate">{e.title}</p>
                          <span className="text-[9px] text-brand-brown/50 italic">{e.organizerName}</span>
                        </div>
                        <span className="px-2 py-1 bg-amber-500 text-white font-extrabold text-[10px] rounded-lg shrink-0">
                          Sisa {remains} Slot
                        </span>
                      </Link>
                    )
                  })
                )}
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="space-y-4">
              <h3 className="font-sans font-bold text-base text-brand-brown">Pintas Manajemen</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/admin/highlights" className="block text-center p-4 bg-white border border-brand-beige/50 rounded-2xl shadow-sm hover:border-brand-sage hover:shadow-md transition-all">
                  <Compass className="w-5 h-5 text-brand-sage mx-auto mb-1.5" />
                  <span className="text-xs font-bold text-brand-brown block">Kelola Highlights</span>
                  <span className="text-[9px] text-brand-brown/55 font-light block mt-0.5">Toggle homepage</span>
                </Link>
                <Link href="/admin/organizers" className="block text-center p-4 bg-white border border-brand-beige/50 rounded-2xl shadow-sm hover:border-brand-sage hover:shadow-md transition-all">
                  <HeartHandshake className="w-5 h-5 text-brand-sage mx-auto mb-1.5" />
                  <span className="text-xs font-bold text-brand-brown block">Kelola EO Partner</span>
                  <span className="text-[9px] text-brand-brown/55 font-light block mt-0.5">3 Vendor Studio</span>
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
