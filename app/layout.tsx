import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Yoga Calendar Jakarta | Platform Booking Kelas & Event Yoga',
  description: 'Prototype platform booking kelas dan event yoga di Jakarta dengan admin portal dan EO dashboard.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="id">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
