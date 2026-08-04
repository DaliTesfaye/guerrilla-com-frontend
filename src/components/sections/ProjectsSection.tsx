"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, CalendarDays, User, DollarSign, ArrowRight } from "lucide-react";
// 🚀 On garde les imports exactement comme ils l'étaient depuis le début
import {
  fetchPublicProjects,
  type PublicProject,
} from "@/features/projects/api/projects";

export default function ProjectsSection() {
  // L'état utilise le type PublicProject d'origine
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchPublicProjects();
        // On passe par "any" temporairement pour injecter les données complètes de la DB
        setProjects(data as any);
      } catch {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Helper pour formater les dates (ex: "Janv. 2026")
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section 
      id="projects" 
      className="relative overflow-hidden px-6 py-20 md:py-24"
    >
      {/* Fond d'écran de la section */}
      <Image
        src="/about-bg.jpg"
        alt="Guerrilla Com Projects Background"
        fill
        priority
        className="object-cover object-center z-0"
      />

      {/* Overlay pour la lisibilité */}
      <div className="" />

      {/* Contenu principal */}
      <div className="relative z-20 mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="mb-14">
          <h2 className="text-4xl font-extrabold leading-tight text-brand-primary md:text-5xl uppercase tracking-tight">
            Nos <span className="text-brand-danger">Projets</span>
          </h2>
          <span className="mt-4 block h-1 w-16 rounded-full bg-brand-danger" />
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-700 font-medium md:text-lg">
            Découvrez nos réalisations concrètes et l'accompagnement de nos clients partenaires.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12 text-brand-primary font-semibold">
            Chargement des projets en cours...
          </div>
        )}

        {/* Grid des cartes */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            // On type localement l'item en "any" pour accéder aux nouveaux champs de la DB (startDate, image, etc.)
            const item = project as any;

            return (
              <div
                key={item._id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                {/* Zone Image & Badges supérieurs */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-brand-primary/5 text-xs text-slate-400">
                      Aucune illustration disponible
                    </div>
                  )}
                  
                  {/* Statut (Top Gauche) */}
                  {item.status && (
                    <span className="absolute top-4 left-4 z-10 inline-block rounded-lg bg-white/95 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-primary shadow-sm">
                      {item.status}
                    </span>
                  )}

                  {/* Dates de début et de fin (Top Droite) */}
                  {(item.startDate || item.endDate) && (
                    <div className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 rounded-lg bg-black/70 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
                      <CalendarDays size={11} className="text-brand-danger" />
                      <span className="capitalize">
                        {formatDate(item.startDate)} — {formatDate(item.endDate)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Contenu texte de la carte */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-bold text-brand-primary group-hover:text-brand-danger transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-500 flex-1">
                    {item.description?.trim() ? item.description : "Aucune description fournie pour ce projet."}
                  </p>

                  {/* Métadonnées dynamiques de la DB */}
                  <div className="mt-6 border-t border-slate-100 pt-4 space-y-2.5 text-[12px] text-slate-600 font-medium">
                    {item.clientName && (
                      <div className="flex items-center gap-2.5">
                        <User size={14} className="shrink-0 text-brand-primary" />
                        <span className="text-slate-500">Client :</span>
                        <span className="text-slate-800 font-semibold">{item.clientName}</span>
                      </div>
                    )}
                    
                    {item.budget !== undefined && (
                      <div className="flex items-center gap-2.5">
                        <DollarSign size={14} className="shrink-0 text-emerald-600" />
                        <span className="text-slate-500">Budget :</span>
                        <span className="text-slate-800 font-semibold">
                          {new Intl.NumberFormat("fr-FR", {
                            style: "currency",
                            currency: "TND",
                            maximumFractionDigits: 0,
                          }).format(item.budget)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bouton vers la page dynamique */}
                  <Link
                    href={`/projects/${item._id}`}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary py-3 text-xs font-bold text-white transition-all duration-200 hover:bg-brand-primary-dark shadow-sm"
                  >
                    Voir détails
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center rounded-2xl border border-brand-primary/15 bg-brand-primary px-8 py-4 text-base font-semibold text-white shadow-sm transition hover:border-brand-primary/25 hover:bg-brand-primary/80"
          >
            Voir tous les projets
          </Link>
        </div>
      </div>
    </section>
  );
}