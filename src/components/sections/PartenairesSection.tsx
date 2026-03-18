"use client"
import Image from "next/image";

const brands = [
  { src: "/dell.png", alt: "Dell" },
  { src: "/hewlett.png", alt: "Hewlett Packard" },
  { src: "/jadidalogo.png", alt: "Jadida" },
  { src: "/landor.png", alt: "Landor" },
  { src: "/mazraa.png", alt: "Mazraa" },
  { src: "/microsoft.png", alt: "Microsoft" },
  { src: "/msi.png", alt: "MSI" },
  { src: "/selja.png", alt: "Selja" },
  { src: "/shell.png", alt: "Shell" },
];

const marqueeBrands = [...brands, ...brands];

export default function PartenairesSection() {
  return (
    <section id="partenaires" className="bg-brand-surface px-6 py-24 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-brand-primary md:text-5xl">
            Nos <span className="text-brand-danger">partenaires</span>
          </h2>
          <span className="mx-auto mt-4 block h-0.75 w-20 rounded-full bg-brand-danger/80" />
          <p className="mt-6 text-base leading-7 text-slate-600 md:text-lg">
            Des marques qui nous font confiance pour concevoir, activer et faire rayonner leurs campagnes sur le terrain.
          </p>
        </div>

        <div className="relative mt-14 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-linear-to-r from-brand-surface to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-linear-to-l from-brand-surface to-transparent" />

          <div className="partner-marquee flex w-max gap-7 py-3">
            {marqueeBrands.map((brand, index) => (
              <div
                key={`${brand.src}-${index}`}
                className="flex min-w-48 items-center justify-center px-7 py-4 text-center"
              >
                <Image
                  src={brand.src}
                  alt={brand.alt}
                  width={400}
                  height={150}
                  className="h-16 w-auto object-contain transition duration-300 hover:scale-150"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .partner-marquee {
          animation: partner-marquee 28s linear infinite;
        }

        @keyframes partner-marquee {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0%);
          }
        }
      `}</style>
    </section>
  );
}