import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  return (
    <div className="fixed bottom-20 sm:bottom-6 right-6 z-50">
      <a
        href={`https://wa.me/6281342531331?text=${encodeURIComponent('Halo Yoga Calendar Jakarta, saya tertarik untuk bertanya mengenai kelas yoga dan event terdekat.')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
        aria-label="Tanya Admin di WhatsApp"
      >
        {/* Animated outer ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping group-hover:animate-none"></span>
        
        {/* Main Icon */}
        <MessageCircle className="w-7 h-7 fill-current relative z-10" />
        
        {/* Hover label */}
        <span className="absolute right-16 bg-brand-charcoal text-white text-xs px-3 py-1.5 rounded-full font-sans whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md pointer-events-none">
          Tanya Admin WA
        </span>
      </a>
    </div>
  );
};
