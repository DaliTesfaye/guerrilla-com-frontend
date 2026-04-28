"use client";

import { useEffect, useState } from "react";
import { MapPin, CalendarDays, Tag } from "lucide-react";
import {
  fetchPublicProjects,
  type PublicProject,
} from "@/features/projects/api/projects";

const projectMeta = [
  { location: "Tunis, Tunisie", date: "Mars 2024", event: "Lancement produit" },
  { location: "Hammamet, Tunisie", date: "Juin 2024", event: "Seminaire" },
  { location: "Sfax, Tunisie", date: "Septembre 2024", event: "Animation commerciale" },
  { location: "Lac 2, Tunis", date: "Novembre 2024", event: "Lancement produit" },
  { location: "Nationwide", date: "Janvier 2025", event: "Roadshow" },
  { location: "Tunis, Tunisie", date: "Fevrier 2025", event: "Convention" },
];

export default function ProjectsSection() {
  const [projects, setProjects] = useState<PublicProject[]>([]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchPublicProjects();
        setProjects(data);
      } catch {
        setProjects([]);
      }
    };

    loadProjects();
  }, []);

  return (
    <section id="projects" className="bg-white px-6 py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-4xl font-extrabold leading-tight text-brand-primary md:text-5xl">
            Nos <span className="text-brand-danger">Projets</span>
          </h2>
          <span className="mt-4 block h-0.75 w-20 rounded-full bg-brand-danger/80" />
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-500 md:text-lg">
            Découvrez quelques-unes de nos réalisations pour nos clients partenaires.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => {
            const meta = projectMeta[index % projectMeta.length];
            return (
            <div
              key={project._id}
              className="group overflow-hidden rounded-2xl border border-brand-primary/10 bg-brand-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              {/* Image placeholder */}
              {/* <div className="flex h-48 w-full items-center justify-center bg-brand-primary/8">
                <svg
                  className="h-12 w-12 text-brand-primary/30"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v13.5a1.5 1.5 0 001.5 1.5z" />
                </svg>
              </div> */}

              {/* Content */}
              <div className="p-6">
                <span className="inline-block rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-primary">
                  {project.status}
                </span>
                <h3 className="mt-3 text-lg font-bold text-brand-primary">{project.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {project.description?.trim() ? project.description : "Description indisponible"}
                </p>

                {/* Meta info */}
                <div className="mt-4 space-y-1.5 border-t border-brand-primary/10 pt-4 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="shrink-0 text-brand-danger" />
                    <span>{meta.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays size={13} className="shrink-0 text-brand-danger" />
                    <span>{meta.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag size={13} className="shrink-0 text-brand-danger" />
                    <span>{meta.event}</span>
                  </div>
                </div>
              </div>
            </div>
          )})}
        </div>
      </div>
    </section>
  );
}
