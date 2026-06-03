import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan | Yoga Calendar Jakarta',
  description: 'Syarat dan ketentuan penggunaan platform Yoga Calendar Jakarta.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-cream text-brand-charcoal">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24">
        <div className="space-y-2 mb-10">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-widest uppercase text-brand-sage bg-brand-sage/10 rounded-full">
            Legal
          </span>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-brand-brown tracking-tight">
            Syarat &amp; Ketentuan
          </h1>
          <p className="text-sm text-brand-brown/50">Terakhir diperbarui: Juni 2026</p>
        </div>

        <div className="prose prose-sm max-w-none space-y-8 text-brand-brown/80 leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-bold text-lg text-brand-brown">1. Penerimaan Ketentuan</h2>
            <p>Dengan mengakses dan menggunakan platform Yoga Calendar Jakarta, Anda menyetujui untuk terikat dengan syarat dan ketentuan ini. Jika Anda tidak menyetujui ketentuan ini, mohon untuk tidak menggunakan layanan kami.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-bold text-lg text-brand-brown">2. Layanan Platform</h2>
            <p>Yoga Calendar Jakarta adalah platform kurasi jadwal kelas yoga, meditasi, breathwork, dan sound healing di Jakarta. Kami bertindak sebagai perantara antara peserta dengan penyelenggara kelas (Event Organizer). Kami tidak bertanggung jawab atas kualitas instruksi yang diberikan langsung oleh EO mitra.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-bold text-lg text-brand-brown">3. Reservasi dan Pembayaran</h2>
            <p>Setiap reservasi yang dilakukan melalui platform bersifat mengikat setelah konfirmasi pembayaran diterima. Kuota yang tercantum di platform bersifat real-time dan dapat berubah sewaktu-waktu. Kami tidak bertanggung jawab apabila slot habis sebelum proses pembayaran selesai.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-bold text-lg text-brand-brown">4. Kebijakan Pembatalan</h2>
            <p>Pembatalan reservasi dapat dilakukan maksimal 24 jam sebelum jadwal kelas dimulai dengan menghubungi admin melalui WhatsApp. Pembatalan yang dilakukan kurang dari 24 jam sebelum kelas tidak dapat dikembalikan dananya (non-refundable). Penyelenggara berhak membatalkan kelas dengan pemberitahuan minimal 12 jam sebelumnya disertai pengembalian dana penuh.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-bold text-lg text-brand-brown">5. Tanggung Jawab Peserta</h2>
            <p>Peserta bertanggung jawab penuh atas kondisi fisik dan kesehatan dirinya sebelum mengikuti kelas. Sangat disarankan untuk berkonsultasi dengan dokter sebelum mengikuti program olahraga apapun, terutama bagi peserta dengan kondisi medis tertentu. Yoga Calendar Jakarta tidak bertanggung jawab atas cedera yang timbul akibat kelalaian peserta.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-bold text-lg text-brand-brown">6. Kontak</h2>
            <p>Untuk pertanyaan mengenai syarat dan ketentuan ini, silakan hubungi kami di <a href="mailto:hello@yogacalendarjakarta.com" className="text-brand-sage hover:underline">hello@yogacalendarjakarta.com</a>.</p>
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
