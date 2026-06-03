# Yoga Calendar Jakarta

Yoga Calendar Jakarta adalah website demo untuk menampilkan jadwal kelas, workshop, dan event yoga di Jakarta. Project ini dibuat sebagai prototype end-to-end untuk kebutuhan presentasi klien, portfolio, dan validasi alur booking online.

Status project: **Demo / Prototype**. Data event, booking, user, dan pembayaran masih menggunakan mock/local storage. Belum disiapkan untuk transaksi production.

## Ringkasan

Website ini menyediakan pengalaman pengguna dari melihat daftar event sampai simulasi booking dan checkout. Di sisi dashboard, tersedia panel admin dan EO untuk mengelola data demo seperti event, booking, organizer, highlight, transaksi, dan profil penyelenggara.

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4
- Motion
- Lucide React
- LocalStorage untuk data demo
- Mock payment provider

## Fitur Utama

### Public Website

- Homepage event yoga dan wellness
- Daftar event dan kelas yoga
- Detail event berdasarkan slug
- Form booking tiket
- Simulasi checkout
- Halaman status pembayaran sukses/gagal
- Halaman privacy policy dan terms

### Dashboard Admin

- Ringkasan dashboard admin
- Manajemen event
- Manajemen booking
- Manajemen organizer / EO
- Manajemen highlight homepage
- Daftar transaksi demo
- Pengaturan platform

### Dashboard EO

- Dashboard khusus event organizer
- Manajemen event milik EO
- Data booking event
- Profil EO

## Akun Demo

Gunakan akun berikut untuk mencoba dashboard demo:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@yogacalendarjakarta.com` | `admin123` |
| EO | `eo@yogacalendarjakarta.com` | `eo123` |

Catatan: akun di atas hanya untuk demo. Jangan gunakan pola ini untuk production.

## Cara Run Lokal

Pastikan Node.js sudah terpasang.

```bash
npm install
npm run dev
```

Buka aplikasi di browser:

```bash
http://localhost:3000
```

## Script yang Tersedia

```bash
npm run dev      # menjalankan development server
npm run build    # build production
npm run start    # menjalankan build production
npm run lint     # menjalankan ESLint
```

## Environment Variable

Lihat `.env.example` untuk contoh konfigurasi.

```env
GEMINI_API_KEY="MY_GEMINI_API_KEY"
APP_URL="MY_APP_URL"
```

Untuk demo saat ini, sebagian besar fitur utama masih berjalan dari data lokal/mock.

## Struktur Project

```txt
app/                 Route utama Next.js App Router
app/admin/           Halaman dashboard admin
app/eo/              Halaman dashboard event organizer
app/events/          Halaman daftar dan detail event
app/checkout/        Simulasi checkout booking
app/payment/         Halaman status pembayaran
components/          Komponen UI reusable
components/dashboard Komponen dashboard
lib/                 Service, dummy data, auth mock, booking, payment
hooks/               Custom hooks
```

## Batasan Saat Ini

Project ini masih prototype. Beberapa batasan penting:

- Auth masih mock dan disimpan di browser.
- Booking masih menggunakan localStorage.
- Payment masih simulasi/mock.
- Data belum tersimpan di database server.
- Role admin/EO belum memakai server-side authorization.

Untuk production, project perlu ditambah real authentication, database, server-side route protection, dan payment gateway seperti Midtrans atau Xendit.

## Deployment

Project ini siap dideploy ke Vercel sebagai demo frontend.

Alur umum:

```txt
GitHub → Vercel → Preview / Production URL
```

## Status

```txt
Demo-ready: Ya
Production-ready: Belum
Target penggunaan: portfolio, presentasi klien, validasi konsep
```
