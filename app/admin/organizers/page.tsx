'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Edit2, ShieldAlert, CheckCircle, XCircle, 
  Trash, Save, X, Phone, Mail, UserCheck, Sparkles
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DataTable from '@/components/dashboard/DataTable';
import { OrganizerService } from '@/lib/organizers/organizer-service';
import { Organizer } from '@/lib/organizers/organizer-types';
import { formatDate } from '@/lib/utils';

export default function AdminOrganizersPage() {
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Single-view Editor State
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Editor Fields
  const [organizerName, setOrganizerName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
      setOrganizers(OrganizerService.getAllOrganizers());
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setOrganizerName('');
    setContactName('');
    setEmail('');
    setPhone('');
    setDescription('');
    setStatus('active');
    setEditorOpen(true);
  };

  const handleOpenEdit = (org: Organizer) => {
    setEditingId(org.id);
    setOrganizerName(org.organizerName);
    setContactName(org.contactName);
    setEmail(org.email);
    setPhone(org.phone);
    setDescription(org.description);
    setStatus(org.status);
    setEditorOpen(true);
  };

  const handleToggleStatus = (id: string) => {
    OrganizerService.toggleOrganizerStatus(id);
    setOrganizers(OrganizerService.getAllOrganizers());
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!organizerName.trim() || !contactName.trim() || !email.trim()) {
      alert('Nama studio, nama kontak, dan email wajib diisi!');
      return;
    }

    const payload = {
      organizerName,
      contactName,
      email,
      phone,
      description,
      status
    };

    if (editingId) {
      OrganizerService.updateOrganizer(editingId, payload);
    } else {
      OrganizerService.createOrganizer(payload);
    }

    setOrganizers(OrganizerService.getAllOrganizers());
    setEditorOpen(false);
    setEditingId(null);
  };

  const searchFilter = (item: Organizer, query: string): boolean => {
    const q = query.toLowerCase();
    return (
      item.organizerName.toLowerCase().includes(q) ||
      item.contactName.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q)
    );
  };

  if (!isHydrated) {
    return (
      <DashboardLayout activeRole="ADMIN">
        <div className="flex h-64 items-center justify-center">
          <p className="text-brand-brown animate-pulse font-semibold">Memuat database kemitraan...</p>
        </div>
      </DashboardLayout>
    );
  }

  const tableHeaders = ['Detail Mitra / Studio', 'Penanggung Jawab', 'Info Kontak', 'Status Aktif', 'Terdaftar Pada', 'Opsi'];

  return (
    <DashboardLayout activeRole="ADMIN">
      <div className="space-y-6">
        
        {/* Banner area */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-sans font-extrabold text-2xl text-brand-brown tracking-tight">
              Manajemen Kemitraan EO / Studio
            </h1>
            <p className="text-xs text-brand-brown/60 font-light">
              Daftarkan studio kebugaran luar, atur hak rujukan terbit, dan hubungi koordinator instansi partner secara terpadu.
            </p>
          </div>
          {!editorOpen && (
            <button
              onClick={handleOpenCreate}
              className="px-5 py-3 bg-brand-sage hover:bg-brand-sagedark text-white text-xs font-bold rounded-2xl shadow-sm flex items-center gap-2 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" /> Tambah Mitra Baru
            </button>
          )}
        </div>

        {/* Inline Drawer Editor View (Toggled) */}
        {editorOpen && (
          <div className="bg-white border-2 border-brand-sage/20 rounded-3xl p-6 sm:p-8 shadow-md space-y-5 animate-fade-in text-brand-brown">
            <div className="flex justify-between items-center border-b border-brand-beige/50 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-sage" />
                <h2 className="font-sans font-bold text-base">
                  {editingId ? 'Edit Rincian Kemitraan' : 'Daftarkan Mitra / EO Studio Baru'}
                </h2>
              </div>
              <button 
                onClick={() => setEditorOpen(false)}
                className="p-1 px-1.5 hover:bg-brand-cream/50 rounded-lg text-brand-brown/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-brand-brown/60">Nama Studio / EO Partner</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Jakarta Yoga Center"
                  className="w-full px-4 py-3 bg-brand-cream/30 border border-brand-beige rounded-2xl focus:outline-none focus:ring-1 focus:ring-brand-sage"
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-brand-brown/60">Nama Koordinator / PIC</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-4 py-3 bg-brand-cream/30 border border-brand-beige rounded-2xl focus:outline-none focus:ring-1 focus:ring-brand-sage"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-brand-brown/60">Alamat Email Koordinator</label>
                <input
                  type="email"
                  required
                  placeholder="budi@jakartayoga.com"
                  className="w-full px-4 py-3 bg-brand-cream/30 border border-brand-beige rounded-2xl focus:outline-none focus:ring-1 focus:ring-brand-sage"
                  value={email}
                  disabled={editingId !== null} // Prevents key discrepancies for mock auth login
                  onChange={(e) => setEmail(e.target.value)}
                />
                {!editingId && <p className="text-[9px] text-brand-brown/40 italic">* Email ini nanti bisa dipakai EO untuk masuk ke Dashboard EO (Pass default: eo123).</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-brand-brown/60">Nomor WhatsApp Koordinator</label>
                <input
                  type="tel"
                  placeholder="628123456789"
                  className="w-full px-4 py-3 bg-brand-cream/30 border border-brand-beige rounded-2xl focus:outline-none"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-brand-brown/60">Kemitraan Status</label>
                <select
                  className="w-full px-4 py-3 bg-brand-cream/20 border border-brand-beige rounded-2xl focus:outline-none"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                >
                  <option value="active">Active (Aktif Beroperasi)</option>
                  <option value="inactive">Inactive (Ditangguhkan Sementara)</option>
                </select>
              </div>

              <div className="space-y-1.5 col-span-1 md:col-span-2">
                <label className="text-[10px] uppercase font-bold tracking-wider text-brand-brown/60">Profil Singkat Deskripsi Studio</label>
                <textarea
                  rows={3}
                  placeholder="Ceritakan latar belakang asana, sertifikasi instruktur, atau fokus kesehatan batin partner..."
                  className="w-full px-4 py-3 bg-brand-cream/30 border border-brand-beige rounded-2xl focus:outline-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="col-span-1 md:col-span-2 flex justify-end gap-2.5 pt-3 border-t border-brand-beige/35">
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="px-4 py-2.5 text-xs text-brand-brown border border-brand-beige rounded-xl hover:bg-brand-cream hover:text-brand-brown"
                >
                  Urungkan
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs bg-brand-sage hover:bg-brand-sagedark text-white font-bold rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Simpan Mitra
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Database Grid */}
        <DataTable<Organizer>
          data={organizers}
          headers={tableHeaders}
          searchPlaceholder="Cari nama studio, nama PIC, alamat email..."
          searchFilter={searchFilter}
          emptyMessage="Belum ada kemitraan studio terdaftar."
          renderDesktopRow={(org, idx) => (
            <tr key={org.id} className="hover:bg-brand-cream/10 transition-colors text-xs text-brand-brown">
              <td className="px-6 py-4 max-w-xs">
                <div className="space-y-1">
                  <p className="font-bold text-brand-brown text-sm leading-tight">{org.organizerName}</p>
                  <p className="text-[10px] text-brand-brown/50 font-light line-clamp-1">{org.description || 'Tidak ada profil tambahan.'}</p>
                </div>
              </td>
              <td className="px-6 py-4 font-semibold text-brand-brown">
                {org.contactName}
              </td>
              <td className="px-6 py-4">
                <div className="space-y-0.5 text-[10px] text-brand-brown/65">
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-brand-sage" /> {org.email}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-brand-sage" /> {org.phone}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleToggleStatus(org.id)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-md border focus:outline-none transition-all ${
                    org.status === 'active' 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                  title="Klik untuk mengubah status aktif"
                >
                  {org.status === 'active' ? (
                    <>
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 text-rose-600" />
                      Inactive
                    </>
                  )}
                </button>
              </td>
              <td className="px-6 py-4 text-[10px] text-brand-brown/50">
                {formatDate(org.createdAt)}
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleOpenEdit(org)}
                  className="p-2 border border-brand-beige rounded-xl text-blue-600 hover:bg-blue-50 transition-all"
                  title="Edit Rincian Mitra"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          )}
          renderMobileCard={(org, idx) => (
            <div key={org.id} className="bg-white border border-brand-beige/50 rounded-2xl p-4.5 space-y-3.5 text-xs text-brand-brown">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h3 className="font-bold text-sm tracking-tight text-brand-brown">{org.organizerName}</h3>
                  <span className="text-[10px] text-brand-brown/60">PIC: {org.contactName}</span>
                </div>
                <button
                  onClick={() => handleToggleStatus(org.id)}
                  className={`px-2.5 py-1 text-[8px] font-extrabold uppercase rounded ${
                    org.status === 'active' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-850'
                  }`}
                >
                  {org.status}
                </button>
              </div>

              <div className="space-y-1 text-[10px] text-brand-brown/65 bg-brand-cream/30 p-2.5 rounded-xl border border-brand-beige/20 select-all">
                <p>Email: {org.email}</p>
                <p>WA: {org.phone}</p>
              </div>

              <div className="flex justify-end pt-1 border-t border-brand-beige/10">
                <button
                  onClick={() => handleOpenEdit(org)}
                  className="px-3.5 py-1.5 border border-brand-beige rounded-lg text-blue-600 font-bold flex items-center gap-1 hover:bg-blue-50"
                >
                  <Edit2 className="w-3 h-3" /> Edit Profil
                </button>
              </div>
            </div>
          )}
        />

      </div>
    </DashboardLayout>
  );
}
