'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, AlertCircle, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';
import { MockAuthService } from '@/lib/auth/mock-auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
      // If already logged in, redirect to appropriate dashboard
      const session = MockAuthService.getCurrentSession();
      if (session) {
        if (session.role === 'ADMIN') {
          router.replace('/admin/dashboard');
        } else if (session.role === 'EO') {
          router.replace('/eo/dashboard');
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Email dan password wajib diisi');
      return;
    }

    setLoading(true);

    // Simulate small latency for UX feel
    setTimeout(() => {
      const result = MockAuthService.login(email, password);
      setLoading(false);

      if (result.success && result.session) {
        if (result.session.role === 'ADMIN') {
          router.replace('/admin/dashboard');
        } else if (result.session.role === 'EO') {
          router.replace('/eo/dashboard');
        }
      } else {
        setError(result.error || 'Autentikasi gagal');
      }
    }, 800);
  };

  const handleFillMock = (role: 'ADMIN' | 'EO') => {
    if (role === 'ADMIN') {
      setEmail('admin@yogacalendarjakarta.com');
      setPassword('admin123');
    } else {
      setEmail('eo@yogacalendarjakarta.com');
      setPassword('eo123');
    }
    setError('');
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-brand-sage" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream text-brand-charcoal overflow-x-hidden selection:bg-brand-sage/20 selection:text-brand-brown">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-32 md:py-40">
        <div className="w-full max-w-md bg-white rounded-3xl border border-brand-beige/60 p-8 shadow-xl space-y-8 relative overflow-hidden">
          
          {/* Accent decoration */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-sage/60"></div>

          {/* Title Area */}
          <div className="flex flex-col items-center text-center space-y-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-brand-brown/50 hover:text-brand-sage transition-colors mb-2 focus:outline-none"
            >
              <ArrowLeft className="w-3 h-3" /> Kembali ke Beranda
            </Link>
            
            <div className="p-3 bg-brand-sage/10 text-brand-sage rounded-full mb-1">
              <Sparkles className="w-6 h-6" />
            </div>

            <h1 className="font-sans font-bold text-2xl text-brand-brown tracking-tight">
              Portal Penyelenggara
            </h1>
            <p className="text-xs text-brand-brown/60 max-w-xs font-light">
              Gunakan kredensial mock untuk login ke dashboard Admin atau partner EO untuk simulasi sistem.
            </p>
          </div>

          {/* Alert View */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl flex items-start gap-2.5 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-brand-brown/60 tracking-wider">
                Alamat Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-brown/40">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-3 bg-brand-cream/40 border border-brand-beige rounded-2xl text-sm text-brand-brown placeholder:text-brand-brown/30 focus:outline-none focus:ring-1 focus:ring-brand-sage focus:border-brand-sage transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-brand-brown/60 tracking-wider">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-brown/40">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-4 py-3 bg-brand-cream/40 border border-brand-beige rounded-2xl text-sm text-brand-brown placeholder:text-brand-brown/30 focus:outline-none focus:ring-1 focus:ring-brand-sage focus:border-brand-sage transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="accent"
              className="w-full py-3.5 font-bold shadow-md flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  Memproses Masuk...
                </>
              ) : (
                'Masuk Dashboard'
              )}
            </Button>
          </form>

          {/* Quick Mock Login Area */}
          <div className="border-t border-brand-beige/50 pt-5 space-y-3.5">
            <p className="text-[10px] font-bold text-brand-brown/45 uppercase tracking-widest text-center">
              PILIH INTEGRASI AKUN MOCK (PROTOTYPE)
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleFillMock('ADMIN')}
                className="p-3 bg-brand-brown/5 hover:bg-brand-brown/10 text-brand-brown border border-brand-brown/5 rounded-2xl text-[11px] font-semibold transition-all flex flex-col items-center gap-0.5"
              >
                <span className="text-brand-sage font-bold">Admin Portal</span>
                <span className="text-[9px] text-brand-brown/60 font-light">admin123</span>
              </button>
              <button
                type="button"
                onClick={() => handleFillMock('EO')}
                className="p-3 bg-brand-brown/5 hover:bg-brand-brown/10 text-brand-brown border border-brand-brown/5 rounded-2xl text-[11px] font-semibold transition-all flex flex-col items-center gap-0.5"
              >
                <span className="text-brand-sage font-bold">EO Partner</span>
                <span className="text-[9px] text-brand-brown/60 font-light">eo123</span>
              </button>
            </div>
          </div>

          {/* Pre-production disclaimer comment in markup */}
          <p className="text-[9px] text-brand-brown/40 text-center italic mt-2">
            * Mode demonstrasi. Pengamanan session ini adalah mock localStorage untuk keperluan prototype dan uji kelayakan flow sebelum integrasi standard Auth.js.
          </p>

        </div>
      </main>

      <Footer />
    </div>
  );
}
