import React from 'react';
import { Metadata } from 'next';
import HomePageContent from './homepage-content';

export const metadata: Metadata = {
  title: 'Yoga Calendar Jakarta | Jadwal Kelas Spiritual, Yoga & Meditasi',
  description: 'Temukan kedamaian terdekat batin Anda. Jadwal lengkap kelas yoga hatha, vinyasa, prenatal, breathwork, & sound healing terkurasi di penjuru Jakarta.',
  openGraph: {
    title: 'Yoga Calendar Jakarta - Jadwal Kelas Spiritual & Meditasi',
    description: 'Eksplorasi kelas spiritual & yoga terbaik di Jakarta. Akses bimbingan instruktur profesional bersertifikasi.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=1200&h=800&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'Yoga Calendar Jakarta',
      },
    ],
  },
};

export default function HomePage() {
  return <HomePageContent />;
}

