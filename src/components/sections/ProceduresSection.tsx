"use client";
import { Fragment } from "react";
import {
  ClipboardList,
  Lightbulb,
  CalendarDays,
  Settings2,
  Rocket,
  BarChart3,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const procedures = [
  {
    step: 1,
    icon: ClipboardList,
    title: "Briefing Client",
    description: "Nous écoutons vos besoins, objectifs et contraintes pour bien cerner votre projet.",
  },
  {
    step: 2,
    icon: Lightbulb,
    title: "Stratégie & Concept",
    description: "Notre équipe créative élabore un concept sur mesure aligné avec votre identité de marque.",
  },
  {
    step: 3,
    icon: CalendarDays,
    title: "Planification",
    description: "Nous établissons un plan d'action détaillé avec un calendrier précis et des jalons clairs.",
  },
  {
    step: 4,
    icon: Settings2,
    title: "Production",
    description: "Fabrication des supports, coordination des prestataires et préparation logistique complète.",
  },
  {
    step: 5,
    icon: Rocket,
    title: "Exécution",
    description: "Déploiement et animation de l'événement avec notre équipe terrain expérimentée.",
  },
  {
    step: 6,
    icon: BarChart3,
    title: "Suivi & Rapport",
    description: "Analyse des résultats et rapport détaillé post-événement pour mesurer l'impact.",
  },
];

export default function ProceduresSection() {
  const topRow = procedures.slice(0, 3);
  const bottomRow = [procedures[5], procedures[4], procedures[3]];

  return (
    <section id="procedures" className="bg-brand-surface px-6 py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-14">
          <h2 className="text-4xl font-extrabold leading-tight text-brand-primary md:text-5xl">
            Nos <span className="text-brand-danger">Procédures</span>
          </h2>
          <span className="mt-4 block h-0.75 w-20 rounded-full bg-brand-danger/80" />
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-500 md:text-lg">
            De la première rencontre jusqu&apos;au bilan final, voici comment nous travaillons.
          </p>
        </div>

        <div className="relative flex flex-col gap-4 lg:px-16">
          {/* Row 1: steps 1–3 */}
          <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:items-center">
            {topRow.map((proc, i) => {
              const Icon = proc.icon;
              return (
                <Fragment key={proc.step}>
                  <div className="relative flex-1 overflow-hidden rounded-2xl border border-brand-primary/10 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <span className="pointer-events-none absolute right-4 top-2 select-none text-7xl font-black leading-none text-brand-primary/10">
                      {String(proc.step).padStart(2, "0")}
                    </span>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary text-white">
                      <Icon size={22} />
                    </div>
                    <h3 className="text-base font-bold text-brand-primary">{proc.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{proc.description}</p>
                  </div>
                  {i < 2 && (
                    <>
                      <ChevronRight className="mx-auto hidden shrink-0 text-brand-danger/60 lg:block" size={28} />
                      <ChevronDown className="mx-auto shrink-0 text-brand-danger/60 lg:hidden" size={24} />
                    </>
                  )}
                </Fragment>
              );
            })}
          </div>

          {/* Mobile connector */}
          <div className="flex items-center justify-center py-1 lg:hidden">
            <ChevronDown className="text-brand-danger/70" size={30} strokeWidth={2.5} />
          </div>

          {/* Row 2: steps 6–4 */}
          <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:items-center">
            {bottomRow.map((proc, i) => {
              const Icon = proc.icon;
              return (
                <Fragment key={proc.step}>
                  <div className="relative flex-1 overflow-hidden rounded-2xl border border-brand-danger/15 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <span className="pointer-events-none absolute right-4 top-2 select-none text-7xl font-black leading-none text-brand-danger/10">
                      {String(proc.step).padStart(2, "0")}
                    </span>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-danger text-white">
                      <Icon size={22} />
                    </div>
                    <h3 className="text-base font-bold text-brand-primary">{proc.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{proc.description}</p>
                  </div>
                  {i < 2 && (
                    <>
                      <ChevronLeft className="mx-auto hidden shrink-0 text-brand-danger/60 lg:block" size={28} />
                      <ChevronDown className="mx-auto shrink-0 text-brand-danger/60 lg:hidden" size={24} />
                    </>
                  )}
                </Fragment>
              );
            })}
          </div>

          {/* Desktop side connectors: 3 -> 4 and 6 -> 1 */}
          <div className="pointer-events-none absolute bottom-[7.2rem] right-2 hidden items-center lg:flex">
            <div className="h-28 w-8 rounded-r-full border-r-2 border-y-2 border-brand-danger/40" />
            <ChevronDown className="-ml-1 text-brand-danger/70" size={24} strokeWidth={2.5} />
          </div>
          <div className="pointer-events-none absolute left-2 top-[7.2rem] hidden items-center lg:flex">
            <ChevronUp className="-mr-1 text-brand-danger/70" size={24} strokeWidth={2.5} />
            <div className="h-28 w-8 rounded-l-full border-l-2 border-y-2 border-brand-danger/40" />
          </div>
        </div>
      </div>
    </section>
  );
}
