"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  deleteEvent,
  fetchEventParticipantsCount,
  getEventById,
  sendReminders,
  type EventItem,
} from "@/features/events/api/events";
import { getDashboardProjects } from "@/features/projects/api/projects";
import EventStatusBadge from "@/features/events/components/EventStatusBadge";
import { formatEventDate } from "@/features/events/utils/eventDisplay";
import { useAuthStore } from "@/store/authStore";

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const user = useAuthStore((state) => state.user);
  const canManage = !!user && (user.role === "admin" || user.role === "super_admin");

  const [event, setEvent] = useState<EventItem | null>(null);
  const [projectName, setProjectName] = useState("");
  const [participantsCount, setParticipantsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [sendingReminders, setSendingReminders] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setError("");
      try {
        const [eventData, projects] = await Promise.all([
          getEventById(eventId),
          getDashboardProjects(),
        ]);

        setEvent(eventData);
        setProjectName(projects.find((project) => project._id === eventData.projectId)?.name || eventData.projectId);

        const count =
          typeof eventData.participantsCount === "number"
            ? eventData.participantsCount
            : await fetchEventParticipantsCount(eventId);
        setParticipantsCount(count);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Impossible de charger l'evenement.");
        } else {
          setError("Impossible de charger l'evenement.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [eventId]);

  const handleDelete = async () => {
    if (!event) {
      return;
    }

    const shouldDelete = window.confirm("Voulez-vous vraiment supprimer cet evenement ?");
    if (!shouldDelete) {
      return;
    }

    setDeleting(true);
    setError("");
    try {
      await deleteEvent(event._id);
      router.push("/dashboard/events");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Suppression impossible.");
      } else {
        setError("Suppression impossible.");
      }
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(t);
  }, [toast]);

  if (loading) {
    return <div className="text-sm text-gray-500">Chargement de l&apos;evenement...</div>;
  }

  if (!event) {
    return <div className="text-sm text-[#C7072C]">Evenement non trouve.</div>;
  }

  return (
    <section className="space-y-6">
      {toast && (
        <div className="fixed right-6 top-6 z-[80]">
          <div
            className={`rounded-lg border px-4 py-3 text-sm shadow-lg ${
              toast.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-[#C7072C]">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-5 md:flex-row">
          <div className="h-44 w-full overflow-hidden rounded-xl border border-gray-100 bg-gray-50 md:w-72">
            {event.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-gray-400">
                No image
              </div>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold text-gray-900">{event.title}</h1>
              <EventStatusBadge status={event.status} />
            </div>

            <p className="text-sm text-gray-700">{event.description || "—"}</p>

            <div className="grid gap-3 text-sm text-gray-700 md:grid-cols-2">
              <p>
                Service: <span className="font-medium">{event.service}</span>
              </p>
              <p>
                Projet: <span className="font-medium">{projectName}</span>
              </p>
              <p>
                Date: <span className="font-medium">{formatEventDate(event.date)}</span>
              </p>
              <p>
                Ville: <span className="font-medium">{event.city}</span>
              </p>
              <p>
                Lieu: <span className="font-medium">{event.location}</span>
              </p>
              <p>
                Max participants: <span className="font-medium">{event.maxParticipants ?? "—"}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Informations</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Participants</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">{participantsCount}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Jeu</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {event.hasGame ? event.gameName || "Oui" : "Non"}
            </p>
          </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Cree le</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {formatEventDate(event.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {canManage && (
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/dashboard/events/${event._id}/edit`}
            className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Modifier l&apos;evenement
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center rounded-lg bg-[#C7072C] px-4 py-2 text-sm font-medium text-white hover:bg-[#a30624] transition disabled:opacity-60"
          >
            {deleting ? "Suppression..." : "Supprimer l&apos;evenement"}
          </button>

          <button
            type="button"
            onClick={async () => {
              if (!event) return;
              setSendingReminders(true);
              setError("");
              try {
                const result = await sendReminders(event._id);
                setToast({
                  type: "success",
                  message: `Rappels envoyes! Envoyes: ${result.sent ?? 0}, Echoues: ${result.failed ?? 0}`,
                });
              } catch (err: unknown) {
                let message = "Impossible d'envoyer les rappels.";
                if (axios.isAxiosError(err)) {
                  const status = err.response?.status;
                  if (status === 404) message = "Evenement non trouve. Veuillez recharger la page.";
                  else if (status === 401) message = "Vous n'etes pas autorise. Acces admin requis.";
                  else if (status === 500) message = "Erreur serveur. Veuillez reessayer plus tard.";
                  else message = err.response?.data?.message || err.message || message;
                } else if (err instanceof Error) {
                  message = err.message;
                }
                setToast({ type: "error", message });
              } finally {
                setSendingReminders(false);
              }
            }}
            disabled={sendingReminders}
            className="inline-flex items-center rounded-lg bg-[#2E3191] px-4 py-2 text-sm font-medium text-white hover:bg-[#1e2266] transition disabled:opacity-60"
          >
            {sendingReminders ? "Envoi des rappels..." : "📧 Envoyer les rappels"}
          </button>
        </div>
      )}
    </section>
  );
}
