import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Instagram, Calendar } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="app-footer" className="bg-brand-beige/40 border-t border-brand-beige pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <span className="font-sans font-bold text-xl text-brand-brown tracking-tight">
              Yoga Calendar <span className="text-brand-sage font-light">Jakarta</span>
            </span>
            <p className="text-sm text-brand-brown/70 leading-relaxed max-w-sm">
              Menghubungkan Anda dengan kedamaian di tengah kesibukan Jakarta. Kalender kurasi kelas Yoga, Breathwork, Meditasi, dan Sound Healing berkualitas tinggi.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="https://instagram.com/yogacalendarjakarta"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-brown/60 hover:text-brand-sage transition-colors p-2 bg-brand-cream rounded-full shadow-sm"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="text-brand-brown/60 hover:text-brand-sage transition-colors p-2 bg-brand-cream rounded-full shadow-sm"
                aria-label="Calendar"
              >
                <Calendar className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-sans font-semibold text-sm tracking-widest text-brand-brown uppercase">
              Navigasi
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-sm text-brand-brown/70 hover:text-brand-sage transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-sm text-brand-brown/70 hover:text-brand-sage transition-colors">
                  Cari Jadwal Kelas
                </Link>
              </li>
              <li>
                <Link href="/events?category=Meditation" className="text-sm text-brand-brown/70 hover:text-brand-sage transition-colors">
                  Meditasi & Penyembuhan
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="font-sans font-semibold text-sm tracking-widest text-brand-brown uppercase">
              Kontak Kami
            </h3>
            <ul className="space-y-3 text-sm text-brand-brown/75">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-sage shrink-0 mt-0.5" />
                <span>DKI Jakarta, Indonesia</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-sage shrink-0" />
                <a href="mailto:hello@yogacalendarjakarta.com" className="hover:text-brand-sage transition-colors">
                  hello@yogacalendarjakarta.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-sage shrink-0" />
                <a href="https://wa.me/6281342531331" target="_blank" rel="noopener noreferrer" className="hover:text-brand-sage transition-colors">
                  0813-4253-1331
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-brand-beige/70 my-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-brand-brown/50 text-center sm:text-left">
            &copy; {currentYear} Yoga Calendar Jakarta. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-brand-brown/50">
            <Link href="/privacy" className="hover:text-brand-sage transition-colors">Kebijakan Privasi</Link>
            <Link href="/terms" className="hover:text-brand-sage transition-colors">Syarat &amp; Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
