'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, MessageCircle } from 'lucide-react';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Semua Kelas', href: '/events' },
    { name: 'Portal EO', href: '/login' },
  ];

  return (
    <header
      id="app-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-brand-cream/80 backdrop-blur-md border-b border-brand-beige shadow-sm py-4'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 focus:outline-none">
            <span className="font-sans font-semibold text-lg sm:text-xl tracking-tight text-brand-brown">
              Yoga Calendar <span className="text-brand-sage font-light">Jakarta</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors duration-200 relative py-1 ${
                    isActive
                      ? 'text-brand-sage font-semibold'
                      : 'text-brand-brown/70 hover:text-brand-brown'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-sage rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="https://wa.me/6281342531331"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 text-xs uppercase tracking-wider font-semibold bg-brand-sage hover:bg-brand-sagedark text-white rounded-full transition-all duration-300 gap-1.5 shadow-sm hover:shadow-md"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              Tanya WA
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-brand-brown p-2 rounded-full hover:bg-brand-beige/50 transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] bg-brand-cream z-40 flex flex-col px-6 py-8 space-y-6 animate-fade-in border-t border-brand-beige">
          <nav className="flex flex-col space-y-5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-medium py-2 border-b border-brand-beige/50 transition-colors ${
                    isActive ? 'text-brand-sage font-semibold pl-1' : 'text-brand-brown/85'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 flex flex-col space-y-4">
            <a
              href="https://wa.me/6281342531331"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="w-full inline-flex items-center justify-center px-5 py-3 text-sm font-semibold bg-brand-sage text-white rounded-full transition-colors gap-2 hover:bg-brand-sagedark text-center"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              Tanya via WhatsApp
            </a>
            <div className="text-center text-xs text-brand-brown/65">
              Hubungi kami di 0813-4253-1331
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
