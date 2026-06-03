import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detail Kelas | Yoga Calendar Jakarta',
};

export default function EventDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
