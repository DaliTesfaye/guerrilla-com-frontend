import { getServices } from "@/lib/services"; // Adjust import path to where your getServices / SERVICES is saved
import ServicesCardsGrid from "@/features/services/components/ServicesCardsGrid";
import Image from "next/image"; 

export default function ServicesSection() {
  // Directly load services on the server (zero network delay)
  const services = getServices();

  return (
    <section 
      id="services" 
      className="relative overflow-hidden px-6 py-24 md:py-28"
    >
      {/* Couche 1 : L'image de fond (z-0) */}
      <Image
        src="/services-bg.jpg"
        alt="Guerrilla Com Services Background"
        fill
        priority
        className="object-cover object-center z-0"
      />

      <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] z-10" />

      {/* Couche 3 : Conteneur principal du contenu (z-20) */}
      <div className="relative z-20 mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            Nos <span className="text-brand-danger">services</span>
          </h2>
          <span className="mx-auto mt-4 block h-0.75 w-20 rounded-full bg-brand-danger/80" />
          <p className="mt-6 text-base leading-7 text-white md:text-lg">
            Guerrilla Com met à votre disposition son expérience confirmée dans six différentes prestations. Découvrez les!
          </p>
        </div>

        <div className="mt-12">
          {services.length === 0 ? (
            <p className="text-center text-sm text-slate-500">Aucun service trouvé.</p>
          ) : (
            <ServicesCardsGrid services={services} />
          )}
        </div>
      </div>
    </section>
  );
}