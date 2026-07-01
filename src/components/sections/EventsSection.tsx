"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CalendarDays, Tag } from "lucide-react";
import {
  fetchEventParticipantsCount,
  fetchPublicEvents,
  participateInEvent,
  type PublicEvent,
} from "@/features/events/api/events";
import { fetchPublicProjects } from "@/features/projects/api/projects";

const eventMeta = [
  "Activation marque",
  "Roadshow",
  "Animation commerciale",
  "Team building",
  "Lancement produit",
  "Convention",
];

export default function EventsSection() {
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<PublicEvent | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [modalSuccessMessage, setModalSuccessMessage] = useState("");
  const [participantsCountByEvent, setParticipantsCountByEvent] = useState<
    Record<string, number>
  >({});
  const [projectNameById, setProjectNameById] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const [data, projects] = await Promise.all([fetchPublicEvents(), fetchPublicProjects()]);
        setEvents(data);
        setProjectNameById(
          projects.reduce<Record<string, string>>((acc, project) => {
            acc[project._id] = project.name;
            return acc;
          }, {})
        );

        const countsEntries = await Promise.all(
          data.map(async (event) => {
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
        setEvents([]);
        setParticipantsCountByEvent({});
      }
    };

    loadEvents();
  }, []);

  const openModal = (event: PublicEvent) => {
    setSelectedEvent(event);
    setFullName("");
    setEmail("");
    setEmailError("");
    setSubmitError("");
    setModalSuccessMessage("");
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setEmailError("");
    setSubmitError("");
    setModalSuccessMessage("");
    setIsSubmitting(false);
  };

  const refreshParticipantsCount = async (eventId: string) => {
    const count = await fetchEventParticipantsCount(eventId);
    setParticipantsCountByEvent((prev) => ({
      ...prev,
      [eventId]: count,
    }));
  };

  const handleParticipate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError("");
    setSubmitError("");
    setSuccessMessage("");
    setModalSuccessMessage("");

    if (!email.trim()) {
      setEmailError("L'email est obligatoire.");
      return;
    }

    if (!selectedEvent) {
      return;
    }

    setIsSubmitting(true);

    try {
      await participateInEvent(selectedEvent._id, {
        email: email.trim(),
        name: fullName.trim() || undefined,
      });

      await refreshParticipantsCount(selectedEvent._id);
      setModalSuccessMessage("Participation enregistrée ✅");
      setSuccessMessage("Participation enregistrée ✅");
      setFullName("");
      setEmail("");
      window.setTimeout(() => {
        closeModal();
      }, 5000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "";
      const normalized = message.toLowerCase();
      const status =
        typeof err === "object" && err !== null && "status" in err
          ? Number((err as { status?: number }).status)
          : undefined;

      if (
        status === 409 ||
        normalized.includes("deja") ||
        normalized.includes("déjà") ||
        normalized.includes("already") ||
        normalized.includes("exist") ||
        normalized.includes("registered") ||
        normalized.includes("enregistr")
      ) {
        setSubmitError("Votre email est deja enregistree");
      } else if (normalized.includes("email")) {
        setSubmitError("Email invalide");
      } else {
        setSubmitError(message || "Une erreur est survenue.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [successMessage]);

  return (
    <section id="events" className="bg-brand-surface px-6 py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <h2 className="text-4xl font-extrabold leading-tight text-brand-primary md:text-5xl">
            Nos <span className="text-brand-danger">Evenements</span>
          </h2>
          <span className="mt-4 block h-0.75 w-20 rounded-full bg-brand-danger/80" />
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-500 md:text-lg">
            Retrouvez nos evenements recents et activations realisees sur le terrain.
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        )}

        {events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand-primary/20 bg-white px-6 py-10 text-center text-sm text-slate-500">
            Aucun evenement disponible pour le moment.
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-4 top-0 h-full w-px bg-brand-primary/20 md:left-1/2 md:-translate-x-1/2" />

            <div className="space-y-6">
              {events.map((event, index) => {
                const isLeft = index % 2 === 0;
                const fallbackType = eventMeta[index % eventMeta.length];

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
                              {new Date(event.date).toLocaleDateString("fr-FR")}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                              <Tag size={12} className="shrink-0" />
                              {projectNameById[event.projectId || ""] || "Projet"}
                            </span>
                          </div>

                          <h3 className="mt-3 text-lg font-extrabold text-brand-primary">{event.name}</h3>

                          <p className="mt-2 text-sm font-medium text-slate-600">
                            👥 {participantsCountByEvent[event._id] ?? 0} participants
                          </p>

                          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                            <Tag size={13} className="shrink-0 text-brand-danger" />
                            <span>{fallbackType}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => openModal(event)}
                            className="mt-5 inline-flex items-center justify-center rounded-lg bg-brand-danger px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#a50524]"
                          >
                            Participer
                          </button>
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

      {selectedEvent && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-brand-primary">Participer</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Evenement: <span className="font-medium text-slate-700">{selectedEvent.name}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-md px-2 py-1 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            <form className="mt-5 space-y-4" onSubmit={handleParticipate}>
              {modalSuccessMessage && (
                <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  <div className="flex items-center justify-between gap-3">
                    <span>{modalSuccessMessage}</span>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="rounded-md border border-emerald-200 bg-white px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="event-email" className="text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  id="event-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@email.com"
                  required
                  className="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
                {emailError && <p className="text-xs text-brand-danger">{emailError}</p>}
                {submitError && <p className="text-xs text-brand-danger">{submitError}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="event-fullname" className="text-sm font-medium text-gray-700">
                  Full name (optionnel)
                </label>
                <input
                  id="event-fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Votre nom complet"
                  className="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-primary-dark"
                >
                  {isSubmitting ? "Envoi..." : "Confirmer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
