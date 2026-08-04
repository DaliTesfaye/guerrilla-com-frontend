"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  CalendarDays, 
  MapPin, 
  ArrowLeft, 
  Briefcase, 
  Clock, 
  DollarSign,
  User
} from "lucide-react";

import {
  fetchPublicProjectDetails,
  type DashboardProject,
  type ProjectRelatedEvent,
} from "@/features/projects/api/projects";
import { fetchPublicEvents, type EventItem, type EventStatus, type PublicEvent } from "@/features/events/api/events";
import EventCard from "@/features/events/components/EventCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type ProjectDisplay = DashboardProject & {
  location?: string;
  deploymentScope?: string;
  relatedEvents?: ProjectRelatedEvent[];
  events?: ProjectRelatedEvent[];
};

type RelatedEventDisplay = PublicEvent | (ProjectRelatedEvent & { title?: string });

function toEventStatus(status?: string): EventStatus {
  return status === "draft" || status === "planned" || status === "ongoing" || status === "completed"
    ? status
    : "planned";
}

function toEventCardItem(event: RelatedEventDisplay): EventItem {
  return {
    _id: event._id,
    title: "title" in event && event.title ? event.title : event.name,
    service: event.service || event.type || "",
    projectId: "projectId" in event && event.projectId ? event.projectId : "",
    status: toEventStatus(event.status),
    date: event.date || "",
    city: event.city || "",
    location: "location" in event && event.location ? event.location : event.city || "",
    participantsCount: event.participantsCount,
    hasGame: "hasGame" in event ? event.hasGame || false : false,
  };
}

export default function PublicProjectDetailsPage() {
  const params = useParams();
  const projectId = params?.id as string;

  const [project, setProject] = useState<DashboardProject | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<PublicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const [data, publicEvents] = await Promise.all([
          fetchPublicProjectDetails(projectId),
          fetchPublicEvents(),
        ]);
        
        setProject(data.project);
        setRelatedEvents(publicEvents.filter((event) => event.projectId === projectId));
      } catch (err: unknown) {
        console.error(err);
        setError("Impossible de charger les détails du projet.");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadDetails();
    }
  }, [projectId]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "A venir";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50/50">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
            <div className="text-brand-primary font-bold tracking-wide animate-pulse text-sm uppercase">
              Chargement des détails...
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50/50">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <div className="rounded-2xl bg-red-50 p-4 text-brand-danger shadow-sm border border-red-100">
            <ArrowLeft size={32} />
          </div>
          <h1 className="mt-6 text-2xl font-extrabold text-brand-primary uppercase tracking-tight">
            Projet introuvable
          </h1>
          <p className="mt-2 max-w-sm text-sm font-medium text-slate-500">
            {error || "Ce projet n'existe pas ou a été déplacé par l'administrateur."}
          </p>
          <Link
            href="/#projects"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-xs font-bold text-white transition-all shadow-sm hover:bg-brand-primary-dark hover:-translate-y-0.5"
          >
            <ArrowLeft size={16} />
            Retour aux réalisations
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const item = project as ProjectDisplay;
  
  const events: RelatedEventDisplay[] = relatedEvents.length > 0 
    ? relatedEvents 
    : (item.relatedEvents && item.relatedEvents.length > 0)
      ? item.relatedEvents
      : (item.events && item.events.length > 0)
        ? item.events
        : [];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/40 selection:bg-brand-danger selection:text-white">
      <Navbar />
      
      {/* ─── EN-TÊTE DU PROJET ─── */}
      <section className="relative h-[50vh] min-h-[400px] w-full bg-brand-primary md:h-[60vh]">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name || "Image du projet"}
            fill
            priority
            className="object-cover object-center"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-primary to-slate-900">
            <Briefcase size={120} className="text-white/10" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-black/30" />

        <div className="absolute inset-x-0 bottom-0 z-20 pb-12 md:pb-16">
          <div className="mx-auto max-w-7xl px-6 w-full">
            
            <Link
              href="/#projects"
              className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-white/20"
            >
              <ArrowLeft size={14} className="text-brand-danger" />
              Retour aux projets
            </Link>

            <div className="flex flex-wrap gap-2.5">
              {item.status && (
                <span className={`inline-block rounded-lg px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs ${
                  item.status === 'completed' ? 'bg-emerald-500' : 
                  item.status === 'active' ? 'bg-blue-500' : 'bg-amber-500'
                }`}>
                  {item.status === 'completed' ? 'Terminé' : 
                   item.status === 'active' ? 'En cours' : 'Planifié'}
                </span>
              )}

              {item.clientName && (
                <span className="inline-block rounded-lg bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                  Client : {item.clientName}
                </span>
              )}
            </div>

            <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl md:text-6xl max-w-4xl tracking-tight uppercase leading-tight">
              {item.name}
            </h1>
          </div>
        </div>
      </section>

      {/* ─── CORPS DE LA PAGE ─── */}
      <main className="flex-1 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            
            {/* Colonne Principale (Gauche) */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Descriptif Projet */}
              <section className="rounded-3xl border border-slate-100 bg-white p-8 md:p-10 shadow-xs">
                <h2 className="text-xl font-black text-brand-primary uppercase tracking-tight flex items-center gap-2">
                  <span className="h-5 w-1 rounded-full bg-brand-danger block" />
                  Présentation du Projet
                </h2>
                <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-slate-600 font-medium">
                  {item.description?.trim() ? item.description : "Aucune description détaillée n'est disponible pour le moment."}
                </p>
              </section>

              {/* Événements liés */}
              <section className="rounded-3xl border border-slate-100 bg-white p-8 md:p-10 shadow-xs">
                <h2 className="text-xl font-black text-brand-primary uppercase tracking-tight flex items-center gap-2">
                  <span className="h-5 w-1 rounded-full bg-brand-danger block" />
                  Événements liés
                </h2>
                
                {events.length > 0 ? (
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {events.map((event) => {
                      const cardEvent = toEventCardItem(event);

                      return (
                        <EventCard
                          key={cardEvent._id}
                          event={cardEvent}
                          detailsHref={`/events/${cardEvent._id}`}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-8 rounded-2xl border border-dashed border-slate-200 py-12 text-center text-sm font-medium text-slate-400">
                    Aucun événement public ou couverture média n&apos;est programmé actuellement pour ce projet.
                  </div>
                )}
              </section>
            </div>

            {/* Fiche Technique Latérale Sticky (Droite) */}
            <div className="lg:col-span-1 lg:sticky lg:top-28">
              <aside className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-primary to-brand-danger" />
                
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-400 mb-6">
                  Fiche Technique
                </h3>

                <div className="divide-y divide-slate-100 text-sm">
                  
                  {item.clientName && (
                    <div className="py-4 flex items-start gap-4">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-brand-primary border border-slate-100">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-400">Partenaire / Client</p>
                        <p className="mt-0.5 font-bold text-slate-800">{item.clientName}</p>
                      </div>
                    </div>
                  )}

                  {item.budget !== undefined && item.budget !== null && (
                    <div className="py-4 flex items-start gap-4">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <DollarSign size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-400">Budget Alloué</p>
                        <p className="mt-0.5 font-black text-emerald-700">
                          {new Intl.NumberFormat("fr-FR", {
                            style: "currency",
                            currency: "TND",
                            maximumFractionDigits: 0,
                          }).format(Number(item.budget))}
                        </p>
                      </div>
                    </div>
                  )}

                  {item.startDate && (
                    <div className="py-4 flex items-start gap-4">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600 border border-slate-100">
                        <CalendarDays size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-400">Lancement</p>
                        <p className="mt-0.5 font-bold text-slate-800">{formatDate(item.startDate)}</p>
                      </div>
                    </div>
                  )}

                  {item.endDate && (
                    <div className="py-4 flex items-start gap-4">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-brand-danger border border-slate-100">
                        <Clock size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-400">Fin / Clôture prévue</p>
                        <p className="mt-0.5 font-bold text-slate-800">{formatDate(item.endDate)}</p>
                      </div>
                    </div>
                  )}

                  {item.location && (
                    <div className="py-4 flex items-start gap-4">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-brand-primary border border-slate-100">
                        <MapPin size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-400">Zone Géographique</p>
                        <p className="mt-0.5 font-bold text-slate-800">{item.location}</p>
                        {item.deploymentScope && (
                          <p className="text-[11px] font-medium text-slate-400 mt-0.5">{item.deploymentScope}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </aside>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
