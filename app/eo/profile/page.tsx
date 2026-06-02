'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UserCheck, Save, Mail, Phone, FileText, Landmark, 
  Sparkles, CheckCircle2, ShieldAlert
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { OrganizerService } from '@/lib/organizers/organizer-service';
import { Organizer } from '@/lib/organizers/organizer-types';
import { MockAuthService } from '@/lib/auth/mock-auth';

export default function EOProfilePage() {
  const router = useRouter();
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Editable fields state
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [saveStatus, setSaveStatus] = useState<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
      const session = MockAuthService.getCurrentSession();
      if (!session) {
        router.replace('/login');
        return;
      }

      const org = OrganizerService.getOrganizerByEmail(session.email);
      if (org) {
        setOrganizer(org);
        setContactName(org.contactName);
        setPhone(org.phone);
        setDescription(org.description || '');
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizer) return;

    try {
      const payload = {
        contactName,
        phone,
        description
      };
      
      const updated = OrganizerService.updateOrganizer(organizer.id, payload);
      if (updated) {
        setOrganizer(updated);
        // Display quick success message
        setSaveStatus({ success: true, text: 'Profil studio Anda berhasil diperbarui!' });
        setTimeout(() => setSaveStatus(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setSaveStatus({ success: false, text: 'Gagal memperbarui profil. Keterangan eror terekam di log debug.' });
    }
  };

  if (!isHydrated || !organizer) {
    return (
      <DashboardLayout activeRole="EO">
        <div className="flex h-64 items-center justify-center">
          <p className="text-brand-brown animate-pulse font-medium">Melaraskan detail studio...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeRole="EO">
      <div className="space-y-6 max-w-3xl">
        
        {/* Banner area */}
        <div>
          <h1 className="font-sans font-extrabold text-2xl text-brand-brown tracking-tight">
            Profil Studio & Kemitraan EO
          </h1>
          <p className="text-xs text-brand-brown/60 font-light">
            Perbarui detail profil, rincian narasi pengantar, koordinator penanggung jawab, dan nomor telepon kontak yang tercantum pada materi sesi kelas publik Anda.
          </p>
        </div>

        {/* Info alerts */}
        {saveStatus && (
          <div className={`p-4 border rounded-2xl flex items-start gap-2 text-xs transition-all ${
            saveStatus.success 
              ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
              : 'bg-rose-50 border-rose-105 text-rose-800'
          }`}>
            {saveStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" /> : <ShieldAlert className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />}
            <span>{saveStatus.text}</span>
          </div>
        )}

        {/* Custom Edit forms card */}
        <form onSubmit={handleSubmit} className="bg-white border border-brand-beige/50 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-brand-brown">
          
          <div className="flex items-center gap-3 border-b border-brand-beige/40 pb-4">
            <div className="p-2.5 bg-brand-cream text-brand-sage rounded-2xl">
              <UserCheck className="w-5 h-5 shrink-0" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Rincian Keanggotaan Partner</h2>
              <p className="text-[10px] text-brand-brown/50">Detail profil verifikasi mitra.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            
            {/* Locked Name & Email inputs */}
            <div className="space-y-1.5 p-4 bg-brand-cream/40 border border-brand-beige/30 rounded-2xl">
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-brand-brown/40 block">Nama Studio (LOCKED)</span>
              <p className="font-bold text-sm text-brand-brown mt-1.5">{organizer.organizerName}</p>
              <p className="text-[9px] text-brand-brown/40 mt-1 italic leading-none">* Hubungi admin utama jika ingin mengubah nama legal.</p>
            </div>

            <div className="space-y-1.5 p-4 bg-brand-cream/40 border border-brand-beige/30 rounded-2xl">
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-brand-brown/40 block">Email Koordinator (LOCKED)</span>
              <p className="font-mono font-bold text-xs text-brand-sage mt-2">{organizer.email}</p>
              <p className="text-[9px] text-brand-brown/40 mt-1 italic leading-none">* Dipakai sebagai username masuk portal partner.</p>
            </div>

            {/* Editable Fields */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-brand-brown/60">Nama Koordinator Lapangan (PIC)</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-brand-cream/30 border border-brand-beige rounded-2xl focus:outline-none"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-brand-brown/60">WhatsApp Koordinator Lapangan</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-brown/40">
                  <Phone className="w-3.5 h-3.5" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="628123456789"
                  className="w-full pl-9 pr-4 py-3 bg-brand-cream/30 border border-brand-beige rounded-2xl focus:outline-none focus:ring-1 focus:ring-brand-sage"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5 col-span-1 sm:col-span-2">
              <label className="text-[10px] uppercase font-bold tracking-wider text-brand-brown/60">Profil Narasi Pengantar Singkat Studio</label>
              <textarea
                rows={4}
                required
                placeholder="Ceritakan latar belakang asana, keunikan matras, meditasi restoratif, atau lisensi instruktur studio Anda..."
                className="w-full px-4 py-3 bg-brand-cream/30 border border-brand-beige rounded-2xl focus:outline-none leading-relaxed font-light"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

          </div>

          <div className="pt-4 border-t border-brand-beige/40 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 text-xs font-bold bg-brand-sage hover:bg-brand-sagedark text-white rounded-2xl shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Simpan Profil Partner
            </button>
          </div>

        </form>

      </div>
    </DashboardLayout>
  );
}
