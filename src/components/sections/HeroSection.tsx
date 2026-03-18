"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    bgImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=80",
    headline: "Nous créons des expériences",
    accent: "inoubliables",
    subtext:
      "Agence de communication événementielle spécialisée dans le marketing de guérilla, le team building et les activations de marque.",
  },
  {
    id: 2,
    bgImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80",
    headline: "Des événements qui",
    accent: "marquent les esprits",
    subtext:
      "De la conception à l'exécution, nous donnons vie à vos idées avec créativité, précision et impact.",
  },
  {
    id: 3,
    bgImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1920&q=80",
    headline: "Votre marque mérite",
    accent: "le meilleur",
    subtext:
      "Street marketing, PLV, Team Building — nous maîtrisons tous les leviers de la communication terrain.",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (animating) return;
      setAnimating(true);
      setCurrent(index);
      setTimeout(() => setAnimating(false), 700);
    },
    [animating]
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  // Auto-advance every 3s
  useEffect(() => {
    const timer = setInterval(next, 3000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">

      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          style={{
            backgroundImage: `url(${slide.bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Dark brand overlay */}
          <div className="absolute inset-0 bg-brand-primary/65" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto">
        <h1
          key={`headline-${current}`}
          className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4 animate-fade-in-up"
        >
          {slides[current].headline}{" "}
          <span className="text-brand-danger">{slides[current].accent}</span>
        </h1>

        <p
          key={`sub-${current}`}
          className="text-white/80 text-lg md:text-xl max-w-2xl leading-relaxed mb-10 animate-fade-in-up"
        >
          {slides[current].subtext}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <a
            href="#services"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-3.5 bg-brand-danger hover:bg-[#a50524] text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-brand-danger/40 hover:-translate-y-0.5"
          >
            Découvrir nos services
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-3.5 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-brand-primary transition-all duration-200 hover:-translate-y-0.5"
          >
            Nous contacter
          </a>
        </div>
      </div>

      {/* Left arrow */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 border border-white/30 text-white hover:bg-brand-danger hover:border-brand-danger transition-all duration-200 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft size={22} />
      </button>

      {/* Right arrow */}
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 border border-white/30 text-white hover:bg-brand-danger hover:border-brand-danger transition-all duration-200 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-8 h-2.5 bg-brand-danger"
                : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

    </section>
  );
}
