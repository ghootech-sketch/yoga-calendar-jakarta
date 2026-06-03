'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, Save, ArrowLeft, Plus, Trash2, Globe, FileText, 
  Clock, MapPin, DollarSign, Users, ShieldAlert, Heart
} from 'lucide-react';
import { OrganizerService } from '@/lib/organizers/organizer-service';
import { ExtendedEvent } from '@/lib/events/event-service';

interface EventFormProps {
  initialData?: ExtendedEvent | null;
  onSubmit: (data: any) => void;
  titleLabel: string;
  onCancelHref: string;
}

export default function EventForm({ initialData, onSubmit, titleLabel, onCancelHref }: EventFormProps) {
  const router = useRouter();
  const organizers = OrganizerService.getAllOrganizers();

  // Basic Form Fields
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [category, setCategory] = useState(initialData?.category || 'Hatha Yoga');
  const [description, setDescription] = useState(initialData?.description || '');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&h=800&fit=crop&q=80');
  const [startDate, setStartDate] = useState(initialData?.startDate || '2026-06-15');
  const [startTime, setStartTime] = useState(initialData?.startTime || '09:00');
  const [endTime, setEndTime] = useState(initialData?.endTime || '10:30');
  const [locationName, setLocationName] = useState(initialData?.locationName || '');
  const [locationAddress, setLocationAddress] = useState(initialData?.locationAddress || '');
  const [city, setCity] = useState(initialData?.city || 'Jakarta Selatan');
  const [price, setPrice] = useState(initialData?.price || 150000);
  const [quota, setQuota] = useState(initialData?.quota || 20);
  const [organizerId, setOrganizerId] = useState(initialData?.organizerId || 'org-1');
  const [status, setStatus] = useState(initialData?.status || 'draft');
  const [isHighlighted, setIsHighlighted] = useState(initialData?.isHighlighted || false);

  // Array Lists
  const [benefits, setBenefits] = useState<string[]>(initialData?.benefits || ['Instruktur bersertifikat RYT-200', 'Matras & props disediakan gratis']);
  const [requirements, setRequirements] = useState<string[]>(initialData?.requirements || ['Membawa botol minum pribadi (tumbler)', 'Datang 15 menit sebelum sesi dimulai']);

  // Slug generator helper
  useEffect(() => {
    if (!initialData) { // Only auto-slugify for new events
      const raw = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphas
        .trim()
        .replace(/\s+/g, '-'); // Replace spacing with hyphen
      const timer = setTimeout(() => {
        setSlug(raw);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [title, initialData]);

  const handleBenefitAdd = () => {
    setBenefits([...benefits, '']);
  };

  const handleBenefitChange = (index: number, val: string) => {
    const next = [...benefits];
    next[index] = val;
    setBenefits(next);
  };

  const handleBenefitRemove = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  const handleReqAdd = () => {
    setRequirements([...requirements, '']);
  };

  const handleReqChange = (index: number, val: string) => {
    const next = [...requirements];
    next[index] = val;
    setRequirements(next);
  };

  const handleReqRemove = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return alert('Judul kelas wajib diisi!');
    if (!slug.trim()) return alert('Slug wajib diisi!');
    if (!locationName.trim()) return alert('Tempat latihan wajib diisi!');
    
    // Find active organizer details
    const activeOrg = OrganizerService.getOrganizerById(organizerId);
    const organizerName = activeOrg ? activeOrg.organizerName : 'Yoga Calendar Jakarta Official';

    const payload = {
      title,
      slug,
      category,
      description,
      imageUrl,
      startDate,
      startTime,
      endTime,
      locationName,
      locationAddress,
      city,
      price: Number(price),
      quota: Number(quota),
      organizerId,
      organizerName,
      status,
      isHighlighted,
      benefits: benefits.filter(b => b.trim() !== ''),
      requirements: requirements.filter(r => r.trim() !== '')
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl bg-white border border-brand-beige/50 rounded-3xl p-6 sm:p-8 shadow-sm text-brand-brown">
      
      {/* Banner / Title segment */}
      <div className="flex items-center gap-3 border-b border-brand-beige/40 pb-5">
        <div className="p-2.5 bg-brand-cream text-brand-sage rounded-2xl">
          <Heart className="w-5 h-5 shrink-0" />
        </div>
        <div>
          <h2 className="font-sans font-bold text-lg leading-tight">{titleLabel}</h2>
          <p className="text-[11px] text-brand-brown/50">Lengkapi formulir registrasi kelas di bawah ini untuk didaftarkan ke platform.</p>
        </div>
      </div>

      {/* Grid Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        
        {/* Title input */}
        <div className="space-y-1.5 col-span-1 md:col-span-2">
          <label className="text-[10px] uppercase font-bold text-brand-brown/65 tracking-wider">Judul Kelas Yoga/Spiritual</label>
          <input
            type="text"
            required
            placeholder="Contoh: Morning Restorative Hatha Yoga"
            className="w-full px-4 py-3 bg-brand-cream/30 border border-brand-beige rounded-2xl focus:outline-none focus:ring-1 focus:ring-brand-sage focus:border-brand-sage transition-all"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Slug and Category */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-brand-brown/65 tracking-wider flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-brand-sage shrink-0" /> Slug Link Halaman
          </label>
          <input
            type="text"
            required
            placeholder="morning-restorative-hatha"
            className="w-full px-4 py-3 bg-brand-cream/30 border border-brand-beige rounded-2xl focus:outline-none focus:ring-1 focus:ring-brand-sage focus:border-brand-sage transition-all font-mono"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-brand-brown/65 tracking-wider">Kategori Latihan</label>
          <select
            className="w-full px-4 py-3 bg-brand-cream/20 border border-brand-beige rounded-2xl focus:outline-none focus:ring-1 focus:ring-brand-sage focus:border-brand-sage transition-all font-semibold"
            value={category}
            onChange={(e) => setCategory(e.target.value as 'Hatha Yoga' | 'Vinyasa Flow' | 'Prenatal Yoga' | 'Meditation' | 'Yoga & Sound' | 'Breathwork' | 'Sunset Yoga' | 'Yoga Therapeutic')}
          >
            <option value="Hatha Yoga">Hatha Yoga</option>
            <option value="Vinyasa Flow">Vinyasa Flow</option>
            <option value="Prenatal Yoga">Prenatal Yoga</option>
            <option value="Meditation">Meditation</option>
            <option value="Breathwork">Breathwork</option>
            <option value="Sound Healing">Sound Healing</option>
          </select>
        </div>

        {/* Date and Time */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-brand-brown/65 tracking-wider">Tanggal Sesi Selesai (YYYY-MM-DD)</label>
          <input
            type="date"
            required
            className="w-full px-4 py-3 bg-brand-cream/30 border border-brand-beige rounded-2xl focus:outline-none focus:ring-1 focus:ring-brand-sage focus:border-brand-sage transition-all font-medium"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-brand-brown/65 tracking-wider">Jam Mulai</label>
            <input
              type="text"
              required
              placeholder="08:00"
              className="w-full px-4 py-3 bg-brand-cream/30 border border-brand-beige rounded-2xl focus:outline-none focus:ring-1 focus:ring-brand-sage focus:border-brand-sage transition-all text-center"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-brand-brown/65 tracking-wider">Jam Selesai</label>
            <input
              type="text"
              required
              placeholder="09:30"
              className="w-full px-4 py-3 bg-brand-cream/30 border border-brand-beige rounded-2xl focus:outline-none focus:ring-1 focus:ring-brand-sage focus:border-brand-sage transition-all text-center"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        {/* Place and Location Address */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-brand-brown/65 tracking-wider flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-brand-sage shrink-0" /> Nama Studio / Venue
          </label>
          <input
            type="text"
            required
            placeholder="Wellness Sanctum Kemang"
            className="w-full px-4 py-3 bg-brand-cream/30 border border-brand-beige rounded-2xl focus:outline-none focus:ring-1 focus:ring-brand-sage focus:border-brand-sage transition-all"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-brand-brown/65 tracking-wider">Kota Administrasi (Jakarta)</label>
          <select
            className="w-full px-4 py-3 bg-brand-cream/20 border border-brand-beige rounded-2xl focus:outline-none focus:ring-1 focus:ring-brand-sage focus:border-brand-sage transition-all"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="Jakarta Selatan">Jakarta Selatan</option>
            <option value="Jakarta Pusat">Jakarta Pusat</option>
            <option value="Jakarta Utara">Jakarta Utara</option>
            <option value="Jakarta Barat">Jakarta Barat</option>
          </select>
        </div>

        <div className="space-y-1.5 col-span-1 md:col-span-2">
          <label className="text-[10px] uppercase font-bold text-brand-brown/65 tracking-wider">Alamat Lengkap Studio</label>
          <input
            type="text"
            required
            placeholder="Jl. Kemang Raya No. 12B, Bangka, Jakarta Selatan"
            className="w-full px-4 py-3 bg-brand-cream/30 border border-brand-beige rounded-2xl focus:outline-none focus:ring-1 focus:ring-brand-sage focus:border-brand-sage transition-all"
            value={locationAddress}
            onChange={(e) => setLocationAddress(e.target.value)}
          />
        </div>

        {/* Pricing, Quota & Image */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-brand-brown/65 tracking-wider flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-brand-sage shrink-0" /> Biaya Investasi Tiket (IDR)
          </label>
          <input
            type="number"
            required
            placeholder="150000"
            className="w-full px-4 py-3 bg-brand-cream/30 border border-brand-beige rounded-2xl focus:outline-none focus:ring-1 focus:ring-brand-sage focus:border-brand-sage transition-all font-semibold"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-brand-brown/65 tracking-wider flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-brand-sage shrink-0" /> Quota Kuursi / Matras
          </label>
          <input
            type="number"
            required
            placeholder="20"
            className="w-full px-4 py-3 bg-brand-cream/30 border border-brand-beige rounded-2xl focus:outline-none focus:ring-1 focus:ring-brand-sage focus:border-brand-sage transition-all text-center"
            value={quota}
            onChange={(e) => setQuota(Number(e.target.value))}
          />
        </div>

        {/* Cover Image */}
        <div className="space-y-1.5 col-span-1 md:col-span-2">
          <label className="text-[10px] uppercase font-bold text-brand-brown/65 tracking-wider">Tautan Gambar Cover Kelas</label>
          <input
            type="text"
            required
            placeholder="https://images.unsplash.com/photo-..."
            className="w-full px-4 py-3 bg-brand-cream/30 border border-brand-beige rounded-2xl focus:outline-none focus:ring-1 focus:ring-brand-sage focus:border-brand-sage transition-all font-mono"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        {/* Owner EO selection and Publish status */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-brand-brown/65 tracking-wider">Pemilik Kreator / EO Partner</label>
          <select
            className="w-full px-4 py-3 bg-brand-cream/20 border border-brand-beige rounded-2xl focus:outline-none focus:ring-1 focus:ring-brand-sage focus:border-brand-sage transition-all"
            value={organizerId}
            onChange={(e) => setOrganizerId(e.target.value)}
          >
            {organizers.map(org => (
              <option key={org.id} value={org.id}>{org.organizerName}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-brand-brown/65 tracking-wider">Status Publikasi</label>
          <select
            className="w-full px-4 py-3 bg-brand-cream/20 border border-brand-beige rounded-2xl focus:outline-none focus:ring-1 focus:ring-brand-sage focus:border-brand-sage transition-all font-bold"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
          >
            <option value="draft">DRAFT (Sembunyi dari Publik)</option>
            <option value="published">PUBLISHED (Aktif di Halaman Listing)</option>
            <option value="cancelled">CANCELLED (Sesi Dibatalkan)</option>
            <option value="completed">COMPLETED (Selesai)</option>
          </select>
        </div>

        {/* Description Textarea */}
        <div className="space-y-1.5 col-span-1 md:col-span-2">
          <label className="text-[10px] uppercase font-bold text-brand-brown/65 tracking-wider flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-brand-sage shrink-0" /> Deskripsi Kelas Secara Lengkap
          </label>
          <textarea
            required
            rows={5}
            placeholder="Tuliskan detail asana, filosofi kelas, rincian aktivitas latihan..."
            className="w-full px-4 py-3 bg-brand-cream/30 border border-brand-beige rounded-2xl focus:outline-none focus:ring-1 focus:ring-brand-sage focus:border-brand-sage transition-all font-light leading-relaxed"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Benefits lists config */}
        <div className="space-y-3 col-span-1 md:col-span-2 border-t border-brand-beige/40 pt-5">
          <div className="flex justify-between items-center text-[10px] uppercase font-bold text-brand-brown/65 tracking-wider">
            <span>Fasilitas & Keuntungan Peserta</span>
            <button
              type="button"
              onClick={handleBenefitAdd}
              className="px-2 py-1 text-[9px] font-bold bg-brand-sage text-white rounded-md flex items-center gap-1 hover:bg-brand-sagedark transition-all focus:outline-none"
            >
              <Plus className="w-3 h-3" /> Tambah Deskripsi
            </button>
          </div>
          <div className="space-y-2">
            {benefits.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Contoh: Voucher diskon teh hangat"
                  className="w-full px-3 py-2 bg-brand-cream/30 border border-brand-beige rounded-xl focus:outline-none"
                  value={item}
                  onChange={(e) => handleBenefitChange(index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => handleBenefitRemove(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                >
                  <Trash2 className="w-4 h-4 shrink-0" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements lists config */}
        <div className="space-y-3 col-span-1 md:col-span-2 border-t border-brand-beige/40 pt-5">
          <div className="flex justify-between items-center text-[10px] uppercase font-bold text-brand-brown/65 tracking-wider">
            <span>Syarat & Persiapan Mengikuti Kelas</span>
            <button
              type="button"
              onClick={handleReqAdd}
              className="px-2 py-1 text-[9px] font-bold bg-brand-sage text-white rounded-md flex items-center gap-1 hover:bg-brand-sagedark transition-all focus:outline-none"
            >
              <Plus className="w-3 h-3" /> Tambah Aturan
            </button>
          </div>
          <div className="space-y-2">
            {requirements.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Contoh: Sangat disarankan memiliki dasar asana sederhana"
                  className="w-full px-3 py-2 bg-brand-cream/30 border border-brand-beige rounded-xl focus:outline-none"
                  value={item}
                  onChange={(e) => handleReqChange(index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => handleReqRemove(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                >
                  <Trash2 className="w-4 h-4 shrink-0" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Button Row */}
      <div className="border-t border-brand-beige/40 pt-6 flex flex-col sm:flex-row justify-end items-center gap-3">
        <button
          type="button"
          onClick={() => router.push(onCancelHref)}
          className="w-full sm:w-auto px-5 py-3 text-xs font-bold bg-transparent text-brand-brown hover:bg-brand-cream rounded-2xl border border-brand-beige"
        >
          Batal & Kembali
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 text-xs font-bold bg-brand-sage hover:bg-brand-sagedark text-white rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-all hover:translate-y-[-1.5px]"
        >
          <Save className="w-4 h-4" /> Simpan Data Sesi
        </button>
      </div>

    </form>
  );
}


