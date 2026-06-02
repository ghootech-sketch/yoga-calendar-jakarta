import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Clock, MessageCircle, User } from 'lucide-react';
import { Event } from '@/lib/dummy-events';
import { formatPrice, formatDate, getDateParts } from '@/lib/utils';
import { getEventAvailableSlots } from '@/lib/bookings/booking-store';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { day, month, weekday } = getDateParts(event.startDate);
  
  const [availableSlots, setAvailableSlots] = useState<number>(event.availableSlot);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const init = () => {
      setAvailableSlots(getEventAvailableSlots(event));
      setIsHydrated(true);
    };
    const handle = setTimeout(init, 0);
    return () => clearTimeout(handle);
  }, [event]);

  const activeAvailableSlots = isHydrated ? availableSlots : event.availableSlot;
  const isFewSlotsLeft = activeAvailableSlots > 0 && activeAvailableSlots <= 5;
  const isSoldOut = activeAvailableSlots === 0;

  return (
    <div
      id={`event-card-${event.id}`}
      className="group bg-white rounded-3xl border border-brand-beige/50 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      {/* Event Header with Image & Badges */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-beige">
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
        />
        
        {/* Date Stamp */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm">
          <span className="text-xs font-bold text-brand-sage tracking-widest leading-none mb-0.5">{weekday}</span>
          <span className="text-lg font-bold text-brand-brown leading-none">{day}</span>
          <span className="text-[9px] font-semibold text-brand-brown/60 tracking-wider leading-none">{month}</span>
        </div>

        {/* Highlights overlay badge */}
        {event.isHighlighted && (
          <div className="absolute top-4 right-4 bg-brand-sage text-white px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm">
            Rekomendasi
          </div>
        )}

        {/* Category Overlay */}
        <div className="absolute bottom-4 left-4">
          <span className="px-3.5 py-1 bg-brand-brown text-brand-cream text-xs font-medium tracking-wide rounded-full shadow-sm">
            {event.category}
          </span>
        </div>
      </div>

      {/* Event Body Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Instructor/Organizer */}
          <div className="flex items-center gap-1.5 text-xs text-brand-brown/60 mb-2 font-medium">
            <User className="w-3.5 h-3.5" />
            <span>{event.organizerName}</span>
          </div>

          {/* Event Title */}
          <h3 className="font-sans font-bold text-lg text-brand-brown group-hover:text-brand-sage transition-colors line-clamp-1 mb-3">
            <Link href={`/events/${event.slug}`} className="focus:outline-none">
              {event.title}
            </Link>
          </h3>

          {/* Summary Details Grid */}
          <div className="space-y-2 mb-5">
            <div className="flex items-center gap-2.5 text-xs text-brand-brown/70 leading-normal">
              <Clock className="w-4 h-4 text-brand-sage shrink-0" />
              <span>{event.startTime} - {event.endTime} WIB</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-brand-brown/70 leading-normal">
              <MapPin className="w-4 h-4 text-brand-sage shrink-0 mt-0.5" />
              <span className="line-clamp-1">{event.locationName}, {event.city}</span>
            </div>
          </div>
        </div>

        {/* Price & Availabilities & Actions */}
        <div className="pt-4 border-t border-brand-beige/50">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <div className="text-[10px] text-brand-brown/50 font-bold uppercase tracking-wider">Investasi</div>
              <div className="text-base font-bold text-brand-brown">{formatPrice(event.price)}</div>
            </div>
            
            {/* Slot indicators */}
            <div className="text-right">
              {isSoldOut ? (
                <span className="inline-block px-2.5 py-1 bg-red-50 text-red-700 text-[10px] font-bold rounded-md">
                  Habis Terjual
                </span>
              ) : isFewSlotsLeft ? (
                <span className="inline-block px-2.5 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold animate-pulse rounded-md">
                  Sisa {activeAvailableSlots} Slot!
                </span>
              ) : (
                <span className="text-xs text-brand-brown/50 font-medium">
                  {activeAvailableSlots} slot tersedia
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            <Link
              href={`/events/${event.slug}`}
              className="col-span-4 inline-flex items-center justify-center px-4 py-2.5 bg-brand-cream hover:bg-brand-sage text-brand-brown hover:text-white border border-brand-sage/20 text-xs font-semibold tracking-wide rounded-full text-center transition-all duration-300 shadow-sm"
            >
              Lihat Detail
            </Link>
            
            <a
              href={`https://wa.me/6281342531331?text=${encodeURIComponent(`Halo Yoga Calendar Jakarta, saya tertarik bertanya tentang sesi: ${event.title}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-1 inline-flex items-center justify-center bg-brand-sage/10 hover:bg-brand-sage text-brand-sage hover:text-white p-2.5 rounded-full transition-all duration-300 shadow-sm"
              title="Tanya Admin via WA"
              aria-label="Tanya Admin di WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
