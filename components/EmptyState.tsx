import React from 'react';
import { SearchX, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  onReset: () => void;
  title?: string;
  description?: string;
  buttonText?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onReset,
  title = 'Tidak Ada Kelas Ditemukan',
  description = 'Maaf, kami tidak menemukan kelas yoga yang sesuai dengan kombinasi filter Anda saat ini. Cobalah menyetel ulang pencarian Anda.',
  buttonText = 'Atur Ulang Filter',
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-brand-beige/55 max-w-lg mx-auto shadow-sm">
      <div className="p-4 bg-brand-cream text-brand-sage/80 rounded-full mb-5">
        <SearchX className="w-10 h-10" />
      </div>
      <h3 className="font-sans font-bold text-lg text-brand-brown mb-2.5">
        {title}
      </h3>
      <p className="text-sm text-brand-brown/65 leading-relaxed mb-6">
        {description}
      </p>
      
      <Button variant="outline" size="sm" onClick={onReset} className="gap-2 shrink-0">
        <RefreshCw className="w-3.5 h-3.5" />
        {buttonText}
      </Button>
    </div>
  );
};
