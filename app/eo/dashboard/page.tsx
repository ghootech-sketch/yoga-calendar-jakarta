'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Calendar, FileText, CheckCircle2, TrendingUp, AlertTriangle, Clock, 
  ArrowRight, Users, Sparkles, User, HeartHandshake, Compass, Receipt
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { DashboardService, EOMetrics } from '@/lib/dashboard/dashboard-service';
import { MockAuthService } from '@/lib/auth/mock-auth';
import { formatPrice, formatDate } from '@/lib/utils';
import { getEventAvailableSlots } from '@/lib/bookings/booking-store';

export default function EODashboardPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<EOMetrics | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
      const curr = MockAuthService.getCurrentSession();
      if (!curr) {
        router.replace('/login');
        return;
      }
      setSession(curr);
      
      // Fetch individual metrics restricted to active studio's email
      setMetrics(DashboardService.getEOMetrics(curr.email));
    }, 0);
    return () => clearTimeout(timer);
  }, [router]);

  if (!isHydrated || !session || !metrics) {
    return (
      <DashboardLayout activeRole="EO">
        <div className="flex items-center justify-center h-64">
          <p className="text-brand-brown animate-pulse font-semibold">Memuat dashboard studio...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeRole="EO">
      <div className="space-y-8 animate-fade-in">
        
        {/* Welcome Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-brand-beige/50 p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden">
          <div className="space-y-1.5 z-10">
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-sage flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Mitra Penyelenggara / Studio Partner
            </span>
            <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-brand-brown tracking-tight">
              {session.name}
            </h1>
            <p className="text-xs text-brand-brown/60 max-w-xl font-light leading-relaxed">
              Pusat monitoring studio eksklusif Anda. Daftarkan asana terapis baru, atur kapasitas ketersediaan matras, pantau pendapatan bulanan, dan kelola pemesanan tiket masuk peserta kelas Anda di sini.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 z-10">
            <Link href="/eo/events">
              <button className="px-5 py-3 bg-brand-sage hover:bg-brand-sagedark text-white text-xs font-bold rounded-2xl shadow-sm hover:translate-y-[-1px] transition-all focus:outline-none">
                Urus Sesi Event Anda
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
            title="Total Sesi Terdaftar"
            value={metrics.totalEvents}
            icon={Calendar}
            subtext="Semua kelas milik studio"
          />
          <DashboardCard
            title="Total Booking Masuk"
            value={metrics.totalBookings}
            icon={FileText}
            subtext="Mendaftarkan sesi Anda"
          />
          <DashboardCard
            title="Transaksi Lunas"
            value={metrics.totalPaidTransactions}
            icon={Receipt}
            subtext="Pendaftaran lunas"
          />
          <DashboardCard
            title="Estimasi Bagi Hasil"
            value={formatPrice(metrics.totalRevenue)}
            icon={TrendingUp}
            subtext="Pendapatan bersih lunas"
          />
        </div>

        {/* Layout Splitting */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Recent entries queue */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <h2 className="font-sans font-bold text-lg text-brand-brown">
                  Reservasi Kelas Anda
                </h2>
                <p className="text-[11px] text-brand-brown/50">Tiket masuk peserta terbaru yang mendaftarkan sesi studio Anda</p>
              </div>
              <Link href="/eo/bookings" className="text-xs font-bold text-brand-sage hover:text-brand-sagedark flex items-center gap-1">
                Selengkapnya <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white border border-brand-beige/50 rounded-3xl shadow-sm divide-y divide-brand-beige/10 overflow-hidden">
              {metrics.recentBookings.length === 0 ? (
                <div className="p-10 text-center">
                  <p className="text-xs text-brand-brown/40">Belum ada booking masuk untuk sesi studio Anda.</p>
                </div>
              ) : (
                metrics.recentBookings.map((b, idx) => (
                  <div key={idx} className="p-5 flex items-center justify-between gap-4 hover:bg-brand-cream/10 transition-colors">
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-brand-brown truncate">{b.customerName}</span>
                        <span className="text-[10px] font-mono text-brand-brown/40 shrink-0">#{b.bookingCode.substring(b.bookingCode.lastIndexOf('-') + 1)}</span>
                      </div>
                      <p className="text-[10px] text-brand-brown/50 truncate">WA Pelanggan: <span className="font-medium text-brand-brown/70">{b.customerPhone}</span></p>
                      <span className="text-[9px] text-brand-brown/40 font-mono block">{formatDate(b.createdAt)}</span>
                    </div>

                    <div className="text-right shrink-0 space-y-1">
                      <span className="text-xs font-extrabold text-brand-brown block">{formatPrice(b.totalPrice)}</span>
                      <span className={`inline-block px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded ${
                        b.status === 'paid' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-amber-50 text-amber-700 font-medium'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Stats shortcut */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="space-y-4">
              <h3 className="font-sans font-bold text-base text-brand-brown">Sesi Latihan Studio</h3>
              <div className="bg-white border border-brand-beige/50 rounded-3xl p-5 shadow-sm space-y-3">
                {metrics.totalEvents === 0 ? (
                  <p className="text-xs text-brand-brown/40 text-center py-4">Studio Anda belum mendaftarkan sesi asana apa pun.</p>
                ) : (
                  <div className="space-y-3.5">
                    <p className="text-xs text-brand-brown/75 leading-relaxed font-light">
                      Anda saat ini mengoperasikan <strong>{metrics.totalEvents} sesi</strong> asana aktif di Yoga Calendar Jakarta.
                    </p>
                    <div className="border-t border-brand-beige/30 pt-3">
                      <Link href="/eo/events/create" className="block text-center w-full bg-brand-sage hover:bg-brand-sagedark text-white font-bold text-xs py-3 rounded-2xl shadow-sm transition-all">
                        + Pasang Kelas Asana Baru
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 bg-brand-sage/5 rounded-3xl border border-brand-sage/10 space-y-2 text-brand-brown text-xs">
              <span className="text-[10px] uppercase font-bold text-brand-sage tracking-wider block">Kemitraan Standard Aman</span>
              <p className="font-light leading-relaxed">Seluruh rincian bagi hasil tiket didistribusikan secara berkala 1x24 jam setelah sesi yoga tereksekusi lunas. Silakan hubungi admin pusat di <strong>6281342531331</strong> apabila menemui ketidaksesuaian rekapitulasi.</p>
            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
