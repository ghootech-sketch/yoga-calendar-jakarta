import React from 'react';
import Link from 'next/link';
import { Sparkles, Waves, Heart, Eye, Wind, Music, LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  description: string;
  count: number;
  bgClass: string;
}

// Icon mapper for dynamic types
const iconMap: Record<string, LucideIcon> = {
  'Hatha Yoga': Sparkles,
  'Vinyasa Flow': Waves,
  'Prenatal Yoga': Heart,
  'Meditation': Eye,
  'Breathwork': Wind,
  'Sound Healing': Music,
};

export const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  description,
  count,
  bgClass,
}) => {
  const IconComponent = iconMap[name] || Sparkles;

  return (
    <Link
      href={`/events?category=${encodeURIComponent(name)}`}
      className="group block p-6 bg-white rounded-3xl border border-brand-beige/50 hover:border-brand-sage/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex gap-4 items-start">
        <div className={`p-3.5 rounded-2xl ${bgClass} shrink-0 transition-transform duration-300 group-hover:scale-110`}>
          <IconComponent className="w-6 h-6" />
        </div>
        
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-sans font-bold text-base text-brand-brown group-hover:text-brand-sage transition-colors">
              {name}
            </h3>
            <span className="text-[10px] uppercase tracking-wider font-bold text-brand-brown/40 bg-brand-cream px-2 py-0.5 rounded-full">
              {count} Kelas
            </span>
          </div>
          <p className="text-xs text-brand-brown/70 leading-relaxed font-light line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};
