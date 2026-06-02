export interface Event {
  id: string;
  title: string;
  slug: string;
  category: 'Hatha Yoga' | 'Vinyasa Flow' | 'Prenatal Yoga' | 'Meditation' | 'Breathwork' | 'Sound Healing' | string;
  description: string;
  imageUrl: string;
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  locationName: string;
  locationAddress: string;
  city: string; // e.g. 'Jakarta Selatan', 'Jakarta Pusat', 'Jakarta Utara', 'Jakarta Barat'
  price: number;
  quota: number;
  availableSlot: number;
  organizerName: string;
  isHighlighted: boolean;
  benefits: string[];
  requirements: string[];
}

export const CATEGORIES = [
  {
    name: 'Hatha Yoga',
    description: 'Postur klasik yang dilakukan secara perlahan dengan fokus peningkatan kekuatan fisik dan kedamaian batin.',
    icon: 'Sparkles',
    count: 2,
    bgClass: 'bg-amber-50 text-amber-800 border-amber-100',
  },
  {
    name: 'Vinyasa Flow',
    description: 'Aliran gerakan dinamis yang terhubung harmonis dengan setiap embusan napas Anda.',
    icon: 'Waves',
    count: 2,
    bgClass: 'bg-emerald-50 text-emerald-800 border-emerald-100',
  },
  {
    name: 'Prenatal Yoga',
    description: 'Kelas yoga aman dan lembut untuk mendukung kebugaran fisik dan persiapan mental ibu hamil.',
    icon: 'Heart',
    count: 1,
    bgClass: 'bg-rose-50 text-rose-800 border-rose-100',
  },
  {
    name: 'Meditation',
    description: 'Relaksasi mental terbimbing untuk melatih fokus diri, melepas kecemasan, dan menyegarkan jiwa.',
    icon: 'Eye',
    count: 1,
    bgClass: 'bg-purple-50 text-purple-800 border-purple-100',
  },
  {
    name: 'Breathwork',
    description: 'Pranayama dan stimulasi oksigen teratur untuk mengoptimalkan kesehatan paru-paru dan vitalitas tubuh.',
    icon: 'Wind',
    count: 1,
    bgClass: 'bg-sky-50 text-sky-800 border-sky-100',
  },
  {
    name: 'Sound Healing',
    description: 'Metode terapi getaran gelombang suara singing bowl untuk penyembuhan seluler dan relaksasi total.',
    icon: 'Music',
    count: 1,
    bgClass: 'bg-indigo-50 text-indigo-800 border-indigo-100',
  },
];

export const CITIES = [
  'Jakarta Selatan',
  'Jakarta Pusat',
  'Jakarta Utara',
  'Jakarta Barat',
];

export const DUMMY_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Morning Hatha Yoga',
    slug: 'morning-hatha-yoga',
    category: 'Hatha Yoga',
    description: 'Sambut pagi indahmu dengan ketenangan sejati. Kelas Hatha Yoga ini dirancang khusus untuk peregangan mendalam, perbaikan keselarasan tulang belakang, olah napas lembut, serta memperkuat otot inti (core muscles). Gerakan lambat dan terkendali membuat kelas ini sangat bersahabat bagi pemula tanpa mengurangi esensi dari olahraga yoga itu sendiri. Setiap sesi diakhiri dengan meditasi Savasana yang menenangkan.',
    imageUrl: 'https://picsum.photos/seed/hatha-morning/1200/800',
    startDate: '2026-06-06',
    startTime: '07:00',
    endTime: '08:30',
    locationName: 'Wellness Sanctum Kemang',
    locationAddress: 'Jl. Kemang Raya No. 12B, Bangka, Kec. Mampang Prapatan',
    city: 'Jakarta Selatan',
    price: 150000,
    quota: 20,
    availableSlot: 8,
    organizerName: 'Yoga Calendar Jakarta',
    isHighlighted: true,
    benefits: [
      'Meningkatkan fleksibilitas dan memperbaiki postur tubuh.',
      'Melatih sistem metabolisme tubuh di pagi hari.',
      'Mendapatkan bimbingan asana langsung dari instruktur bersertifikat RYT-200.',
      'Disediakan matras yoga dan water refill secara gratis di area lobi.',
      'Sesi teh herbal hangat pasca latihan.'
    ],
    requirements: [
      'Membawa botol minum pribadi (tumbler).',
      'Menggunakan pakaian olahraga yang nyaman dan menyerap keringat.',
      'Datang 15 menit sebelum kelas dimulai untuk proses check-in.',
      'Terbuka untuk semua tingkat keahlian (All Levels).'
    ]
  },
  {
    id: '2',
    title: 'Weekend Vinyasa Flow',
    slug: 'weekend-vinyasa-flow',
    category: 'Vinyasa Flow',
    description: 'Lepaskan penat akhir pekan Anda dalam sebuah rangkaian gerakan dinamis. Vinyasa Flow menyelaraskan napas dengan asana yang berkesinambungan dan mengalir layaknya sebuah tarian. Kelas ini fokus membangun stamina fisik, kelenturan, kekuatan sendi, serta melatih daya fokus pikiran Anda. Anda akan dipandu melintasi sekuens kreatif yang menantang sekaligus menyenangkan di atas rooftop dengan udara segar.',
    imageUrl: 'https://picsum.photos/seed/vinyasa-flow/1200/800',
    startDate: '2026-06-07',
    startTime: '08:00',
    endTime: '09:30',
    locationName: 'Rooftop Studio Senopati',
    locationAddress: 'Jl. Senopati No. 45, Kebayoran Baru',
    city: 'Jakarta Selatan',
    price: 180000,
    quota: 15,
    availableSlot: 4,
    organizerName: 'Yoga Calendar Jakarta',
    isHighlighted: true,
    benefits: [
      'Membangun daya tahan jantung dan kekuatan fisik kardio yang baik.',
      'Membakar kalori ekstra serta mendetoksifikasi tubuh melalui keringat.',
      'Mendapatkan pose adjustment yang aman dan profesional.',
      'Menikmati suasana ruang terbuka hijau di tengah kota Jakarta.',
      'Voucher diskon 20% untuk menu healthy juice di lokasi.'
    ],
    requirements: [
      'Sangat disarankan memiliki dasar yoga dasar (bukan benar-benar pertama kali).',
      'Membawa handuk kecil sendiri.',
      'Hindari makan makanan berat minimal 2 jam sebelum latihan.'
    ]
  },
  {
    id: '3',
    title: 'Prenatal Yoga Class',
    slug: 'prenatal-yoga-class',
    category: 'Prenatal Yoga',
    description: 'Masa kehamilan adalah momen sakral yang menuntut Ibu untuk lebih memahami harmoni tubuh dan batin. Kelas Prenatal Yoga kami dirancang secara cermat oleh instruktur bersertifikat khusus kehamilan. Gerakannya fungsional untuk meredakan nyeri punggung bawah, melenturkan otot pinggul, serta melatih pernapasan diafragma yang penting dalam persalinan normal. Hubungkan ikatan kasih sayang Anda dengan calon bayi dalam keheningan asana yang penuh kehangatan.',
    imageUrl: 'https://picsum.photos/seed/prenatal-yoga/1200/800',
    startDate: '2026-06-10',
    startTime: '09:00',
    endTime: '10:30',
    locationName: 'Bumi Yoga Center Menteng',
    locationAddress: 'Jl. Teuku Umar No. 8, Gondangdia',
    city: 'Jakarta Pusat',
    price: 200000,
    quota: 12,
    availableSlot: 6,
    organizerName: 'Maternity partners',
    isHighlighted: false,
    benefits: [
      'Meringankan keluhan umum ibu hamil seperti pegal dan bengkak.',
      'Melatih pernapasan relaksasi (hypnobirthing) menyambut hari persalinan.',
      'Meningkatkan sirkulasi darah serta asupan oksigen ke janin.',
      'Disediakan bantal penyangga khusus (props), bolster, dan yoga block.',
      "Sesi sharing sesama ibu hamil ('Mommy Circle') setelah olahraga."
    ],
    requirements: [
      'Usia kehamilan minimal masuk 14 minggu (trimester ke-2 atau ke-3).',
      'Wajib membawa surat rekomendasi dokter kandungan atau sertifikat kehamilan sehat.',
      'Boleh memakai kaos longgar bernapas lega.'
    ]
  },
  {
    id: '4',
    title: 'Sound Healing Session',
    slug: 'sound-healing-session',
    category: 'Sound Healing',
    description: 'Masuki dimensi relaksasi total yang paling mendalam. Dalam sesi Sound Healing, Anda cukup berbaring nyaman (Savasana) sementara praktisi memainkan instrumen sakral seperti Alchemy Crystal Singing Bowls, Tibetan Bowls, Gong Chalices, dan Rainsticks. Gelombang suara akustik harmonik ini bekerja secara ilmiah menurunkan aktivitas otak ke tingkat gelombang Theta. Sempurna untuk menyembuhkan trauma, mengatasi insomnia akut, dan menyeimbangkan medan energi tubuh.',
    imageUrl: 'https://picsum.photos/seed/sound-healing/1200/800',
    startDate: '2026-06-13',
    startTime: '16:00',
    endTime: '17:30',
    locationName: 'Calm Oasis Studio PIK',
    locationAddress: 'Ruko Cordoba Blok G, Bukit Golf Mediterania, Pantai Indah Kapuk',
    city: 'Jakarta Utara',
    price: 250000,
    quota: 25,
    availableSlot: 10,
    organizerName: 'Yoga Calendar Jakarta',
    isHighlighted: true,
    benefits: [
      'Menyembuhkan stres psikologis kronis dan kecemasan.',
      'Meningkatkan kualitas tidur (sangat baik untuk penderita insomnia).',
      'Menstimulasi pelepasan hormon kebahagiaan (oksitosin & dopamin).',
      'Termasuk aromatherapy premium infusion selama sesi berlangsung.',
      'Disediakan matras tebal dengan selimut lembut nan hangat.'
    ],
    requirements: [
      'Mengenakan pakaian hangat atau kaos kaki ekstra (karena suhu AC ruang dingin).',
      'Kurangi konsumsi kafein berat pada hari H.',
      'Tidak disarankan untuk penderita epilepsi akut akibat stimulasi resonansi suara.'
    ]
  },
  {
    id: '5',
    title: 'Warm Breathwork for Beginner',
    slug: 'breathwork-for-beginner',
    category: 'Breathwork',
    description: 'Napas adalah rahasia terbesar dari kesehatan. Sayangnya, mayoritas dari kita terbiasa bernapas secara dangkal. Di kelas Breathwork pemula ini, Anda akan mempelajari anatomi pernapasan, esensi restoratif Pranayama, hingga teknik pernapasan modern untuk mengontrol stres instan (Box Breathing) serta meningkatkan fungsi imun tubuh. Manfaatkan oksigenasi optimal untuk membersihkan racun tubuh dan me-recharge fokus otak.',
    imageUrl: 'https://picsum.photos/seed/breathwork/1200/800',
    startDate: '2026-06-14',
    startTime: '10:00',
    endTime: '11:30',
    locationName: 'Zen Garden Kuningan',
    locationAddress: 'Karet Pedurenan No. 74, Kuningan, Setiabudi',
    city: 'Jakarta Selatan',
    price: 120000,
    quota: 18,
    availableSlot: 12,
    organizerName: 'Breathing Lab',
    isHighlighted: false,
    benefits: [
      'Mempelajari teknik pernapasan orisinal untuk meredakan panik seketika.',
      'Membantu meningkatkan kapasitas vital paru-paru Anda.',
      'Meningkatkan kejernihan berpikir dan fokus kognitif harian.',
      'Instruktur tersertifikasi internasional membimbing teknik dengan detail.'
    ],
    requirements: [
      'Membawa alas yoga pribadi jika punya (atau memakai matras sewa di lokasi).',
      'Perut dalam keadaan kosong atau minimal makan ringan 1 jam sebelumnya.'
    ]
  },
  {
    id: '6',
    title: 'Sunset Beach Meditation',
    slug: 'sunset-meditation',
    category: 'Meditation',
    description: 'Lepaskan hiruk-pikuk kesibukan metropolitan Jakarta dan nikmati deburan ombak yang menyapa. Dibimbing oleh praktisi meditasi kawakan, kita akan merenung, melepaskan kepahitan hati, dan menyelaraskan getaran sukacita di bawah hamparan senja Ancol yang magis. Meditasi mindfulness ini menggunakan metode terapi visual matahari terbenam untuk melatih kehadiran jiwa secara penuh (grounding).',
    imageUrl: 'https://picsum.photos/seed/sunset-meditation/1200/800',
    startDate: '2026-06-17',
    startTime: '17:00',
    endTime: '18:15',
    locationName: 'Ancol Beachfront Area',
    locationAddress: 'Taman Impian Jaya Ancol, Pademangan',
    city: 'Jakarta Utara',
    price: 95000,
    quota: 30,
    availableSlot: 21,
    organizerName: 'Yoga Calendar Jakarta',
    isHighlighted: false,
    benefits: [
      'Merilis racun emosional dan mengembalikan energi positif yang segar.',
      'Menikmati kedamaian alami di pinggir pantai saat matahari terbenam.',
      'Sudah termasuk tiket masuk akses pejalan kaki area Ancol Pantai.',
      'Dokumentasi potret senja estetik oleh fotografer tim.'
    ],
    requirements: [
      'Membawa sarung, syal tebal, atau kain pantai untuk alas duduk di pasir.',
      'Membawa kacamata hitam (sunglasses) apabila silau.'
    ]
  },
  {
    id: '7',
    title: 'Yoga Healing for Back Pain',
    slug: 'yoga-for-back-pain',
    category: 'Hatha Yoga',
    description: 'Sering merasa pegal, kaku di pundak, pinggang terasa nyeri setelah seharian duduk di depan meja kerja? Ini adalah kelas terapi asana penyelamat Anda. Berfokus pada peregangan dekompresi tulang belakang yang lembut, penguatan otot panggul, core, dan penyelarasan ulang bahu. Postur didesain fungsional tanpa tekanan sendi yang tinggi sehingga aman untuk semua rentang usia penderita nyeri punggung.',
    imageUrl: 'https://picsum.photos/seed/yoga-backpain/1200/800',
    startDate: '2026-06-20',
    startTime: '14:00',
    endTime: '15:30',
    locationName: 'Healing Studio Permata Hijau',
    locationAddress: 'Rukan Permata Hijau Blok C-3, Kebayoran Lama Benhil',
    city: 'Jakarta Barat',
    price: 160000,
    quota: 15,
    availableSlot: 3,
    organizerName: 'Yoga Calendar Jakarta',
    isHighlighted: false,
    benefits: [
      'Membantu meregangkan otot psoas dan tulang belakang yang kaku.',
      'Tips & trik ergonomis menjaga postur tubuh saat bekerja di kantor.',
      'Alas yoga premium, yoga straps, dan blocks telah dipersiapkan.',
      'Konsultasi singkat pasca kelas dengan instruktur fisioterapi yoga.'
    ],
    requirements: [
      'Sangat diimbau menginformasikan instruktur jika Anda memiliki riwayat saraf terjepit (HNP).',
      'Mengenakan celana longgar yang elastis.'
    ]
  },
  {
    id: '8',
    title: 'Mindful Flow Class',
    slug: 'mindful-flow-class',
    category: 'Vinyasa Flow',
    description: 'Dua elemen esensial: Meditasi visual yang menenangkan dipadukan dengan gerakan mengalir lambat. Kelas ini didedikasikan sepenuhnya untuk membawa Anda kembali ke momen saat ini (The Present Moment). Rasakan setiap pergantian asana, kontrol penuh hembusan napas, serta kurangi obrolan batin (brain chatter) yang mengganggu mental Anda. Selesai kelas, Anda akan merasakan pikiran jernih dan raga yang bertenaga.',
    imageUrl: 'https://picsum.photos/seed/mindful-yoga/1200/800',
    startDate: '2026-06-21',
    startTime: '15:00',
    endTime: '16:30',
    locationName: 'Serenity Space Kemang',
    locationAddress: 'Jl. Kemang Timur No. 3A, Mampang Prapatan',
    city: 'Jakarta Selatan',
    price: 175000,
    quota: 15,
    availableSlot: 5,
    organizerName: 'Yoga Calendar Jakarta',
    isHighlighted: false,
    benefits: [
      'Menyeimbangkan emosi serta melatih ketenangan saraf parasimpatis.',
      'Memperbaiki fokus mental dan manajemen emosional emosi berlebih.',
      'Aroma lavender calming mist di awal dan akhir sesi yoga.',
      'Refreshment cold press juice segar sesudah sesi.'
    ],
    requirements: [
      'Membawa handuk pribadi untuk kebersihan ekstra.',
      'Terbuka untuk pemula maupun yogi tingkat menengah.'
    ]
  }
];
