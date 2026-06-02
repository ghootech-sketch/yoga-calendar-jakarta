'use client';

import React, { useState } from 'react';
import { Settings, Save, Sparkles, Shield, Bell, Database } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function AdminSettingsPage() {
  const [platformName, setPlatformName] = useState('Yoga Calendar Jakarta');
  const [contactWa, setContactWa] = useState('6281342531331');
  const [currency, setCurrency] = useState('IDR');
  const [emailSender, setEmailSender] = useState('noreply@yogacalendarjakarta.com');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Konfigurasi pengaturan platform berhasil disimpan (Mock System).');
  };

  return (
    <DashboardLayout activeRole="ADMIN">
      <div className="space-y-6 max-w-3xl">
        
        {/* Banner Area */}
        <div>
          <h1 className="font-sans font-extrabold text-2xl text-brand-brown tracking-tight">
            Konfigurasi Sistem Platform
          </h1>
          <p className="text-xs text-brand-brown/60 font-light">
            Atur parameter dasar, integrasi notifikasi whatsapp default, rincian mata uang pembayaran, maupun kredensial penyuratan digital.
          </p>
        </div>

        {/* Dashboard setup form card */}
        <form onSubmit={handleSave} className="bg-white border border-brand-beige/50 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-brand-brown">
          <div className="flex items-center gap-3 border-b border-brand-beige/40 pb-4">
            <div className="p-2.5 bg-brand-cream text-brand-sage rounded-2xl">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Pengaturan Aplikasi Utama</h2>
              <p className="text-[10px] text-brand-brown/50">Sesuaikan metadata dan integrasi sandbox platform.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-brand-brown/60">Nama Platform</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-brand-cream/30 border border-brand-beige rounded-2xl focus:outline-none"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-brand-brown/60">Nomor WhatsApp Pusat Layanan</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-brand-cream/30 border border-brand-beige rounded-2xl focus:outline-none"
                value={contactWa}
                onChange={(e) => setContactWa(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-brand-brown/60">Mata Uang Pengantar</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-brand-cream/30 border border-brand-beige rounded-2xl focus:outline-none"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-brand-brown/60">Sender Email Notifikasi Mock</label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-brand-cream/30 border border-brand-beige rounded-2xl focus:outline-none"
                value={emailSender}
                onChange={(e) => setEmailSender(e.target.value)}
              />
            </div>
          </div>

          {/* Dev credentials alerts */}
          <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl space-y-2 text-brand-brown/80 text-xs">
            <p className="font-bold text-amber-850 flex items-center gap-1"><Shield className="w-4 h-4 shrink-0 text-amber-600" /> Mode Pengembangan Bersertifikat</p>
            <p className="text-[11px] font-light leading-relaxed">Penyimpanan konfigurasi utama saat ini dilaunching menggunakan Local Storage sandbox. Modifikasi database statis dapat diganti dengan penyedia postgreSQL atau Google Firestore setelah perancangan Phase 3 tereksekusi penuh.</p>
          </div>

          <div className="pt-4 border-t border-brand-beige/40 flex justify-end">
            <button
              type="submit"
              className="px-5 py-3 text-xs font-bold bg-brand-sage hover:bg-brand-sagedark text-white rounded-2xl shadow-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Simpan Pengaturan
            </button>
          </div>
        </form>

      </div>
    </DashboardLayout>
  );
}
