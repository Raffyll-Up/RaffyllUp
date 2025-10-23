'use client';

import { Gem, Menu, X } from "lucide-react";
import Link from "next/link";
import CustomButton from "./CustomButton";
import { useState, useEffect } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest('.mobile-menu') && !target.closest('.menu-button')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/", label: "Explore" },
    { href: "/create-raffle", label: "Documentation" },
    { href: "/my-raffles", label: "About Us" },
  ];

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-dark-primary/95 border-b border-dark-secondary/20 py-2' 
          : 'bg-dark-primary/90 border-b border-dark-secondary/20 py-3'
      } px-4 sm:px-6 backdrop-blur-md`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link 
            href="/" 
            className="flex items-center gap-3 group"
            onClick={() => setIsMenuOpen(false)}
          >
            <Gem
              size={20}
              className="text-teal-400 group-hover:rotate-12 transition-transform duration-300"
            />
            <h2 className="text-xl font-bold text-teal-400">Raffyl</h2>
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-300 hover:text-teal-300 focus:outline-none menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-300 hover:text-teal-300 text-sm font-medium transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {/* Connect Button - Hidden on mobile when menu is open */}
        <div className={`hidden md:block`}>
          <CustomButton />
        </div>

      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mobile-menu">
          <div className="pt-4 pb-3 border-t border-dark-secondary/20 mt-3">
            <div className="flex flex-col space-y-3 px-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-300 hover:bg-dark-secondary/30 hover:text-teal-300 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <CustomButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
