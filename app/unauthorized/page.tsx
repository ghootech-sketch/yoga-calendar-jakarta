'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';
import { MockAuthService } from '@/lib/auth/mock-auth';

export default function UnauthorizedPage() {
  const handleLogoutRedirect = () => {
    MockAuthService.logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream text-brand-charcoal overflow-x-hidden selection:bg-brand-sage/20 selection:text-brand-brown">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-32 md:py-40">
        <div className="w-full max-w-md bg-white rounded-3xl border border-brand-beige/60 p-8 shadow-xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-red-500"></div>

          <div className="p-4 bg-red-50 text-red-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="font-sans font-bold text-2xl text-brand-brown tracking-tight">
              Akses Ditolak
            </h1>
            <p className="text-sm text-brand-brown/70 leading-relaxed font-light">
              Maaf, Anda tidak memiliki izin otorisasi untuk mengakses halaman manajemen terpilih ini. Silakan masuk menggunakan kredensial yang tepat.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-3">
            <Link href="/" className="flex-1 focus:outline-none">
              <Button variant="outline" className="w-full text-brand-brown border-brand-brown/10 flex items-center justify-center gap-1.5 py-3">
                <Home className="w-4 h-4" />
                Beranda
              </Button>
            </Link>
            <button
              onClick={handleLogoutRedirect}
              className="flex-1 focus:outline-none bg-brand-sage hover:bg-brand-sagedark text-white font-bold text-sm tracking-wide rounded-full py-3 hover:translate-y-[-1px] transition-all"
            >
              Ubah Akun Login
            </button>
          </div>
          
          <p className="text-[10px] text-brand-brown/40 italic">
            * Simulasi Multi-Role: Admin hanya dapat mengakses /admin dan EO hanya dapat mengakses /eo.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
