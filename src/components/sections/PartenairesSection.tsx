"use client";

import Image from "next/image";

const brands = [
  { src: "/Logo Dell Technologies.png", alt: "Dell" },
  { src: "/Hewlett_Packard_Enterprise_logo.svg.png", alt: "Hewlett Packard" },
  { src: "/jadidalogo.png", alt: "Jadida" },
  { src: "/LOGO LANDOR.png", alt: "Landor" },
  { src: "/logo mazraa.png", alt: "Mazraa" },
  { src: "/micr.png", alt: "Microsoft" },
  { src: "/logo1.png", alt: "MSI" },
  { src: "/logo selja.png", alt: "Selja" },
  { src: "/logo shell.png", alt: "Shell" },
  { src: "/logo brandt.png", alt: "Brandt" },
  { src: "/LOGO DANINO.png", alt: "Brandt" },
  { src: "/Logo Deìlice danone.png", alt: "Brandt" },
];

export default function PartenairesSection() {
  return (
    <section
      id="partenaires"
      className="relative overflow-hidden px-6 py-24 md:py-28"
    >
      {/* Couche 1 : Image de fond about-bg */}
      <Image
        src="/about-bg.jpg"
        alt="Partenaires Background"
        fill
        priority
        className="object-cover object-center z-0"
      />

      {/* Couche 2 : Overlay blanc pur (sans aucun flou) pour assurer le contraste */}
      <div className="absolute inset-0 bg-white/30 z-10" />

      {/* Couche 3 : Contenu principal */}
      <div className="relative z-20 mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-brand-primary md:text-5xl">
            Nos <span className="text-brand-danger">partenaires</span>
          </h2>
          <span className="mx-auto mt-4 block h-0.75 w-20 rounded-full bg-brand-danger/80" />
          <p className="mt-6 text-base leading-7 text-slate-900 md:text-lg font-semibold">
            Des marques qui nous font confiance pour concevoir, activer et faire
            rayonner leurs campagnes sur le terrain.
          </p>
        </div>

        {/* Grille de logos : 4 par ligne, fond blanc pur et ombres légères */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {brands.map((brand, index) => (
            <div
              key={`${brand.src}-${index}`}
              className="group flex aspect-video items-center justify-center overflow-hidden rounded-2xl p-4 md:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 "
            >
              {/* Conteneur de l'image du logo */}
              <div className="relative h-16 md:h-20 w-full">
                <Image
                  src={brand.src}
                  alt={brand.alt}
                  fill
                  className="object-contain transition-transform duration-300 ease-out group-hover:scale-115"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
