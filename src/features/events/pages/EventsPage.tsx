"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import axios from "axios";
import { deleteEvent, getEvents, type EventItem } from "@/features/events/api/events";
import { fetchParticipantsCountByEventIds } from "@/features/events/api/events";
import EventCard from "@/features/events/components/EventCard";
import { useAuthStore } from "@/store/authStore";

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [participantsCountByEvent, setParticipantsCountByEvent] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);
  const canManage = !!user && (user.role === "admin" || user.role === "super_admin");

  const fetchEvents = useCallback(async () => {
    setError("");
    try {
      const eventList = await getEvents();
      setEvents(eventList);

      const participantsMap = await fetchParticipantsCountByEventIds(
        eventList.map((event) => event._id)
      );
      setParticipantsCountByEvent(participantsMap);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Impossible de charger les evenements.");
      } else {
        setError("Impossible de charger les evenements.");
      }
      setParticipantsCountByEvent({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleDelete = async (eventId: string) => {
    const shouldDelete = window.confirm("Voulez-vous vraiment supprimer cet evenement ?");
    if (!shouldDelete) {
      return;
    }

    setDeletingId(eventId);
    setError("");
    try {
      await deleteEvent(eventId);
      await fetchEvents();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Suppression impossible.");
      } else {
        setError("Suppression impossible.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Chargement des evenements...</div>;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
            <CalendarDays size={22} className="text-[#2E3191]" />
            Evenements
          </h1>
          <p className="mt-1 text-sm text-gray-500">Liste des evenements de la plateforme</p>
        </div>

        {canManage && (
          <Link
            href="/dashboard/events/create"
            className="inline-flex items-center rounded-lg bg-[#2E3191] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1e2266]"
          >
            + Add Event
          </Link>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-[#C7072C]">
          {error}
        </div>
      )}

      {events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center text-sm text-gray-500">
          Aucun evenement trouve.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={{
                ...event,
                participantsCount: event.participantsCount ?? participantsCountByEvent[event._id] ?? 0,
              }}
              canManage={canManage}
              detailsHref={`/dashboard/events/${event._id}`}
              editHref={`/dashboard/events/${event._id}/edit`}
              onDelete={() => handleDelete(event._id)}
              deleting={deletingId === event._id}
            />
          ))}
        </div>
      )}
    </section>
  );
}
