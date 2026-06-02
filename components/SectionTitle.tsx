import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  badge?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  badge,
  align = 'center',
  className = '',
}) => {
  const alignmentClass = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  };

  return (
    <div className={`max-w-2xl mb-12 ${alignmentClass[align]} ${className}`}>
      {badge && (
        <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-widest uppercase text-brand-sage bg-brand-sage/10 rounded-full">
          {badge}
        </span>
      )}
      <h2 className="font-sans font-bold text-2xl sm:text-3xl md:text-4xl text-brand-brown tracking-tight leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3.5 text-sm sm:text-base text-brand-brown/65 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
