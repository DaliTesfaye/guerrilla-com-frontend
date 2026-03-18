"use client";
import { ArrowUp } from "lucide-react";

const footerLinks = [
  { label: "Accueil", sectionId: "hero" },
  { label: "A propos", sectionId: "about" },
  { label: "Services", sectionId: "services" },
  { label: "Partenaires", sectionId: "partenaires" },
  { label: "Contact", sectionId: "contact" },
];

export default function Footer() {
  const handleScrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    section.scrollIntoView({ behavior: "smooth" });

    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  };

  return (
    <footer className="bg-brand-primary px-6 py-14 text-white md:py-16">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_0.95fr_0.95fr_1.55fr]">
        <div>
          <h3 className="text-lg font-extrabold uppercase tracking-[0.08em]">Liens</h3>
          <span className="mt-3 block h-0.5 w-14 rounded-full bg-brand-danger" />
          <ul className="mt-5 space-y-2.5 text-sm text-white/85">
            {footerLinks.map((link) => (
              <li key={link.sectionId}>
                <button
                  type="button"
                  onClick={() => handleScrollToSection(link.sectionId)}
                  className="transition-colors duration-200 hover:text-brand-danger"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-extrabold uppercase tracking-[0.08em]">Infos</h3>
          <span className="mt-3 block h-0.5 w-14 rounded-full bg-brand-danger" />
          <div className="mt-5 space-y-2.5 text-sm leading-7 text-white/85">
            <p>Guerrilla Com</p>
            <p>Agence de communication evenementielle</p>
            <p>Activations marketing, street marketing et team building</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-extrabold uppercase tracking-[0.08em]">Contact</h3>
          <span className="mt-3 block h-0.5 w-14 rounded-full bg-brand-danger" />
          <div className="mt-5 space-y-2.5 text-sm leading-7 text-white/85">
            <p>+216 50 699 800</p>
            <p>guerrillacom.tunisie@gmail.com</p>

          </div>
        </div>

        <div>
          <h3 className="text-lg font-extrabold uppercase tracking-[0.08em]">Localisation</h3>
          <span className="mt-3 block h-0.5 w-14 rounded-full bg-brand-danger" />
          <div className="mt-5 overflow-hidden rounded-2xl border border-white/20 bg-white/10">
            <iframe
              title="Carte de localisation Guerrilla Com"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3192.541884133559!2d10.182837075491362!3d36.853446272232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd35a1e5d73c27%3A0xa69de8df8d26264c!2sGu%C3%A9rrilla%20com!5e0!3m2!1sfr!2stn!4v1773458185021!5m2!1sfr!2stn"
              className="h-52 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-white/15 pt-5 flex items-center justify-between text-xs text-white/70 md:text-sm">
        <span>© {new Date().getFullYear()} Guerrilla Com. Tous droits reserves.</span>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Retour en haut"
          className="flex items-center justify-center rounded-full bg-brand-danger p-2.5 text-white shadow-lg transition-transform duration-200 hover:-translate-y-1 hover:bg-white hover:text-brand-danger"
        >
          <ArrowUp size={18} />
        </button>
      </div>
    </footer>
  );
}