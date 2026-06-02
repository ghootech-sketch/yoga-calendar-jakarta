'use client';

import React, { useState } from 'react';
import { Search, ChevronDown, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface DataTableProps<T> {
  data: T[];
  headers: string[];
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  renderDesktopRow: (item: T, index: number) => React.ReactNode;
  renderMobileCard: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string;
  actions?: React.ReactNode;
}

export default function DataTable<T>({
  data,
  headers,
  searchPlaceholder = 'Cari data...',
  searchFilter,
  renderDesktopRow,
  renderMobileCard,
  emptyMessage = 'Tidak ada data yang ditemukan',
  actions
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');

  const filteredData = searchFilter && query.trim() !== ''
    ? data.filter(item => searchFilter(item, query))
    : data;

  return (
    <div className="space-y-4">
      
      {/* Control row with Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Search Input bar */}
        {searchFilter && (
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-brown/40">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-beige/60 rounded-2xl text-xs text-brand-brown placeholder:text-brand-brown/40 focus:outline-none focus:ring-1 focus:ring-brand-sage focus:border-brand-sage transition-all shadow-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        )}

        {/* Dynamic customized slots like filters or buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {actions}
        </div>
      </div>

      {/* Main Responsive Canvas container */}
      {filteredData.length === 0 ? (
        <div className="bg-white rounded-3xl border border-brand-beige/50 p-12 text-center shadow-sm">
          <p className="text-sm text-brand-brown/50 font-light">{emptyMessage}</p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE STRUCTURE */}
          <div className="hidden md:block overflow-hidden bg-white border border-brand-beige/50 rounded-3xl shadow-sm selection:bg-brand-sage/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-cream/50 border-b border-brand-beige/35">
                    {headers.map((header, idx) => (
                      <th 
                        key={idx} 
                        className="px-6 py-4 text-[10px] uppercase font-bold tracking-wider text-brand-brown/60 select-none"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-beige/20">
                  {filteredData.map((item, idx) => renderDesktopRow(item, idx))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE LIST CARDS VIEW */}
          <div className="block md:hidden space-y-4">
            {filteredData.map((item, idx) => renderMobileCard(item, idx))}
          </div>
        </>
      )}

    </div>
  );
}
