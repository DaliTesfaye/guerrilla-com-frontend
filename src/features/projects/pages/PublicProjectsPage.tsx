"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, CalendarDays, DollarSign, MapPin, User } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchPublicProjects, type PublicProject } from "@/features/projects/api/projects";

type PublicProjectItem = PublicProject & {
  image?: string;
  clientName?: string;
  budget?: number;
  startDate?: string;
  endDate?: string;
};

export default function PublicProjectsPage() {
  const [projects, setProjects] = useState<PublicProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchPublicProjects();
        setProjects(data as PublicProjectItem[]);
      } catch {
        setError("Impossible de charger les projets.");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-brand-surface">
      <Navbar />

      <main className="flex-1">
        <section className="relative overflow-hidden px-6 py-20 md:py-24">
          <Image
            src="/about-bg.jpg"
            alt="Guerrilla Com Projects Background"
            fill
            priority
            className="object-cover object-center z-0"
          />

          <div className="absolute inset-0 bg-white/15 z-10" />

          <div className="relative z-20 mx-auto max-w-6xl">
            <Link
              href="/#projects"
              className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-primary transition hover:text-brand-danger"
            >
              <ArrowLeft size={16} />
              Retour
            </Link>

            <div className="mb-14">
              <h1 className="text-4xl font-extrabold leading-tight text-brand-primary md:text-5xl uppercase tracking-tight">
                Tous les <span className="text-brand-danger">Projets</span>
              </h1>
              <span className="mt-4 block h-1 w-16 rounded-full bg-brand-danger" />
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-700 font-medium md:text-lg">
                Retrouvez ici l’ensemble des projets disponibles sur la vitrine.
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-12 text-brand-primary font-semibold">
                Chargement des projets en cours...
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-[#C7072C]">
                {error}
              </div>
            ) : projects.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center text-slate-500">
                Aucun projet disponible pour le moment.
              </div>
            ) : (
              <>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {projects.map((project) => {
                    const item = project as any;

                    return (
                      <div
                        key={item._id}
                        className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                      >
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

                          {item.status && (
                            <span className="absolute top-4 left-4 z-10 inline-block rounded-lg bg-white/95 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-primary shadow-sm">
                              {item.status}
                            </span>
                          )}

                          {(item.startDate || item.endDate) && (
                            <div className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 rounded-lg bg-black/70 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
                              <CalendarDays size={11} className="text-brand-danger" />
                              <span className="capitalize">
                                {formatDate(item.startDate)} — {formatDate(item.endDate)}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-1 flex-col p-6">
                          <h3 className="text-xl font-bold text-brand-primary group-hover:text-brand-danger transition-colors line-clamp-1">
                            {item.name}
                          </h3>

                          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-500 flex-1">
                            {item.description?.trim()
                              ? item.description
                              : "Aucune description fournie pour ce projet."}
                          </p>

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

                <div className="mt-10 flex justify-center">
                  <Link
                    href="/#projects"
                    className="inline-flex items-center justify-center rounded-xl border border-brand-primary/15 bg-white px-6 py-3 text-sm font-semibold text-brand-primary shadow-sm transition hover:border-brand-primary/25 hover:bg-brand-primary/5"
                  >
                    Retour à la vitrine
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

