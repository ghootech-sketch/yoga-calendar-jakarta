import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi | Yoga Calendar Jakarta',
  description: 'Kebijakan privasi Yoga Calendar Jakarta mengenai pengumpulan dan penggunaan data pengguna.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-cream text-brand-charcoal">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24">
        <div className="space-y-2 mb-10">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-widest uppercase text-brand-sage bg-brand-sage/10 rounded-full">
            Legal
          </span>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-brand-brown tracking-tight">
            Kebijakan Privasi
          </h1>
          <p className="text-sm text-brand-brown/50">Terakhir diperbarui: Juni 2026</p>
        </div>

        <div className="prose prose-sm max-w-none space-y-8 text-brand-brown/80 leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-bold text-lg text-brand-brown">1. Informasi yang Kami Kumpulkan</h2>
            <p>Saat Anda melakukan reservasi kelas melalui platform Yoga Calendar Jakarta, kami mengumpulkan informasi yang Anda berikan secara langsung, termasuk nama lengkap, alamat email aktif, dan nomor WhatsApp untuk keperluan konfirmasi booking dan komunikasi kelas.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-bold text-lg text-brand-brown">2. Penggunaan Informasi</h2>
            <p>Informasi yang dikumpulkan digunakan semata-mata untuk memproses reservasi kelas, mengirimkan konfirmasi e-ticket, serta memberikan informasi jadwal dan perubahan kelas yang relevan. Kami tidak menjual atau membagikan data pribadi Anda kepada pihak ketiga tanpa persetujuan Anda.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-bold text-lg text-brand-brown">3. Keamanan Data</h2>
            <p>Kami berkomitmen menjaga keamanan data pribadi Anda dengan menerapkan standar keamanan yang wajar. Namun, tidak ada metode transmisi melalui internet yang 100% aman, sehingga kami tidak dapat menjamin keamanan absolut.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-bold text-lg text-brand-brown">4. Cookie dan Penyimpanan Lokal</h2>
            <p>Platform ini menggunakan penyimpanan lokal (localStorage) browser untuk keperluan manajemen sesi dan preferensi pengguna. Data ini tersimpan di perangkat Anda dan tidak dikirimkan ke server kami.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-bold text-lg text-brand-brown">5. Kontak</h2>
            <p>Untuk pertanyaan mengenai kebijakan privasi ini, silakan hubungi kami melalui email di <a href="mailto:hello@yogacalendarjakarta.com" className="text-brand-sage hover:underline">hello@yogacalendarjakarta.com</a> atau melalui WhatsApp di nomor 0813-4253-1331.</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-brand-beige">
          <Link href="/" className="text-sm text-brand-sage hover:underline">&larr; Kembali ke Beranda</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
