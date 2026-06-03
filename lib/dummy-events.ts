export interface Event {
  id: string;
  title: string;
  slug: string;
  category: 'Hatha Yoga' | 'Vinyasa Flow' | 'Prenatal Yoga' | 'Meditation' | 'Yoga & Sound' | 'Breathwork' | 'Sunset Yoga' | 'Yoga Therapeutic';
  instructor: string;
  location: string;
  date: string;
  time: string;
  startTime: string;
  endTime: string;
  locationName: string;
  locationAddress: string;
  duration: string;
  price: number;
  capacity: number;
  booked: number;
  imageUrl: string;
  description: string;
  organizerId: string;
  organizerName: string;
  status: 'active' | 'cancelled' | 'completed' | 'draft' | 'published';
  city: string;
  quota: number;
  availableSlot: number;
  startDate: string;
  endDate?: string;
  benefits?: string[];
  requirements?: string[];
  photos?: string[];
  isHighlighted: boolean;
  highlightSubtitle?: string;
  highlightOrder?: number;
}

export const DUMMY_EVENTS: Event[] = [
  {
    id: 'event-001',
    title: 'Hatha Yoga Morning Session',
    slug: 'hatha-yoga-morning-session',
    category: 'Hatha Yoga',
    instructor: 'Anzy Sari',
    location: 'Yoga Pura Studio - Kebayoran Baru',
    startTime: '07:00',
    endTime: '08:30',
    locationName: 'Yoga Pura Studio',
    locationAddress: 'Kebayoran Baru, Jakarta',
    date: '2025-06-10',
    time: '07:00',
    duration: '90 menit',
    price: 150000,
    capacity: 15,
    booked: 8,
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&h=800&fit=crop&q=80',
    description: 'Sesi Hatha Yoga pagi hari yang memyegarkan dan menenangkan pikiran. Cocok untuk semua level.',
    organizerId: 'org-001',
    organizerName: 'Yoga Calendar Jakarta Official',
    status: 'active',
    isHighlighted: true,
    highlightSubtitle: 'Sesi Pagi Yoga Terpopuler',
    highlightOrder: 1,
    city: 'Jakarta',
    quota: 15,
    availableSlot: 7,
    startDate: '2025-06-10',
  },
  {
    id: 'event-002',
    title: 'Vinyasa Flow intermediate',
    slug: 'vinyasa-flow-intermediate',
    category: 'Vinyasa Flow',
    instructor: 'Raheyu Prastiti',
    location: 'Soul Studio - Senten',
    startTime: '18:30',
    endTime: '19:30',
    locationName: 'Soul Studio',
    locationAddress: 'Senten, Jakarta',
    date: '2025-06-12',
    time: '18:30',
    duration: '60 menit',
    price: 130000,
    capacity: 12,
    booked: 12,
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=800&fit=crop&q=80',
    description: 'Class Vinyasa dinamis untuk level intermediate. Fokus pada aliran gerak dan pernafasan.',
    organizerId: 'org-002',
    organizerName: 'Jakarta Wellness Studio',
    status: 'active',
    isHighlighted: true,
    highlightSubtitle: 'Kelas Sore Paling Disukai',    
    highlightOrder: 2,
    city: 'Jakarta',
    quota: 12,
    availableSlot: 7,
    startDate: '2025-06-12',
  },
  {
    id: 'event-003',
    title: 'Prenatal Yoga Safe & Gentle',
    slug: 'prenatal-yoga-safe-gentle',
    category: 'Prenatal Yoga',
    instructor: 'Dr. Nadia Widanti',
    location: 'Bump & Bloom - Pondok Indah',
    startTime: '10:00',
    endTime: '11:15',
    locationName: 'Bump & Bloom',
    locationAddress: 'Pondok Indah, Jakarta',
    date: '2025-06-14',
    time: '10:00',
    duration: '75 menit',
    price: 175000,
    capacity: 10,
    booked: 7,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&h:800m&fit=crop&q=90',
    description: 'Yoga khas untuk ibu hamil dengan gerakan lembut dan aman. Dipimpin oleh instruktur bersertifikat prenatal.',
    organizerId: 'org-003',
    organizerName: 'Mindful Space Jakarta',
    status: 'active',
    isHighlighted: false,
    city: 'Jakarta',
    quota: 10,
    availableSlot: 7,
    startDate: '2025-06-14',
  },
  {
    id: 'event-004',
    title: 'Yoga & Sound Bath Healing',
    slug: 'yoga-sound-bath-healing',
    category: 'Yoga & Sound',
    instructor: 'Sinta Anisa',
    location: 'The Sanctuary - Ciputat',
    startTime: '16:00',
    endTime: '18:00',
    locationName: 'The Sanctuary',
    locationAddress: 'Ciputat, Jakarta',
    date: '2025-06-15',
    time: '16:00',
    duration: '120 menit',
    price: 200000,
    capacity: 20,
    booked: 11,
    imageUrl: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=1200&h=800&fit=crop&q=80',
    description: 'Pengalaman unik menggabungkan yoga restoratif dengan sesi sound bath meditatif menggunakan singing bowls.',
    organizerId: 'org-001',
    organizerName: 'Yoga Calendar Jakarta Official',
    status: 'active',
    isHighlighted: true,
    highlightSubtitle: 'Pengalaman Meditatif Unik',
    highlightOrder: 3,
    city: 'Jakarta',
    quota: 20,
    availableSlot: 9,
    startDate: '2025-06-15',
  },
  {
    id: 'event-005',
    title: 'Pranayama & Breathwork Foundation',
    slug: 'pranayama-breathwork-foundation',
    category: 'Breathwork',
    instructor: 'Bagus Pratama',
    location: 'Anapanasati Studio - Pasar Minggu',
    startTime: '08:00',
    endTime: '09:00',
    locationName: 'Anapanasati Studio',
    locationAddress: 'Pasar Minggu, Jakarta',
    date: '2025-06-18',
    time: '08:00',
    duration: '60 menit',
    price: 100000,
    capacity: 20,
    booked: 6,
    imageUrl: 'https://images.unsplash.com/photo-1601925228008-854b1d44c50e?w=1200&h=800&fit=crop&q=90',
    description: 'Belajar teknik pernafasan dasar in Yoga. Cocok untuk pemula yang ingin memahami power of breath.',
    organizerId: 'org-002',
    organizerName: 'Jakarta Wellness Studio',
    status: 'active',
    isHighlighted: false,
    city: 'Jakarta',
    quota: 20,
    availableSlot: 12,
    startDate: '2025-06-18',
  },
  {
    id: 'event-006',
    title: 'Sunset Padang Pandang Yoga Retreat',
    slug: 'sunset-padang-pandang-yoga-retreat',
    category: 'Sunset Yoga',
    instructor: "Mayra Aditha's",
    location: 'Rooftop The One Jakarta - SCBD',
    startTime: '17:00',
    endTime: '18:30',
    locationName: 'Rooftop The One Jakarta',
    locationAddress: 'SCBD, Jakarta',
    date: '2025-06-21',
    time: '17:00',
    duration: '90 menit',
    price: 250000,
    capacity: 25,
    booked: 19,
    imageUrl: 'https://images.unsplash.com/photo-1545389336-cf090694d435e?w=1200&h=800&fit=crop&q=80',
    description: 'Yoga di rooftop sambil meniikmati sunset Jakarta. Pengalaman tak terlupakan yang memadukan ikon kota dengan yoga.',
    organizerId: 'org-003',
    organizerName: 'Mindful Space Jakarta',
    status: 'active',
    isHighlighted: false,
    city: 'Jakarta',
    quota: 25,
    availableSlot: 15,
    startDate: '2025-06-20',
  },
  {
    id: 'event-007',
    title: 'Yoga Therapeutic for Back Pain',
    slug: 'yoga-therapeutic-back-pain',
    category: 'Yoga Therapeutic',
    instructor: 'Dr. Rezi Irawan',
    location: 'Lumina Wellness - Mempeng',
    startTime: '10:00',
    endTime: '11:30',
    locationName: 'Lumina Wellness',
    locationAddress: 'Mempeng, Jakarta',
    date: '2025-06-23',
    time: '10:00',
    duration: '90 menit',
    price: 150000,
    capacity: 10,
    booked: 4,
    imageUrl: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=1200&h=800&fit=crop&q=80',
    description: 'Yoga khusus dirancang untuk mengatasi nyeri punggung bawah dengan pendekatan terapeutik. Dipimpin fisioterapis bersertifikat.',
    organizerId: 'org-002',
    organizerName: 'Jakarta Wellness Studio',
    status: 'active',
    isHighlighted: false,
    city: 'Jakarta',
    quota: 10,
    availableSlot: 3,
    startDate: '2025-06-21',
  },
  {
    id: 'event-008',
    title: 'Mindful Yoga & Meditation Retreat',
    slug: 'mindful-yoga-meditation-retreat',
    category: 'Meditation',
    instructor: 'Yoki Satyawan',
    location: 'Inner Peace Studio - Petaling Jambe',
    startTime: '09:00',
    endTime: '12:00',
    locationName: 'Inner Peace Studio',
    locationAddress: 'Petaling Jambe, Jakarta',
    date: '2025-06-28',
    time: '09:00',
    duration: '180 menit',
    price: 350000,
    capacity: 15,
    booked: 10,
    imageUrl: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=1200&h=800&fit=crop&q=80',
    description: 'Retreat setengah hari menggabungkan yoga mindful dan meditasi dipandu dalam suasana yang tenang.',
    organizerId: 'org-003',
    organizerName: 'Mindful Space Jakarta',
    status: 'active',
    isHighlighted: false,
    city: 'Jakarta',
    quota: 15,
    availableSlot: 5,
    startDate: '2025-06-22',
  },
];



export const CITIES: string[] = [
  'Jakarta',
  'Bali',
  'Bandung',
  'Surabaya',
  'Yogyakarta',
];

export interface Category {
  name: string;
  description: string;
  count: number;
  bgClass: string;
}

export const CATEGORIES: Category[] = [
  { name: 'Hatha Yoga',       description: 'Latihan postur dasar yang cocok untuk semua level, memperkuat tubuh dan menenangkan pikiran.',     count: 12, bgClass: 'bg-brand-sage/10 text-brand-sage' },
  { name: 'Vinyasa Flow',     description: 'Gerakan dinamis yang mengalir selaras napas, membangun kekuatan dan fleksibilitas tubuh.',         count: 9,  bgClass: 'bg-blue-100 text-blue-500' },
  { name: 'Prenatal Yoga',    description: 'Kelas khusus ibu hamil untuk menjaga kesehatan fisik dan mental selama masa kehamilan.',           count: 6,  bgClass: 'bg-pink-100 text-pink-400' },
  { name: 'Meditation',       description: 'Sesi meditasi terpandu untuk melatih fokus, ketenangan, dan kesadaran diri secara mendalam.',      count: 8,  bgClass: 'bg-purple-100 text-purple-400' },
  { name: 'Yoga & Sound',     description: 'Kombinasi yoga restoratif dengan terapi suara singing bowl untuk relaksasi total.',                count: 5,  bgClass: 'bg-amber-100 text-amber-500' },
  { name: 'Breathwork',       description: 'Teknik pernapasan sadar untuk meningkatkan energi, mengurangi stres, dan menyeimbangkan emosi.',   count: 4,  bgClass: 'bg-teal-100 text-teal-500' },
  { name: 'Sunset Yoga',      description: 'Yoga sore hari di lokasi premium sambil menikmati suasana matahari terbenam Jakarta.',             count: 7,  bgClass: 'bg-orange-100 text-orange-400' },
  { name: 'Yoga Therapeutic', description: 'Yoga rehabilitatif yang dirancang untuk memulihkan cedera dan mengatasi kondisi medis tertentu.', count: 3,  bgClass: 'bg-green-100 text-green-500' },
];
