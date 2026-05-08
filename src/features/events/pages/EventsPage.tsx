"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import api from "@/lib/api";
import { fetchParticipantsCountByEventIds } from "@/features/events/api/events";

type EventItem = {
  _id: string;
  name: string;
  date: string;
  type?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [participantsCountByEvent, setParticipantsCountByEvent] = useState<
    Record<string, number>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      setError("");
      try {
        const res = await api.get("/events");
        const eventList = Array.isArray(res.data) ? (res.data as EventItem[]) : [];
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
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div className="text-sm text-gray-500">Chargement des evenements...</div>;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Evenements</h1>
          <p className="text-sm text-gray-500 mt-1">Liste des evenements de la plateforme</p>
        </div>

        <Link
          href="/dashboard/events/create"
          className="inline-flex items-center rounded-lg bg-[#2E3191] px-4 py-2 text-sm font-medium text-white hover:bg-[#1e2266] transition"
        >
          + Add Event
        </Link>
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
        <div className="space-y-3">
          {events.map((event) => (
            <article
              key={event._id}
              className="rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm transition hover:border-[#2E3191]/25 hover:shadow-md"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <p className="text-base font-semibold text-gray-900 truncate">{event.name}</p>
                  <p className="mt-1 text-xs text-gray-600">
                    👥 {participantsCountByEvent[event._id] ?? 0} participants
                  </p>
                  {event.createdAt && (
                    <p className="mt-1 text-xs text-gray-500">
                      Cree le {new Date(event.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                    {new Date(event.date).toLocaleDateString("fr-FR")}
                  </span>
                  <span className="rounded-full bg-[#e9ebff] px-2.5 py-1 text-xs font-medium text-[#2E3191]">
                    {event.type?.trim() ? event.type : "N/A"}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
