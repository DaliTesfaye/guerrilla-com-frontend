"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, CalendarDays, MapPin, Search, Tag, Users } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchEventParticipantsCount, fetchPublicEvents, type PublicEvent } from "@/features/events/api/events";
import { fetchPublicProjects } from "@/features/projects/api/projects";

type PublicEventItem = PublicEvent & {
  image?: string;
};

function formatDate(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const statusLabels: Record<string, string> = {
  draft: "Brouillon",
  planned: "Planifié",
  ongoing: "En cours",
  completed: "Terminé",
};

export default function PublicEventsPage() {
  const [events, setEvents] = useState<PublicEventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [projectNameById, setProjectNameById] = useState<Record<string, string>>({});
  const [participantsCountByEvent, setParticipantsCountByEvent] = useState<Record<string, number>>({});

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const [eventsData, projects] = await Promise.all([fetchPublicEvents(), fetchPublicProjects()]);
        setEvents(eventsData);
        setProjectNameById(
          projects.reduce<Record<string, string>>((acc, project) => {
            acc[project._id] = project.name;
            return acc;
          }, {})
        );

        const countsEntries = await Promise.all(
          eventsData.map(async (event) => {
            try {
              const count = await fetchEventParticipantsCount(event._id);
              return [event._id, count] as const;
            } catch {
              return [event._id, 0] as const;
            }
          })
        );

        setParticipantsCountByEvent(Object.fromEntries(countsEntries));
      } catch {
        setError("Impossible de charger les événements.");
        setEvents([]);
        setParticipantsCountByEvent({});
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return events;

    return events.filter((event) => {
      const projectName = projectNameById[event.projectId || ""] || "";
      return [
        event.name,
        event.type || "",
        event.city || "",
        event.location || "",
        projectName,
      ].some((value) => value.toLowerCase().includes(normalized));
    });
  }, [events, projectNameById, query]);

  return (
    <div className="flex min-h-screen flex-col bg-brand-surface">
      <Navbar />

      <main className="flex-1">
        <section className="relative overflow-hidden px-6 py-20 md:py-24">
          <Image
            src="/services-bg.jpg"
            alt="Events Background"
            fill
            priority
            className="object-cover object-center z-0"
          />
          <div className="absolute inset-0 bg-white/12 z-10" />

          <div className="relative z-20 mx-auto max-w-6xl">
            <Link
              href="/#events"
              className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-brand-danger"
            >
              <ArrowLeft size={16} />
              Retour
            </Link>

            <div className="mb-10">
              <h1 className="text-4xl font-extrabold leading-tight text-white md:text-5xl uppercase tracking-tight">
                Tous les <span className="text-brand-danger">Événements</span>
              </h1>
              <span className="mt-4 block h-1 w-20 rounded-full bg-brand-danger/80" />
              <p className="mt-5 max-w-2xl text-base leading-7 text-white md:text-lg">
                Explorez les événements disponibles, leurs lieux, leurs dates et le volume de participants.
              </p>
            </div>

            <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-white/40 bg-white/85 p-4 shadow-sm backdrop-blur-sm md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <Search size={16} className="text-brand-primary" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher un événement, lieu ou projet..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 md:w-96"
                />
              </div>
              <div className="text-sm font-semibold text-brand-primary">
                {filteredEvents.length} événement{filteredEvents.length > 1 ? "s" : ""}
              </div>
            </div>

            {loading ? (
              <div className="py-16 text-center font-semibold text-white">Chargement des événements...</div>
            ) : error ? (
              <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-[#C7072C]">
                {error}
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/30 bg-white/80 px-6 py-14 text-center text-slate-500 backdrop-blur-sm">
                Aucun événement trouvé.
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-4 top-0 h-full w-px bg-white md:left-1/2 md:-translate-x-1/2" />

                <div className="space-y-6">
                  {filteredEvents.map((event, index) => {
                    const isLeft = index % 2 === 0;

                    return (
                      <div key={event._id} className="relative md:flex md:items-center">
                        <div
                          className={`pl-10 md:w-[calc(50%-1.5rem)] md:pl-0 ${
                            isLeft ? "md:pr-6" : "md:ml-auto md:pl-6"
                          }`}
                        >
                          <article className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 p-0 shadow-[0_10px_30px_rgba(46,49,145,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(46,49,145,0.14)]">
                            <div className="h-1.5 w-full bg-linear-to-r from-brand-primary via-brand-danger/80 to-brand-primary" />

                            <div className="p-5">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-block rounded-md bg-brand-primary/8 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-brand-primary">
                                  {event.type?.trim() ? event.type : "N/A"}
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-md border border-brand-danger/20 bg-brand-danger/8 px-2.5 py-1 text-[11px] font-semibold text-brand-danger">
                                  <CalendarDays size={12} className="shrink-0" />
                                  {formatDate(event.date)}
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                                  <Tag size={12} className="shrink-0" />
                                  {projectNameById[event.projectId || ""] || "Projet"}
                                </span>
                              </div>

                              <h3 className="mt-3 text-lg font-extrabold text-brand-primary">{event.name}</h3>

                              {/* <p className="mt-2 text-sm font-medium text-slate-600">
                                👥 {participantsCountByEvent[event._id] ?? 0} participants
                              </p> */}

                              {/* <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                                <Tag size={13} className="shrink-0 text-brand-danger" />
                                <span>{statusLabels[event.status || "planned"] || event.status || "Planifié"}</span>
                              </div> */}

                              <div className="mt-5 flex flex-wrap items-center gap-3">
                                <Link
                                  href={`/events/${event._id}`}
                                  className="inline-flex items-center justify-center rounded-lg border bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-primary/90"
                                >
                                  Voir les détails
                                </Link>
                              </div>
                            </div>
                          </article>
                        </div>

                        <span className="absolute left-4 top-8 h-3 w-3 -translate-x-1/2 rounded-full bg-brand-danger ring-4 ring-brand-surface md:left-1/2" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
