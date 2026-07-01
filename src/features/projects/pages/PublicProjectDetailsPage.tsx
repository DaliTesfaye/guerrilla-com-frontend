"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  CalendarDays, 
  MapPin, 
  ArrowLeft, 
  Briefcase, 
  Clock, 
  CheckCircle2,
  Calendar,
  ChevronRight
} from "lucide-react";
import {
  fetchPublicProjectDetails,
  type DashboardProject,
  type ProjectRelatedEvent,
} from "@/features/projects/api/projects";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PublicProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<DashboardProject | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<ProjectRelatedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const data = await fetchPublicProjectDetails(projectId);
        setProject(data.project);
        setRelatedEvents(data.relatedEvents);
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

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-brand-surface">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-brand-primary animate-pulse font-medium">Chargement du projet...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex min-h-screen flex-col bg-brand-surface">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <div className="rounded-full bg-red-100 p-4 text-brand-danger">
            <ArrowLeft size={32} />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-brand-primary">Projet non trouvé</h1>
          <p className="mt-2 text-slate-500">{error || "Ce projet n'existe pas ou a été supprimé."}</p>
          <Link
            href="/#projects"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-primary px-6 py-2.5 font-semibold text-white transition hover:bg-brand-primary-dark"
          >
            <ArrowLeft size={18} />
            Retour aux projets
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
            href="/#projects"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-primary transition hover:text-brand-danger"
          >
            <ArrowLeft size={16} />
            Retour à l'accueil
          </Link>

          <article className="overflow-hidden rounded-3xl border border-white bg-white shadow-[0_20px_50px_rgba(46,49,145,0.08)]">
            {/* Header / Hero area */}
            <div className="relative h-64 w-full bg-brand-primary md:h-80">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.name}
                  className="h-full w-full object-cover opacity-60 mix-blend-overlay"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-brand-primary to-brand-primary-dark">
                  <Briefcase size={80} className="text-white/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 md:p-12">
                <div className="flex flex-wrap gap-3">
                  <span className={`rounded-md px-3 py-1 text-xs font-bold uppercase tracking-wider text-white ${
                    project.status === 'completed' ? 'bg-emerald-500' : 
                    project.status === 'active' ? 'bg-blue-500' : 'bg-amber-500'
                  }`}>
                    {project.status === 'completed' ? 'Terminé' : 
                     project.status === 'active' ? 'En cours' : 'Planifié'}
                  </span>
                  <span className="rounded-md bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-md text-white">
                    Client: {project.clientName}
                  </span>
                </div>
                <h1 className="mt-4 text-3xl font-extrabold text-white md:text-5xl">
                  {project.name}
                </h1>
              </div>
            </div>

            <div className="grid gap-0 md:grid-cols-3">
              {/* Left Column: Details */}
              <div className="col-span-2 p-8 md:p-12">
                <section>
                  <h2 className="text-xl font-bold text-brand-primary">Présentation du projet</h2>
                  <div className="mt-4 h-1 w-12 rounded-full bg-brand-danger" />
                  <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-slate-600">
                    {project.description || "Aucune description détaillée disponible pour ce projet."}
                  </p>
                </section>

                <section className="mt-12">
                  <h2 className="text-xl font-bold text-brand-primary">Événements liés</h2>
                  <div className="mt-4 h-1 w-12 rounded-full bg-brand-danger" />
                  
                  <div className="mt-8 space-y-4">
                    {relatedEvents.length > 0 ? (
                      relatedEvents.map((event) => (
                        <Link 
                          key={event._id}
                          href={`/events/${event._id}`}
                          className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-white hover:shadow-md"
                        >
                          <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-brand-primary/10 p-3 text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                              <Calendar size={20} />
                            </div>
                            <div>
                              <h4 className="font-bold text-brand-primary">{event.name}</h4>
                              <p className="text-xs text-slate-500">
                                {event.date ? new Date(event.date).toLocaleDateString("fr-FR") : "Date à venir"} • {event.city || "Lieu à confirmer"}
                              </p>
                            </div>
                          </div>
                          <ChevronRight size={18} className="text-slate-300 group-hover:text-brand-danger transition-colors" />
                        </Link>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-400">
                        Aucun événement n'est encore programmé pour ce projet.
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* Right Column: Sidebar info */}
              <div className="border-l border-slate-100 bg-slate-50/30 p-8 md:p-12">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Période</h3>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm text-brand-primary">
                          <CalendarDays size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500">Début</p>
                          <p className="text-sm font-bold text-brand-primary">
                            {new Date(project.startDate).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm text-brand-danger">
                          <Clock size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500">Fin prévue</p>
                          <p className="text-sm font-bold text-brand-primary">
                            {new Date(project.endDate).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Localisation</h3>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm text-brand-primary">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-brand-primary">Tunisie</p>
                        <p className="text-xs font-medium text-slate-500">Déploiement national</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
