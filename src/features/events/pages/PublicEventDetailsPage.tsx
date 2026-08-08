"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // 👈 Importation pour une gestion propre de l'image
import { CalendarDays, MapPin, Users, ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
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
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
            <p className="text-sm font-medium text-slate-500">Chargement de l'événement...</p>
          </div>
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
          <div className="rounded-2xl bg-red-50 p-4 text-brand-danger border border-red-100">
            <ArrowLeft size={28} />
          </div>
          <h1 className="mt-5 text-xl font-bold text-brand-primary">Événement introuvable</h1>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
            {error || "Cet événement n'est plus disponible ou l'adresse est incorrecte."}
          </p>
          <Link
            href="/#events"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-brand-primary-dark"
          >
            <ArrowLeft size={16} />
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
      
      <main className="flex-1 py-8 md:py-16">
        <div className="mx-auto max-w-5xl px-6">
          
          {/* Fil d'ariane épuré */}
          <Link
            href="/#events"
            className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-brand-primary"
          >
            <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
            Retour aux événements
          </Link>

          <article className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            
            {/* Zone Hero avec Image Optimisée */}
            <div className="relative h-72 w-full bg-slate-900 md:h-96">
              {event.image ? (
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  priority
                  className="object-cover opacity-75"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-brand-primary/95 to-brand-primary-dark">
                  <CalendarDays size={64} className="text-white/10" />
                </div>
              )}
              {/* Gradient overlay moderne et progressif pour garantir le contraste du texte */}
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
              
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-brand-danger px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    {event.service}
                  </span>
                  <span className="rounded-md bg-white/10 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white backdrop-blur-md ring-1 ring-white/10">
                    {projectName}
                  </span>
                </div>
                <h1 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl md:text-4xl tracking-tight">
                  {event.title}
                </h1>
              </div>
            </div>

            {/* Layout Principal : Contenu vs Sidebar */}
            <div className="grid gap-0 md:grid-cols-3">
              
              {/* Colonne Gauche : Infos & Corps */}
              <div className="col-span-2 space-y-10 p-6 md:p-10">
                <section>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                    Présentation
                  </h2>
                  <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-slate-600">
                    {event.description || "Aucune description détaillée disponible pour cet événement."}
                  </p>
                </section>

                <hr className="border-slate-100" />

                {/* Grille de fiches informatives */}
                <section className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-primary/8 text-brand-primary">
                      <CalendarDays size={20} />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Date de l'événement</span>
                      <p className="mt-0.5 text-sm font-semibold text-slate-800 capitalize">
                        {new Date(event.date).toLocaleDateString("fr-FR", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-danger/8 text-brand-danger">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Localisation</span>
                      <p className="mt-0.5 text-sm font-semibold text-slate-800">
                        {event.location}, {event.city}
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              {/* Colonne Droite : Sidebar Widget (Sticky) */}
              <div className="border-t border-slate-100 bg-slate-50/40 p-6 md:border-t-0 md:border-l md:p-10">
                <div className="md:sticky md:top-24 space-y-6">
                  
                  {/* Carte Statut/Participants */}
                  <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-xs">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
                      Données en direct
                    </span>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-600 border border-slate-100">
                          <Users size={18} />
                        </div>
                        {/* <div>
                          <p className="text-xl font-bold tracking-tight text-brand-primary">{participantsCount}</p>
                          <p className="text-[11px] font-medium text-slate-500">Inscriptions enregistrées</p>
                        </div> */}
                      </div>

                      {event.hasGame && (
                        <div className="flex items-center gap-3 pt-2 border-t border-slate-50">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <CheckCircle2 size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{event.gameName || "Activité interactive"}</p>
                            <p className="text-[11px] font-medium text-slate-500">Disponible sur place</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bouton d'action principal */}
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="w-full rounded-xl bg-brand-danger py-3.5 text-center text-sm font-bold text-white shadow-xs transition hover:bg-[#a50524] active:scale-[0.99]"
                    >
                      Rejoindre l'événement
                    </button>
                    
                    <div className="flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400">
                      <ShieldCheck size={13} className="text-slate-400" />
                      <span>Confirmation immédiate et gratuite</span>
                    </div>
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