'use client';

import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: any;
  subtext?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

export default function DashboardCard({ title, value, icon: Icon, subtext, trend, className = '' }: DashboardCardProps) {
  return (
    <div className={`bg-white rounded-3xl border border-brand-beige/50 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden flex flex-col justify-between ${className}`}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-brand-brown/50 tracking-wider block">
            {title}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-brand-brown tracking-tight">
            {value}
          </div>
        </div>
        <div className="p-3 bg-brand-sage/10 text-brand-sage rounded-2xl">
          <Icon className="w-5 h-5 shrink-0" />
        </div>
      </div>
      
      {(subtext || trend) && (
        <div className="mt-4 pt-4 border-t border-brand-beige/30 flex items-center gap-1.5 text-xs text-brand-brown/60 font-light">
          {trend && (
            <span className={`font-bold px-1.5 py-0.5 rounded ${
              trend.positive 
                ? 'bg-emerald-50 text-emerald-700' 
                : 'bg-rose-50 text-rose-750'
            }`}>
              {trend.value}
            </span>
          )}
          <span>{subtext}</span>
        </div>
      )}
    </div>
  );
}
