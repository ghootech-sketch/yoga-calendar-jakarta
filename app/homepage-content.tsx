'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Calendar, CheckCircle, ArrowRight, MessageCircle, ShieldCheck, HeartHandshake, MapPin } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';
import { EventCard } from '@/components/EventCard';
import { SectionTitle } from '@/components/SectionTitle';
import { CategoryCard } from '@/components/CategoryCard';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { DUMMY_EVENTS, CATEGORIES } from '@/lib/dummy-events';
import { EventService } from '@/lib/events/event-service';

// Entry animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function HomePageContent() {
  const [highlightedEvents, setHighlightedEvents] = useState<any[]>(() => {
    return DUMMY_EVENTS.filter((e) => e.isHighlighted).slice(0, 3);
  });
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>(() => {
    return DUMMY_EVENTS.slice(0, 4);
  });
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const init = () => {
      setHighlightedEvents(EventService.getHighlightedEvents().slice(0, 3));
      setUpcomingEvents(EventService.getPublishedEvents().slice(0, 4));
      setIsHydrated(true);
    };
    const handle = setTimeout(init, 0);
    return () => clearTimeout(handle);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-brand-cream text-brand-charcoal overflow-x-hidden selection:bg-brand-sage/20 selection:text-brand-brown">
      <Header />

      {/* Hero Section */}
      <section id="hero" className="relative pt-32 pb-20 md:pt-44 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="lg:col-span-6 space-y-6 sm:space-y-8 text-left z-10"
            >
              <div className="inline-block px-3.5 py-1 text-[11px] font-bold tracking-widest uppercase text-brand-sage bg-brand-sage/10 rounded-full">
                Media Partner Event Yoga & Wellness
              </div>
              
              <h1 className="font-sans font-bold text-4xl sm:text-5xl md:text-6xl text-brand-brown tracking-tight leading-[1.1]">
                Discover Yoga Events, <br />
                <span className="text-brand-sage font-light italic">All Across Indonesia</span>
              </h1>
              
              <p className="text-base sm:text-lg text-brand-brown/70 leading-relaxed font-light max-w-lg">
                Platform media partner resmi untuk event yoga & wellness terkurasi di seluruh Indonesia. Temukan retreat, workshop, dan kelas reguler dari instruktur bersertifikat terpercaya.
              </p>

              <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                <Link href="/events" className="focus:outline-none">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2 group shadow-lg">
                    Lihat Jadwal Kelas
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <a
                  href={`https://wa.me/6281342531331?text=${encodeURIComponent('Halo Yoga Calendar Jakarta, saya tertarik untuk berkonsultasi private/group session.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus:outline-none"
                >
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto gap-2 text-brand-brown border border-brand-brown/10">
                    <MessageCircle className="w-4 h-4 fill-current" />
                    Tanya via WhatsApp
                  </Button>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 sm:pt-10 flex flex-wrap items-center gap-x-8 gap-y-3.5 border-t border-brand-beige/60">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-full bg-brand-sage/10 text-brand-sage">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-brand-brown/75 tracking-wide">50+ Event Aktif</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-full bg-brand-sage/10 text-brand-sage">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-brand-brown/75 tracking-wide">Instruktur Bersertifikat</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-full bg-brand-sage/10 text-brand-sage">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-brand-brown/75 tracking-wide">Tanpa Biaya Admin</span>
                </div>
              </div>
            </motion.div>

            {/* Right Image Composition */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="lg:col-span-6 relative aspect-[5/4] sm:aspect-[4/3] lg:aspect-square w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
            >
              <Image
                src="https://images.unsplash.com/photo-1566501206188-5dd0cf160a0e?w=1200&h=1200&fit=crop&q=80"
                alt="Mindful Yoga Practice Session"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/20 to-transparent"></div>
              
              {/* Floating review card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-4 sm:p-5 rounded-2xl shadow-lg border border-brand-beige/40 flex items-center gap-4.5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 relative rounded-full overflow-hidden shrink-0 bg-brand-beige">
                  <Image
                    src="https://images.unsplash.com/photo-1529693662653-9d480530a697?w=100&h=100&fit=crop&q=80"
                    alt="Reviewer avatar"
                    fill
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="flex text-amber-400 text-xs mb-0.5">★★★★★</div>
                  <p className="text-xs sm:text-sm font-medium text-brand-brown/90 italic">
                    &ldquo;Instrukturnya sangat sabar memberi penyesuaian tubuh. Studio asri dan sejuk!&rdquo;
                  </p>
                  <p className="text-[10px] font-bold text-brand-sage uppercase tracking-wider mt-1">- Clara L, Menteng</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. Highlight Event Section */}
      <section id="highlights" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Rekomendasi Kami"
            title="Sesi Yoga Pilihan Pekan Ini"
            subtitle="Pilihan kelas yoga yang banyak diminati peserta dan dikelilingi oleh lingkungan yang mendamaikan batin."
          />
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {highlightedEvents.map((event) => (
              <motion.div key={event.id} variants={fadeInUp}>
                <EventCard event={event} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. Category Section */}
      <section id="categories" className="py-20 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Eksplorasi Kelas"
            title="Pilih Kategori Kebutuhan Anda"
            subtitle="Setiap orang memiliki ritme tersendiri. Temukan jenis latihan yang selaras dengan energi dan tujuan kesehatan fisik Anda saat ini."
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {CATEGORIES.map((category) => (
              <motion.div key={category.name} variants={fadeInUp}>
                <CategoryCard
                  name={category.name}
                  description={category.description}
                  count={category.count}
                  bgClass={category.bgClass}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. Upcoming Events Section */}
      <section id="upcoming" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="max-w-xl text-left">
              <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-widest uppercase text-brand-sage bg-brand-sage/10 rounded-full">
                Jadwal Mendatang
              </span>
              <h2 className="font-sans font-bold text-2xl sm:text-3xl md:text-4xl text-brand-brown tracking-tight leading-tight">
                Kelas & Event Terdekat di Jakarta
              </h2>
              <p className="mt-3 text-sm text-brand-brown/65 leading-relaxed">
                Segera amankan slot Anda pada deretan tanggal rilis kelas yoga terdekat. Kuota sangat terbatas demi menjaga kualitas meditasi personal.
              </p>
            </div>
            
            <Link href="/events" className="focus:outline-none shrink-0">
              <Button variant="outline" className="gap-2">
                Semua Jadwal
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {upcomingEvents.map((event) => (
              <motion.div key={event.id} variants={fadeInUp}>
                <EventCard event={event} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. About Short Section */}
      <section id="about" className="py-20 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Image */}
            <div className="lg:col-span-5 relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border-2 border-white">
              <Image
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=1000&fit=crop&q=80"
                alt="Asana posture illustration"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Right Text Content */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-block px-3 py-1 text-xs font-semibold tracking-widest uppercase text-brand-sage bg-brand-sage/10 rounded-full">
                Mengenal Kami
              </span>
              <h2 className="font-sans font-bold text-2xl sm:text-3xl md:text-4xl text-brand-brown tracking-tight">
                Media Partner Terpercaya untuk Ekosistem Yoga Indonesia
              </h2>
              <div className="space-y-4 text-brand-brown/75 text-sm sm:text-base leading-relaxed font-light">
                <p>
                  Sebagai media partner resmi event yoga dan wellness, kami menghubungkan penyelenggara dengan peserta yang tepat di seluruh penjuru Indonesia.
                </p>
                <p>
                  <strong>Yoga Calendar Jakarta</strong> adalah platform media partner yang mendukung pertumbuhan ekosistem yoga Indonesia. Kami mempromosikan event, retreat, dan workshop yoga dari penyelenggara terpercaya ke komunitas yogi aktif di seluruh nusantara.
                </p>
                <p>
                  Bergabunglah bersama ratusan penyelenggara dan ribuan peserta yang telah mempercayakan promosi dan pencarian event yoga mereka kepada kami.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-6">
                <div>
                  <h4 className="text-2xl font-bold text-brand-sage">500+</h4>
                  <p className="text-xs text-brand-brown/60 uppercase font-bold tracking-widest mt-1">Event Dipromosikan</p>
                </div>
                <div className="w-px h-10 bg-brand-beige"></div>
                <div>
                  <h4 className="text-2xl font-bold text-brand-sage">100%</h4>
                  <p className="text-xs text-brand-brown/60 uppercase font-bold tracking-widest mt-1">Instruktur Berlisensi</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Why Book With Us Section */}
      <section id="why-us" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Keunggulan"
            title="Mengapa Memilih Yoga Calendar Jakarta?"
            subtitle="Kami berfokus memberi kemudahan perjalanan restorasi batin Anda tanpa hambatan."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-brand-cream/40 rounded-3xl border border-brand-beige/50 text-center space-y-4">
              <div className="inline-flex p-3.5 bg-brand-sage/10 text-brand-sage rounded-full mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-sans font-bold text-lg text-brand-brown">Terpercaya & Berizin</h3>
              <p className="text-sm text-brand-brown/70 leading-relaxed font-light">
                Seluruh pengajar di bawah naungan kami wajib memiliki sertifikasi RYT resmi tingkat internasional serta asisten asana yang profesional.
              </p>
            </div>

            <div className="p-8 bg-brand-cream/40 rounded-3xl border border-brand-beige/50 text-center space-y-4">
              <div className="inline-flex p-3.5 bg-brand-sage/10 text-brand-sage rounded-full mb-2">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-sans font-bold text-lg text-brand-brown">Komunitas Ramah & Aman</h3>
              <p className="text-sm text-brand-brown/70 leading-relaxed font-light">
                Menciptakan ruang latihan non-kompetitif. Setiap gerakan dihargai sesuai batasan tubuh Anda tanpa adanya intimidasi.
              </p>
            </div>

            <div className="p-8 bg-brand-cream/40 rounded-3xl border border-brand-beige/50 text-center space-y-4">
              <div className="inline-flex p-3.5 bg-brand-sage/10 text-brand-sage rounded-full mb-2">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-sans font-bold text-lg text-brand-brown">Pilihan Lokasi Terbaik</h3>
              <p className="text-sm text-brand-brown/70 leading-relaxed font-light">
                Kami merangkul lokasi-lokasi tenang pilihan di Jakarta Selatan, Pusat, Barat, dan Utara untuk memudahkan jangkauan kepulangan Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CTA Final Section */}
      <section id="cta-final" className="py-16 bg-white last:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-brown bg-gradient-to-br from-brand-brown to-brand-charcoal text-brand-cream rounded-3xl px-6 py-12 md:p-16 text-center space-y-6 relative overflow-hidden shadow-2xl">
            {/* Background design elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-brand-sage/10 rounded-full blur-3xl pointer-events-none -translate-x-12 -translate-y-12"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-sage/20 rounded-full blur-3xl pointer-events-none translate-x-12 translate-y-12"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <span className="inline-block px-3.5 py-1 text-xs font-semibold tracking-wider bg-brand-sage/25 text-brand-cream rounded-full">
                START YOUR JOURNEY
              </span>
              <h2 className="font-sans font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight">
                Daftarkan Event Yoga Anda Sekarang
              </h2>
              <p className="text-sm sm:text-base text-brand-cream/80 font-light leading-relaxed">
                Jadikan event yoga & wellness Anda lebih mudah ditemukan oleh ribuan peserta aktif. Daftarkan sebagai penyelenggara (EO) dan kelola event Anda melalui portal khusus kami.
              </p>
              
              <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link href="/events" className="w-full sm:w-auto focus:outline-none">
                  <Button variant="primary" size="lg" className="w-full bg-brand-sage hover:bg-brand-sagedark border-none">
                    Daftar Sebagai EO
                  </Button>
                </Link>
                <a
                  href={`https://wa.me/6281342531331?text=${encodeURIComponent('Halo Yoga Calendar Jakarta, saya ingin mendapatkan rekomendasi kelas yang tepat.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto focus:outline-none"
                >
                  <Button variant="outline" size="lg" className="w-full border-brand-cream/35 text-brand-cream hover:bw-white hover:text-brand-brown">
                    Konsultasi via WA
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

