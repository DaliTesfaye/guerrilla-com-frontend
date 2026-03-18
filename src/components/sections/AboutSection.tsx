"use client";

import { ArrowRight } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="bg-brand-surface px-6 py-24 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <div>
            <h3 className="text-3xl font-black uppercase tracking-[0.08em] text-brand-primary md:text-4xl">
              A propos
            </h3>
            <span className="mt-3 block h-0.75 w-20 rounded-full bg-brand-danger/80" />
          </div>

          <h2 className="mt-8 max-w-2xl text-4xl font-extrabold leading-tight text-brand-primary md:text-5xl">
            Guerrilla Com transforme les idees en experiences <span className="text-brand-danger">memorables</span>.
          </h2>

          <div className="mt-6 max-w-2xl space-y-4 text-base leading-8 text-slate-600 md:text-lg">
            <p>
              La création de Guerrilla Com est l’aboutissement de plus de 15 ans d’expérience de notre fondateur dans le secteur de l’évènementiel en Tunisie. Nos prestations de prédilection sont les opérations de pousse à la vente, les activations marketing, les animations GMS, le street marketing et les gadgets promotionnels.
            </p>
            <p>
                D'ailleurs, vous avez certainement vu ou même acheté certains des gadgets que nous avons introduits en Tunisie pour des opérations de promotions pour des leaders nationaux en FMCG (Yaourt, fromage, biscuit, shampoing ...)
            </p>
          </div>

          <a
            href="#services"
            className="mt-10 inline-flex items-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-brand-primary-dark hover:shadow-lg hover:shadow-brand-primary/20"
          >
            Decouvrir nos services
            <ArrowRight size={18} />
          </a>
        </div>

        <div className="w-full lg:pl-6">
          <div className="rounded-3xl border border-brand-primary/15 bg-white p-4 shadow-xl shadow-brand-primary/10 md:p-5">
            <div className="aspect-video overflow-hidden rounded-2xl border border-brand-primary/20 bg-brand-surface">
              <video
                className="h-full w-full object-cover"
                controls
                playsInline
                preload="metadata"
                aria-label="Presentation video"
              >
                <source src="/aboutvideo.mp4" type="video/mp4" />
                Votre navigateur ne supporte pas la lecture video.
              </video>
            </div>

            <div className="mt-4 w-full rounded-2xl border border-white/70 bg-white px-6 py-5 shadow-md shadow-brand-primary/10">
              <p className="text-3xl font-extrabold text-brand-primary">+120</p>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
                activations, lancements et experiences produites
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}