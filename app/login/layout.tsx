import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portal EO & Admin | Yoga Calendar Jakarta',
  description: 'Login ke dashboard Admin atau partner EO untuk mengelola kelas, event, dan reservasi.',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
