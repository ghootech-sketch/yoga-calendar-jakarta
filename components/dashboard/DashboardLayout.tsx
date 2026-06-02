'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Sparkles, LayoutDashboard, Calendar, FileText, Landmark, Users, Settings, 
  LogOut, Menu, X, UserCheck, BarChart4, ArrowLeftRight, Compass
} from 'lucide-react';
import { MockAuthService } from '@/lib/auth/mock-auth';

interface SidebarItem {
  label: string;
  href: string;
  icon: any;
  roles: ('ADMIN' | 'EO')[];
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  // Admin Items
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, roles: ['ADMIN'] },
  { label: 'Kelola Event', href: '/admin/events', icon: Calendar, roles: ['ADMIN'] },
  { label: 'Highlight Pilihan', href: '/admin/highlights', icon: Compass, roles: ['ADMIN'] },
  { label: 'Daftar Booking', href: '/admin/bookings', icon: FileText, roles: ['ADMIN'] },
  { label: 'Transaksi Pembayaran', href: '/admin/transactions', icon: ArrowLeftRight, roles: ['ADMIN'] },
  { label: 'Kemitraan EO', href: '/admin/organizers', icon: Users, roles: ['ADMIN'] },
  { label: 'Pengaturan', href: '/admin/settings', icon: Settings, roles: ['ADMIN'] },

  // EO Items
  { label: 'Dashboard EO', href: '/eo/dashboard', icon: BarChart4, roles: ['EO'] },
  { label: 'Event Saya', href: '/eo/events', icon: Calendar, roles: ['EO'] },
  { label: 'Booking Sesi', href: '/eo/bookings', icon: FileText, roles: ['EO'] },
  { label: 'Profil Studio', href: '/eo/profile', icon: UserCheck, roles: ['EO'] },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeRole: 'ADMIN' | 'EO';
}

export default function DashboardLayout({ children, activeRole }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<any>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
      const curr = MockAuthService.getCurrentSession();
      if (!curr) {
        router.replace('/login');
        return;
      }
      
      // Check role authority
      if (curr.role !== activeRole) {
        router.replace('/unauthorized');
        return;
      }
      setSession(curr);
    }, 0);
    return () => clearTimeout(timer);
  }, [router, activeRole]);

  const handleLogout = () => {
    MockAuthService.logout();
    window.location.href = '/login';
  };

  if (!isHydrated || !session) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-brand-sage/30 border-t-brand-sage rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-brand-brown/50 font-medium tracking-wide">Validasi Otorisasi...</p>
        </div>
      </div>
    );
  }

  const menuItems = SIDEBAR_ITEMS.filter(item => item.roles.includes(session.role));

  return (
    <div className="min-h-screen bg-brand-cream/40 flex flex-col font-sans text-brand-charcoal overflow-x-hidden">
      
      {/* GLOBAL BANNER PRE-PRODUCTION MOCK */}
      <div className="w-full bg-brand-sage/10 border-b border-brand-sage/20 px-4 py-2 text-center text-[10px] font-medium text-brand-brown tracking-wide flex items-center justify-center gap-1.5 shrink-0 select-none">
        <Sparkles className="w-3.5 h-3.5 text-brand-sage animate-pulse" />
        <span>Pre-production Prototype Active — Mock Sandbox Mode</span>
      </div>

      <div className="flex-1 flex relative">
        
        {/* DESKTOP SIDEBAR PANEL */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-brand-beige/50 shrink-0 sticky top-0 h-[calc(100vh-37px)] p-6 z-20">
          
          {/* Platform Identity */}
          <div className="flex items-center gap-2.5 pb-6 border-b border-brand-beige/40">
            <div className="p-2 bg-brand-sage/10 text-brand-sage rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-sm text-brand-brown tracking-tight">YOGA CALENDAR</p>
              <p className="text-[10px] uppercase font-bold text-brand-sage tracking-wider">Jakarta Portal</p>
            </div>
          </div>

          {/* User Account Capsule */}
          <div className="mt-6 p-4 bg-brand-cream/60 border border-brand-beige/40 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-sage/20 text-brand-sage font-bold text-xs flex items-center justify-center">
              {session.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-brand-brown truncate">{session.name}</p>
              <span className="inline-block px-2 py-0.5 mt-0.5 text-[8px] font-bold tracking-widest uppercase rounded bg-brand-sage text-white">
                {session.role}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 mt-8 space-y-1.5 overflow-y-auto">
            {menuItems.map((item, idx) => {
              const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              const IconComp = item.icon;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all ${
                    active 
                      ? 'bg-brand-sage text-white shadow-sm' 
                      : 'text-brand-brown/70 hover:text-brand-sage hover:bg-brand-cream/50'
                  }`}
                >
                  <IconComp className="w-4 h-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer Logout */}
          <div className="pt-4 border-t border-brand-beige/40">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-red-600 hover:bg-red-50 transition-all text-left focus:outline-none"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Keluar Portal
            </button>
          </div>
        </aside>

        {/* MOBILE OVERLAY NAVIGATION FOR MENU PANEL */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-brand-charcoal/30 backdrop-blur-sm z-45 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* MOBILE DRAWER CONTAINER */}
        <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-brand-beige/50 p-6 flex flex-col z-50 transform transition-transform duration-300 lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex items-center justify-between pb-6 border-b border-brand-beige/40">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-sage" />
              <p className="font-extrabold text-sm text-brand-brown tracking-tight">YOGA CALENDAR</p>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 rounded-full text-brand-brown/50 hover:bg-brand-cream"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-5 p-3.5 bg-brand-cream/60 border border-brand-beige/40 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-sage/20 text-brand-sage font-bold text-xs flex items-center justify-center shrink-0">
              {session.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-brand-brown truncate">{session.name}</p>
              <span className="text-[7px] font-bold tracking-widest uppercase bg-brand-sage text-white px-1.5 py-0.5 rounded">
                {session.role}
              </span>
            </div>
          </div>

          <nav className="flex-1 mt-6 space-y-1 overflow-y-auto">
            {menuItems.map((item, idx) => {
              const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              const IconComp = item.icon;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all ${
                    active 
                      ? 'bg-brand-sage text-white shadow-sm' 
                      : 'text-brand-brown/70 hover:text-brand-sage hover:bg-brand-cream/50'
                  }`}
                >
                  <IconComp className="w-4 h-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-brand-beige/40">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-red-600 hover:bg-red-50 transition-all text-left focus:outline-none"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Keluar Portal
            </button>
          </div>
        </aside>

        {/* PRIMARY WORKSPACE CONTENT */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          
          {/* MOBILE NAVIGATION BAR / TOPBAR */}
          <header className="lg:hidden h-16 bg-white border-b border-brand-beige/40 px-4 flex items-center justify-between sticky top-0 z-30 shadow-sm shrink-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-brand-brown/80 rounded-xl hover:bg-brand-cream focus:outline-none"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-sage" />
              <span className="font-extrabold text-xs text-brand-brown tracking-tight">PORTAL {session.role}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-brand-sage/20 text-brand-sage font-bold text-xs flex items-center justify-center">
              {session.name.substring(0, 2).toUpperCase()}
            </div>
          </header>

          {/* MAIN PAGE BODY VIEW */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>

      </div>
    </div>
  );
}
