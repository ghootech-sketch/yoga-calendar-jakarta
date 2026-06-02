'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, MapPin, Calendar as CalendarIcon, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { EventCard } from '@/components/EventCard';
import { EmptyState } from '@/components/EmptyState';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { DUMMY_EVENTS, CATEGORIES, CITIES } from '@/lib/dummy-events';
import { EventService } from '@/lib/events/event-service';

interface InnerProps {
  categoryParam: string;
  cityParam: string;
  searchParam: string;
}

function EventsListingInner({ categoryParam, cityParam, searchParam }: InnerProps) {
  const router = useRouter();

  // Load dynamic events from localStorage
  const [eventsList, setEventsList] = useState<any[]>(() => DUMMY_EVENTS);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const init = () => {
      setEventsList(EventService.getPublishedEvents());
      setIsHydrated(true);
    };
    const handle = setTimeout(init, 0);
    return () => clearTimeout(handle);
  }, []);

  // Filter and Sorting states initializations
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedCity, setSelectedCity] = useState(cityParam);
  const [selectedDate, setSelectedDate] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'price-asc' | 'price-desc'

  // Derive and dynamically process filtered lists synchronously during render
  let filteredEvents = [...eventsList];

  // Filter by Search Query
  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase();
    filteredEvents = filteredEvents.filter(
      (event) =>
        event.title.toLowerCase().includes(q) ||
        event.description.toLowerCase().includes(q) ||
        event.locationName.toLowerCase().includes(q) ||
        event.organizerName.toLowerCase().includes(q)
    );
  }

  // Filter by Category
  if (selectedCategory && selectedCategory !== 'all') {
    filteredEvents = filteredEvents.filter((event) => event.category === selectedCategory);
  }

  // Filter by City Location
  if (selectedCity && selectedCity !== 'all') {
    filteredEvents = filteredEvents.filter((event) => event.city === selectedCity);
  }

  // Filter by Specific Date
  if (selectedDate !== '') {
    filteredEvents = filteredEvents.filter((event) => event.startDate === selectedDate);
  }

  // Apply Sorting
  if (sortBy === 'date') {
    // Sort earliest date first
    filteredEvents.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  } else if (sortBy === 'price-asc') {
    filteredEvents.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filteredEvents.sort((a, b) => b.price - a.price);
  }

  // Reset all filters to default state
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedCity('');
    setSelectedDate('');
    setSortBy('date');
    router.replace('/events');
  };

  return (
    <div className="space-y-12">
      {/* Listing Hero Headings */}
      <div className="text-center space-y-4 max-w-2xl mx-auto pt-6">
        <span className="inline-block px-3.5 py-1 text-xs font-semibold tracking-widest uppercase text-brand-sage bg-brand-sage/10 rounded-full">
          Jadwal Lengkap
        </span>
        <h1 className="font-sans font-bold text-3xl sm:text-4xl md:text-5xl text-brand-brown tracking-tight">
          Temukan Kedamaian Terdekat
        </h1>
        <p className="text-sm sm:text-base text-brand-brown/70 leading-relaxed font-light">
          Jelajahi dan pilih kelas spiritual, pernapasan, penyembuhan suara, atau yoga dinamis terpilih di berbagai lokasi strategis di sekitar tempat tinggal Anda di Jakarta.
        </p>
      </div>

      {/* Filter and Control Panel Box */}
      <div className="bg-white rounded-3xl border border-brand-beige/65 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Text Search Input */}
          <div className="md:col-span-4 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-brand-brown/40">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Cari nama kelas atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm pl-11 pr-10 py-3 bg-brand-cream/40 border border-brand-beige rounded-2xl focus:ring-2 focus:ring-brand-sage/20 focus:border-brand-sage focus:outline-none transition-all placeholder:text-brand-brown/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-brand-brown/40 hover:text-brand-brown transition-colors"
                aria-label="Clear Search Input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Location Dropdown */}
          <div className="md:col-span-3 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-brand-brown/40 pointer-events-none">
              <MapPin className="w-4 h-4" />
            </span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full text-sm pl-11 pr-4 py-3 bg-brand-cream/40 border border-brand-beige rounded-2xl focus:ring-2 focus:ring-brand-sage/20 focus:border-brand-sage focus:outline-none appearance-none cursor-pointer text-brand-brown/80"
            >
              <option value="">Semua Wilayah Jakarta</option>
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Date Input Helper */}
          <div className="md:col-span-3 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-brand-brown/40 pointer-events-none">
              <CalendarIcon className="w-4 h-4" />
            </span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full text-sm pl-11 pr-4 py-3 bg-brand-cream/40 border border-brand-beige rounded-2xl focus:ring-2 focus:ring-brand-sage/20 focus:border-brand-sage focus:outline-none cursor-pointer text-brand-brown/80"
              title="Pilih tanggal mulai kelas"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate('')}
                className="absolute inset-y-0 right-3.5 flex items-center text-brand-brown/40 hover:text-brand-brown transition-colors"
                aria-label="Clear Date"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sorting Dropdown */}
          <div className="md:col-span-2 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-brand-brown/40 pointer-events-none">
              <ArrowUpDown className="w-4 h-4" />
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full text-sm pl-11 pr-4 py-3 bg-brand-cream/40 border border-brand-beige rounded-2xl focus:ring-2 focus:ring-brand-sage/20 focus:border-brand-sage focus:outline-none appearance-none cursor-pointer text-brand-brown/80"
            >
              <option value="date">Tanggal Terdekat</option>
              <option value="price-asc">Harga Terendah</option>
              <option value="price-desc">Harga Tertinggi</option>
            </select>
          </div>

        </div>

        {/* Category Swipeable Filter Pills */}
        <div className="space-y-2 pt-2 border-t border-brand-beige/50">
          <div className="flex items-center justify-between text-xs text-brand-brown/65 mb-2 font-medium">
            <span className="flex items-center gap-1.5 uppercase tracking-wider font-bold text-[10px]">
              <SlidersHorizontal className="w-3 h-3" /> Filter Kategori Yoga
            </span>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory('')}
                className="text-brand-sage font-bold hover:underline transition-all"
              >
                Sembunyikan Filter Kategori (X)
              </button>
            )}
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-6 px-6 sm:mx-0 sm:px-0">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4.5 py-2 text-xs font-semibold tracking-wide rounded-full cursor-pointer shrink-0 transition-all ${
                selectedCategory === ''
                  ? 'bg-brand-brown text-brand-cream shadow-sm'
                  : 'bg-brand-cream hover:bg-brand-beige text-brand-brown border border-brand-beige'
              }`}
            >
              Semua Kelas
            </button>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4.5 py-2 text-xs font-semibold tracking-wide rounded-full cursor-pointer shrink-0 transition-all ${
                    isSelected
                      ? 'bg-brand-sage text-white shadow-sm'
                      : 'bg-brand-cream hover:bg-brand-beige text-brand-brown border border-brand-beige'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Display Badge summary of active filters */}
        {(selectedCategory || selectedCity || selectedDate || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 pt-3 text-xs text-brand-brown/60">
            <span>Filter Aktif:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-brand-cream px-3 py-1 rounded-full border border-brand-beige text-brand-brown">
                Kata kunci: &ldquo;{searchQuery}&rdquo;
                <X className="w-3 h-3 cursor-pointer text-brand-brown/60 hover:text-brand-brown" onClick={() => setSearchQuery('')} />
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 bg-brand-cream px-3 py-1 rounded-full border border-brand-beige text-brand-brown">
                Kategori: {selectedCategory}
                <X className="w-3 h-3 cursor-pointer text-brand-brown/60 hover:text-brand-brown" onClick={() => setSelectedCategory('')} />
              </span>
            )}
            {selectedCity && (
              <span className="inline-flex items-center gap-1 bg-brand-cream px-3 py-1 rounded-full border border-brand-beige text-brand-brown">
                Lokasi: {selectedCity}
                <X className="w-3 h-3 cursor-pointer text-brand-brown/60 hover:text-brand-brown" onClick={() => setSelectedCity('')} />
              </span>
            )}
            {selectedDate && (
              <span className="inline-flex items-center gap-1 bg-brand-cream px-3 py-1 rounded-full border border-brand-beige text-brand-brown">
                Tanggal: {selectedDate}
                <X className="w-3 h-3 cursor-pointer text-brand-brown/60 hover:text-brand-brown" onClick={() => setSelectedDate('')} />
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="text-xs text-brand-sage font-bold hover:underline ml-auto animate-fade-in"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </div>

      {/* Grid listing and Empty Sates checks */}
      {filteredEvents.length === 0 ? (
        <EmptyState onReset={handleResetFilters} />
      ) : (
        <div>
          <div className="flex justify-between items-center text-xs text-brand-brown/60 mb-6 font-bold uppercase tracking-widest pl-1">
            <span>Ditemukan {filteredEvents.length} Kelas Yoga</span>
            <span>Kota Jakarta</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function EventsListingContent() {
  const searchParams = useSearchParams();
  
  const categoryParam = searchParams.get('category') || '';
  const cityParam = searchParams.get('city') || '';
  const searchParam = searchParams.get('search') || '';

  // Key based remounting to sync router transitions automatically
  const innerKey = `${categoryParam}_${cityParam}_${searchParam}`;

  return (
    <EventsListingInner
      key={innerKey}
      categoryParam={categoryParam}
      cityParam={cityParam}
      searchParam={searchParam}
    />
  );
}
