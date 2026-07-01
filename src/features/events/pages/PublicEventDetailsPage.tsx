"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CalendarDays, MapPin, Users, ArrowLeft, CheckCircle2 } from "lucide-react";
import {
  getEventById,
  fetchEventParticipantsCount,
  type EventItem,
} from "@/features/events/api/events";
import { fetchPublicProjects } from "@/features/projects/api/projects";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ParticipationModal from "@/features/events/components/ParticipationModal";

export default function PublicEventDetailsPage() {
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [projectName, setProjectName] = useState("");
  const [participantsCount, setParticipantsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadParticipantsCount = async () => {
    try {
      const count = await fetchEventParticipantsCount(eventId);
      setParticipantsCount(count);
    } catch (err) {
      console.error("Failed to refresh participants count:", err);
    }
  };

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const [eventData, projects] = await Promise.all([
          getEventById(eventId),
          fetchPublicProjects(),
        ]);

        setEvent(eventData);
        setProjectName(
          projects.find((p) => p._id === eventData.projectId)?.name || "Projet"
        );

        const count = await fetchEventParticipantsCount(eventId);
        setParticipantsCount(count);
      } catch (err: unknown) {
        console.error(err);
        setError("Impossible de charger les détails de l'événement.");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      loadDetails();
    }
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-brand-surface">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-brand-primary animate-pulse font-medium">Chargement des détails...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex min-h-screen flex-col bg-brand-surface">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <div className="rounded-full bg-red-100 p-4 text-brand-danger">
            <ArrowLeft size={32} />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-brand-primary">Événement non trouvé</h1>
          <p className="mt-2 text-slate-500">{error || "Cet événement n'existe pas ou a été supprimé."}</p>
          <Link
            href="/#events"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-primary px-6 py-2.5 font-semibold text-white transition hover:bg-brand-primary-dark"
          >
            <ArrowLeft size={18} />
            Retour aux événements
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-brand-surface">
      <Navbar />
      
      <main className="flex-1 py-12 md:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Link
            href="/#events"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-primary transition hover:text-brand-danger"
          >
            <ArrowLeft size={16} />
            Retour à l'accueil
          </Link>

          <article className="overflow-hidden rounded-3xl border border-white bg-white shadow-[0_20px_50px_rgba(46,49,145,0.08)]">
            {/* Header / Hero area */}
            <div className="relative h-64 w-full bg-brand-primary md:h-80">
              {event.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover opacity-60 mix-blend-overlay"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-brand-primary to-brand-primary-dark">
                  <CalendarDays size={80} className="text-white/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 md:p-12">
                <div className="flex flex-wrap gap-3">
                  <span className="rounded-md bg-brand-danger px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                    {event.service}
                  </span>
                  <span className="rounded-md bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-md text-white">
                    {projectName}
                  </span>
                </div>
                <h1 className="mt-4 text-3xl font-extrabold text-white md:text-5xl">
                  {event.title}
                </h1>
              </div>
            </div>

            <div className="grid gap-0 md:grid-cols-3">
              {/* Left Column: Details */}
              <div className="col-span-2 p-8 md:p-12">
                <section>
                  <h2 className="text-xl font-bold text-brand-primary">À propos de l'événement</h2>
                  <div className="mt-4 h-1 w-12 rounded-full bg-brand-danger" />
                  <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-slate-600">
                    {event.description || "Aucune description détaillée disponible pour cet événement."}
                  </p>
                </section>

                <section className="mt-12 grid gap-6 sm:grid-cols-2">
                  <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
                    <div className="rounded-xl bg-brand-primary/10 p-3 text-brand-primary">
                      <CalendarDays size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Date</p>
                      <p className="mt-1 text-lg font-bold text-brand-primary">
                        {new Date(event.date).toLocaleDateString("fr-FR", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
                    <div className="rounded-xl bg-brand-danger/10 p-3 text-brand-danger">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Lieu</p>
                      <p className="mt-1 text-lg font-bold text-brand-primary">
                        {event.location}, {event.city}
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column: Sidebar info */}
              <div className="border-l border-slate-100 bg-slate-50/30 p-8 md:p-12">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Statistiques</h3>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm text-brand-primary">
                        <Users size={20} />
                      </div>
                      <div>
                        <p className="text-2xl font-black text-brand-primary">{participantsCount}</p>
                        <p className="text-xs font-medium text-slate-500">Participants inscrits</p>
                      </div>
                    </div>
                  </div>

                  {event.hasGame && (
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Expérience</h3>
                      <div className="mt-4 flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm text-brand-danger">
                          <CheckCircle2 size={20} />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-brand-primary">{event.gameName || "Jeu interactif"}</p>
                          <p className="text-xs font-medium text-slate-500">Activité disponible sur place</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="flex w-full items-center justify-center rounded-xl bg-brand-danger py-4 text-center font-bold text-white transition hover:bg-[#a50524] shadow-lg shadow-brand-danger/20"
                    >
                      Participer maintenant
                    </button>
                    <p className="mt-4 text-center text-xs text-slate-400">
                      Inscrivez-vous pour recevoir les informations et rappels.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>

      {isModalOpen && (
        <ParticipationModal
          eventId={event._id}
          eventName={event.title}
          onClose={() => setIsModalOpen(false)}
          onSuccess={loadParticipantsCount}
        />
      )}

      <Footer />
    </div>
  );
}
