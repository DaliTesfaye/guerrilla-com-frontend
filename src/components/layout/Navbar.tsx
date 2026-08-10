"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "À PROPOS", sectionId: "about" },
  { label: "SERVICES", sectionId: "services" },
  { label: "PROJETS", sectionId: "projects" },
  { label: "EVENEMENTS", sectionId: "events" },
  { label: "PROCEDURES", sectionId: "procedures" },
  { label: "ACTUALITÉ", sectionId: "actualite" },
  { label: "PARTENAIRES", sectionId: "partenaires" },
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

  // Position-sorted scroll spy loop
  useEffect(() => {
    const sectionIds = [...navLinks.map((l) => l.sectionId), "contact"];

    const onScroll = () => {
      const scrollY = window.scrollY + 120; // Comfort offset for navbar height + spacing

      // 1. Map all sections to their real layout positions (including footer as fallback for contact)
      const elements = sectionIds
        .map((id) => {
          let el = document.getElementById(id);
          if (!el && id === "contact") {
            el = document.querySelector("footer") || document.getElementById("footer");
          }
          return el ? { id, top: el.offsetTop } : null;
        })
        .filter((item): item is { id: string; top: number } => item !== null);

      // 2. Sort sections by their actual physical top coordinates from top to bottom
      elements.sort((a, b) => a.top - b.top);

      // 3. Find the current section occupying the viewport
      let current = elements[0]?.id || "";
      for (const el of elements) {
        if (scrollY >= el.top) {
          current = el.id;
        }
      }

      // 4. Update the state (ignore 'contact' to keep the main menu clean when hitting the footer)
      if (current === "contact") {
        setActiveSection("");
      } else {
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // Run immediately on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setIsOpen(false);

    // Look for target by ID, falling back to <footer> for contact if ID is not set
    let el = document.getElementById(sectionId);
    if (!el && sectionId === "contact") {
      el = document.querySelector("footer") || document.getElementById("footer");
    }

    if (!el) return;
    el.scrollIntoView({ behavior: "smooth" });

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
        <Link href="/" className="shrink-0" aria-label="Retour à l'accueil">
          <Image
            src="/logo.png"
            alt="Guerrilla Com"
            width={140}
            height={56}
            priority
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop nav links — centered */}
        <nav className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => {
            const isActive = activeSection === link.sectionId;
            return (
              <button
                key={link.sectionId}
                onClick={() => handleNavClick(link.sectionId)}
                className="group relative px-4 py-2 text-[15px] font-normal uppercase text-white whitespace-nowrap"
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
                className={`text-left px-4 py-2.5 rounded-lg text-[15px] font-normal uppercase transition-all duration-200 ${
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