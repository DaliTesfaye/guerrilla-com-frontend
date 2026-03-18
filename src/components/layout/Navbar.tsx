"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "À PROPOS", sectionId: "about" },
  { label: "SERVICES", sectionId: "services" },
  { label: "PROJETS", sectionId: "projects" },
  { label: "PROCEDURES", sectionId: "procedures" },
  { label: "PARTENAIRES", sectionId: "partenaires" },
  { label: "CONTACT", sectionId: "contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  // Add shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight active section based on scroll position
  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.sectionId);

    const onScroll = () => {
      const scrollY = window.scrollY + 80; // offset for navbar height

      // Find the last section whose top is above the scroll position
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setIsOpen(false);
    const el = document.getElementById(sectionId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth" });

    // Keep clean URL with no hash fragment after navigation.
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-brand-primary transition-shadow duration-300 ${
        scrolled ? "shadow-lg shadow-brand-primary/30" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative">

        {/* Logo */}
        <button
          type="button"
          onClick={() => handleNavClick("hero")}
          className="shrink-0"
          aria-label="Retour en haut"
        >
          <Image
            src="/logo.png"
            alt="Guerrilla Com"
            width={140}
            height={56}
            priority
            className="h-10 w-auto object-contain"
          />
        </button>

        {/* Desktop nav links — centered */}
        <nav className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => {
            const isActive = activeSection === link.sectionId;
            return (
              <button
                key={link.sectionId}
                onClick={() => handleNavClick(link.sectionId)}
                className="group relative px-4 py-2 text-sm font-medium transition-all duration-200 text-white whitespace-nowrap"
              >
                {link.label}
                {/* Underline indicator */}
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-brand-danger rounded-full transition-all duration-200 ${
                    isActive ? "w-3/4" : "w-0 group-hover:w-3/4"
                  }`}
                />
              </button>
            );
          })}
        </nav>



        {/* CTA button — right */}
        <div className="hidden md:flex items-center">
          <button
            onClick={() => handleNavClick("contact")}
            className="relative inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-lg overflow-hidden border border-white/30 hover:border-brand-danger transition-all duration-300 group"
          >
            <span className="absolute inset-0 bg-brand-danger translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
            <span className="relative z-10">Nous contacter</span>
            
          </button>
        </div>

        {/* Hamburger — mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white p-1.5 rounded-lg hover:bg-white/10 transition"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-primary-dark border-t border-white/10 px-6 py-4 flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive = activeSection === link.sectionId;
            return (
              <button
                key={link.sectionId}
                onClick={() => handleNavClick(link.sectionId)}
                className={`text-left px-4 py-2.5 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActive
                    ? "text-brand-danger border-l-2 border-brand-danger pl-3"
                    : "text-white hover:text-brand-danger hover:border-l-2 hover:border-brand-danger hover:pl-3"
                }`}
              >
                {link.label}
              </button>
            );
          })}
          <button
            onClick={() => handleNavClick("contact")}
            className="mt-3 w-full py-2.5 text-sm font-semibold text-white rounded-lg border border-white/30 hover:bg-brand-danger hover:border-brand-danger transition-all duration-300"
          >
            Nous contacter →
          </button>
        </div>
      )}
    </header>
  );
}
